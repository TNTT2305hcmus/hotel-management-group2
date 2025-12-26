import express from 'express';
import { getRooms, createRoom, getRoomStats, updateRoom } from '../controllers/roomControllers.js'; 

const router = express.Router();

// 1. Get statistics (Placed before the list route to avoid conflicts with /:id)
router.get('/stats', getRoomStats);

// 2. Get room list (Filter + Pagination)
// URL: /api/rooms
router.get('/', getRooms); 

// 3. Create a new room
router.post('/', createRoom);

// 4. Update room details
router.put('/:id', updateRoom);

export default router;