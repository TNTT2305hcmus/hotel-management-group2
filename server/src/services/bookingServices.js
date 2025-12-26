import pool from '../config/database.js';

export const createBookingService = async (data) => {
    const { roomId, checkInDate, checkOutDate, guests } = data;
    
    // 1. Calculate check-out date (Default to 1 day if not provided)
    let finalCheckOut = checkOutDate;
    if (!finalCheckOut) {
        const date = new Date(checkInDate);
        date.setDate(date.getDate() + 1);
        finalCheckOut = date.toISOString().slice(0, 10); 
    }

    const connection = await pool.getConnection();

    try {
        // --- START TRANSACTION ---
        await connection.beginTransaction();

        // Step 1: Get room price to calculate total cost
        const [roomRows] = await connection.query(
            `SELECT Price FROM ROOM 
             JOIN ROOM_TYPE ON ROOM.RoomTypeID = ROOM_TYPE.RoomTypeID 
             WHERE RoomID = ?`, 
            [roomId]
        );
        
        if (roomRows.length === 0) {
            throw new Error('Room not found or has been deleted');
        }
        
        // Calculate Total Price: Price * Days
        const pricePerNight = roomRows[0].Price;
        const diffTime = Math.abs(new Date(finalCheckOut) - new Date(checkInDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
        const totalPrice = pricePerNight * diffDays;

        // Step 2: Process Guest List (With Phone Number)
        for (const guest of guests) {
            // Check if guest already exists in the system
            const [existing] = await connection.query(
                `SELECT CitizenID FROM CUSTOMER WHERE CitizenID = ?`, 
                [guest.citizenId]
            );

            if (existing.length === 0) {
                // --- A. NEW GUEST -> INSERT ---
                // Note: Parameter order must match SQL query
                await connection.query(
                    `INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        guest.citizenId, 
                        guest.customerTypeId, 
                        guest.fullName, 
                        guest.phoneNumber || null, // Save phone number (null if missing)
                        guest.address
                    ]
                );
            } else {
                // --- B. RETURNING GUEST -> UPDATE ---
                // Update latest Phone Number and Address
                await connection.query(
                    `UPDATE CUSTOMER 
                     SET PhoneNumber = ?, Address = ?, FullName = ? 
                     WHERE CitizenID = ?`,
                    [
                        guest.phoneNumber || null, 
                        guest.address, 
                        guest.fullName,
                        guest.citizenId
                    ]
                );
            }
        }

        // Step 3: Create Booking Record
        const [bookingResult] = await connection.query(
            `INSERT INTO BOOKING (RoomID, CheckInDate, CheckOutDate, TotalPrice) 
             VALUES (?, ?, ?, ?)`,
            [roomId, checkInDate, finalCheckOut, totalPrice]
        );
        const newBookingId = bookingResult.insertId;

        // Step 4: Save Booking Details (Link Guests to Booking)
        for (const guest of guests) {
            await connection.query(
                `INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (?, ?)`,
                [newBookingId, guest.citizenId]
            );
        }

        // Step 5: Update Room Status -> Occupied
        await connection.query(
            `UPDATE ROOM SET Status = 'Occupied' WHERE RoomID = ?`,
            [roomId]
        );

        // --- COMMIT TRANSACTION ---
        await connection.commit();
        
        return {
            bookingId: newBookingId,
            totalPrice: totalPrice,
            status: 'Success'
        };

    } catch (error) {
        // --- HANDLE ERROR -> ROLLBACK ---
        await connection.rollback();
        throw error;
    } finally {
        connection.release(); // Release connection back to the pool
    }
};