import ReportModel from '../models/reportModel.js';

// --- HELPER FUNCTION: Tính tổng số ngày thuê thực tế nằm trong 1 tháng ---
const calculateMonthlyRentalDays = (month, year, bookings) => {
    if (!bookings || bookings.length === 0) return 0;

    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStart = new Date(year, month - 1, 1, 0, 0, 0);
    const monthEnd = new Date(year, month - 1, daysInMonth, 23, 59, 59);

    let totalDays = 0;

    bookings.forEach(b => {
        const checkIn = new Date(b.CheckInDate);
        const checkOut = new Date(b.CheckOutDate);

        const start = checkIn < monthStart ? monthStart : checkIn;
        const end = checkOut > monthEnd ? monthEnd : checkOut;

        // Số ngày chênh lệch
        const diffTime = end - start;
        
        // Nếu diffTime > 0 nghĩa là có ở trong tháng này
        if (diffTime > 0) {
            // Chia cho ms trong 1 ngày, dùng ceil để làm tròn lên (ít nhất 1 ngày)
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalDays += days;
        }
    });

    return totalDays;
};

const ReportService = {
    // 1. API Overview: Tổng doanh thu, tổng ngày thuê, so sánh tăng trưởng
    getOverview: async (month, year) => {
        const currentMonth = parseInt(month);
        const currentYear = parseInt(year);

        // -- Tính toán tháng trước để so sánh --
        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth === 0) { prevMonth = 12; prevYear -= 1; }

        // 1. Doanh thu
        const currentRevenue = await ReportModel.getTotalRevenueByMonth(currentMonth, currentYear);
        const prevRevenue = await ReportModel.getTotalRevenueByMonth(prevMonth, prevYear);
        
        // Tính % tăng trưởng doanh thu
        let revenueGrowth = 0;
        if (prevRevenue > 0) {
            revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        } else if (currentRevenue > 0) {
            revenueGrowth = 100; // Tăng trưởng từ 0 lên có số
        }

        // 2. Tổng ngày thuê (Total Bookings Days)
        // Mật độ tháng này
        const currentBookings = await ReportModel.getBookingsForDensity(currentMonth, currentYear);
        const totalRentalDays = calculateMonthlyRentalDays(currentMonth, currentYear, currentBookings);

        // Mật độ tháng trước
        const prevBookings = await ReportModel.getBookingsForDensity(prevMonth, prevYear);
        const prevRentalDays = calculateMonthlyRentalDays(prevMonth, prevYear, prevBookings);

        // Tăng trưởng mật độ
        let rentalDaysGrowth = 0;
        if (prevRentalDays > 0) {
            rentalDaysGrowth = ((totalRentalDays - prevRentalDays) / prevRentalDays) * 100;
        } else if (totalRentalDays > 0) {
            rentalDaysGrowth = 100;
        }

        return {
            totalRevenue: currentRevenue,
            revenueGrowth: revenueGrowth.toFixed(1), // Làm tròn 1 số thập phân
            totalRentalDays: totalRentalDays,
            rentalDaysGrowth: rentalDaysGrowth.toFixed(1)
        };
    },

    // 2. Report Revenue by Room Type (Có tính tỷ lệ %)
    getRevenueReport: async (month, year) => {
        const data = await ReportModel.getRevenueByRoomType(month, year);
        const totalRevenue = data.reduce((sum, item) => sum + Number(item.Revenue), 0);

        return data.map((item, index) => ({
            stt: index + 1,
            roomType: item.RoomTypeName,
            revenue: Number(item.Revenue),
            proportion: totalRevenue > 0 ? ((item.Revenue / totalRevenue) * 100).toFixed(2) : 0
        }));
    },

    // 3. Report Density by Room (Tính số ngày thuê của từng phòng)
    getDensityReport: async (month, year) => {
        const rooms = await ReportModel.getAllRooms(); // Lấy list phòng [101, 102, ...]
        const bookings = await ReportModel.getBookingsForDensity(month, year);

        const daysInMonth = new Date(year, month, 0).getDate();
        const monthStart = new Date(`${year}-${month}-01`);
        const monthEnd = new Date(year, month - 1, daysInMonth, 23, 59, 59);

        // Tạo map để tính tổng ngày cho từng phòng
        const roomDensityMap = {};
        rooms.forEach(r => roomDensityMap[r.RoomID] = 0);

        let totalDaysAllRooms = 0;

        bookings.forEach(b => {
            const start = new Date(b.CheckInDate) < monthStart ? monthStart : new Date(b.CheckInDate);
            const end = new Date(b.CheckOutDate) > monthEnd ? monthEnd : new Date(b.CheckOutDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            if (days > 0 && roomDensityMap[b.RoomID] !== undefined) {
                roomDensityMap[b.RoomID] += days;
                totalDaysAllRooms += days;
            }
        });

        // Format dữ liệu trả về bảng
        const reportData = rooms.map((r, index) => {
            const rentalDays = roomDensityMap[r.RoomID];
            return {
                stt: index + 1,
                roomNumber: r.RoomID,
                totalRentalDays: rentalDays,
                // Tỷ lệ so với tổng số ngày đã cho thuê của khách sạn
                proportion: totalDaysAllRooms > 0 ? ((rentalDays / totalDaysAllRooms) * 100).toFixed(2) : 0
            };
        });

        // Sắp xếp theo số ngày thuê giảm dần
        return reportData.sort((a, b) => b.totalRentalDays - a.totalRentalDays);
    }
};

export default ReportService;