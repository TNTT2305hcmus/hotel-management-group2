import request from 'supertest';
import app from '../src/server.js';
import pool from '../src/config/database.js'; // Import pool để dọn dẹp DB

describe('ROOM API Testing', () => {
    // Test Case 5: Test Create Room 
    test('POST /api/rooms - Should create a new room successfully', async () => {
        
        const newRoomData = {
            id: 909,              
            typeId: 1,            
            status: 'Available',  
            note: 'Test Room by Jest'
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

    // Test Case 6: Test Update Room (Valid case: Available -> Maintenance)
    test('PUT /api/rooms/:id - Should update room status and note', async () => {
        const roomIdToUpdate = 909; 

        const updateData = {
            roomNumber: 909,         
            typeId: 1,               
            status: 'Maintenance',   
            description: 'Update by Jest', 
            image: ''
        };

        const res = await request(app)
            .put(`/api/rooms/${roomIdToUpdate}`)
            .send(updateData);

        if (res.statusCode !== 200) {
            console.log("Update Error:", res.body);
        }

        expect(res.statusCode).toBe(200);
        
        expect(res.body).toHaveProperty('status', 'Maintenance');
        expect(res.body.note || res.body.description).toContain('Update by Jest');
    });

    afterAll(async () => {
        try {
            await pool.query("DELETE FROM ROOM WHERE RoomID = ?", [909]);
        } catch (err) {
            console.error("Cleanup Error:", err);
        }
    });
});