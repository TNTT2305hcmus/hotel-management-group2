import {
    getAllRoomsService,
    createRoomService,
    getRoomStatsService,
    updateRoomService,
    deleteRoomService,
    getRoomDetailService
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

// --- PUT: Update Room (Add this function to the end of the file) ---
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params; // Old ID from URL parameters
        
        // Get data from request body
        // roomNumber: New ID (if you want to rename the room)
        // typeId: New Room Type (Capacity and Price will update automatically based on this)
        const { roomNumber, typeId, status, description, image } = req.body;

        // Basic Validation
        if (!typeId) {
            return res.status(400).json({ message: 'Missing required field: Room Type (typeId)' });
        }

        // Call Service
        const updatedRoom = await updateRoomService(id, { 
            newId: roomNumber, 
            typeId, 
            status, 
            note: description, 
            image 
        });

        res.status(200).json(updatedRoom);

    } catch (error) {
        console.error("Update Error:", error);

        // Handle Duplicate ID Error (When renaming to an existing room number)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                message: `Room Number ${req.body.roomNumber} already exists!` 
            });
        }

        // Handle Invalid Room Type Error (Foreign Key Constraint)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: 'Invalid Room Type ID!' });
        }

        // Handle Room Not Found Error
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(500).json({ message: 'Server Error' });
    }
};

// API detail room
export const getRoomDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await getRoomDetailService(id);
        res.status(200).json(room);
    } catch (error) {
        if (error.message === 'Room not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// API Delete room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteRoomService(id);
        
        res.status(200).json({ message: `Room ${id} deleted successfully!` });
    } catch (error) {
        console.error("Delete Error:", error);

        // Lỗi khách book phòng
        if (error.message.includes('Cannot delete')) {
             return res.status(409).json({ message: error.message });
        }
        
        // Trả về 404 nếu không tìm thấy
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: 'Server Error' });
    }
};