// src/controllers/roomController.js
import { sql } from '../config/database.js';
import {
    getAllRoomsService,
    getRoomsByStatusService,
    getRoomsByTypeService,
    getRoomsByStatusAndTypeService
} from '../services/roomServices.js';

// Controller Lấy tất cả các phòng
export const getAllRooms = async (req, res) => {
    try {

        const rooms = await getAllRoomsService();

        res.status(200).json(rooms);
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

// Thêm phòng 
export const createRoom = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ Frontend gửi lên
        const { id, typeId, status, note, image } = req.body;

        // 2. Validate cơ bản (Bắt buộc phải có ID và Loại phòng)
        if (!id || !typeId) {
            return res.status(400).json({ 
                message: 'Vui lòng nhập đầy đủ Mã phòng (id) và Loại phòng (typeId)' 
            });
        }

        // 3. Kết nối và thực thi lệnh SQL Insert
        const request = new sql.Request();
        
        // Gán tham số (SQL Parameters) để bảo mật
        request.input('id', sql.Int, id);
        request.input('typeId', sql.Int, typeId);
        request.input('status', sql.NVarChar, status || 'Available'); // Mặc định là Available
        request.input('note', sql.NVarChar, note || '');
        request.input('image', sql.NVarChar, image || ''); // Link ảnh

        // Câu lệnh SQL 
        await request.query(`
            INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL)
            VALUES (@id, @typeId, @status, @note, @image)
        `);

        // 4. Trả về kết quả thành công
        res.status(201).json({ 
            message: 'Thêm phòng thành công!', 
            newRoom: { id, typeId, status, note, image }
        });

    } catch (error) {
        console.error("Lỗi khi thêm phòng:", error);

        // 5. Xử lý lỗi trùng ID (Mã lỗi 2627 của SQL Server)
        if (error.number === 2627) {
            return res.status(409).json({ 
                message: 'Lỗi: Mã phòng này ĐÃ TỒN TẠI trong hệ thống!' 
            });
        }

        // Lỗi khác
        res.status(500).json({ message: 'Lỗi Server', error: error.message });
    }
};