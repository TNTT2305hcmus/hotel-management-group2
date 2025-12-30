import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomDetailAPI, fetchRoomGuestsAPI } from "../services/listRoomService";
import "../css/RoomDetail.css";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Fetching ID:", id);

        const [roomData, guestsData] = await Promise.all([
          fetchRoomDetailAPI(id),
          fetchRoomGuestsAPI(id)
        ])

        if (roomData) {
            setRoom(roomData);
        }

        // Kiểm tra dữ liệu guestsData trả về
        if (Array.isArray(guestsData)) {
            setGuests(guestsData);
        } else if (guestsData && Array.isArray(guestsData.data)) {
            setGuests(guestsData.data);
        } else {
             setGuests([]);
        }

      } catch (err) {
        setError("Không tìm thấy thông tin phòng hoặc lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading room info...</div>;
  
  if (error) return (
    <div className="detail-error">
        <h2>Error 404</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const isAvailable = room.status === 'Available';

  const handleBookNowClick = () => {
    navigate('/checkin', { 
      state: { 
        selectedRoomId: room.roomNumber || room.id 
      } 
    });
  }

  return (
    <div className="room-detail-container">
      <div className="detail-card">
        {/* Cột trái: Ảnh lớn & Trạng thái */}
        <div className="detail-image">
           <img src={room.image || "https://via.placeholder.com/600x400"} alt="Room View" />
           <span className={`status-tag ${room.status?.toLowerCase()}`}>{room.status}</span>
        </div>

        {/* Cột phải: Thông tin chi tiết */}
        <div className="detail-info">
            <h1>Room {room.roomNumber}</h1>
            <h3 className="text-type">{room.type}</h3>
            
            <div className="info-grid">
                <div className="info-item">
                    <label>Price per night</label>
                    <span>{Number(room.price).toLocaleString()} VNĐ</span>
                </div>
                <div className="info-item">
                    <label>Capacity</label>
                    <span>{room.capacity} Guests</span>
                </div>
            </div>

            <div className="description-section">
                <label>Description / Notes</label>
                <p>{room.note || "No description available for this room."}</p>
            </div>

            <div className="detail-actions">
                 <button 
                    className="btn-action" 
                    onClick={handleBookNowClick}
                    disabled={!isAvailable} 
                    style={{
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.6 
                    }}
                 >
                    {isAvailable ? 'Book Now' : 'Not Available'}
                 </button>
            </div>
        </div>
      </div>
      
      {/* Bảng lịch sử khách hàng */}
      <div className="guest-history-section">
        <h3>Guest History</h3>
        <div className="table-responsive">
            <table className="guest-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>ID/Passport</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Check-in</th>
                        <th>Status / Check-out</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.length > 0 ? (
                        guests.map((guest, index) => {
                            const isStaying = (guest.status === 'CheckedIn' || guest.status === 'Occupied') || !guest.checkOut;

                            return (
                                <tr key={index} className={isStaying ? "row-staying" : ""}>
                                    <td>{index + 1}</td>
                                    
                                    <td className="guest-name">
                                        {guest.name}
                                        {/* Đã XÓA đoạn hiển thị badge Current tại đây */}
                                    </td>
                                    
                                    <td>{guest.passport || guest.idCard || "N/A"}</td>
                                    <td>{guest.phone}</td>
                                    <td>
                                        {guest.address?.city 
                                            ? `${guest.address.city}, ${guest.address.country}` 
                                            : (guest.address || "N/A")}
                                    </td>
                                    <td>{new Date(guest.checkIn).toLocaleDateString("vi-VN")}</td>
                                    
                                    <td>
                                        {isStaying ? (
                                            <div className="status-staying-container">
                                                <span className="status-dot"></span>
                                                <span className="status-text">Staying</span>
                                            </div>
                                        ) : (
                                            new Date(guest.checkOut).toLocaleDateString("vi-VN")
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">No booking history found for this room.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;