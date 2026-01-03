import { axiosClient} from '../api/axiosClient';

// Đảm bảo URL này khớp với route đã khai báo ở Server (routes/checkoutRoutes.js)
const API_URL = '/api/checkout';

// --- HELPER: Xử lý lỗi chung ---
const handleError = (error) => {
    console.error("Checkout API Error:", error);
    return { 
        success: false, 
        message: error.response?.data?.message || error.message || "Cannot connect to server" 
    };
};

// 1. Lấy danh sách phòng đang thuê (hoặc Occupied)
// Endpoint: GET /api/checkout/rented-rooms
export const fetchRentedRoomsAPI = async () => {
    try {
        const res = await axiosClient.get(`${API_URL}/rented-rooms`);
        // Server trả về: { success: true, data: [...] }
        return res.data; 
    } catch (error) {
        return handleError(error);
    }
};

// 2. Xem trước hóa đơn (Tính toán tiền phòng + phụ thu)
// Endpoint: GET /api/checkout/preview/:roomId
export const fetchInvoicePreviewAPI = async (roomId) => {
    try {
        const res = await axiosClient.get(`${API_URL}/preview/${roomId}`);
        // Server trả về: { success: true, data: { totalAmount, surchargeDetails... } }
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// 3. Xác nhận thanh toán (Checkout)
// Endpoint: POST /api/checkout/confirm
export const confirmCheckoutAPI = async (checkoutData) => {
    try {
        // checkoutData gồm: { roomId, bookingId, paymentMethod, totalAmount }
        const res = await axiosClient.post(`${API_URL}/confirm`, checkoutData);
        // Server trả về: { success: true, message: "Checkout successful!" }
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};