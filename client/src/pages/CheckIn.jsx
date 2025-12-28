import { useState, useEffect } from 'react';
import '../css/CheckIn.css';
import {
    fetchAvailableRoomsAPI,
    createCheckInAPI,
    fetchTodayReservationsAPI,
    searchTodayReservationsAPI,
    checkInFromReservationAPI
} from '../services/checkinService';
import useDebounce from '../hooks/useDebounce';

// Components
import GuestFormCard from '../components/GuestFormCard';
import ReservationsTable from '../components/ReservationsTable';
import { ConfirmCheckInModal, StatusModal } from '../components/CheckInModals';

// --- CONSTANTS & UTILS ---
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getNextDay = (dateString = new Date()) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

// --- GUEST TEMPLATE ---
const createEmptyGuest = () => ({
    fullName: '',
    citizenId: '',
    phone: '',
    address: '',
    notes: '',
    customerTypeId: 1
});

const CheckIn = () => {
    // --- DATA STATES ---
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');

    // --- DATE STATES ---
    const [checkInDate, setCheckInDate] = useState(getTodayDate());
    const [checkOutDate, setCheckOutDate] = useState(getNextDay());
    const [guests, setGuests] = useState([createEmptyGuest()]);

    // --- TODAY'S RESERVATIONS ---
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    // --- UI STATES ---
    const [submitting, setSubmitting] = useState(false);

    // --- MODAL STATES ---
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [checkInReservation, setCheckInReservation] = useState(null);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    // --- INITIAL LOAD ---
    useEffect(() => {
        loadAvailableRooms();
        loadTodayReservations();
    }, []);

    // --- SEARCH EFFECT ---
    useEffect(() => {
        if (debouncedSearch) {
            searchReservations(debouncedSearch);
        } else {
            loadTodayReservations();
        }
    }, [debouncedSearch]);

    const loadAvailableRooms = async () => {
        const res = await fetchAvailableRoomsAPI();
        if (res.success) {
            setAvailableRooms(res.data);
        }
    };

    const loadTodayReservations = async () => {
        const res = await fetchTodayReservationsAPI();
        if (res.success) {
            setReservations(res.data);
        }
    };

    const searchReservations = async (term) => {
        const res = await searchTodayReservationsAPI(term);
        if (res.success) {
            setReservations(res.data);
        }
    };

    // --- GUEST HANDLERS ---
    const handleGuestChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index][field] = value;
        setGuests(updatedGuests);
    };

    // --- VALIDATION ---
    const validateForm = () => {
        if (!selectedRoom) return false;
        if (!checkInDate) return false;
        if (!checkOutDate) return false;
        
        // Kiểm tra ngày checkout phải sau ngày checkin
        if (new Date(checkOutDate) <= new Date(checkInDate)) return false;

        // Validate guest
        const mainGuest = guests[0];
        if (!mainGuest.fullName.trim() || !mainGuest.citizenId.trim()) {
            return false;
        }
        return true;
    };

    const handleCheckInDateChange = (e) => {
        const newCheckIn = e.target.value;
        setCheckInDate(newCheckIn);

        if (newCheckIn >= checkOutDate) {
            setCheckOutDate(getNextDay(newCheckIn));
        }
    };

    // --- CREATE BOOKING  ---
    const handleCreateBooking = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        const checkInData = {
            roomId: parseInt(selectedRoom),
            checkInDate,
            checkOutDate,
            guests: guests.map(g => ({
                fullName: g.fullName.trim(),
                citizenId: g.citizenId.trim(),
                phoneNumber: g.phone?.trim() || null,
                address: g.address?.trim() || null,
                customerTypeId: g.customerTypeId || 1
            }))
        };

        const res = await createCheckInAPI(checkInData);
        setSubmitting(false);

        if (res.success) {
            handleReset();
            loadAvailableRooms(); // Load lại phòng để thấy phòng vừa book đã mất khỏi list (hoặc cập nhật status)
            loadTodayReservations();
            setStatusModal({ isOpen: true, type: 'success', message: 'Booking created & Room occupied!' });
        } else {
            setStatusModal({ isOpen: true, type: 'error', message: res.message || "Booking failed." });
        }
    };

    // --- CHECK-IN FROM RESERVATION ---
    const handleCheckInClick = (reservation) => {
        setCheckInReservation(reservation);
        setShowConfirmModal(true);
    };

    const handleConfirmCheckIn = async () => {
        if (!checkInReservation) return;

        setSubmitting(true);
        const res = await checkInFromReservationAPI(checkInReservation.bookingId);
        setSubmitting(false);
        setShowConfirmModal(false);
        setCheckInReservation(null);

        if (res.success) {
            loadTodayReservations();
            loadAvailableRooms();
            setStatusModal({ isOpen: true, type: 'success', message: 'Check-in successful!' });
        } else {
            setStatusModal({ isOpen: true, type: 'error', message: res.message || "Check-in failed." });
        }
    };

    const handleReset = () => {
        setSelectedRoom('');
        setCheckInDate(getTodayDate());
        setCheckOutDate(getNextDay());
        setGuests([createEmptyGuest()]);
    };

    const isFormValid = validateForm();

    return (
        <div className="checkin-page">
            <h1 className="page-title">Check-in</h1>

            <div className="checkin-top-section">
                <div className="checkin-card top-card">
                    <div className="top-form-row">
                        {/* 1. SELECT ROOM  */}
                        <div className="form-group">
                            <label className="form-label">Select Room*</label>
                            <select
                                className="form-select"
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                            >
                                <option value="">Choose an empty room..</option>
                                {availableRooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber} - {room.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. CHECK-IN DATE */}
                        <div className="form-group">
                            <label className="form-label">Check-in Date*</label>
                            <input
                                type="date"
                                className="form-input date-input"
                                value={checkInDate}
                                min={getTodayDate()}
                                onChange={handleCheckInDateChange}
                            />
                        </div>

                        {/* 3. CHECK-OUT DATE */}
                        <div className="form-group">
                            <label className="form-label">Check-out Date*</label>
                            <input
                                type="date"
                                className="form-input date-input"
                                value={checkOutDate}
                                // Min của checkout luôn là ngày sau của checkin
                                min={getNextDay(checkInDate)} 
                                onChange={(e) => setCheckOutDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* GUEST INFORMATION SECTION */}
            <div className="checkin-card guest-card">
                <div className="guest-header">
                    <h3 className="section-title">Guest Information</h3>
                </div>

                {/* Chỉ hiển thị form cho khách đầu tiên */}
                <GuestFormCard
                    key={0}
                    guest={guests[0]}
                    index={0}
                    onGuestChange={(field, value) => handleGuestChange(0, field, value)}
                    onRemove={null} 
                    canRemove={false}
                />

                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleReset}>
                        Cancel
                    </button>
                    <button
                        className="btn-confirm"
                        disabled={!isFormValid || submitting}
                        onClick={handleCreateBooking}
                    >
                        {submitting ? 'Processing...' : 'Create Booking'}
                    </button>
                </div>
            </div>

            <ReservationsTable
                reservations={reservations}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCheckInClick={handleCheckInClick}
            />

            {showConfirmModal && (
                <ConfirmCheckInModal
                    reservation={checkInReservation}
                    onConfirm={handleConfirmCheckIn}
                    onCancel={() => setShowConfirmModal(false)}
                    submitting={submitting}
                />
            )}

            <StatusModal
                isOpen={statusModal.isOpen}
                type={statusModal.type}
                message={statusModal.message}
                onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
            />
        </div>
    );
};

export default CheckIn;
