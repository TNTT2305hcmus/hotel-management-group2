import pool from '../config/database.js';

export const createBookingService = async (data) => {
    const { roomId, checkInDate, checkOutDate, guests } = data;
    
    // 1. Tính toán ngày checkout dự kiến
    let finalCheckOut = checkOutDate;
    if (!finalCheckOut) {
        const date = new Date(checkInDate);
        date.setDate(date.getDate() + 1);
        finalCheckOut = date.toISOString().slice(0, 10); 
    }

    // a. Tính số lượng khách
    const guestCount = guests.length;

    // b. Kiểm tra có khách nước ngoài không
    const isForeign = guests.some(guest => Number(guest.customerTypeId) === 2);

    // c. Lấy tên khách đại diện (Người đầu tiên trong danh sách)
    const customerName = guests.length > 0 ? guests[0].fullName : 'Unknown';

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // B1: Lấy giá phòng
        const [roomRows] = await connection.query(
            `SELECT Price FROM ROOM 
             JOIN ROOM_TYPE ON ROOM.RoomTypeID = ROOM_TYPE.RoomTypeID 
             WHERE RoomID = ?`, 
            [roomId]
        );
        
        if (roomRows.length === 0) {
            throw new Error('Room not found or has been deleted');
        }
        
        // Tính tổng tiền dự kiến
        const pricePerNight = roomRows[0].Price;
        const diffTime = Math.abs(new Date(finalCheckOut) - new Date(checkInDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
        const totalPrice = pricePerNight * diffDays;

        // B2: Xử lý thông tin khách hàng 
        for (const guest of guests) {
            const [existing] = await connection.query(
                `SELECT CitizenID FROM CUSTOMER WHERE CitizenID = ?`, 
                [guest.citizenId]
            );

            if (existing.length === 0) {
                // Thêm khách mới
                await connection.query(
                    `INSERT INTO CUSTOMER (CitizenID, CustomerTypeID, FullName, PhoneNumber, Address) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        guest.citizenId, 
                        guest.customerTypeId, 
                        guest.fullName, 
                        guest.phoneNumber || null, 
                        guest.address
                    ]
                );
            } else {
                // Cập nhật khách cũ
                await connection.query(
                    `UPDATE CUSTOMER 
                     SET PhoneNumber = ?, Address = ?, FullName = ? 
                     WHERE CitizenID = ?`,
                    [
                        guest.phoneNumber || null, 
                        guest.address, 
                        guest.fullName,
                        guest.citizenId
                    ]
                );
            }
        }

        // B3: Tạo Booking 
        const [bookingResult] = await connection.query(
            `INSERT INTO BOOKING (RoomID, CheckInDate, CheckOutDate, TotalPrice, CustomerName, GuestCount, IsForeign) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                roomId, 
                checkInDate, 
                finalCheckOut, 
                totalPrice,
                customerName, 
                guestCount,   
                isForeign     
            ]
        );
        const newBookingId = bookingResult.insertId;

        // B4: Lưu Booking Details
        for (const guest of guests) {
            await connection.query(
                `INSERT INTO BOOKING_DETAIL (BookingID, CitizenID) VALUES (?, ?)`,
                [newBookingId, guest.citizenId]
            );
        }

        // B5: Cập nhật trạng thái phòng
        await connection.query(
            `UPDATE ROOM SET Status = 'Occupied' WHERE RoomID = ?`,
            [roomId]
        );

        await connection.commit();
        
        return {
            bookingId: newBookingId,
            totalPrice: totalPrice,
            guestCount: guestCount, 
            isForeign: isForeign,
            status: 'Success'
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};