import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { PAYMENT_OPTIONS, InvoiceRow, formatCurrency, formatDate } from './CheckoutUI';
import paypalQrImage from '../assets/qr.png'; 

const CheckoutContent = ({ 
    rentedRooms, selectedRoom, handleRoomChange, loading, invoice, 
    paymentMethod, setPaymentMethod, onConfirmClick, onResetClick, isFormValid 
}) => {
    const PAYPAL_DISPLAY_NAME = 'My Hotel PayPal'; 
    const subTotal = invoice ? (invoice.totalAmount - invoice.extraCharge) : 0;
    const renderSurchargeTags = () => {
        if (!invoice || !invoice.surchargeDetails) return null;
        
        const { 
            isForeign, foreignRate, 
            isExtraPerson, extraPersonRate, 
            isHoliday, holidayRate 
        } = invoice.surchargeDetails;
        
        return (
            <div className="surcharge-tags">
                {isForeign && (
                    <span className="tag tag-foreign">
                        Foreign Guest ({foreignRate})
                    </span>
                )}
                {isExtraPerson && (
                    <span className="tag tag-guest">
                        3rd Guest ({extraPersonRate})
                    </span>
                )}
                {isHoliday && (
                    <span className="tag tag-holiday">
                        Holiday ({holidayRate})
                    </span>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="checkout-container">
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
                            <InvoiceRow label="Room Charge (Subtotal)" value={formatCurrency(subTotal)} />
                            {invoice.extraCharge > 0 && (
                                <div className="surcharge-container">
                                    <div className="invoice-row highlight-warning">
                                        <span className="label">Total Surcharge</span>
                                        <span className="value">+{formatCurrency(invoice.extraCharge)}</span>
                                    </div>
                                    {renderSurchargeTags()}
                                </div>
                            )}
                            <div className="invoice-row total-row" style={{marginTop: '15px', borderTop: '2px dashed #cbd5e1'}}>
                                <span className="label-total" style={{fontSize: '20px'}}>GRAND TOTAL</span>
                                <span className="value-total" style={{fontSize: '28px', color: '#0f172a'}}>
                                    {formatCurrency(invoice.totalAmount)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">Please select a room to view details</div>
                    )}
                </div>

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

                    {paymentMethod === 'PayPal' && invoice && (
                        <div style={{
                            marginTop: '30px', padding: '25px', backgroundColor: '#f8fafc',
                            border: '2px solid #003087', borderRadius: '16px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textAlign: 'center', animation: 'fadeIn 0.5s ease'
                        }}>
                            <h4 style={{margin: '0 0 15px 0', color: '#003087', fontSize: '18px'}}>
                                Scan to Pay via PayPal
                            </h4>
                            
                            <div style={{
                                background: 'white', padding: '10px', borderRadius: '12px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '15px'
                            }}>
                                <img 
                                    src={paypalQrImage} 
                                    alt="Payment QR Code" 
                                    style={{width: '200px', height: '200px', display: 'block', objectFit: 'contain'}}
                                />
                            </div>

                            <div style={{fontSize: '15px', color: '#334155'}}>
                                <p style={{margin: '5px 0'}}>To: <strong>{PAYPAL_DISPLAY_NAME}</strong></p>
                                <p style={{margin: '5px 0'}}>
                                    Amount: <strong style={{color: '#003087', fontSize: '18px'}}>
                                        {formatCurrency(invoice.totalAmount)}
                                    </strong>
                                </p>
                            </div>
                            <p style={{marginTop: '15px', fontSize: '13px', color: '#64748b', fontStyle: 'italic'}}>
                                *Open app and scan to pay instantly
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="checkout-footer">
                <button 
                    className="btn-confirm" 
                    onClick={onConfirmClick} 
                    disabled={!isFormValid}
                >
                    {paymentMethod === 'PayPal' ? 'Confirm Payment' : 'Confirm Checkout'}
                </button>
                <button className="btn-cancel" onClick={onResetClick}>Cancel</button>
            </div>
        </>
    );
};

export default CheckoutContent;