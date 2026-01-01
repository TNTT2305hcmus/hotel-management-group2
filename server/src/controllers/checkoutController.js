import pool from '../config/database.js';
import surcharge from '../config/surchargeRegulations.js'; 

// --- Hàm kiểm tra ngày lễ ---
const isHoliday = (date) => {
    const holidays = ['01/01', '30/04', '01/05', '02/09', '25/12', '31/12']; 
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return holidays.includes(`${day}/${month}`);
};

// 1. Lấy danh sách phòng đang thuê
export const getRentedRooms = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT r.RoomID, rt.RoomTypeName as Type, rt.Price 
            FROM ROOM r
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            JOIN BOOKING b ON r.RoomID = b.RoomID
            WHERE b.CheckOutDate IS NULL
        `);
        
        const formattedRooms = rows.map(room => ({
            RoomID: room.RoomID,
            RoomName: `Room ${room.RoomID}`, 
            Type: room.Type, 
            Price: parseFloat(room.Price)
        }));

        res.json({ success: true, data: formattedRooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Tính toán hóa đơn (Preview)
export const getInvoicePreview = async (req, res) => {
    try {
        const { roomId } = req.params;
        const query = `
            SELECT 
                b.BookingID, 
                b.CheckInDate, 
                rt.Price, 
                rt.RoomTypeName as Type,
                (SELECT COUNT(*) FROM BOOKING_DETAIL bd WHERE bd.BookingID = b.BookingID) as CalculatedGuestCount,
                (
                    SELECT COUNT(*) 
                    FROM BOOKING_DETAIL bd
                    JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
                    JOIN CUSTOMER_TYPE ct ON c.CustomerTypeID = ct.CustomerTypeID
                    WHERE bd.BookingID = b.BookingID AND ct.CustomerTypeName = 'Foreign'
                ) as ForeignCount
            FROM BOOKING b
            JOIN ROOM r ON b.RoomID = r.RoomID
            JOIN ROOM_TYPE rt ON r.RoomTypeID = rt.RoomTypeID
            WHERE b.RoomID = ? AND b.CheckOutDate IS NULL
            LIMIT 1
        `;
        
        const [rows] = await pool.query(query, [roomId]);

        if (rows.length === 0) return res.status(404).json({ success: false, message: "No active booking found." });

        const data = rows[0];
        const guestCount = data.CalculatedGuestCount;
        const isForeign = data.ForeignCount > 0; // Nếu có > 0 khách ngoại thì tính là khách ngoại
        // Tính tiền gốc
        const now = new Date();
        const checkIn = new Date(data.CheckInDate);
        const diffDays = Math.ceil(Math.abs(now - checkIn) / (1000 * 60 * 60 * 24)) || 1; 
        const roomPrice = parseFloat(data.Price);
        const baseTotal = roomPrice * diffDays; 

        // Tính phụ thu
        let totalSurchargeAmount = 0; 

        // 1. Khách thứ 3 
        const hasExtraPerson = guestCount >= 3;
        if (hasExtraPerson) {
            totalSurchargeAmount += baseTotal * (surcharge.extraPerson - 1); 
        }

        // 2. Khách nước ngoài 
        const hasForeign = isForeign;
        if (hasForeign) {
            totalSurchargeAmount += baseTotal * (surcharge.foreignGuest - 1);
        }

        // 3. Ngày lễ 
        const hasHoliday = isHoliday(checkIn); 
        if (hasHoliday) {
            totalSurchargeAmount += baseTotal * (surcharge.holiday - 1);
        }

        const grandTotal = baseTotal + totalSurchargeAmount;

        res.json({
            success: true,
            data: {
                bookingId: data.BookingID,
                checkInDate: data.CheckInDate,
                nights: diffDays,
                roomType: data.Type,
                guests: guestCount, // Trả về số khách đếm được
                
                totalAmount: grandTotal,
                extraCharge: totalSurchargeAmount,
                
                surchargeDetails: {
                    isForeign: hasForeign,
                    foreignRate: surcharge.foreignGuest, 
                    isExtraPerson: hasExtraPerson,
                    extraPersonRate: surcharge.extraPerson, 
                    isHoliday: hasHoliday, 
                    holidayRate: surcharge.holiday 
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
            // BƯỚC 1: Lấy tên khách hàng để lưu vào hóa đơn (Logic này cần thêm vào)
            let customerName = 'Unknown Guest';
            
            // Thử lấy tên từ bảng BOOKING_DETAIL nối với CUSTOMER
            const [customerRows] = await connection.query(`
                SELECT c.FullName FROM BOOKING_DETAIL bd
                JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
                WHERE bd.BookingID = ? LIMIT 1
            `, [bookingId]);
            
            if (customerRows.length > 0) {
                customerName = customerRows[0].FullName;
            }

            // BƯỚC 2: Cập nhật Booking
            await connection.query(`
                UPDATE BOOKING 
                SET CheckOutDate = NOW(), 
                    PaymentDate = NOW(), 
                    TotalPrice = ? 
                WHERE BookingID = ?
            `, [totalAmount, bookingId]);
            
            // BƯỚC 3: Cập nhật Phòng
            await connection.query("UPDATE ROOM SET Status = 'Available' WHERE RoomID = ?", [roomId]);
            
            // BƯỚC 4: LƯU HÓA ĐƠN (Đoạn này bị thiếu ở code của bạn)
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
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};