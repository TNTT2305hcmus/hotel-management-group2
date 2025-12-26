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
        } else {
            throw new Error("Data is empty");
        }

        if (guestsData) {
            setGuests(guestsData);
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

  return (
    <div className="room-detail-container">
      <div className="detail-card">
        {/* Cột trái: Ảnh lớn */}
        <div className="detail-image">
           <img src={room.image || "https://via.placeholder.com/600x400"} alt="Room View" />
           <span className={`status-tag ${room.status?.toLowerCase()}`}>{room.status}</span>
        </div>

        {/* Cột phải: Thông tin */}
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

            {/* Các nút hành động nhanh (nếu cần) */}
            <div className="detail-actions">
                 <button className="btn-action primary">Book Now</button>
            </div>
        </div>
      </div>
      
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
                        <th>Check-out</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.length > 0 ? (
                        guests.map((guest, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="guest-name">{guest.name}</td>
                                <td>{guest.passport || guest.idCard || "N/A"}</td>
                                <td>{guest.phone}</td>
                                <td>
                                    {/* Xử lý hiển thị địa chỉ linh hoạt */}
                                    {guest.address?.city 
                                        ? `${guest.address.city}, ${guest.address.country}` 
                                        : (guest.address || "N/A")}
                                </td>
                                <td>{new Date(guest.checkIn).toLocaleDateString("vi-VN")}</td>
                                <td>
                                    {guest.checkOut 
                                        ? new Date(guest.checkOut).toLocaleDateString("vi-VN") 
                                        : <span className="status-staying">Staying</span>}
                                </td>
                            </tr>
                        ))
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