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
    },

    // 5. Update Room
    update: async (currentId, roomData) => {
        const { newId, typeId, status, note, image } = roomData;
        
        // If newId is not provided, keep the current ID
        const finalId = newId || currentId;

        const query = `
            UPDATE ROOM 
            SET 
                RoomID = ?,       -- Allow changing Room ID
                RoomTypeID = ?,   -- Change Type (Updates Price & Capacity)
                Status = ?, 
                Notes = ?, 
                ImageURL = ?
            WHERE RoomID = ?      -- Find by old ID
        `;

        // Parameter order is critical: NewID -> Type -> Status -> Note -> Image -> OldID
        const [result] = await pool.query(query, [
            finalId, 
            typeId, 
            status, 
            note, 
            image, 
            currentId 
        ]);
        
        return result.affectedRows > 0;
    },

    // 6. Detail Room
    findById: async (id) => {
        const query = `
            SELECT 
                R.RoomID AS id, 
                CAST(R.RoomID AS CHAR) AS roomNumber,
                RT.RoomTypeName AS type, 
                RT.MaxGuests AS capacity,                
                RT.Price AS price, 
                R.Status AS status, 
                R.ImageURL AS image,
                R.Notes AS note
            FROM ROOM R
            INNER JOIN ROOM_TYPE RT ON R.RoomTypeID = RT.RoomTypeID
            WHERE R.RoomID = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0]; // Trả về object đầu tiên (hoặc undefined nếu không tìm thấy)
    },

    // 7. Delete Room
    delete: async (id) => {
        const query = `DELETE FROM ROOM WHERE RoomID = ?`;
        const [result] = await pool.query(query, [id]);
        return result.affectedRows;
    },

    // Lấy lịch sử khách hàng của một phòng cụ thể
    getRoomGuestHistory: async (roomId) => {
        const query = `
            SELECT 
                c.FullName as name,          
                c.CitizenID as idCard,       
                c.CitizenID as passport,     
                c.PhoneNumber as phone,
                c.Address as address,
                b.CheckInDate as checkIn,    
                b.CheckOutDate as checkOut,  
                b.PaymentDate
            FROM BOOKING b
            JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
            JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
            WHERE b.RoomID = ?
            ORDER BY b.CheckInDate DESC
        `;
        const [rows] = await pool.query(query, [roomId]);
        return rows;
    }


};

export default RoomModel;