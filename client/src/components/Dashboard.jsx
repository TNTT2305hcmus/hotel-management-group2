import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchListRoomsFollowPage, fetchRoomStats } from '../services/listRoomService';
import useDebounce from '../hooks/useDebounce';
import StatusSummary from './StatusSummary';
import FilterBar from './FilterBar';
import RoomCard from './RoomCard';
import '../css/Dashboard.css';

const PAGE_SIZE = 8;

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState({ available: 0, occupied: 0, maintenance: 0 }); 
    const [loading, setLoading] = useState(false);
    
    // Pagination & Filter states
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({ search: '', type: '', status: '' });
    
    const debouncedSearch = useDebounce(filters.search, 500); 

    const skeletonList = useMemo(() => Array.from({ length: PAGE_SIZE }, (_, i) => i), []);

    // 1. Hàm Load Danh sách phòng
    const fetchRoomsData = useCallback(async (currentPage, currentFilters, isSearching) => {
        setLoading(true);
        if (isSearching) setRooms([]); 

        try {
            const newRooms = await fetchListRoomsFollowPage(
                currentPage,
                currentFilters.search,
                currentFilters.type,
                currentFilters.status
            );

            // Kiểm tra newRooms có phải mảng không ?
            if (Array.isArray(newRooms)) {
                if (isSearching || currentPage === 1) {
                    setRooms(newRooms);
                } else {
                    setRooms((prev) => [...prev, ...newRooms]);
                }
                
                // Logic check Load More
                if (newRooms.length < PAGE_SIZE) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } else {
                 setHasMore(false);
            }
            
        } catch (error) {
            console.error("Lỗi tải phòng:", error);
        } finally {
            setLoading(false);
        }
    }, []); 

    // 2. Hàm Load Thống kê (Chỉ gọi 1 lần khi mount hoặc khi action thêm/sửa/xóa xong)
    const loadStats = async () => {
        const data = await fetchRoomStats();
        setStats(data);
    };

    // Effect khởi tạo: Load Stats
    useEffect(() => {
        loadStats();
    }, []);

    // Effect xử lý Filter (Search/Type/Status)
    useEffect(() => {
        let isActive = true; 
        const executeFetch = async () => {
            setPageNumber(1); 
            if (isActive) {
                await fetchRoomsData(1, { ...filters, search: debouncedSearch }, true);
            }
        };
        executeFetch();
        return () => { isActive = false; };
    }, [debouncedSearch, filters.type, filters.status, fetchRoomsData]);

    // Effect xử lý Load More
    useEffect(() => {
        if (pageNumber === 1) return;
        let isActive = true;
        const executeFetch = async () => {
            if (isActive) {
                await fetchRoomsData(pageNumber, { ...filters, search: debouncedSearch }, false);
            }
        };
        executeFetch();
        return () => { isActive = false; };
    }, [pageNumber, fetchRoomsData]);


    // Handlers
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPageNumber(prev => prev + 1);
        }
    };

    const handleSearch = (val) => setFilters(prev => ({ ...prev, search: val }));
    const handleFilterType = (val) => setFilters(prev => ({ ...prev, type: val }));
    const handleFilterStatus = (val) => setFilters(prev => ({ ...prev, status: val }));
    
    const handleEdit = (id) => console.log("Edit:", id);
    const handleDelete = (id) => console.log("Delete:", id);

    return (
        <div className="room-management-page">
            <div className="header">
                <h1>Room Management</h1>
                <button className="btn-add"><i className='bx bx-plus'></i> Add New Room</button>
            </div>

            {/* Truyền stats vào component con */}
            <StatusSummary stats={stats} isLoading={false} />
            
            <FilterBar
                onSearch={handleSearch}
                onFilterType={handleFilterType}
                onFilterStatus={handleFilterStatus}
            />

            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
                ))}

                {loading && skeletonList.map((i) => (
                    <RoomCard key={`sk-${i}`} isLoading />
                ))}
            </div>

            <div className="text-center" style={{ marginTop: '20px', paddingBottom: '20px' }}>
                {!loading && hasMore && rooms.length > 0 && (
                    <button onClick={handleLoadMore} className="btn-loadMore">
                        Show More Rooms
                    </button>
                )}
                {!loading && !hasMore && rooms.length > 0 && (
                    <p className="text-muted">Bạn đã xem hết danh sách phòng.</p>
                )}
                {!loading && rooms.length === 0 && (
                    <div className="empty-state">
                        <i className='bx bx-search-alt' style={{fontSize: '40px', color: '#ccc'}}></i>
                        <p className="text-muted">Không tìm thấy phòng nào phù hợp.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;