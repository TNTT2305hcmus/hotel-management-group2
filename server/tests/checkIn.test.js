import request from 'supertest';
import app from '../src/server.js';
import pool from '../src/config/database.js';

describe('CHECK-IN API Testing', () => {

    const TEST_ROOM_ID = 101; 
    const TEST_CITIZEN_ID = 'TEST_JEST_001'; 

    // Test case 3: Hiện thị phòng available
    test('GET /api/check-in/rooms/available - Should return available rooms with correct structure', async () => {
        const res = await request(app).get('/api/check-in/rooms/available');

        // 1. Kiểm tra Status Code
        expect(res.statusCode).toBe(200);

        // 2. Kiểm tra cấu trúc bao bọc (Wrapper) từ Service
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('count');
        expect(Array.isArray(res.body.data)).toBe(true);

        // 3. Kiểm tra chi tiết dữ liệu phòng (Nếu có dữ liệu)
        if (res.body.data.length > 0) {
            const room = res.body.data[0];
            expect(room).toHaveProperty('roomId');     // R.RoomID as roomId
            expect(room).toHaveProperty('roomType');   // RT.RoomTypeName as roomType
            expect(room).toHaveProperty('price');      // RT.Price as price
            expect(room).toHaveProperty('maxGuests');  // RT.MaxGuests as maxGuests
            
            // Logic: API này chỉ được trả về phòng có status là 'Available'
            expect(room.status).toBe('Available');
        }
    });

    // --- TEST CASE: Logic lọc phòng (Không hiện phòng đang bận) ---
    test('GET /api/check-in/rooms/available - Should NOT return occupied rooms', async () => {
        // BƯỚC 1: Giả lập phòng 101 đang bận (Occupied)
        await pool.query("UPDATE ROOM SET Status = 'Occupied' WHERE RoomID = ?", [TEST_ROOM_ID]);

        // BƯỚC 2: Gọi API
        const res = await request(app).get('/api/check-in/rooms/available');

        // BƯỚC 3: Kiểm tra phòng 101 KHÔNG có trong danh sách
        // Map ra mảng ID để kiểm tra cho dễ
        const availableRoomIds = res.body.data.map(r => r.roomId); 
        expect(availableRoomIds).not.toContain(TEST_ROOM_ID);

        // BƯỚC 4: (Cleanup) Trả lại trạng thái Available ngay lập tức
        await pool.query("UPDATE ROOM SET Status = 'Available' WHERE RoomID = ?", [TEST_ROOM_ID]);
    });

    // Test case 4: Tạo booking mới
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

        // Debug log (giữ lại để xem nếu có lỗi khác)
        if (res.statusCode !== 201) {
            console.log("❌ Check-in Failed Response:", res.body);
        }

        // 1. Kiểm tra Status Code
        expect(res.statusCode).toBe(201);

        // 2. Kiểm tra cấu trúc data trả về (SỬA LẠI ĐƯỜNG DẪN)
        // bookingId nằm trong object 'data'
        expect(res.body.data).toHaveProperty('bookingId');
        
        // Kiểm tra success = true (thay vì status = Success)
        expect(res.body.success).toBe(true);

        // 3. Kiểm tra bookingId là số
        expect(typeof res.body.data.bookingId).toBe('number');
        
        // (Tùy chọn) Kiểm tra totalPrice 
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