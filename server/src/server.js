import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import { connectDB } from './config/database.js'; 

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js'; // 2. Import route phòng vừa tạo

// Kích hoạt biến môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. Kết nối Database ---
connectDB();

// --- 4. Middleware ---
// Cho phép Frontend (Vite) gọi API sang
app.use(cors()); 
// Đọc dữ liệu JSON từ body request
app.use(express.json()); 

// --- 5. Routes ---
// API test server sống hay chết
app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING');
});

// API Xác thực (Login/Register)
app.use('/api/auth', authRoutes);

// API Phòng (Lấy danh sách phòng)
// Đường dẫn sẽ là: http://localhost:5000/api/rooms
app.use('/api/rooms', roomRoutes); // 3. Đăng ký route phòng vào server

// --- 6. Khởi chạy Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});