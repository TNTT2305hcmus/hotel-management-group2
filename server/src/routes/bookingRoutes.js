import express from 'express';
import { createBooking } from '../controllers/bookingController.js';

const router = express.Router();

// POST /api/bookings
router.post('/bookings', createBooking);

export default router;