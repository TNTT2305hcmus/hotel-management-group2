import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    fetchListRoomsFollowPage, 
    fetchRoomStats,
    createRoomAPI, 
    updateRoomAPI, 
    deleteRoomAPI 
} from '../services/listRoomService';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../api/AuthContext';
import StatusSummary from './StatusSummary';
import FilterBar from './FilterBar';
import RoomCard from './RoomCard';
import DeleteConfirm from '../components/DeleteConfirm';
import RoomForm from '../components/RoomForm';
import Unauthorized from '../components/Unauthorized';
import '../css/Dashboard.css';

const PAGE_SIZE = 8;

const Dashboard = () => {
    // User info
    const { user } = useAuth();
    const isManager = user?.accountTypeID === 1;

    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState({ available: 0, occupied: 0, maintenance: 0 }); 
    const [loading, setLoading] = useState(false);
    
    // Pagination & Filter states
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({ search: '', type: '', status: '' });

    // Modal
    const [showUnauthorized, setShowUnauthorized] = useState(false);
    const [modalState, setModalState] = useState({ 
        type: null, // 'ADD', 'EDIT', 'DELETE'
        isOpen: false,
        data: null // Dữ liệu phòng đang chọn
    });
    
    const debouncedSearch = useDebounce(filters.search, 500); 

    const skeletonList = useMemo(() => Array.from({ length: PAGE_SIZE }, (_, i) => i), []);

    // Hàm Load Danh sách phòng
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

    // Hàm Load Thống kê (Chỉ gọi 1 lần khi mount hoặc khi action thêm/sửa/xóa xong)
    const loadStats = async () => {
        const data = await fetchRoomStats();
        setStats(data);
    };

    // Hàm check quyền
    const checkPermissionAndOpen = (type, data = null) => {
        if (isManager) {
            // Nếu là Manager -> Mở Modal chức năng
            setModalState({ type, isOpen: true, data });
        } else {
            // Nếu là Receptionist -> Mở màn hình báo lỗi 404/403
            setShowUnauthorized(true);
        }
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
    
    const handleAdd = () => checkPermissionAndOpen('ADD');
    const handleEdit = (room) => checkPermissionAndOpen('EDIT', room);
    const handleDelete = (room) => checkPermissionAndOpen('DELETE', room);

    const closeModal = () => setModalState({ ...modalState, isOpen: false });

    const handleSubmitAction = async (formData) => {
        try {
            if (modalState.type === 'ADD') {
                await createRoomAPI(formData);
                alert("Thêm phòng thành công!");
            } else if (modalState.type === 'EDIT') {
                await updateRoomAPI(modalState.data.id, formData);
                alert("Cập nhật thành công!");
            }
            
            // Khi thêm/sửa xong, ta nên load lại trang 1 để đảm bảo dữ liệu mới nhất
            setPageNumber(1); 
            fetchRoomsData(1, filters, true); 
            
            loadStats(); // Update lại số liệu thống kê luôn
            closeModal();
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteRoomAPI(modalState.data.id);
            alert("Xóa thành công!");
            
            // Tương tự, xóa xong thì refresh về trang 1
            setPageNumber(1);
            fetchRoomsData(1, filters, true);
            
            loadStats();
            closeModal();
        } catch (error) {
            alert("Lỗi xóa: " + error.message);
        }
    };

    return (
        <div className="room-management-page">
            <div className="header">
                <h1>Room Management</h1>
                <button className="btn-add" onClick={handleAdd}><i className='bx bx-plus'></i> Add New Room</button>
            </div>

            <StatusSummary stats={stats} isLoading={false} />
            
            <FilterBar
                onSearch={handleSearch}
                onFilterType={handleFilterType}
                onFilterStatus={handleFilterStatus}
            />

            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onEdit={() => handleEdit(room)} onDelete={() => handleDelete(room)} />
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

            {showUnauthorized && (
                <Unauthorized onClose={() => setShowUnauthorized(false)} />
            )}

            <DeleteConfirm 
                isOpen={modalState.isOpen && modalState.type === 'DELETE'}
                onClose={closeModal}
                onConfirm={confirmDelete}
                roomNumber={modalState.data?.roomNumber}
            />

            <RoomForm 
                isOpen={modalState.isOpen && (modalState.type === 'ADD' || modalState.type === 'EDIT')}
                onClose={closeModal}
                onSubmit={handleSubmitAction}
                mode={modalState.type}
                initialData={modalState.data}
            />
        </div>
    );
};

export default Dashboard;