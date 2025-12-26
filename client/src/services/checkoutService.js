import axios from 'axios';

// --- CẤU HÌNH (CONFIGURATION) ---
const API_URL = 'http://localhost:5000/api/checkout';
const USE_MOCK_API = true; // <--- Đổi thành FALSE khi muốn gọi Server của backend

// --- API SERVICES ---

// 1. Lấy danh sách phòng đang thuê
export const fetchRentedRoomsAPI = async () => {
    if (USE_MOCK_API) return mockFetchRentedRooms();

    try {
        const res = await axios.get(`${API_URL}/rented-rooms`);
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
export const confirmCheckoutAPI = async (data) => {
    if (USE_MOCK_API) return mockConfirmCheckout(data);

    try {
        const res = await axios.post(`${API_URL}/confirm`, data);
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
        message: error.response?.data?.message || error.message || "Network Error" 
    };
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// --- MOCK IMPLEMENTATIONS (Dùng để test giao diện) ---
// ============================================================

const mockFetchRentedRooms = async () => {
    await delay(500);
    console.log("[Mock] Fetching rented rooms...");
    
    return {
        success: true,
        data: [
            { RoomID: '101', RoomName: 'Room 101 - Single', Type: 'Single', Price: 500000 },
            { RoomID: '205', RoomName: 'Room 205 - Double', Type: 'Double', Price: 800000 },
            { RoomID: '304', RoomName: 'Room 304 - Deluxe', Type: 'Deluxe', Price: 1200000 },
        ]
    };
};

const mockFetchInvoicePreview = async (roomId) => {
    await delay(700);
    console.log(`[Mock] Preview invoice for room ${roomId}...`);

    return {
        success: true,
        data: {
            bookingId: 999,
            checkInDate: "2023-12-20T14:00:00.000Z",
            checkOutDate: new Date().toISOString(),
            nights: 5,
            roomType: roomId === '101' ? 'Single' : 'Deluxe',
            guests: 3,
            roomPrice: roomId === '101' ? 500000 : 1200000,
            totalAmount: 6500000,
            extraCharge: 500000
        }
    };
};

const mockConfirmCheckout = async (data) => {
    await delay(1000);
    console.log("[Mock] Checkout confirmed:", data);
    return { success: true, message: "Checkout successful (Mock Mode)!" };
};