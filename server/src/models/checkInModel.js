import pool from "../config/database.js";

const CheckInModel = {
  // Get list of unpaid check-ins (PaymentDate IS NULL) - returns only customer name and room number
  findUnpaidCheckIns: async () => {
    const query = `
            SELECT
                c.FullName AS fullName,
                CAST(b.RoomID AS CHAR) AS roomNumber
            FROM BOOKING b
            INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
            INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
            WHERE b.PaymentDate IS NULL
            ORDER BY b.CheckInDate DESC
        `;

    const [rows] = await pool.query(query);
    return rows;
  },

  // Search unpaid check-ins by customer name or room name - returns only customer name and room number
  searchUnpaidCheckIns: async (searchTerm) => {
    const query = `
            SELECT
                c.FullName AS fullName,
                CAST(b.RoomID AS CHAR) AS roomNumber
            FROM BOOKING b
            INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
            INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
            WHERE b.PaymentDate IS NULL
            AND (
                c.FullName LIKE ? 
                OR CAST(b.RoomID AS CHAR) LIKE ?
            )
            ORDER BY b.CheckInDate DESC
        `;

    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [searchPattern, searchPattern]);
    return rows;
  },

  // Lấy danh sách Booking CHECK-IN HÔM NAY
  getTodayReservations: async () => {
    const query = `
      SELECT 
        b.BookingID as bookingId,
        CAST(b.RoomID AS CHAR) as roomNumber,
        c.FullName as guestName, -- hoặc fullName tuỳ client mapping
        c.CitizenID as citizenId,
        c.PhoneNumber as phoneNumber,
        c.Address as address,
        CASE 
           WHEN b.PaymentDate IS NOT NULL THEN 'Confirmed' -- Đã thanh toán (hoặc logic khác tuỳ bạn)
           ELSE 'Pending' -- Chưa thanh toán (mới check-in)
        END as status
      FROM BOOKING b
      INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
      INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
      -- Lọc theo ngày check-in bằng hôm nay
      WHERE DATE(b.CheckInDate) = CURDATE()
      ORDER BY b.BookingID DESC -- Mới nhất lên đầu
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // Tìm kiếm trong danh sách hôm nay
  searchTodayReservations: async (searchTerm) => {
    const query = `
      SELECT 
        b.BookingID as bookingId,
        CAST(b.RoomID AS CHAR) as roomNumber,
        c.FullName as guestName,
        c.CitizenID as citizenId,
        c.PhoneNumber as phoneNumber,
        c.Address as address,
        'Pending' as status -- Đơn giản hóa hoặc dùng CASE như trên
      FROM BOOKING b
      INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
      INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
      WHERE DATE(b.CheckInDate) = CURDATE()
      AND (
        c.FullName LIKE ? 
        OR CAST(b.RoomID AS CHAR) LIKE ?
        OR c.PhoneNumber LIKE ? -- Thêm tìm kiếm theo SĐT
      )
      ORDER BY b.BookingID DESC
    `;
    const pattern = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [pattern, pattern, pattern]);
    return rows;
  },
};

export default CheckInModel;
