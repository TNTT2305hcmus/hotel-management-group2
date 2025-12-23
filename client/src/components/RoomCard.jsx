import '../css/RoomCard.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


// room: object
// onEdit / onDelete : function
const RoomCard = ({ room, onEdit, onDelete, isLoading = false }) => {
    const getSatusColor = (status) => {
        if (status === 'Available') {
            return 'green';
        } else if (status === 'Occupied') {
            return 'red';
        }
        return 'yellow';
    };
    if (isLoading) {
        return (
            <div className="room-card">
                {/* Image */}
                <div className="image-container relative">
                    <Skeleton height={180} className="skeleton-img" />

                    <span className="status-badge">
                        <Skeleton width={70} height={18} />
                    </span>

                    <span className="room-number">
                        <Skeleton width={90} height={18} />
                    </span>
                </div>

                {/* Detail Info */}
                <div className="detail-infor">
                    <p><Skeleton width="80%" height={16} /></p>
                    <p><Skeleton width="70%" height={16} /></p>
                    <p><Skeleton width="90%" height={16} /></p>
                </div>

                {/* Buttons */}
                <div className="action-btn">
                    <Skeleton width="48%" height={38} />
                    <Skeleton width="48%" height={38} />
                </div>
            </div>
        );
    }

    return (
        <div className="room-card">
            {/* Image */}
            <div className="image-container relative">
                <img src={room.image} alt={`Room ${room.roomNumber}`}></img>
                <span className={`status-badge ${getSatusColor(room.status)}`}>
                    {room.status}
                </span>
                <span className="room-number">Room {room.roomNumber}</span>
            </div>

            {/* Detail Infor */}
            <div className="detail-infor">
                <p>Type: <strong>{room.type}</strong></p>
                <p>Capacity: <strong>{room.capacity} guests</strong></p>
                <p>Price: <strong>{room.price.toLocaleString()} VNĐ/night</strong></p>
            </div>

            {/* Button */}
            <div className="action-btn">
                <button onClick={() => onEdit(room.id)}>
                    <i className='bx  bx-edit'></i>
                    Edit
                </button>
                <button onClick={() => onDelete(room.id)}>
                    <i className='bx  bx-trash'></i>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default RoomCard;