import express from 'express';
import { getRooms, createRoom, getRoomStats, updateRoom, deleteRoom, getRoomDetail, getRoomGuests } from '../controllers/roomControllers.js'; 

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

// 5. Delete
router.delete('/:id', deleteRoom);

// 6. Detail room
router.get('/:id', getRoomDetail);

// 7. Guest list
router.get('/:id/guest', getRoomGuests);

export default router;