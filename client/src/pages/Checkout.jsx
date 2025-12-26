import { useState, useEffect } from 'react';
import '../css/Checkout.css';
import { 
    fetchRentedRoomsAPI, 
    fetchInvoicePreviewAPI, 
    confirmCheckoutAPI 
} from '../services/checkoutService';
import { 
    FaMoneyBillWave, FaCcMastercard, FaCcVisa, FaPaypal, 
    FaCheckCircle, FaQuestionCircle, FaTimesCircle 
} from 'react-icons/fa';

// --- CONSTANTS & UTILS ---
const PAYMENT_OPTIONS = [
    { id: 'Cash', label: 'Cash', icon: <FaMoneyBillWave size={45} color="#85bb65"/> },
    { id: 'MasterCard', label: 'MasterCard', icon: <FaCcMastercard size={45} color="#eb001b"/> },
    { id: 'Visa', label: 'Visa', icon: <FaCcVisa size={45} color="#1a1f71"/> },
    { id: 'PayPal', label: 'PayPal', icon: <FaPaypal size={45} color="#003087"/> },
];

const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString('en-GB');
};

const Checkout = () => {
    // --- DATA STATES ---
    const [rentedRooms, setRentedRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [invoice, setInvoice] = useState(null);
    
    // --- UI STATES ---
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- MODAL STATES ---
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    // --- INITIAL LOAD ---
    useEffect(() => { 
        loadRooms(); 
    }, []);

    const loadRooms = async () => {
        const res = await fetchRentedRoomsAPI();
        if (res.success) {
            setRentedRooms(res.data);
        }
    };

    // --- HANDLERS ---
    const handleRoomChange = async (e) => {
        const roomId = e.target.value;
        setSelectedRoom(roomId);
        setPaymentMethod(''); 
        setInvoice(null);
        
        if (!roomId) return;

        setLoading(true);
        const res = await fetchInvoicePreviewAPI(roomId);
        setLoading(false);

        if (res.success) {
            setInvoice(res.data);
        }
    };

    const handleCheckoutConfirm = async () => {
        if (!selectedRoom || !invoice || !paymentMethod) return;

        const res = await confirmCheckoutAPI({
            roomId: selectedRoom,
            bookingId: invoice.bookingId,
            paymentMethod: paymentMethod,
            totalAmount: invoice.totalAmount
        });

        setShowConfirmModal(false);

        if (res.success) {
            handleReset();
            loadRooms(); // Tải lại danh sách phòng sau khi thanh toán
            setStatusModal({ isOpen: true, type: 'success', message: 'Checkout Successful!' });
        } else {
            setStatusModal({ isOpen: true, type: 'error', message: res.message || "Checkout failed." });
        }
    };

    const handleReset = () => {
        setSelectedRoom('');
        setInvoice(null);
        setPaymentMethod('');
    };

    const isFormValid = selectedRoom && invoice && paymentMethod;

    return (
        <div className="checkout-page">
            <h1 className="page-title">Check-out & Payment</h1>

            <div className="checkout-container">
                {/* CỘT TRÁI: CHỌN PHÒNG & XEM HÓA ĐƠN */}
                <div className="checkout-card">
                    <h3 className="card-title">Select Room</h3>
                    <select className="room-select" value={selectedRoom} onChange={handleRoomChange}>
                        <option value="">-- Select Room --</option>
                        {rentedRooms.map(room => (
                            <option key={room.RoomID} value={room.RoomID}>
                                {room.RoomName}
                            </option>
                        ))}
                    </select>

                    <h3 className="card-title mt-40">Invoice Preview</h3>
                    {loading ? (
                        <div className="empty-state">Calculating invoice...</div>
                    ) : invoice ? (
                        <div className="invoice-details">
                            <InvoiceRow label="Check-in Date" value={formatDate(invoice.checkInDate)} />
                            <InvoiceRow label="No. Of Nights" value={invoice.nights} />
                            <InvoiceRow label="Room Type" value={invoice.roomType} />
                            <InvoiceRow label="No. Of Guests" value={invoice.guests} />
                            <div className="invoice-divider"></div>
                            <div className="invoice-row total-row">
                                <span className="label-total">Total Amount</span>
                                <span className="value-total">{formatCurrency(invoice.totalAmount)}</span>
                            </div>
                            <div className="invoice-row" style={{ marginTop: '10px' }}>
                                <span className="label">Extra Surcharge</span>
                                <span className="value-extra">+{formatCurrency(invoice.extraCharge)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">Please select a room to view details</div>
                    )}
                </div>

                {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
                <div className="checkout-card">
                    <h3 className="card-title">Payment Method</h3>
                    <div className="payment-grid">
                        {PAYMENT_OPTIONS.map(option => (
                            <div 
                                key={option.id}
                                className={`payment-option ${paymentMethod === option.id ? 'active' : ''}`}
                                onClick={() => setPaymentMethod(option.id)}
                            >
                                <div className="payment-icon">{option.icon}</div>
                                <span className="payment-label">{option.label}</span>
                                {paymentMethod === option.id && <FaCheckCircle className="check-icon" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="checkout-footer">
                <button 
                    className="btn-confirm" 
                    onClick={() => setShowConfirmModal(true)} 
                    disabled={!isFormValid}
                >
                    Confirm Checkout
                </button>
                <button className="btn-cancel" onClick={handleReset}>Cancel</button>
            </div>

            {/* --- CÁC MODAL (NẰM TRONG SCOPED CONTAINER) --- */}
            
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="checkout-modal">
                        <div className="modal-icon"><FaQuestionCircle size={60} color="#0f172a"/></div>
                        <h3 className="modal-title">Confirm Checkout</h3>
                        <p className="modal-message">
                            Confirm checkout for <b>Room {selectedRoom}</b>?<br/>
                            Payment method: <b>{paymentMethod}</b>
                        </p>
                        <div className="modal-actions">
                            <button className="btn-modal-yes" onClick={handleCheckoutConfirm}>Confirm</button>
                            <button className="btn-cancel" onClick={() => setShowConfirmModal(false)} style={{padding: '15px 40px'}}>Back</button>
                        </div>
                    </div>
                </div>
            )}

            {statusModal.isOpen && (
                <div className="modal-overlay">
                    <div className={`checkout-modal ${statusModal.type === 'success' ? 'success-theme' : 'error-theme'}`}>
                        <div className={`modal-icon ${statusModal.type}-icon`}>
                            {statusModal.type === 'success' ? <FaCheckCircle size={60}/> : <FaTimesCircle size={60}/>}
                        </div>
                        <h3 className={`modal-title ${statusModal.type}-text`}>
                            {statusModal.type === 'success' ? 'Success!' : 'Failed'}
                        </h3>
                        <p className="modal-message">{statusModal.message}</p>
                        <button 
                            className={`btn-modal-close btn-${statusModal.type}`} 
                            onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---
const InvoiceRow = ({ label, value }) => (
    <div className="invoice-row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

export default Checkout;