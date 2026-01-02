import request from 'supertest';
import app from '../src/server.js';
import pool from '../src/config/database.js'; // Import pool để dọn dẹp DB

describe('ROOM API Testing', () => {


    // Test Case 5: Thêm phòng mới thành công
    test('POST /api/rooms - Should create a new room successfully', async () => {
        
        const newRoomData = {
            id: 909,              
            typeId: 1,            
            status: 'Available',  
            note: 'Phòng test tự động từ Jest'
        };

        const res = await request(app)
            .post('/api/rooms')
            .send(newRoomData);

        const isValidStatus = [200, 201].includes(res.statusCode);
        if (!isValidStatus) {
            console.log("Create Room Failed Response:", res.body);
        }
        expect(isValidStatus).toBe(true);
    });

    afterAll(async () => {
        try {
            // Lưu ý: Tên cột trong SQL vẫn là RoomID, nhưng body gửi lên API là id
            await pool.query("DELETE FROM ROOM WHERE RoomID = ?", [909]);
        } catch (err) {
            console.error("Cleanup Error:", err);
        }
    });
});