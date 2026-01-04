import pool from '../config/database.js';
import CheckOutModel from '../models/checkOutModel.js';
import surchargeDefault from '../config/surchargeRegulations.js'; // Import file config của bạn

// Helper: Kiểm tra ngày lễ
const isHoliday = (date) => {
    const holidays = ['01/01', '30/04', '01/05', '02/09', '25/12', '31/12'];
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return holidays.includes(`${day}/${month}`);
};

const CheckOutService = {
    // 1. Lấy danh sách phòng
    getRentedRooms: async () => {
        const rooms = await CheckOutModel.findRentedRooms();
        // Format dữ liệu trước khi trả về Controller
        return rooms.map(room => ({
            RoomID: room.RoomID,
            RoomName: `Room ${room.RoomID}`, 
            Type: room.Type, 
            Price: parseFloat(room.Price)
        }));
    },

    // 2. Tính toán hóa đơn (Preview)
    calculateInvoicePreview: async (roomId) => {
        // Lấy dữ liệu từ Model
        const data = await CheckOutModel.findActiveBookingByRoomId(roomId);
        if (!data) throw new Error("No active booking found for this room.");

        const now = new Date(); // Thời gian thực tế 
        const checkIn = new Date(data.CheckInDate);
        const registeredCheckOut = new Date(data.CheckOutDate); // Thời gian đăng ký lúc Check-in
        
        let calculationDate;

        if (now < registeredCheckOut) {
            // Trường hợp A: Check-out sớm -> Tính tiền theo ngày đăng ký
            calculationDate = registeredCheckOut;
        } else {
            // Trường hợp B: Check-out muộn -> Tính tiền đến thời điểm hiện tại
            calculationDate = now;
        }

        // Tính số ngày (làm tròn lên, tối thiểu 1 ngày)
        const diffTime = Math.abs(calculationDate - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 

        // Tính tiền
        const roomPrice = parseFloat(data.Price);
        const baseTotal = roomPrice * diffDays; 

        let totalSurchargeAmount = 0;

        // a. Khách thứ 3 
        const hasExtraPerson = data.GuestCount >= 3;
        if (hasExtraPerson) {
            totalSurchargeAmount += baseTotal * (surchargeDefault.extraPerson - 1); 
        }

        // b. Khách nước ngoài
        const hasForeign = Boolean(data.IsForeign);
        if (hasForeign) {
            totalSurchargeAmount += baseTotal * (surchargeDefault.foreignGuest - 1);
        }

        // c. Ngày lễ 
        const hasHoliday = isHoliday(now); 
        if (hasHoliday) {
            totalSurchargeAmount += baseTotal * (surchargeDefault.holiday - 1);
        }

        const grandTotal = baseTotal + totalSurchargeAmount;

        return {
            bookingId: data.BookingID,
            checkInDate: data.CheckInDate,
            registeredCheckOutDate: data.CheckOutDate,
            actualCheckOutDate: now,
            nights: diffDays,
            roomType: data.Type,
            guests: data.GuestCount,
            totalAmount: grandTotal,
            extraCharge: totalSurchargeAmount,
            surchargeDetails: {
                isForeign: hasForeign,
                foreignRate: surchargeDefault.foreignGuest,
                isExtraPerson: hasExtraPerson,
                extraPersonRate: surchargeDefault.extraPerson,
                isHoliday: hasHoliday,
                holidayRate: surchargeDefault.holiday
            }
        };
    },

    // 3. Xử lý Checkout 
    processCheckout: async (checkoutData) => {
        const { roomId, bookingId, paymentMethod, totalAmount } = checkoutData;
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // A. Lấy tên khách hàng
            const customerRow = await CheckOutModel.findCustomerNameByBookingId(bookingId, connection);
            let customerName = customerRow ? customerRow.FullName : 'Unknown Guest';
            
            // Nếu không tìm thấy trong detail, thử tìm trong booking 
            if (customerName === 'Unknown Guest') {
            }

            // B. Cập nhật Booking -> Completed
            await CheckOutModel.updateBookingStatus(bookingId, totalAmount, connection);

            // C. Cập nhật Room -> Mantainance
            await CheckOutModel.updateRoomStatus(roomId, 'Mantainance', connection);

            await connection.commit();
            return { message: "Checkout successful!" };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

export default CheckOutService;
