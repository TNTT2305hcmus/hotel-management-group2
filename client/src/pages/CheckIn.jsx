import { useState, useEffect } from 'react';
import '../css/CheckIn.css';
import {
    fetchAvailableRoomsAPI,
    createCheckInAPI,
    fetchTodayReservationsAPI,
    searchTodayReservationsAPI,
    checkInFromReservationAPI
} from '../services/checkinService';
import { FaUserPlus } from 'react-icons/fa';
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
    const [checkInDate, setCheckInDate] = useState(getTodayDate());
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
    const handleAddGuest = () => {
        setGuests([...guests, createEmptyGuest()]);
    };

    const handleRemoveGuest = (index) => {
        if (guests.length === 1) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                message: 'Must have at least 1 guest!'
            });
            return;
        }
        setGuests(guests.filter((_, i) => i !== index));
    };

    const handleGuestChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index][field] = value;
        setGuests(updatedGuests);
    };

    // --- VALIDATION ---
    const validateForm = () => {
        if (!selectedRoom) return false;
        if (!checkInDate) return false;

        for (const guest of guests) {
            if (!guest.fullName.trim() || !guest.citizenId.trim()) {
                return false;
            }
        }
        return true;
    };

    // --- CREATE BOOKING (new check-in) ---
    const handleCreateBooking = async () => {
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        // Calculate checkout date (default: next day)
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 1);

        const checkInData = {
            roomId: parseInt(selectedRoom),
            checkInDate,
            checkOutDate: checkOutDate.toISOString().split('T')[0],
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
            loadAvailableRooms();
            loadTodayReservations();
            setStatusModal({ isOpen: true, type: 'success', message: 'Booking created successfully!' });
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
        setGuests([createEmptyGuest()]);
    };

    const isFormValid = validateForm();

    return (
        <div className="checkin-page">
            <h1 className="page-title">Check-in</h1>

            {/* TOP SECTION: Room Selection & Date */}
            <div className="checkin-top-section">
                <div className="checkin-card top-card">
                    <div className="top-form-row">
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
                        <div className="form-group">
                            <label className="form-label">Check-in Date*</label>
                            <input
                                type="date"
                                className="form-input date-input"
                                value={checkInDate}
                                min={getTodayDate()}
                                onChange={(e) => setCheckInDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* GUEST INFORMATION SECTION */}
            <div className="checkin-card guest-card">
                <div className="guest-header">
                    <h3 className="section-title">Guest Information</h3>
                    <button className="btn-add-guest" onClick={handleAddGuest}>
                        <FaUserPlus /> Add Guest
                    </button>
                </div>

                {guests.map((guest, index) => (
                    <GuestFormCard
                        key={index}
                        guest={guest}
                        index={index}
                        onGuestChange={(field, value) => handleGuestChange(index, field, value)}
                        onRemove={() => handleRemoveGuest(index)}
                        canRemove={guests.length > 1}
                    />
                ))}

                {/* Action Buttons */}
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

            {/* TODAY'S RESERVATIONS SECTION */}
            <ReservationsTable
                reservations={reservations}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCheckInClick={handleCheckInClick}
            />

            {/* CONFIRM CHECK-IN MODAL */}
            {showConfirmModal && (
                <ConfirmCheckInModal
                    reservation={checkInReservation}
                    onConfirm={handleConfirmCheckIn}
                    onCancel={() => setShowConfirmModal(false)}
                    submitting={submitting}
                />
            )}

            {/* STATUS MODAL */}
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
