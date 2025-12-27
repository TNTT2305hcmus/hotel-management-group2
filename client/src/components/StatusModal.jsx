import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StatusModal = ({ data, onClose }) => (
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
export default StatusModal;