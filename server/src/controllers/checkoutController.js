import CheckOutService from '../services/checkoutService.js';

// 1. Lấy danh sách phòng
export const getRentedRooms = async (req, res) => {
    try {
        const data = await CheckOutService.getRentedRooms();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Preview Hóa đơn
export const getInvoicePreview = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) return res.status(400).json({ success: false, message: "Room ID is required" });

        const data = await CheckOutService.calculateInvoicePreview(roomId);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Controller Error:", error);
        // Kiểm tra lỗi 404 (Không tìm thấy booking)
        if (error.message === "No active booking found for this room.") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Confirm Checkout
export const confirmCheckout = async (req, res) => {
    try {
        const { roomId, bookingId, paymentMethod, totalAmount } = req.body;
        
        // Validate cơ bản
        if (!roomId || !bookingId || !totalAmount) {
            return res.status(400).json({ success: false, message: "Missing required checkout fields." });
        }

        const result = await CheckOutService.processCheckout({
            roomId, bookingId, paymentMethod, totalAmount
        });

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: "Checkout failed: " + error.message });
    }
};