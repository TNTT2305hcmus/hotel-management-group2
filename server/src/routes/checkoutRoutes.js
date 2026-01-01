import express from 'express';
import { 
    getRentedRooms, 
    getInvoicePreview, 
    confirmCheckout 
} from '../controllers/checkoutController.js'; 

const router = express.Router();

// 1. Lấy danh sách phòng đang thuê
router.get('/rented-rooms', getRentedRooms);

// 2. Xem trước hóa đơn theo RoomID
router.get('/preview/:roomId', getInvoicePreview);

// 3. Xác nhận thanh toán
router.post('/confirm', confirmCheckout);

export default router;