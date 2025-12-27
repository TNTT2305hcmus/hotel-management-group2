import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { PAYMENT_OPTIONS, InvoiceRow, formatCurrency, formatDate } from './CheckoutUI';

const CheckoutContent = ({ 
    rentedRooms, 
    selectedRoom, 
    handleRoomChange, 
    loading, 
    invoice, 
    paymentMethod, 
    setPaymentMethod, 
    onConfirmClick, 
    onResetClick, 
    isFormValid 
}) => {
    return (
        <>
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
                    onClick={onConfirmClick} 
                    disabled={!isFormValid}
                >
                    Confirm Checkout
                </button>
                <button className="btn-cancel" onClick={onResetClick}>Cancel</button>
            </div>
        </>
    );
};

export default CheckoutContent;