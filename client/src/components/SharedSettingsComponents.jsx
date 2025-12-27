import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// --- INPUT GROUP ---
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

// --- MODALS ---
export const EditValueModal = ({ data, onClose, onConfirm }) => {
    const [val, setVal] = useState(data.value);
    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <div className="modal-header">
                    <h2>{data.label}</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <div style={{ padding: '20px 0' }}>
                    <input type="number" step="0.1" min="0" style={{ width: '100%', padding: '10px', fontSize: '18px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px' }}
                        value={val} onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()} autoFocus />
                </div>
                <div className="modal-actions" style={{justifyContent: 'center'}}>
                    <button className="btn-submit" onClick={() => onConfirm(val)}>Change</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export const ConfirmationModal = ({ data, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div className="modal-header"><h2>{data.title}</h2></div>
            <h3>{data.message}</h3>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
                <button className={data.type.includes('DELETE') ? "btn-confirm-delete" : "btn-submit"} onClick={onConfirm}>Yes</button>
                <button className="btn-cancel" onClick={onClose}>No</button>
            </div>
        </div>
    </div>
);

export const StatusModal = ({ data, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div style={{ fontSize: '50px', color: data.type === 'success' ? '#28a745' : '#dc3545', marginBottom: '10px' }}>
                {data.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            </div>
            <h2>{data.type === 'success' ? 'Success!' : 'Error'}</h2>
            <p style={{ margin: '15px 0', fontSize: '16px', color: '#555' }}>{data.message}</p>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
                <button className="btn-submit" onClick={onClose}>OK</button>
            </div>
        </div>
    </div>
);