import { FaSearch } from 'react-icons/fa';

const ReservationsTable = ({
    reservations,
    searchTerm,
    onSearchChange,
}) => {
    return (
        <div className="checkin-card reservations-card">
            <h3 className="section-title">Today's Reservation</h3>

            <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, room, or phone..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="reservations-table">
                {/* HEADERS */}
                <div className="table-header">
                    <span className="col-room">Room</span>
                    <span className="col-name">Guest Name</span>
                    <span className="col-id">ID/Passport</span>
                    <span className="col-phone">Phone</span>
                    <span className="col-address">Address</span>
                </div>

                {/* DATA ROWS */}
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div key={reservation.bookingId} className="table-row">
                            <span className="col-room font-bold">{reservation.roomNumber}</span>
                            <span className="col-name font-bold">{reservation.fullName || reservation.guestName}</span>
                            <span className="col-id">{reservation.citizenId || "N/A"}</span>
                            <span className="col-phone">{reservation.phoneNumber || "N/A"}</span>
                            <span className="col-address truncate" title={reservation.address}>
                                {reservation.address || "N/A"}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No reservations found for today</div>
                )}
            </div>
        </div>
    );
};

export default ReservationsTable;