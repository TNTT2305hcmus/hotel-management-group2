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
};

export default CheckInModel;
