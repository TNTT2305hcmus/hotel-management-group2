import { sql } from '../config/database.js';

// Lấy tất cả phòng
export const getAllRoomsService = async () => {
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
    return result.recordset;
};

// Lọc phòng theo status
export const getRoomsByStatusService = async (status) => {
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
        WHERE R.Status = '${status}'
    `);
    return result.recordset;
};

// Lọc phòng theo loại phòng (RoomTypeName)
export const getRoomsByTypeService = async (roomType) => {
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
        WHERE RT.RoomTypeName = '${roomType}'
    `);
    return result.recordset;
};

// Lọc phòng theo cả status và loại phòng
export const getRoomsByStatusAndTypeService = async (status, roomType) => {
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
        WHERE R.Status = '${status}' AND RT.RoomTypeName = '${roomType}'
    `);
    return result.recordset;
};
