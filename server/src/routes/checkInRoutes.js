import express from 'express';
import * as checkInController from '../controllers/checkInController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create new booking
// POST /api/check-in/booking
router.post('/booking', checkInController.createBooking);

export default router;