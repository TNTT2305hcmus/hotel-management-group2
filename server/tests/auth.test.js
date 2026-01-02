import request from 'supertest';
import app from '../src/server.js'; // Import app từ server
import pool from '../src/config/database.js'; 

describe('AUTH API Testing', () => {
    
    // Test Case 1: Đăng nhập thất bại (Username không tồn tại hoặc sai pass)
    test('POST /api/auth/login - Should fail with wrong credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'UserKhongTonTai123',
            password: 'WrongPassword123'
        });

        // Mong đợi trả về 401 hoặc 404 tùy logic code của bạn (trong code cũ bạn trả 401)
        expect(res.statusCode).toBe(401); 
        expect(res.body).toHaveProperty('error');
    });

    // Test Case 2: Reset Password thất bại do sai OTP
    test('POST /api/auth/reset-password - Should fail with Invalid OTP', async () => {
        const res = await request(app).post('/api/auth/reset-password').send({
            email: 'test@gmail.com', // Email giả định
            otp: '000000',           // OTP cố tình nhập sai
            newPassword: 'newpass123'
        });

        // Mong đợi trả về 400 hoặc 401
        expect(res.statusCode).toBe(400); // Code cũ trả 400 nếu lỗi
        expect(res.body.error).toMatch(/Invalid OTP|No OTP requested/);
    });

    // Clean up: Đóng kết nối DB sau khi chạy xong test file này
    afterAll(async () => {
        await pool.end(); // Nếu pool của bạn hỗ trợ end(), nếu không thì bỏ qua
    });
});