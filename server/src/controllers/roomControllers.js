import {
    getAllRoomsService,
    createRoomService,
    getRoomStatsService,
    updateRoomService,
    deleteRoomService,
    getRoomDetailService,
    getRoomGuestsService
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

// API statistical
export const getRoomStats = async (req, res) => {
    try {
        const stats = await getRoomStatsService();
        res.status(200).json(stats);
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT: Update Room 
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params; 
        
        // Get data from request body
        const { typeId, status, description, image } = req.body;

        // Basic Validation
        if (!typeId) {
            return res.status(400).json({ message: 'Missing required field: Room Type (typeId)' });
        }

        // --- SECURITY & LOGIC CHECK START ---
        
        // 1. Fetch current room 
        let currentRoom;
        try {
            currentRoom = await getRoomDetailService(id);
        } catch (err) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // 2. Rule: Cannot edit a room that is currently Occupied
        if (currentRoom.status === 'Occupied') {
            return res.status(400).json({ 
                message: 'Action denied: Cannot update room details while it is Occupied.' 
            });
        }

        // 3. Rule: Prevent changing status TO 'Occupied' manually
        if (status === 'Occupied') {
            return res.status(400).json({ 
                message: 'Action denied: Cannot manually change status to Occupied. Please use the Check-in feature.' 
            });
        }

        // 4. Rule: Allow only 'Available' or 'Maintenance'
        const validStatuses = ['Available', 'Maintenance'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Only "Available" or "Maintenance" are allowed for update.' 
            });
        }

        // --- SECURITY & LOGIC CHECK END ---
        // Call Service to update
        const updatedRoom = await updateRoomService(id, { 
            typeId, 
            status, 
            note: description, 
            image 
        });

        res.status(200).json(updatedRoom);

    } catch (error) {
        console.error("Update Error:", error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: 'Invalid Room Type ID!' });
        }
        if (error.message && error.message.includes('not found')) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(500).json({ message: 'Internal Server Error' });
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

        // Error: Cannot delete room due to existing bookings/constraints
        if (error.message.includes('Cannot delete')) {
             return res.status(409).json({ message: error.message });
        }
        
        // Return 404 if room is not found
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: 'Server Error' });
    }
};

// API to retrieve guest history for a specific room
export const getRoomGuests = async (req, res) => {
    try {
        const { id } = req.params;
        
        const guests = await getRoomGuestsService(id);
        
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}