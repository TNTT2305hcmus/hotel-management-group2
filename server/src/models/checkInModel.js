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

  // Lấy Booking Check-in HÔM NAY
  getTodayReservations: async () => {
    const query = `
      SELECT 
        b.BookingID as bookingId,
        CAST(b.RoomID AS CHAR) as roomNumber,
        c.FullName as guestName, 
        c.CitizenID as citizenId,
        c.PhoneNumber as phoneNumber,
        c.Address as address,
        CASE 
           WHEN b.PaymentDate IS NOT NULL THEN 'Confirmed' 
           ELSE 'Pending' 
        END as status
      FROM BOOKING b
      INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
      INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
      -- So sánh ngày: Dùng DATE() để bỏ qua phần giờ phút giây
      WHERE DATE(b.CheckInDate) = DATE(NOW())
      ORDER BY b.BookingID DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // Tìm kiếm booking hôm nay
  searchTodayReservations: async (searchTerm) => {
    const query = `
      SELECT 
        b.BookingID as bookingId,
        CAST(b.RoomID AS CHAR) as roomNumber,
        c.FullName as guestName,
        c.CitizenID as citizenId,
        c.PhoneNumber as phoneNumber,
        c.Address as address,
        'Pending' as status
      FROM BOOKING b
      INNER JOIN BOOKING_DETAIL bd ON b.BookingID = bd.BookingID
      INNER JOIN CUSTOMER c ON bd.CitizenID = c.CitizenID
      WHERE DATE(b.CheckInDate) = DATE(NOW())
      AND (
        c.FullName LIKE ? OR CAST(b.RoomID AS CHAR) LIKE ? OR c.PhoneNumber LIKE ?
      )
      ORDER BY b.BookingID DESC
    `;
    const pattern = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [pattern, pattern, pattern]);
    return rows;
  }
};

export default CheckInModel;
