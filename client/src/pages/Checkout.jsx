import React, { useState, useEffect } from 'react';
import '../css/Checkout.css';
import { 
    fetchRentedRoomsAPI, 
    fetchInvoicePreviewAPI, 
    confirmCheckoutAPI 
} from '../services/checkoutService';
import CheckoutContent from '../components/CheckoutContent';
import { ConfirmCheckoutModal, StatusModal } from '../components/CheckoutUI';

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
            loadRooms(); // Tải lại danh sách phòng sau khi thanh toán thành công
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

            <CheckoutContent 
                rentedRooms={rentedRooms}
                selectedRoom={selectedRoom}
                handleRoomChange={handleRoomChange}
                loading={loading}
                invoice={invoice}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onConfirmClick={() => setShowConfirmModal(true)}
                onResetClick={handleReset}
                isFormValid={isFormValid}
            />

            {/* --- MODALS --- */}   
            {showConfirmModal && (
                <ConfirmCheckoutModal 
                    data={{ roomName: selectedRoom, paymentMethod: paymentMethod }}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleCheckoutConfirm}
                />
            )}

            {statusModal.isOpen && (
                <StatusModal 
                    data={statusModal}
                    onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
                />
            )}
        </div>
    );
};

export default Checkout;