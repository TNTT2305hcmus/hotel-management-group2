import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes, FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';

// --- INPUT GROUP (GIỮ NGUYÊN) ---
export const InputGroup = ({ label, type="text", value, onChange, placeholder, isPasswordField, showPassword, onTogglePassword, onFocus }) => (
    <div className="form-group">
        <label>{label}</label>
        <div style={{ position: 'relative', width: '100%' }}>
            <input 
                type={type} 
                className="input-styled" 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                value={value} 
                onChange={e => onChange(e.target.value)}
                onFocus={onFocus}
                style={{ width: '100%', paddingRight: isPasswordField ? '45px' : '15px' }}
            />
            {isPasswordField && (
                <div 
                    onClick={onTogglePassword}
                    style={{
                        position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                        cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center'
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
            )}
        </div>
    </div>
);

// --- MODALS (CẬP NHẬT THEO MODAL.CSS & CHECKOUT STYLE) ---

// 1. Edit Modal (Form nhập số)
export const EditValueModal = ({ data, onClose, onConfirm }) => {
    const [val, setVal] = useState(data.value);
    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <div className="modal-header">
                    <h2>{data.label}</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <div style={{ padding: '30px 0' }}>
                    <input 
                        type="number" step="0.1" min="0" 
                        style={{ width: '80%', padding: '12px', fontSize: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 'bold' }}
                        value={val} onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()} 
                        autoFocus 
                    />
                </div>
                <div className="modal-actions" style={{justifyContent: 'center', gap: '15px'}}>
                    <button className="btn-submit" style={{backgroundColor: '#0f172a'}} onClick={() => onConfirm(val)}>Update</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// 2. Confirmation Modal (GIỐNG CHECKOUT: Icon to, nút tối màu)
export const ConfirmationModal = ({ data, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            {/* Icon dấu hỏi giống Checkout */}
            <div style={{ marginBottom: '15px' }}>
                <FaQuestionCircle size={70} color="#0f172a"/>
            </div>

            <div className="modal-header" style={{border: 'none', padding: 0, justifyContent: 'center'}}>
                <h2>{data.title}</h2>
            </div>
            
            <p style={{ margin: '15px 0 25px', fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
                {data.message}
            </p>

            <div className="modal-actions" style={{justifyContent: 'center', gap: '20px'}}>
                {/* Nút Confirm màu tối (#0f172a) giống Checkout */}
                <button 
                    className="btn-submit" 
                    onClick={onConfirm}
                    style={{ backgroundColor: '#0f172a', padding: '10px 30px' }}
                >
                    Yes, Confirm
                </button>
                <button 
                    className="btn-cancel" 
                    onClick={onClose}
                    style={{ padding: '10px 30px' }}
                >
                    No
                </button>
            </div>
        </div>
    </div>
);

// 3. Status Modal (Thông báo thành công/thất bại)
export const StatusModal = ({ data, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div style={{ fontSize: '60px', color: data.type === 'success' ? '#28a745' : '#dc3545', marginBottom: '15px' }}>
                {data.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            </div>
            <h2 style={{ marginBottom: '10px' }}>{data.type === 'success' ? 'Success!' : 'Error'}</h2>
            <p style={{ margin: '0 0 25px', fontSize: '16px', color: '#555' }}>{data.message}</p>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
                <button className="btn-submit" style={{ backgroundColor: '#0f172a', minWidth: '120px' }} onClick={onClose}>OK</button>
            </div>
        </div>
    </div>
);