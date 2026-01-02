import request from 'supertest';
import app from '../src/server.js';
import pool from '../src/config/database.js';

describe('INVOICE & CHECKOUT - DATA SAFETY TEST', () => {
    const MOCK_ROOM_ID = 9999;
    const MOCK_BOOKING_ID = 8888;
    const MOCK_CITIZEN_ID = 'TEST_USER_01';

    const cleanupData = async () => {
        await pool.query("DELETE FROM INVOICE WHERE BookingID = ?", [MOCK_BOOKING_ID]);
        await pool.query("DELETE FROM BOOKING_DETAIL WHERE BookingID = ?", [MOCK_BOOKING_ID]);
        await pool.query("DELETE FROM BOOKING WHERE BookingID = ?", [MOCK_BOOKING_ID]);
        await pool.query("DELETE FROM ROOM WHERE RoomID = ?", [MOCK_ROOM_ID]);
        await pool.query("DELETE FROM ROOM_TYPE WHERE RoomTypeID = 99");
        await pool.query("DELETE FROM CUSTOMER WHERE CitizenID = ?", [MOCK_CITIZEN_ID]);
    };

    beforeAll(async () => {
        await cleanupData();

        try {
            // Reset surcharge settings
            await request(app).post('/api/settings/surcharge/reset');

            // Create mock data (Room Type, Room, Customer)
            await pool.query(`INSERT INTO ROOM_TYPE (RoomTypeID, RoomTypeName, Price, MaxGuests) VALUES (99, 'Standard', 150000, 2)`);
            
            await pool.query(`INSERT INTO ROOM (RoomID, RoomTypeID, Status) VALUES (?, 99, 'Occupied')`, [MOCK_ROOM_ID]);
            
            await pool.query(`INSERT INTO CUSTOMER_TYPE (CustomerTypeID, CustomerTypeName) VALUES (1, 'Domestic') ON DUPLICATE KEY UPDATE CustomerTypeName='Domestic'`);
            await pool.query(`INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName) VALUES (?, 1, 'Jest Tester')`, [MOCK_CITIZEN_ID]);

            // Create a booking starting 2 days ago
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); 
            
            await pool.query(`
                INSERT INTO BOOKING (BookingID, RoomID, CheckInDate, GuestCount, IsForeign, Status, CustomerName) 
                VALUES (?, ?, ?, 3, 1, 'Active', 'Jest Tester')
            `, [MOCK_BOOKING_ID, MOCK_ROOM_ID, twoDaysAgo]);

            await pool.query(`INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (?, ?)`, [MOCK_BOOKING_ID, MOCK_CITIZEN_ID]);

        } catch (error) {
            console.error("SETUP ERROR:", error);
            throw error;
        }
    });

    // Test case 7: VERIFY CALCULATION ACCURACY 
    test('GET /preview - Should calculate correctly (Base Check)', async () => {
        const res = await request(app).get(`/api/checkout/preview/${MOCK_ROOM_ID}`);
        expect(res.statusCode).toBe(200);
        
        // Verify total (150k * 2 nights + surcharge = 600k)
        expect(res.body.data.totalAmount).toBe(600000);
    });

    // Test case 8: VERIFY DATA SAFETY
    test('GET /preview - Should NOT change DB status when Previewing (Cancel Action)', async () => {
        
        await request(app).get(`/api/checkout/preview/${MOCK_ROOM_ID}`);

        const [booking] = await pool.query("SELECT Status, TotalPrice FROM BOOKING WHERE BookingID = ?", [MOCK_BOOKING_ID]);
        expect(booking[0].Status).toBe('Active'); 
        
        const [room] = await pool.query("SELECT Status FROM ROOM WHERE RoomID = ?", [MOCK_ROOM_ID]);
        expect(room[0].Status).toBe('Occupied');

        const [invoice] = await pool.query("SELECT * FROM INVOICE WHERE BookingID = ?", [MOCK_BOOKING_ID]);
        expect(invoice.length).toBe(0); 
    });

    afterAll(async () => {
        await cleanupData();
    });
});