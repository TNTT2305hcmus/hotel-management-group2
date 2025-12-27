import React from 'react';
import { FaSave } from 'react-icons/fa';
import SurchargeRow from './SurchargeRow';

const MainSettingsView = ({ receptionistCount, surcharge, onEditReceptionist, onEditSurcharge, onSave, onReset }) => (
    <div className="settings-container-width">
        <h1 className="page-title">Settings</h1>
        
        {/* Receptionist Card */}
        <div className="setting-card">
            <h3>Account Management</h3>
            <div className="setting-row">
                <span className="setting-label">The number of current account</span>
                <span className="setting-value-display">{receptionistCount}</span>
                <button className="btn-edit" onClick={onEditReceptionist}>Edit</button>
            </div>
        </div>

        {/* Surcharge Card */}
        <div className="setting-card">
            <div className="card-header-row">
                <h3>Surcharge Regulations</h3>
                <div className="header-right-group">
                    <span className="header-subtitle">Surcharge Factor</span>
                    <div className="header-button-spacer"></div> 
                </div>
            </div>
            
            <SurchargeRow label="Foreign Guest Price Multiplier" value={surcharge?.foreignGuest} onEdit={() => onEditSurcharge('foreignGuest', 'Foreign Guest Multiplier')} />
            <SurchargeRow label="Extra Person Charge" value={surcharge?.extraPerson} onEdit={() => onEditSurcharge('extraPerson', 'Extra Person Charge')} />
            <SurchargeRow label="Holiday Surcharge" value={surcharge?.holiday} onEdit={() => onEditSurcharge('holiday', 'Holiday Surcharge')} />
        </div>

        <div className="actions-footer">
            <button className="btn-reset" onClick={onReset}>Reset to Default</button>
            <button className="btn-save" onClick={onSave}><FaSave /> Save</button>
        </div>
    </div>
);
export default MainSettingsView;