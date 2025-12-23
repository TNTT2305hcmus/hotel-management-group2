import {
    getAllRoomsService,
    createRoomService,
    getRoomStatsService 
} from '../services/roomServices.js';


// --- GET: A single function handling all filtering cases ---
export const getRooms = async (req, res) => {
    try {
        // Get params, default page 1, limit 8
        const { page = 1, limit = 12, search, type, status } = req.query;

        // Call Service
        const result = await getAllRoomsService(page, limit, search, type, status);

        // Return JSON
        res.status(200).json(result.data);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- POST: Add new room (Keep logic but cleaner code) ---
export const createRoom = async (req, res) => {
    try {
        const { id, typeId, status, note, image } = req.body;

        // Quick validation
        if (!id || !typeId) {
            return res.status(400).json({ 
                message: 'Missing required data: Room ID (id) or Room Type (typeId)' 
            });
        }

        const newRoom = await createRoomService({ id, typeId, status, note, image });

        res.status(201).json({ 
            message: 'Room added successfully!', 
            data: newRoom
        });

    } catch (error) {
        console.error("Error adding room:", error);

        // Handle specific MySQL error codes
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Room ${req.body.id} already exists!` });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: 'Invalid Room Type (typeId)!' });
        }

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// API thống kê
export const getRoomStats = async (req, res) => {
    try {
        const stats = await getRoomStatsService();
        res.status(200).json(stats);
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};