import { useState, useEffect, useMemo } from 'react';
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
            image: 'https://xhomesg.com.vn/wp-content/uploads/2024/08/thiet-ke-noi-that-phong-ngu-12m2-Xhome-Sai-Gon.jpg'
        },
        {
            id: 112,
            roomNumber: "112",
            type: "Double",
            capacity: 2,
            price: 750000,
            status: "Maintainance",
            image: 'https://www.made4home.com.vn/wp-content/uploads/2025/10/thiet-ke-noi-that-phong-ngu.webp'
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
            image: 'https://noithatbyt.vn/wp-content/uploads/2025/08/TOP-10-Mau-Thiet-Ke-Phong-Ngu-10m2-Dep-Choang-Ngop.webp'
        },
    ]);

    const [loading, setLoading] = useState(false);
    // để biết loading trang nào (phân biệt first load vs load more)
    const [loadingPage, setLoadingPage] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [stats, setStats] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filters, setFilters] = useState({ search: '', type: '', status: '' });

    const debouncedSearch = useDebounce(filters.search, 1000);

    // Số skeleton card = page size
    const PAGE_SIZE = 8;

    // Danh sách key skeleton ổn định
    const skeletonList = useMemo(
        () => Array.from({ length: PAGE_SIZE }, (_, i) => i),
        []
    );

    const fetchRooms = async (currentPage) => {
        if (loading) return;

        setLoading(true);
        setLoadingPage(currentPage);

        try {
            // Dùng currentPage thay vì pageNumber (tránh load sai trang)
            const newRooms = await fetchListRoomsFollowPage(
                currentPage,
                debouncedSearch,
                filters.type,
                filters.status
            );

            if (currentPage === 1) {
                setRooms(newRooms);
            } else {
                setRooms((prevRooms) => [...prevRooms, ...newRooms]);
            }

            if (newRooms.length === 0 || newRooms.length < PAGE_SIZE) {
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

    // useEffect cho search/filter
    useEffect(() => {
        setPageNumber(1);
        setHasMore(true);
        fetchRooms(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filters.type, filters.status]);

    // useEffect cho Load More
    useEffect(() => {
        if (pageNumber > 1) {
            fetchRooms(pageNumber);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber]);

    // Xử lý action
    const handleLoadMore = () => {
        if (loading) return; // ✅ tránh bấm liên tục khi đang load
        setPageNumber((prev) => prev + 1);
    };

    const handleSearch = (val) => setFilters({ ...filters, search: val });
    const handleFilterType = (val) => setFilters({ ...filters, type: val });
    const handleFilterStatus = (val) => setFilters({ ...filters, status: val });

    const handleEdit = (id) => console.log("Edit room:", id);
    const handleDelete = (id) => console.log("Delete room:", id);

    // Phân biệt loading
    const isFirstLoading = loading && loadingPage === 1;
    const isLoadingMore = loading && loadingPage > 1;

    return (
        <div className="room-management-page">
            <div className="header">
                <h1>Room Management</h1>
                <button className="btn-add">
                    <i className='bx bx-plus'></i> Add New Room
                </button>
            </div>

            <StatusSummary stats={stats} isLoading={loading && pageNumber === 1} />

            <FilterBar
                onSearch={handleSearch}
                onFilterType={handleFilterType}
                onFilterStatus={handleFilterStatus}
            />

            <div className="room-list">
                {/* // Hiển thị skeleton khi là first load  */}
                {isFirstLoading ? (
                    skeletonList.map((i) => (
                        <RoomCard key={`sk-${i}`} isLoading />
                    ))
                ) : (
                    <>
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                        {/* ✅ NEW: khi load more thì append skeleton ở dưới */}
                        {isLoadingMore &&
                            skeletonList.map((i) => (
                                <RoomCard key={`sk-more-${i}`} isLoading />
                            ))}
                    </>
                )}
            </div>

            <div className="text-center">
                {!loading && hasMore && (
                    <button onClick={handleLoadMore} className="btn-loadMore">
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
