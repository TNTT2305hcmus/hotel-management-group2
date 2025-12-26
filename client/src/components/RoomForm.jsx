// src/components/RoomForm.jsx
import React, { useState, useEffect } from 'react';
import '../css/Modal.css';

const RoomForm = ({ isOpen, onClose, onSubmit, initialData, mode = 'ADD' }) => {
    const [formData, setFormData] = useState({
        id: '', 
        typeId: '1',
        status: 'Available',
        price: '',
        note: '',
        image: '' 
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (isOpen) {
            if (mode === 'EDIT' && initialData) {
                setFormData({
                    id: initialData.id,
                    typeId: initialData.type === 'Single Room' ? '1' : initialData.type === 'Double Room' ? '2' : '3',
                    status: initialData.status,
                    note: initialData.note || '',
                    image: initialData.image || ''
                });
            } else {
                // Reset form cho Add
                setFormData({ id: '', typeId: '1', status: 'Available', price: '', note: '', image: '' });
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content form-modal" style={{maxWidth: '800px'}}>
                <div className="modal-header">
                    <h2>{mode === 'ADD' ? 'Add New Room' : `Room ${formData.id} Edit`}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body-split">
                    {/* Cột trái: Ảnh */}
                    <div className="image-uploader">
                        {formData.image ? (
                            <img src={formData.image} alt="Room Preview" />
                        ) : (
                            <div className="placeholder-img"><i className='bx bx-camera'></i></div>
                        )}
                        <input 
                            type="text" 
                            placeholder="Paste Image URL here" 
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                    </div>

                    {/* Cột phải: Form */}
                    <div className="form-fields">
                        <label>Room Number</label>
                        <input 
                            type="text" 
                            value={formData.id} 
                            onChange={(e) => setFormData({...formData, id: e.target.value})}
                        />

                        <label>Room Type</label>
                        <select 
                            value={formData.typeId} 
                            onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                        >
                            <option value="1">Single Room</option>
                            <option value="2">Double Room</option>
                            <option value="3">Standard Room</option>
                            <option value="4">Luxury Room</option>
                        </select>

                        <label>Status</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Maintanance">Maintanance</option>
                        </select>
                        
                        {/* Các input khác tương tự... */}
                        <label>Description</label>
                        <textarea 
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-submit" onClick={handleSubmit}>
                        {mode === 'ADD' ? 'Add Room' : 'Change'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RoomForm;