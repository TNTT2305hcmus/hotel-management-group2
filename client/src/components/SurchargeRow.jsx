import React from 'react';

const SurchargeRow = ({ label, value, onEdit }) => (
    <div className="setting-row">
        <span className="setting-label">{label}</span>
        <span className="setting-value-display">{value ?? 0}</span>
        <button className="btn-edit" onClick={onEdit}>Edit</button>
    </div>
);
export default SurchargeRow;