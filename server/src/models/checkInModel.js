import pool from '../config/database.js';

const CheckInModel = {
    // Check room status
    checkRoomStatus: async (roomId) => {
        const sql = 'SELECT Status FROM ROOM WHERE RoomID = ?';
        const [results] = await pool.query(sql, [roomId]);
        return results[0];
    },

    // Create new booking
    createBooking: async (bookingData) => {
        const { roomId, checkInDate, checkOutDate, totalPrice, guestCount, isForeign } = bookingData;
        
        const sql = `
            INSERT INTO BOOKING (RoomID, CheckInDate, CheckOutDate, TotalPrice, GuestCount, IsForeign) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const isForeignVal = isForeign ? 1 : 0;

        const [results] = await pool.query(sql, [
            roomId, 
            checkInDate, 
            checkOutDate, 
            totalPrice, 
            guestCount, 
            isForeignVal
        ]);
        
        return { bookingId: results.insertId, ...bookingData };
    },

    // Update room status to Occupied
    updateRoomStatus: async (roomId, status) => {
        const sql = 'UPDATE ROOM SET Status = ? WHERE RoomID = ?';
        const [results] = await pool.query(sql, [status, roomId]);
        return results;
    },

    // Create booking detail (link customer with booking)
    createBookingDetail: async (bookingId, citizenId) => {
        const sql = 'INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (?, ?)';
        const [results] = await pool.query(sql, [bookingId, citizenId]);
        return results;
    },

    // Check if customer exists
    checkCustomerExists: async (citizenId) => {
        const sql = 'SELECT CitizenID FROM CUSTOMER WHERE CitizenID = ?';
        const [results] = await pool.query(sql, [citizenId]);
        return results.length > 0;
    },

    // Create new customer if not exists
    createCustomer: async (customerData) => {
        const { citizenId, customerTypeId, fullName, phoneNumber, address } = customerData;
        const sql = `
            INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [results] = await pool.query(sql, [citizenId, customerTypeId, fullName, phoneNumber, address]);
        return results;
    },

    // Get today's bookings with customer information
    getTodayBookings: async () => {
        const sql = `
            SELECT 
                B.BookingID as bookingId,
                B.RoomID as roomId,
                R.Status as roomStatus,
                RT.RoomTypeName as roomType,
                B.CheckInDate as checkInDate,
                B.CheckOutDate as checkOutDate,
                B.TotalPrice as totalPrice,
                C.CitizenID as citizenId,
                C.FullName as fullName,
                C.PhoneNumber as phoneNumber,
                C.Address as address,
                CT.CustomerTypeName as customerType
            FROM BOOKING B
            INNER JOIN ROOM R ON B.RoomID = R.RoomID
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            INNER JOIN BOOKING_DETAIL BD ON B.BookingID = BD.BookingID
            INNER JOIN CUSTOMER C ON BD.CitizenID = C.CitizenID
            INNER JOIN CUSTOMER_TYPE CT ON C.CustomerTypeID = CT.CustomerTypeID
            WHERE DATE(B.CheckInDate) = CURDATE()
            ORDER BY B.CheckInDate DESC
        `;
        const [results] = await pool.query(sql);
        return results;
    },

    // Get available rooms
    getAvailableRooms: async () => {
        const sql = `
            SELECT 
                R.RoomID as roomId,
                RT.RoomTypeName as roomType,
                RT.Price as price,
                RT.MaxGuests as maxGuests,
                R.Status as status
            FROM ROOM R
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            WHERE R.Status = 'Available'
            ORDER BY R.RoomID
        `;
        const [results] = await pool.query(sql);
        return results;
    },

    // Get maximum guests for a specific room
    getRoomMaxGuests: async (roomId) => {
        const sql = `
            SELECT 
                R.RoomID,
                RT.RoomTypeName,
                RT.MaxGuests,
                RT.Price,
                R.Status
            FROM ROOM R
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            WHERE R.RoomID = ?
        `;
        const [results] = await pool.query(sql, [roomId]);
        return results[0];
    },

    // Search today's bookings by guest name, room number, or phone
    searchTodayBookings: async (searchTerm) => {
        const sql = `
            SELECT 
                B.BookingID as bookingId,
                B.RoomID as roomId,
                R.Status as roomStatus,
                RT.RoomTypeName as roomType,
                B.CheckInDate as checkInDate,
                B.CheckOutDate as checkOutDate,
                B.TotalPrice as totalPrice,
                C.CitizenID as citizenId,
                C.FullName as fullName,
                C.PhoneNumber as phoneNumber,
                C.Address as address,
                CT.CustomerTypeName as customerType
            FROM BOOKING B
            INNER JOIN ROOM R ON B.RoomID = R.RoomID
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            INNER JOIN BOOKING_DETAIL BD ON B.BookingID = BD.BookingID
            INNER JOIN CUSTOMER C ON BD.CitizenID = C.CitizenID
            INNER JOIN CUSTOMER_TYPE CT ON C.CustomerTypeID = CT.CustomerTypeID
            WHERE DATE(B.CheckInDate) = CURDATE()
            AND (C.FullName LIKE ? OR B.RoomID LIKE ? OR C.PhoneNumber LIKE ?)
            ORDER BY B.CheckInDate DESC
        `;
        const searchPattern = `%${searchTerm}%`;
        const [results] = await pool.query(sql, [searchPattern, searchPattern, searchPattern]);
        return results;
    }
};

export default CheckInModel;