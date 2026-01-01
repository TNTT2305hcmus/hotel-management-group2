import React from 'react';
import { 
    FaMoneyBillWave, FaCcMastercard, FaCcVisa, FaPaypal, 
    FaCheckCircle, FaQuestionCircle, FaTimesCircle 
} from 'react-icons/fa';

// --- UTILS ---
export const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString('en-GB');
};

// --- CONSTANTS ---
export const PAYMENT_OPTIONS = [
    { id: 'Cash', label: 'Cash', icon: <FaMoneyBillWave size={45} color="#85bb65"/> },
    { id: 'MasterCard', label: 'MasterCard', icon: <FaCcMastercard size={45} color="#eb001b"/> },
    { id: 'Visa', label: 'Visa', icon: <FaCcVisa size={45} color="#1a1f71"/> },
    { id: 'PayPal', label: 'PayPal', icon: <FaPaypal size={45} color="#003087"/> },
];

// --- SUB-COMPONENTS ---
export const InvoiceRow = ({ label, value }) => (
    <div className="invoice-row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

// --- MODALS---
export const ConfirmCheckoutModal = ({ data, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div style={{ marginBottom: '15px' }}>
                <FaQuestionCircle size={70} color="#0f172a"/>
            </div>
            <h2>Confirm Checkout</h2>
            <p style={{ margin: '15px 0', fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
                Confirm checkout for <b>{data.roomName}</b>?<br/>
                Payment method: <b>{data.paymentMethod}</b>
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center', gap: '20px' }}>
                <button 
                    className="btn-submit" 
                    onClick={onConfirm}
                    style={{ backgroundColor: '#0f172a' }}
                >
                    Confirm
                </button>
                <button 
                    className="btn-cancel" 
                    onClick={onClose} 
                    style={{ padding: '10px 30px', textTransform: 'uppercase' }}
                >
                    Back
                </button>
            </div>
        </div>
    </div>
);

export const StatusModal = ({ data, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div style={{ marginBottom: '15px', color: data.type === 'success' ? '#28a745' : '#dc3545' }}>
                {data.type === 'success' ? <FaCheckCircle size={70}/> : <FaTimesCircle size={70}/>}
            </div>
            
            <h2>{data.type === 'success' ? 'Success!' : 'Failed'}</h2>
            
            <p style={{ margin: '20px 0', fontSize: '16px', color: '#555' }}>
                {data.message}
            </p>
            
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button 
                    className="btn-submit" 
                    onClick={onClose}
                    style={{ minWidth: '100px', backgroundColor: data.type === 'success' ? '#28a745' : '#dc3545' }}
                >
                    OK
                </button>
            </div>
        </div>
    </div>
);