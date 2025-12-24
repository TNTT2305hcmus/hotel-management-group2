import React from 'react';
import '../css/Modal.css'; // File CSS chung cho Modal

const DeleteConfirm = ({ isOpen, onClose, onConfirm, roomNumber }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <h3>You are going to delete. Are you sure ?</h3>
                <div className="modal-actions">
                    <button className="btn-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
                    <button className="btn-cancel" onClick={onClose}>No, Keep it</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;