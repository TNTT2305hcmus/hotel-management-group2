// src/routes/roomRoutes.js
import express from 'express';
import { getAllRooms } from '../controllers/roomController.js';

const router = express.Router();

// Khi ai đó gọi GET vào đường dẫn này -> Chạy hàm getAllRooms
router.get('/', getAllRooms);

export default router;