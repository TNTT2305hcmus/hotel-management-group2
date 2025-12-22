import express from 'express';
import { getRooms, createRoom, getRoomStats } from '../controllers/roomControllers.js'; 

const router = express.Router();

// 1. Lấy thống kê (Đặt trước route lấy danh sách để tránh xung đột nếu sau này có /:id)
router.get('/stats', getRoomStats);

// 2. Lấy danh sách phòng (Filter + Pagination)
// URL: /api/rooms
router.get('/', getRooms); 

// 3. Tạo phòng mới
router.post('/', createRoom);

export default router;