import { useState, useEffect } from 'react';
import { fetchListRoomsFollowPage } from '../services/listRoomService';
import useDebounce from '../hooks/useDebounce';
import StatusSummary from './StatusSummary';
import FilterBar from './FilterBar';
import RoomCard from './RoomCard';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [rooms, setRooms] = useState([
        {
            id: 107,
            roomNumber: "107",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Available", 
            image: 'https://noithathaiminh.com.vn/public/anh1/images/tin-tuc/noi-that-phong-ngu-01.webp'
        },
        {
            id: 108,
            roomNumber: "108",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Available", 
            image: 'https://www.made4home.com.vn/wp-content/uploads/2025/10/thiet-ke-noi-that-phong-ngu.webp'
        },
        {
            id: 109,
            roomNumber: "109",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Maintainance", 
            image: 'https://noithatbyt.vn/wp-content/uploads/2025/08/TOP-10-Mau-Thiet-Ke-Phong-Ngu-10m2-Dep-Choang-Ngop.webp'
        },
        {
            id: 110,
            roomNumber: "110",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Occupied", 
            image: 'https://xhomesg.com.vn/wp-content/uploads/2024/08/thiet-ke-noi-that-phong-ngu-12m2-Xhome-Sai-Gon.jpg'
        },
        {
            id: 111,
            roomNumber: "111",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Occupied", 
            image: 'https://noithathaiminh.com.vn/public/anh1/images/tin-tuc/noi-that-phong-ngu-01.webp'
        },
        {
            id: 112,
            roomNumber: "112",
            type: "Double",
            capacity: 2,
            price: 750000,
            status: "Maintainance", 
            image: 'https://noithathaiminh.com.vn/public/anh1/images/tin-tuc/noi-that-phong-ngu-01.webp'
        },
        {
            id: 113,
            roomNumber: "113",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Available", 
            image: 'https://noithathaiminh.com.vn/public/anh1/images/tin-tuc/noi-that-phong-ngu-01.webp'
        },
        {
            id: 114,
            roomNumber: "110",
            type: "Single",
            capacity: 1,
            price: 500000,
            status: "Occupied", 
            image: 'https://noithathaiminh.com.vn/public/anh1/images/tin-tuc/noi-that-phong-ngu-01.webp'
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1); // Trang 1
    const [hasMore, setHasMore] = useState(true); // Check xem còn dữ liệu để fetch không
    const [stats, setStats] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filters, setFilters] = useState({ search: '', type: '', status: '' });

    const debouncedSearch = useDebounce(filters.search, 1000);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const newRooms = await fetchListRoomsFollowPage(pageNumber);
            if (pageNumber === 1) {
                setRooms(newRooms); 
            } else {
                setRooms(prevRooms => [...prevRooms, ...newRooms]); 
            }

            if (newRooms.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách phòng:", error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect cho search
    useEffect(() => {
        setPageNumber(1);
        fetchRooms(1, debouncedSearch, filters.type, filters.status);
    }, [debouncedSearch, filters.type, filters.status]);

    // useEffect cho Load More
    useEffect(() => {
        if (pageNumber > 1) {
            fetchRooms(pageNumber, debouncedSearch, filters.type, filters.status);
        }
    }, [pageNumber]);

    // Xử lý action
    const handleLoadMore = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
    }
    const handleSearch = (val) => setFilters({...filters, search: val});
    const handleFilterType = (val) => setFilters({...filters, type: val});
    const handleFilterStatus = (val) => setFilters({...filters, status: val});
    
    const handleEdit = (id) => { console.log("Edit room:", id); /* Mở Modal Edit */ };
    const handleDelete = (id) => { console.log("Delete room:", id); /* Gọi API xóa */ };

    return (
        <div className="room-management-page">
            <div className="header">
                <h1>Room Management</h1>
                <button className="btn-add">
                    <i className='bx  bx-plus'></i> 
                    Add New Room
                </button>
            </div>

            {/* Truyền số liệu thống kê xuống */}
            <StatusSummary stats={stats} />

            {/* Truyền hàm xử lý lọc xuống */}
            <FilterBar 
                onSearch={handleSearch}
                onFilterType={handleFilterType}
                onFilterStatus={handleFilterStatus}
            />

            <div className="room-list">
                {loading ? <p>Loading...</p> : rooms.map(room => (
                <RoomCard 
                    key={room.id} 
                    room={room} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                />
                ))}
            </div>
            
            {/* Khu vực nút Load More */}
            <div className="text-center">
                {loading && <p className="loading-text">Đang tải...</p>}
                
                {!loading && hasMore && (
                    <button 
                        onClick={handleLoadMore}
                        className="btn-loadMore"
                    >
                        Show More Rooms
                    </button>
                    )}

                {!hasMore && rooms.length > 0 && (
                    <p className="text-error">Bạn đã xem hết danh sách phòng.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;