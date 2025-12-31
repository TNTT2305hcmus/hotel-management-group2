import express from 'express';
import * as checkInController from '../controllers/checkInController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Route to get today's bookings with customer information
// GET /api/check-in/today
router.get('/today', checkInController.getTodayBookings);

// Route to get today's reservations (alias for /today)
// GET /api/check-in/today-reservations
router.get('/today-reservations', checkInController.getTodayBookings);

// Route to search today's reservations
// GET /api/check-in/today-reservations/search?q=search_term
router.get('/today-reservations/search', checkInController.searchTodayReservations);

// Route to create new booking
// POST /api/check-in/booking
router.post('/booking', checkInController.createBooking);

// Route to get available rooms
// GET /api/check-in/rooms/available
router.get('/rooms/available', checkInController.getAvailableRooms);

// Route to get maximum guests for a specific room
// GET /api/check-in/room/:maphong
router.get('/room/:maphong', checkInController.getRoomMaxGuests);

export default router;