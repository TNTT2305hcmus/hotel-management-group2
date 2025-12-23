import pool from '../config/database.js';

const RoomModel = {
    // 1. Search and pagination
    findRooms: async (limit, offset, whereClause, params) => {
        const query = `
            SELECT 
                R.RoomID AS id, 
                CAST(R.RoomID AS CHAR) AS roomNumber,
                RT.RoomTypeName AS type, 
                RT.MaxGuests AS capacity,                
                RT.Price AS price, 
                R.Status AS status, 
                R.ImageURL AS image
            FROM ROOM R
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            ${whereClause} 
            ORDER BY R.RoomID ASC
            LIMIT ? OFFSET ?
        `;
        
        // Append limit and offset parameters to the end
        const finalParams = [...params, parseInt(limit), parseInt(offset)];
        
        const [rows] = await pool.query(query, finalParams);
        return rows;
    },

    // 2. Count total records
    countRooms: async (whereClause, params) => {
        const query = `
            SELECT COUNT(*) as total 
            FROM ROOM R 
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            ${whereClause}
        `;
        const [rows] = await pool.query(query, params);
        return rows[0].total;
    },

    // 3. Create room 
    create: async (roomData) => {
        const { id, typeId, status, note, image } = roomData;
        const query = `
            INSERT INTO ROOM (RoomID, RoomTypeID, Status, Notes, ImageURL)
            VALUES (?, ?, ?, ?, ?)
        `;
        await pool.query(query, [id, typeId, status, note, image]);
        return roomData;
    },

    // 4. Thống kê
    getStats: async () => {
        const query = `
            SELECT Status, COUNT(*) as total 
            FROM ROOM 
            GROUP BY Status
        `;
        const [rows] = await pool.query(query);
        return rows;
    }
};

export default RoomModel;