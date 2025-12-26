import RoomModel from '../models/roomModel.js';

export const getAllRoomsService = async (page, limit, search, typeId, status) => {
    try {
        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = "WHERE 1=1"; 

        // Build filter logic
        if (search) {
            whereClause += " AND R.RoomID LIKE ?";
            params.push(`%${search}%`);
        }
        if (status) {
            whereClause += " AND R.Status = ?";
            params.push(status);
        }
        if (typeId) {
            whereClause += " AND R.RoomTypeID = ?";
            params.push(typeId);
        }

        // Call Model to fetch data in parallel
        const [rooms, total] = await Promise.all([
            RoomModel.findRooms(Number(limit), Number(offset), whereClause, params),
            RoomModel.countRooms(whereClause, params)
        ]);

        return {
            data: rooms,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalRows: total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw error;
    }
};

export const createRoomService = async (data) => {
    return await RoomModel.create(data);
};


export const getRoomStatsService = async () => {
    const rows = await RoomModel.getStats();
    
    // Trả về JSON { available: x, occupied: y, maintenance: z }
    const stats = {
        available: 0,
        occupied: 0,
        maintenance: 0
    };

    rows.forEach(row => {
        const statusKey = row.Status.toLowerCase();
        if (stats.hasOwnProperty(statusKey)) {
            stats[statusKey] = row.total;
        }
    });

    return stats;
};

export const updateRoomService = async (currentId, data) => {
    // Call Model to update
    const isUpdated = await RoomModel.update(currentId, data);

    if (!isUpdated) {
        throw new Error('Room not found or no changes made');
    }

    // Return the result for the controller to display
    return {
        originalId: currentId,
        updatedId: data.newId || currentId,
        ...data
    };
};