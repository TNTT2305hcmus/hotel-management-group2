import { axiosClient } from "../api/axiosClient"; 

// Lấy danh sách phòng 
export const fetchListRoomsFollowPage = async (page, search, type, status) => {
    try {
        const response = await axiosClient.get('/api/rooms', {
            params: {
                page: page,
                limit: 8,
                search: search,
                type: type,
                status: status
            }
        });
        
        return response.data || [];
    } catch (error) {
        console.error("API Error (List):", error);
        return [];
    }
};

// 2. Lấy thống kê
export const fetchRoomStats = async () => {
    try {
        const response = await axiosClient.get('/api/rooms/stats');
        return response.data; // BE trả về JSON { available: x, occupied: y, maintenance: z }
    } catch (error) {
        console.error("API Error (Stats):", error);
        return { available: 0, occupied: 0, maintenance: 0 };
    }
};

// 3. Xóa phòng
// DELETE /api/rooms/:id
export const deleteRoomAPI = (id) => {
    return axiosClient.delete(`/api/rooms/${id}`);
};

// 4. Edit phòng
// PUT /api/rooms/:id
export const updateRoomAPI = (id, data) => {
    return axiosClient.put(`/api/rooms/${id}`, data);
};

// 5. Thêm phòng
// POST /api/rooms
export const createRoomAPI = (data) => {
    return axiosClient.post('/api/rooms', data);
};