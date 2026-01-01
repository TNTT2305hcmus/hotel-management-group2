import axios from 'axios';

const API_URL = 'http://localhost:5000/api/checkout';

// --- Xử lý lỗi chung ---
const handleError = (error) => {
    console.error("API Error:", error);
    return { 
        success: false, 
        message: error.response?.data?.message || error.message || "Cannot connect to server" 
    };
};

// 1. Lấy danh sách phòng đang thuê
export const fetchRentedRoomsAPI = async () => {
    try {
        const res = await axios.get(`${API_URL}/rented-rooms`);
        // Backend trả về: { success: true, data: [...] }
        return res.data; 
    } catch (error) {
        return handleError(error);
    }
};

// 2. Xem trước hóa đơn
export const fetchInvoicePreviewAPI = async (roomId) => {
    try {
        const res = await axios.get(`${API_URL}/preview/${roomId}`);
        // Backend trả về: { success: true, data: { ... } }
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// 3. Xác nhận thanh toán
export const confirmCheckoutAPI = async (checkoutData) => {
    try {
        // checkoutData = { roomId, bookingId, paymentMethod, totalAmount }
        const res = await axios.post(`${API_URL}/confirm`, checkoutData);
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};