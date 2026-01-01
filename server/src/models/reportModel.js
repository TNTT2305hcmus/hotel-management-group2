import pool from '../config/database.js';

const ReportModel = {
    // Lấy các Booking có thời gian ở nằm trong tháng báo cáo VÀ đã thanh toán
    getRevenueBookings: async (month, year) => {
        const startDate = `${year}-${month}-01`;
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

        const query = `
            SELECT 
                b.BookingID, b.RoomID, b.CheckInDate, b.CheckOutDate, b.TotalPrice,
                rt.RoomTypeName
            FROM BOOKING b
            JOIN ROOM r ON b.RoomID = r.RoomID
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            WHERE 
                b.CheckInDate <= ?          -- CheckIn trước khi tháng kết thúc
                AND b.CheckOutDate >= ?     -- CheckOut sau khi tháng bắt đầu
                AND b.PaymentDate IS NOT NULL -- Chỉ tính đơn đã thanh toán
        `;
        const [rows] = await pool.query(query, [endDate, startDate]);
        return rows;
    },

    // 2. Giữ nguyên booking cho Density
    getBookingsForDensity: async (month, year) => {
        const startDate = `${year}-${month}-01`;
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

        const query = `
            SELECT RoomID, CheckInDate, CheckOutDate
            FROM BOOKING
            WHERE CheckInDate <= ? AND CheckOutDate >= ?
        `;
        const [rows] = await pool.query(query, [endDate, startDate]);
        return rows;
    },

    // 3. Lấy danh sách phòng để làm khung báo cáo
    getAllRooms: async () => {
        const query = `SELECT RoomID FROM ROOM`;
        const [rows] = await pool.query(query);
        return rows;
    }
};

export default ReportModel;