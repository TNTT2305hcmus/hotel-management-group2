import axios from 'axios';

// Đảm bảo port 5000 khớp với port trong file .env của server
const API_URL = 'http://localhost:5000/api/checkout';

// 1. API Lấy danh sách phòng đang có người ở
export const fetchRentedRoomsAPI = async () => {
    try {
        const res = await axios.get(`${API_URL}/rented-rooms`);
        // Backend trả về: { success: true, data: [...] }
        return res.data; 
    } catch (error) {
        console.error("Error fetching rented rooms:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

// 2. API Lấy thông tin xem trước hóa đơn
export const fetchInvoicePreviewAPI = async (roomId) => {
    try {
        const res = await axios.get(`${API_URL}/preview/${roomId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching invoice preview:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

// 3. API Xác nhận thanh toán (Checkout)
export const confirmCheckoutAPI = async (checkoutData) => {
    // checkoutData gồm: { roomId, bookingId, paymentMethod, totalAmount }
    try {
        const res = await axios.post(`${API_URL}/confirm`, checkoutData);
        return res.data;
    } catch (error) {
        console.error("Error confirming checkout:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};