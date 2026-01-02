import pool from '../config/database.js';

const CheckOutModel = {
    // 1. Lấy danh sách phòng đang có người ở
    findRentedRooms: async () => {
        const query = `
            SELECT DISTINCT r.RoomID, rt.RoomTypeName as Type, rt.Price 
            FROM ROOM r
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            JOIN BOOKING b ON r.RoomID = b.RoomID
            -- Lấy phòng đang có người (Occupied) và chưa thanh toán
            WHERE r.Status = 'Occupied' AND b.PaymentDate IS NULL
            ORDER BY r.RoomID ASC
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 2. Lấy thông tin Booking đang Active của một phòng
    findActiveBookingByRoomId: async (roomId) => {
        const query = `
            SELECT 
                b.BookingID, 
                b.CheckInDate, 
                b.CheckOutDate,
                b.GuestCount, 
                b.IsForeign, 
                b.CustomerName, 
                rt.Price, 
                rt.RoomTypeName as Type
            FROM BOOKING b
            JOIN ROOM r ON b.RoomID = r.RoomID
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            -- Điều kiện tìm booking chưa thanh toán
            WHERE b.RoomID = ? AND b.PaymentDate IS NULL
            ORDER BY b.CheckInDate DESC
            LIMIT 1
        `;
        const [rows] = await pool.query(query, [roomId]);
        return rows[0];
    },

    // 3. Lấy tên khách hàng từ chi tiết Booking 
    findCustomerNameByBookingId: async (bookingId, connection) => {
        const db = connection || pool;
        const query = `
            SELECT c.FullName FROM BOOKING_DETAIL bd
            JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
            WHERE bd.BookingID = ? LIMIT 1
        `;
        const [rows] = await db.query(query, [bookingId]);
        return rows[0];
    },

    // 4. Cập nhật trạng thái Booking 
    updateBookingStatus: async (bookingId, totalAmount, connection) => {
        const query = "UPDATE BOOKING SET Status = 'Completed', TotalPrice = ?, PaymentDate = NOW(), CheckOutDate = NOW() WHERE BookingID = ?";
        await connection.query(query, [totalAmount, bookingId]);
    },

    // 5. Cập nhật trạng thái Phòng 
    updateRoomStatus: async (roomId, status, connection) => {
        const query = "UPDATE ROOM SET Status = ? WHERE RoomID = ?";
        await connection.query(query, [status, roomId]);
    },

    // 6. Tạo hóa đơn 
    createInvoice: async (data, connection) => {
        const query = `
            INSERT INTO INVOICE (BookingID, RoomID, CustomerName, TotalAmount, PaymentMethod, CheckOutDate)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        await connection.query(query, [
            data.bookingId, 
            data.roomId, 
            data.customerName, 
            data.totalAmount, 
            data.paymentMethod
        ]);
    }
};

export default CheckOutModel;