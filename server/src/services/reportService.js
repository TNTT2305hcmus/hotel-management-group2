import ReportModel from '../models/reportModel.js';

// ---  Tính số ngày thực tế nằm trong tháng  ---
const calculateDaysInMonth = (month, year, checkInDate, checkOutDate) => {
    const monthStart = new Date(year, month - 1, 1, 0, 0, 0);
    const monthEnd = new Date(year, month - 1, new Date(year, month, 0).getDate(), 23, 59, 59);

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Tìm khoảng giao nhau
    const start = checkIn < monthStart ? monthStart : checkIn;
    const end = checkOut > monthEnd ? monthEnd : checkOut;

    const diffTime = end - start;
    if (diffTime <= 0) return 0;

    // Quy đổi ra số ngày (Làm tròn lên để tính ít nhất 1 ngày/đêm)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// --- Tính doanh thu phân bổ cho tháng ---
const calculateAllocatedRevenue = (month, year, bookings) => {
    let totalRevenue = 0;
    const revenueByRoomType = {}; // Dùng để gom nhóm theo loại phòng

    bookings.forEach(b => {
        const checkIn = new Date(b.CheckInDate);
        const checkOut = new Date(b.CheckOutDate);
        
        // 1. Tính tổng số ngày của Booking này (Duration thực tế)
        const totalDurationMs = checkOut - checkIn;
        // Tránh chia cho 0, tối thiểu là 1 ngày
        const totalDurationDays = Math.max(1, Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24)));

        // 2. Tính số ngày booking này nằm trong tháng hiện tại
        const daysInCurrentMonth = calculateDaysInMonth(month, year, b.CheckInDate, b.CheckOutDate);

        if (daysInCurrentMonth > 0) {
            // 3. Tính đơn giá trung bình mỗi ngày của booking này
            const dailyRate = b.TotalPrice / totalDurationDays;

            // 4. Doanh thu đóng góp vào tháng này = Đơn giá * Số ngày ở trong tháng
            const allocatedAmount = dailyRate * daysInCurrentMonth;

            totalRevenue += allocatedAmount;

            // Cộng dồn vào loại phòng tương ứng
            if (!revenueByRoomType[b.RoomTypeName]) {
                revenueByRoomType[b.RoomTypeName] = 0;
            }
            revenueByRoomType[b.RoomTypeName] += allocatedAmount;
        }
    });

    return { totalRevenue, revenueByRoomType };
};

const ReportService = {
    // 1. API Overview: Tổng doanh thu (đã phân bổ), tổng ngày thuê
    getOverview: async (month, year) => {
        const currentMonth = parseInt(month);
        const currentYear = parseInt(year);

        // -- Xử lý tháng trước --
        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth === 0) { prevMonth = 12; prevYear -= 1; }

        // 1. Doanh thu 
        const currentBookingsRev = await ReportModel.getRevenueBookings(currentMonth, currentYear);
        const prevBookingsRev = await ReportModel.getRevenueBookings(prevMonth, prevYear);

        const currentRevenueData = calculateAllocatedRevenue(currentMonth, currentYear, currentBookingsRev);
        const prevRevenueData = calculateAllocatedRevenue(prevMonth, prevYear, prevBookingsRev);

        const currentRevenue = currentRevenueData.totalRevenue;
        const prevRevenue = prevRevenueData.totalRevenue;

        // Tính % tăng trưởng
        let revenueGrowth = 0;
        if (prevRevenue > 0) {
            revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        } else if (currentRevenue > 0) {
            revenueGrowth = 100;
        }

        // 2. Tổng ngày thuê 
        const currentBookingsDen = await ReportModel.getBookingsForDensity(currentMonth, currentYear);
        const prevBookingsDen = await ReportModel.getBookingsForDensity(prevMonth, prevYear);

        // Tính tổng ngày thuê bằng cách reduce mảng
        const totalRentalDays = currentBookingsDen.reduce((acc, b) => 
            acc + calculateDaysInMonth(currentMonth, currentYear, b.CheckInDate, b.CheckOutDate), 0);
        
        const prevRentalDays = prevBookingsDen.reduce((acc, b) => 
            acc + calculateDaysInMonth(prevMonth, prevYear, b.CheckInDate, b.CheckOutDate), 0);

        let rentalDaysGrowth = 0;
        if (prevRentalDays > 0) {
            rentalDaysGrowth = ((totalRentalDays - prevRentalDays) / prevRentalDays) * 100;
        } else if (totalRentalDays > 0) {
            rentalDaysGrowth = 100;
        }

        return {
            totalRevenue: Math.round(currentRevenue), 
            revenueGrowth: revenueGrowth.toFixed(1),
            totalRentalDays: totalRentalDays,
            rentalDaysGrowth: rentalDaysGrowth.toFixed(1)
        };
    },

    // 2. Report Revenue by Room Type 
    getRevenueReport: async (month, year) => {
        // Lấy booking overlap
        const bookings = await ReportModel.getRevenueBookings(month, year);
        
        // Tính toán phân bổ
        const { totalRevenue, revenueByRoomType } = calculateAllocatedRevenue(month, year, bookings);

        // Chuyển object thành mảng trả về cho FE
        const result = Object.keys(revenueByRoomType).map((typeName, index) => {
            const revenue = revenueByRoomType[typeName];
            return {
                stt: index + 1,
                roomType: typeName,
                revenue: Math.round(revenue),
                proportion: totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(2) : 0
            };
        });

        // Sắp xếp doanh thu giảm dần
        return result.sort((a, b) => b.revenue - a.revenue);
    },

    // 3. Report Density by Room 
    getDensityReport: async (month, year) => {
        const rooms = await ReportModel.getAllRooms();
        const bookings = await ReportModel.getBookingsForDensity(month, year);

        let totalDaysAllRooms = 0;

        // Map để tính tổng
        const roomDensityMap = {}; 
        rooms.forEach(r => roomDensityMap[r.RoomID] = 0);

        bookings.forEach(b => {
            const days = calculateDaysInMonth(month, year, b.CheckInDate, b.CheckOutDate);
            if (days > 0 && roomDensityMap[b.RoomID] !== undefined) {
                roomDensityMap[b.RoomID] += days;
                totalDaysAllRooms += days;
            }
        });

        const reportData = rooms.map((r, index) => {
            const rentalDays = roomDensityMap[r.RoomID];
            return {
                stt: index + 1,
                roomNumber: r.RoomID,
                totalRentalDays: rentalDays,
                proportion: totalDaysAllRooms > 0 ? ((rentalDays / totalDaysAllRooms) * 100).toFixed(2) : 0
            };
        });

        return reportData.sort((a, b) => b.totalRentalDays - a.totalRentalDays);
    }
};

export default ReportService;