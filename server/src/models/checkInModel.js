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
        const { roomId, checkInDate, checkOutDate, totalPrice } = bookingData;
        const sql = `
            INSERT INTO BOOKING (RoomID, CheckInDate, CheckOutDate, TotalPrice) 
            VALUES (?, ?, ?, ?)
        `;
        const [results] = await pool.query(sql, [roomId, checkInDate, checkOutDate, totalPrice]);
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
    }
};

export default CheckInModel;