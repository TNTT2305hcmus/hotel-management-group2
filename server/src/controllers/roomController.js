// src/controllers/roomController.js
import { sql } from '../config/database.js';

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