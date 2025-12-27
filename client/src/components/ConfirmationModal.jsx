import React from 'react';

const ConfirmationModal = ({ data, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal-content delete-modal">
            <div className="modal-header">
                <h2>{data.title}</h2>
            </div>
            <h3>{data.message}</h3>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
                <button 
                    className={data.type.includes('DELETE') ? "btn-confirm-delete" : "btn-submit"} 
                    onClick={onConfirm}
                >
                    Yes
                </button>
                <button className="btn-cancel" onClick={onClose}>No</button>
            </div>
        </div>
    </div>
);
export default ConfirmationModal;