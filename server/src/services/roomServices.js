import { sql } from '../config/database.js';

// Get all rooms
const getAllRoomsService = async () => {
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

// Filter rooms by status
const getRoomsByStatusService = async (status) => {
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

// Filter rooms by room type (RoomTypeName)
const getRoomsByTypeService = async (roomType) => {
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

// Filter rooms by both status and room type
const getRoomsByStatusAndTypeService = async (status, roomType) => {
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
// Export all services
export { getAllRoomsService, getRoomsByStatusService, getRoomsByTypeService, getRoomsByStatusAndTypeService };