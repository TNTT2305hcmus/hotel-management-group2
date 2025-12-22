import { axiosClient } from "../api/axiosClient"; // Import đúng instance đã cấu hình interceptor

// 1. Lấy danh sách phòng
export const fetchListRoomsFollowPage = async (page, search, type, status) => {
    try {
        // URL đúng phải là /api/rooms (đã cấu hình prefix bên server routes chưa? Giả sử server mount ở /api/rooms)
        // Nếu file index.js server bạn dùng: app.use('/api/rooms', roomRoutes) thì url dưới đây là:
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

// 2. Lấy thống kê (Thêm mới)
export const fetchRoomStats = async () => {
    try {
        const response = await axiosClient.get('/api/rooms/stats');
        return response.data; // Trả về { available: x, occupied: y, maintenance: z }
    } catch (error) {
        console.error("API Error (Stats):", error);
        return { available: 0, occupied: 0, maintenance: 0 };
    }
};