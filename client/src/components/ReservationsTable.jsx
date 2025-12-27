import { FaSearch } from 'react-icons/fa';

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'confirmed': return 'status-confirmed';
        case 'pending': return 'status-pending';
        default: return '';
    }
};

const ReservationsTable = ({
    reservations,
    searchTerm,
    onSearchChange,
    onCheckInClick
}) => {
    return (
        <div className="checkin-card reservations-card">
            <h3 className="section-title">Today's Reservation</h3>

            <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name or room number..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="reservations-table">
                <div className="table-header">
                    <span className="col-name">Guest Name</span>
                    <span className="col-room">Room</span>
                    <span className="col-status">Status</span>
                    <span className="col-action">Action</span>
                </div>

                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div key={reservation.bookingId} className="table-row">
                            <span className="col-name">{reservation.guestName}</span>
                            <span className="col-room">{reservation.roomNumber}</span>
                            <span className="col-status">
                                <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                                    {reservation.status}
                                </span>
                            </span>
                            <span className="col-action">
                                <button
                                    className="btn-checkin"
                                    onClick={() => onCheckInClick(reservation)}
                                >
                                    Check-in
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No reservations for today</div>
                )}
            </div>
        </div>
    );
};

export default ReservationsTable;
