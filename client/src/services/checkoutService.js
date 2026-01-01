import axios from 'axios';

const API_URL = 'http://localhost:5000/api/checkout';
<<<<<<< HEAD
const USE_MOCK_API = true; 

// Danh sách phòng đang thuê
=======
const USE_MOCK_API = false; 

// --- API SERVICES ---
// 1. Lấy danh sách phòng đang thuê
>>>>>>> origin/feature/setting-checkout
export const fetchRentedRoomsAPI = async () => {
    if (USE_MOCK_API) return mockFetchRentedRooms();

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
    if (USE_MOCK_API) return mockFetchInvoicePreview(roomId);

    try {
        const res = await axios.get(`${API_URL}/preview/${roomId}`);
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// 3. Xác nhận thanh toán
export const confirmCheckoutAPI = async (checkoutData) => {
    if (USE_MOCK_API) return mockConfirmCheckout(checkoutData);

    try {
        // checkoutData = { roomId, bookingId, paymentMethod, totalAmount }
        const res = await axios.post(`${API_URL}/confirm`, checkoutData);
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// --- HELPER FUNCTIONS ---
const handleError = (error) => {
    console.error("API Error:", error);
    return { 
        success: false, 
        message: error.response?.data?.message || error.message || "Network Error - Cannot connect to server" 
    };
};
