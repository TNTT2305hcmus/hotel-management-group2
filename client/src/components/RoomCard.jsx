import '../css/RoomCard.css';

// room: object
// onEdit / onDelete : function
const RoomCard = ({room, onEdit, onDelete}) => {
    const getSatusColor = (status) => {
        if(status === 'Available'){
            return 'green';
        } else if (status === 'Occupied'){
            return 'red';
        }
        return 'yellow';
    };


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