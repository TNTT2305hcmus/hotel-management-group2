import express from 'express';
import * as checkInController from '../controllers/checkInController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Route to get today's bookings with customer information
// GET /api/check-in/today
router.get('/today', checkInController.getTodayBookings);
// Route to create new booking
// POST /api/check-in/booking
router.post('/booking', checkInController.createBooking);

export default router;