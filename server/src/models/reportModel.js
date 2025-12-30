import pool from '../config/database.js';

const ReportModel = {
    // 1. Tổng doanh thu (Chỉ tính đơn ĐÃ THANH TOÁN)
    getTotalRevenueByMonth: async (month, year) => {
        const query = `
            SELECT SUM(TotalPrice) as totalRevenue
            FROM BOOKING
            WHERE MONTH(PaymentDate) = ? 
              AND YEAR(PaymentDate) = ?
              AND PaymentDate IS NOT NULL 
        `;
        const [rows] = await pool.query(query, [month, year]);
        return rows[0].totalRevenue || 0;
    },

    // 2. Booking để tính mật độ 
    getBookingsForDensity: async (month, year) => {
        // Ngày đầu tháng và cuối tháng
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

    // 3. Doanh thu theo loại phòng 
    getRevenueByRoomType: async (month, year) => {
        const query = `
            SELECT 
                rt.RoomTypeName,
                SUM(b.TotalPrice) as Revenue
            FROM BOOKING b
            JOIN ROOM r ON b.RoomID = r.RoomID
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            WHERE MONTH(b.PaymentDate) = ? 
              AND YEAR(b.PaymentDate) = ?
              AND b.PaymentDate IS NOT NULL
            GROUP BY rt.RoomTypeID, rt.RoomTypeName
        `;
        const [rows] = await pool.query(query, [month, year]);
        return rows;
    },

    // 4. Lấy tất cả phòng
    getAllRooms: async () => {
        const query = `SELECT RoomID FROM ROOM`;
        const [rows] = await pool.query(query);
        return rows;
    }
};

export default ReportModel;