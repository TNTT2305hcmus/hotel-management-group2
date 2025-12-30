import '../css/RoomCard.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room, onEdit, onDelete, isLoading = false }) => {
    const navigate = useNavigate();

    // Logic: Only allow editing if the room is Available or under Maintenance
    const isEditable = room?.status === 'Available' || room?.status === 'Maintenance';
    
    // Helper to determine badge color based on status
    const getStatusColor = (status) => {
        if (status === 'Available') {
            return 'green';
        } else if (status === 'Occupied') {
            return 'red';
        }
        return 'yellow'; // Default for Maintenance or others
    };

    // Handle navigation to room detail page
    const handleViewDetail = () => {
        console.log("Check ID Click:", room?.id); 
        
        if (room?.id) {
            navigate(`/room/${room.id}`);
        } else {
            alert("Error: Room ID not found!");
        }
    };

    // Render Loading Skeleton
    if (isLoading) {
        return (
            <div className="room-card">
                {/* Image Skeleton */}
                <div className="image-container relative">
                    <Skeleton height={180} className="skeleton-img" />

                    <span className="status-badge">
                        <Skeleton width={70} height={18} />
                    </span>

                    <span className="room-number">
                        <Skeleton width={90} height={18} />
                    </span>
                </div>

                {/* Detail Info Skeleton */}
                <div className="detail-infor">
                    <p><Skeleton width="80%" height={16} /></p>
                    <p><Skeleton width="70%" height={16} /></p>
                    <p><Skeleton width="90%" height={16} /></p>
                </div>

                {/* Buttons Skeleton */}
                <div className="action-btn">
                    <Skeleton width="48%" height={38} />
                    <Skeleton width="48%" height={38} />
                </div>
            </div>
        );
    }

    // Render Main Content
    return (
        <div className="room-card" style={{cursor: 'pointer'}}>
            {/* Image Section */}
            <div className="image-container relative" onClick={handleViewDetail} >
                <img src={room.image} alt={`Room ${room.roomNumber}`}></img>
                <span className={`status-badge ${getStatusColor(room.status)}`}>
                    {room.status}
                </span>
                <span className="room-number">Room {room.roomNumber}</span>
            </div>

            {/* Detail Info Section */}
            <div className="detail-infor" onClick={handleViewDetail} >
                <p>Type: <strong>{room.type}</strong></p>
                <p>Capacity: <strong>{room.capacity} guests</strong></p>
                <p>Price: <strong>{Number(room.price).toLocaleString()} VNĐ/night</strong></p>
            </div>

            {/* Action Buttons */}
            <div className="action-btn">
                <button 
                    onClick={() => isEditable && onEdit(room.id)}
                    disabled={!isEditable}
                    style={{
                        opacity: isEditable ? 1 : 0.5,
                        cursor: isEditable ? 'pointer' : 'not-allowed',
                        backgroundColor: isEditable ? '' : '#e0e0e0' // Optional: Grey out background
                    }}
                    title={isEditable ? "Edit room" : "Cannot edit occupied room"}
                >
                    <i className='bx bx-edit'></i>
                    Edit
                </button>
                
                <button onClick={() => onDelete(room.id)}>
                    <i className='bx bx-trash'></i>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default RoomCard;