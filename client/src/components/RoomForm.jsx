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

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'EDIT' && initialData) {
                setFormData({
                    id: initialData.id,
                    typeId: initialData.type === 'Standard' ? '1' : initialData.type === 'VIP' ? '2' : '3', 
                    status: initialData.status,
                    note: initialData.note || '',
                    image: initialData.image || ''
                });
            } else {
                // Reset form for Add mode
                setFormData({ id: '', typeId: '1', status: 'Available', price: '', note: '', image: '' });
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isOccupied = formData.status === 'Occupied';

    return (
        <div className="modal-overlay">
            <div className="modal-content form-modal" style={{maxWidth: '800px'}}>
                <div className="modal-header">
                    <h2>{mode === 'ADD' ? 'Add New Room' : `Edit Room ${formData.id}`}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body-split">
                    {/* Left Column: Image */}
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

                    {/* Right Column: Form Fields */}
                    <div className="form-fields">
                        <label>Room Number {mode === 'EDIT' && <small>(Read Only)</small>}</label>
                        <input 
                            type="text" 
                            value={formData.id} 
                            disabled={mode === 'EDIT'} 
                            style={mode === 'EDIT' ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
                            onChange={(e) => setFormData({...formData, id: e.target.value})}
                        />

                        <label>Room Type</label>
                        <select 
                            value={formData.typeId} 
                            onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                        >
                            <option value="1">Standard</option>
                            <option value="2">VIP</option>
                            <option value="3">Luxury</option>
                        </select>

                        <label>Status</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            disabled={isOccupied} 
                            style={isOccupied ? {backgroundColor: '#e9ecef', cursor: 'not-allowed'} : {}}
                        >
                            <option value="Available">Available</option>
                            <option value="Maintenance">Maintenance</option>
                            {isOccupied && <option value="Occupied">Occupied</option>}
                        </select>
                        {isOccupied && <small style={{color: 'red'}}>* Cannot change status of an occupied room.</small>}
                        
                        <label>Description</label>
                        <textarea 
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-submit" onClick={handleSubmit}>
                        {mode === 'ADD' ? 'Add Room' : 'Save Changes'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RoomForm;