// src/controllers/roomController.js
import { sql } from '../config/database.js';
import {
    getAllRoomsService,
    getRoomsByStatusService,
    getRoomsByTypeService,
    getRoomsByStatusAndTypeService
} from '../services/roomServices.js';

// Controller Get all rooms
const getAllRooms = async (req, res) => {
    try {

        const rooms = await getAllRoomsService();

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching room list:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Controller filter by status
const getRoomsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const rooms = await getRoomsByStatusService(status);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error filtering rooms by status:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Controller filter by room type
const getRoomsByType = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ message: 'Room type is required' });
        }

        const rooms = await getRoomsByTypeService(type);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error filtering rooms by type:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Controller filter by both status and room type
const getRoomsByStatusAndType = async (req, res) => {
    try {
        const { status, type } = req.query;

        if (!status || !type) {
            return res.status(400).json({ message: 'Both status and type are required' });
        }

        const rooms = await getRoomsByStatusAndTypeService(status, type);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error filtering rooms by status and type:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Add new room
const createRoom = async (req, res) => {
    try {
        // 1. Get data from Frontend
        const { id, typeId, status, note, image } = req.body;

        // 2. Basic validation (Must have ID and Room Type)
        if (!id || !typeId) {
            return res.status(400).json({ 
                message: 'Please enter complete Room ID (id) and Room Type (typeId)' 
            });
        }

        // 3. Connect and execute SQL Insert
        const request = new sql.Request();
        
        // Assign parameters (SQL Parameters) for security
        request.input('id', sql.Int, id);
        request.input('typeId', sql.Int, typeId);
        request.input('status', sql.NVarChar, status || 'Available'); // Default is Available
        request.input('note', sql.NVarChar, note || '');
        request.input('image', sql.NVarChar, image || ''); // Image URL

        // SQL statement
        await request.query(`
            INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL)
            VALUES (@id, @typeId, @status, @note, @image)
        `);

        // 4. Return success result
        res.status(201).json({ 
            message: 'Room added successfully!', 
            newRoom: { id, typeId, status, note, image }
        });

    } catch (error) {
        console.error("Error adding room:", error);

        // 5. Handle duplicate ID error (SQL Server error code 2627)
        if (error.number === 2627) {
            return res.status(409).json({ 
                message: 'Error: This room ID ALREADY EXISTS in the system!' 
            });
        }

        // Other errors
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Export all controllers
export { getAllRooms, getRoomsByStatus, getRoomsByType, getRoomsByStatusAndType, createRoom };


