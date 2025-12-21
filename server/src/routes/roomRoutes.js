// src/routes/roomRoutes.js
import express from 'express';
import {
    getAllRooms,
    getRoomsByStatus,
    getRoomsByType,
    getRoomsByStatusAndType,
    createRoom
} from '../controllers/roomController.js';

const router = express.Router();

// Lấy tất cả phòng
router.get('/', getAllRooms);

// Lọc theo status: /api/rooms/by-status?status=Available
router.get('/by-status', getRoomsByStatus);

// Lọc theo loại phòng: /api/rooms/by-type?type=Single Room
router.get('/by-type', getRoomsByType);

// Lọc theo cả status và loại phòng: /api/rooms/by-status-and-type?status=Available&type=Single Room
router.get('/by-status-and-type', getRoomsByStatusAndType);

// POST: Thêm phòng mới 
router.post('/', createRoom);

export default router;