import request from 'supertest';
import app from '../src/server.js'; // Import app from server
import pool from '../src/config/database.js'; 

describe('AUTH API Testing', () => {
    
    // Test Case 1: Login failure (Non-existent username or wrong password)
    test('POST /api/auth/login - Should fail with wrong credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'UserKhongTonTai123',
            password: 'WrongPassword123'
        });

        expect(res.statusCode).toBe(401); 
        expect(res.body).toHaveProperty('error');
    });

    // Test Case 2: Reset Password failure due to invalid OTP
    test('POST /api/auth/reset-password - Should fail with Invalid OTP', async () => {
        const res = await request(app).post('/api/auth/reset-password').send({
            email: 'test@gmail.com', // Dummy email
            otp: '000000',           // Intentionally incorrect OTP
            newPassword: 'newpass123'
        });

        // Expect 400 or 401 response
        expect(res.statusCode).toBe(400); 
        expect(res.body.error).toMatch(/Invalid OTP|No OTP requested/);
    });

    // Clean up: Close DB connection after running tests
    afterAll(async () => {
        await pool.end(); 
    });
});