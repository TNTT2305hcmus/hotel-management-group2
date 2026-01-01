import pool from '../config/database.js';
import surcharge from '../config/surchargeRegulations.js'; // <--- QUAN TRỌNG: Phải import dòng này

// --- HÀM HELPER: KIỂM TRA NGÀY LỄ ---
const isHoliday = (date) => {
    // List ngày lễ (DD/MM)
    const holidays = ['01/01', '30/04', '01/05', '02/09', '25/12', '31/12'];
    
    // Mẹo: Thêm ngày hôm nay vào list này nếu muốn test thử tính năng phụ thu ngày lễ ngay lập tức
    // holidays.push('31/12'); // Ví dụ hôm nay là 31/12

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return holidays.includes(`${day}/${month}`);
};

// 1. Lấy danh sách phòng đang thuê
export const getRentedRooms = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.RoomID, rt.RoomTypeName as Type, rt.Price 
            FROM ROOM r
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            WHERE r.Status = 'Rented' OR r.Status = 'Occupied'
        `);
        
        const formattedRooms = rows.map(room => ({
            RoomID: room.RoomID,
            RoomName: `Room ${room.RoomID}`, 
            Type: room.Type, 
            Price: parseFloat(room.Price)
        }));

        res.json({ success: true, data: formattedRooms });
    } catch (error) {
        console.error("Error fetching rented rooms:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Tính toán hóa đơn (Preview)
export const getInvoicePreview = async (req, res) => {
    try {
        const { roomId } = req.params;

        // B1: Lấy thông tin
        const query = `
            SELECT b.BookingID, b.CheckInDate, b.GuestCount, b.IsForeign, rt.Price, rt.RoomTypeName as Type
            FROM BOOKING b
            JOIN ROOM r ON b.RoomID = r.RoomID
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            WHERE b.RoomID = ? AND b.Status = 'Active'
        `;
        const [rows] = await pool.query(query, [roomId]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "No active booking found." });
        const data = rows[0];

        // B2: Tính tiền gốc
        const now = new Date();
        const checkIn = new Date(data.CheckInDate);
        const diffDays = Math.ceil(Math.abs(now - checkIn) / (1000 * 60 * 60 * 24)) || 1; 
        const roomPrice = parseFloat(data.Price);
        
        const baseTotal = roomPrice * diffDays; // Tổng tiền phòng gốc

        // B3: Tính các khoản phụ thu (CỘNG DỒN)
        let totalSurchargeAmount = 0; // Biến tổng tiền phụ thu

        // 1. Khách thứ 3
        const hasExtraPerson = data.GuestCount >= 3;
        let extraPersonAmount = 0;
        if (hasExtraPerson) {
            extraPersonAmount = baseTotal * (surcharge.extraPerson - 1); 
            totalSurchargeAmount += extraPersonAmount;
        }

        // 2. Khách nước ngoài
        const hasForeign = Boolean(data.IsForeign);
        let foreignAmount = 0;
        if (hasForeign) {
            foreignAmount = baseTotal * (surcharge.foreignGuest - 1);
            totalSurchargeAmount += foreignAmount;
        }

        // 3. Ngày lễ
        const hasHoliday = isHoliday(now);
        let holidayAmount = 0;
        if (hasHoliday) {
            holidayAmount = baseTotal * (surcharge.holiday - 1);
            totalSurchargeAmount += holidayAmount;
        }

        // Tổng cuối cùng = Gốc + Tổng phụ thu
        const grandTotal = baseTotal + totalSurchargeAmount;

        res.json({
            success: true,
            data: {
                bookingId: data.BookingID,
                checkInDate: data.CheckInDate,
                nights: diffDays,
                roomType: data.Type,
                guests: data.GuestCount,
                
                totalAmount: grandTotal,       // Tổng thanh toán
                extraCharge: totalSurchargeAmount, // Tổng phụ thu hiển thị
                
                // Gửi chi tiết về cho Frontend hiển thị (Kèm cả Rate)
                surchargeDetails: {
                    isForeign: hasForeign,
                    foreignRate: surcharge.foreignGuest, // Gửi tỷ lệ 1.1

                    isExtraPerson: hasExtraPerson,
                    extraPersonRate: surcharge.extraPerson, // Gửi tỷ lệ 1.2

                    isHoliday: hasHoliday,
                    holidayRate: surcharge.holiday // Gửi tỷ lệ 1.3
                }
            }
        });

    } catch (error) {
        console.error("Error preview:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Xác nhận thanh toán
export const confirmCheckout = async (req, res) => {
    let connection;
    try {
        const { roomId, bookingId, paymentMethod, totalAmount } = req.body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Lấy tên khách hàng
            const [customerRows] = await connection.query(`
                SELECT c.FullName FROM BOOKING_DETAIL bd
                JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
                WHERE bd.BookingID = ? LIMIT 1
            `, [bookingId]);
            
            let customerName = 'Unknown Guest';
            if (customerRows.length > 0) {
                customerName = customerRows[0].FullName;
            } else {
                const [bookingInfo] = await connection.query("SELECT CustomerName FROM BOOKING WHERE BookingID = ?", [bookingId]);
                if (bookingInfo.length > 0 && bookingInfo[0].CustomerName) customerName = bookingInfo[0].CustomerName;
            }

            // Cập nhật Booking
            await connection.query("UPDATE BOOKING SET Status = 'Completed', TotalPrice = ?, PaymentDate = NOW() WHERE BookingID = ?", [totalAmount, bookingId]);

            // Cập nhật Phòng
            await connection.query("UPDATE ROOM SET Status = 'Available' WHERE RoomID = ?", [roomId]);

            // Lưu Hóa Đơn
            await connection.query(`
                INSERT INTO INVOICE (BookingID, RoomID, CustomerName, TotalAmount, PaymentMethod, CheckOutDate)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [bookingId, roomId, customerName, totalAmount, paymentMethod]);

            await connection.commit();
            res.json({ success: true, message: "Checkout successful!" });

        } catch (err) {
            await connection.rollback();
            throw err;
        }

    } catch (error) {
        console.error("Checkout failed:", error);
        res.status(500).json({ success: false, message: "Checkout failed: " + error.message });
    } finally {
        if (connection) connection.release();
    }
};