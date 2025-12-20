// src/controllers/roomController.js
import { sql } from '../config/database.js';
import {
    getAllRoomsService,
    getRoomsByStatusService,
    getRoomsByTypeService,
    getRoomsByStatusAndTypeService
} from '../services/roomServices.js';

export const getAllRooms = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                R.RoomID AS id, 
                CAST(R.RoomID AS VARCHAR) AS roomNumber, 
                RT.RoomTypeName AS type, 
                RT.MaxGuests AS capacity,                
                RT.Price AS price, 
                R.Status AS status, 
                R.ImageURL AS image                  
            FROM ROOM R
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
        `);

        // Trả về kết quả
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
        res.status(500).json({ message: 'Lỗi Server', error: error.message });
    }
};

// Controller lọc theo status
export const getRoomsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const rooms = await getRoomsByStatusService(status);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Lỗi khi lọc phòng theo status:", error);
        res.status(500).json({ message: 'Lỗi Server', error: error.message });
    }
};

// Controller lọc theo loại phòng
export const getRoomsByType = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ message: 'Room type is required' });
        }

        const rooms = await getRoomsByTypeService(type);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Lỗi khi lọc phòng theo loại:", error);
        res.status(500).json({ message: 'Lỗi Server', error: error.message });
    }
};

// Controller lọc theo cả status và loại phòng
export const getRoomsByStatusAndType = async (req, res) => {
    try {
        const { status, type } = req.query;

        if (!status || !type) {
            return res.status(400).json({ message: 'Both status and type are required' });
        }

        const rooms = await getRoomsByStatusAndTypeService(status, type);

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Lỗi khi lọc phòng theo status và loại:", error);
        res.status(500).json({ message: 'Lỗi Server', error: error.message });
    }
};