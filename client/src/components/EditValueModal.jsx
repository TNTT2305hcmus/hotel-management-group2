import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EditValueModal = ({ data, onClose, onConfirm }) => {
    const [val, setVal] = useState(data.value);
    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <div className="modal-header">
                    <h2>{data.label}</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <div style={{ padding: '20px 0' }}>
                    <input 
                        type="number" step="0.1" min="0" 
                        style={{ width: '100%', padding: '10px', fontSize: '18px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px' }}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()} 
                        autoFocus 
                    />
                </div>
                <div className="modal-actions" style={{justifyContent: 'center'}}>
                    <button className="btn-submit" onClick={() => onConfirm(val)}>Change</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
export default EditValueModal;