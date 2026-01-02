import request from 'supertest';
import app from '../src/server.js';
import pool from '../src/config/database.js';

describe('CHECK-IN API Testing', () => {

    const TEST_ROOM_ID = 101; 
    const TEST_CITIZEN_ID = 'TEST_JEST_001'; 

    // Test case 3: Display available rooms
    test('GET /api/check-in/rooms/available - Should return available rooms with correct structure', async () => {
        const res = await request(app).get('/api/check-in/rooms/available');

        // 1. Check Status Code
        expect(res.statusCode).toBe(200);

        // 2. Check wrapper structure from Service
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('count');
        expect(Array.isArray(res.body.data)).toBe(true);

        // 3. Check room data details (if data exists)
        if (res.body.data.length > 0) {
            const room = res.body.data[0];
            expect(room).toHaveProperty('roomId');     // R.RoomID as roomId
            expect(room).toHaveProperty('roomType');   // RT.RoomTypeName as roomType
            expect(room).toHaveProperty('price');      // RT.Price as price
            expect(room).toHaveProperty('maxGuests');  // RT.MaxGuests as maxGuests
            
            // Logic: This API should only return rooms with status 'Available'
            expect(room.status).toBe('Available');
        }
    });

    // --- TEST CASE: Room filtering logic (Do not show occupied rooms) ---
    test('GET /api/check-in/rooms/available - Should NOT return occupied rooms', async () => {
        // STEP 1: Simulate room 101 being occupied
        await pool.query("UPDATE ROOM SET Status = 'Occupied' WHERE RoomID = ?", [TEST_ROOM_ID]);

        // STEP 2: Call API
        const res = await request(app).get('/api/check-in/rooms/available');

        // STEP 3: Verify room 101 is NOT in the list
        // Map to ID array for easy checking
        const availableRoomIds = res.body.data.map(r => r.roomId); 
        expect(availableRoomIds).not.toContain(TEST_ROOM_ID);

        // STEP 4: (Cleanup) Restore status to Available immediately
        await pool.query("UPDATE ROOM SET Status = 'Available' WHERE RoomID = ?", [TEST_ROOM_ID]);
    });

    // Test case 4: Create new booking
    test('POST /api/check-in/booking - Should create booking successfully', async () => {
        
        const bookingData = {
            roomId: TEST_ROOM_ID,
            checkInDate: new Date().toISOString().slice(0, 10),
            checkOutDate: null, 
            customers: [ 
                {
                    citizenId: TEST_CITIZEN_ID,
                    fullName: "Nguyen Van Jest",
                    customerTypeId: 1, 
                    phoneNumber: "0999888777",
                    address: "Jest Testing Environment"
                }
            ]
        };

        const res = await request(app)
            .post('/api/check-in/booking')
            .send(bookingData);

        // Debug log 
        if (res.statusCode !== 201) {
            console.log("❌ Check-in Failed Response:", res.body);
        }

        // 1. Check Status Code
        expect(res.statusCode).toBe(201);

        // 2. Check returned data structure 
        // bookingId is inside 'data' object
        expect(res.body.data).toHaveProperty('bookingId');
        
        // Check success = true 
        expect(res.body.success).toBe(true);

        // 3. Check bookingId is a number
        expect(typeof res.body.data.bookingId).toBe('number');
        
        // (Optional) Check totalPrice 
        if (res.body.data.booking && res.body.data.booking.totalPrice !== undefined) {
             expect(Number(res.body.data.booking.totalPrice)).toBeGreaterThanOrEqual(0);
        }
    });

    afterAll(async () => {
        try {
            const [rows] = await pool.query(
                `SELECT b.BookingID 
                 FROM BOOKING b
                 JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
                 WHERE bd.CitizenID = ?`, 
                [TEST_CITIZEN_ID]
            );

            if (rows.length > 0) {
                const bookingID = rows[0].BookingID;
                await pool.query("DELETE FROM BOOKING_DETAIL WHERE BookingID = ?", [bookingID]);
                await pool.query("DELETE FROM BOOKING WHERE BookingID = ?", [bookingID]);
            }

            await pool.query("DELETE FROM CUSTOMER WHERE CitizenID = ?", [TEST_CITIZEN_ID]);
            await pool.query("UPDATE ROOM SET Status = 'Available' WHERE RoomID = ?", [TEST_ROOM_ID]);

        } catch (error) {
            console.error("Error cleaning up test data:", error);
        }
    });
});