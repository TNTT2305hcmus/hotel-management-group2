import React, { useState, useEffect } from 'react';
import '../css/Settings.css';
import '../css/modal.css'; 
import { 
    fetchSettings, updateSurchargeAPI, resetSurchargeAPI, deleteReceptionistAPI 
} from '../services/settingService';
import { FaSave } from 'react-icons/fa';
import ReceptionistView from '../components/ReceptionistView'; // Import từ file số 2
import { EditValueModal, ConfirmationModal, StatusModal } from '../components/SettingUI'; // Import từ file số 1

const FALLBACK_SURCHARGE = { foreignGuest: 1.5, extraPerson: 1.5, holiday: 1.5 };

const Settings = () => {
    // Global State
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('MAIN'); 
    const [surcharge, setSurcharge] = useState({ ...FALLBACK_SURCHARGE });
    const [receptionistCount, setReceptionistCount] = useState(0);

    // Modal States
    const [editModal, setEditModal] = useState({ isOpen: false, key: '', label: '', value: 0 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '', data: null });
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    useEffect(() => { loadSettingsData(); }, []);

    const loadSettingsData = async () => {
        try {
            const res = await fetchSettings();
            if (res.success) {
                setSurcharge(res.data?.surcharge || FALLBACK_SURCHARGE);
                setReceptionistCount(res.data?.receptionistCount ?? 0);
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const handleStatusModal = (type, message) => setStatusModal({ isOpen: true, type, message });

    // Handle Confirm Actions (Delete Staff, Save Surcharge, Reset)
    const handleConfirmAction = async () => {
        const { type, data } = confirmModal;
        setConfirmModal({ ...confirmModal, isOpen: false }); 
        try {
            if (type === 'DELETE_RECEPTIONIST') {
                const res = await deleteReceptionistAPI(data);
                if (res.success) {
                    setReceptionistCount(prev => prev - 1);
                    handleStatusModal('success', res.message);
                } else { handleStatusModal('error', res.message); }
            } 
            else if (type === 'SAVE_SURCHARGE') {
                const res = await updateSurchargeAPI(surcharge);
                if (res.success) { handleStatusModal('success', res.message); } 
                else { handleStatusModal('error', res.message); }
            } 
            else if (type === 'RESET_SURCHARGE') {
                const res = await resetSurchargeAPI();
                if (res.success) {
                    setSurcharge(res.data?.data || FALLBACK_SURCHARGE);
                    handleStatusModal('success', res.message);
                } else { handleStatusModal('error', res.message || "Failed to reset"); }
            }
        } catch (error) { handleStatusModal('error', error.message || "An unexpected error occurred"); }
    };

    const handleSurchargeChange = (val) => {
        const floatVal = parseFloat(val);
        if (floatVal <= 0 || isNaN(floatVal)) { alert("Value must be greater than 0"); return; }
        setSurcharge(prev => ({ ...prev, [editModal.key]: floatVal }));
        setEditModal({ ...editModal, isOpen: false });
    };

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="settings-page">
            {viewMode === 'RECEPTIONIST_EDIT' ? (
                <ReceptionistView 
                    onBack={() => setViewMode('MAIN')}
                    onDeleteRequest={(username) => setConfirmModal({
                        isOpen: true, type: 'DELETE_RECEPTIONIST', title: 'Delete Account', 
                        message: `Are you sure you want to delete account "${username}"?`, data: username 
                    })}
                    refreshTrigger={receptionistCount}
                    onAddSuccess={() => setReceptionistCount(prev => prev + 1)}
                    onShowStatus={handleStatusModal}
                />
            ) : (
                <MainSettingsView 
                    receptionistCount={receptionistCount} surcharge={surcharge}
                    onEditReceptionist={() => setViewMode('RECEPTIONIST_EDIT')}
                    onEditSurcharge={(key, label) => setEditModal({ isOpen: true, key, label, value: surcharge[key] })}
                    onSave={() => setConfirmModal({ isOpen: true, type: 'SAVE_SURCHARGE', title: 'Save Settings', message: 'Are you sure you want to save these changes?' })}
                    onReset={() => setConfirmModal({ isOpen: true, type: 'RESET_SURCHARGE', title: 'Reset to Default', message: 'Are you sure? This will revert all values to defaults.' })}
                />
            )}

            {/* MODALS */}
            {editModal.isOpen && <EditValueModal data={editModal} onClose={() => setEditModal({ ...editModal, isOpen: false })} onConfirm={handleSurchargeChange} />}
            {confirmModal.isOpen && <ConfirmationModal data={confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={handleConfirmAction} />}
            {statusModal.isOpen && <StatusModal data={statusModal} onClose={() => setStatusModal({ ...statusModal, isOpen: false })} />}
        </div>
    );
};

// Component con nội bộ cho màn hình Settings chính
const MainSettingsView = ({ receptionistCount, surcharge, onEditReceptionist, onEditSurcharge, onSave, onReset }) => (
    <div className="settings-container-width">
        <h1 className="page-title">Settings</h1>
        <div className="setting-card">
            <h3>Receptionist Account Management</h3>
            <div className="setting-row">
                <span className="setting-label">The number of current account</span>
                <span className="setting-value-display">{receptionistCount}</span>
                <button className="btn-edit" onClick={onEditReceptionist}>Edit</button>
            </div>
        </div>
        <div className="setting-card">
            <div className="card-header-row">
                <h3>Surcharge Regulations</h3>
                <div className="header-right-group">
                    <span className="header-subtitle">Surcharge Factor</span><div className="header-button-spacer"></div> 
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

const SurchargeRow = ({ label, value, onEdit }) => (
    <div className="setting-row">
        <span className="setting-label">{label}</span>
        <span className="setting-value-display">{value ?? 0}</span>
        <button className="btn-edit" onClick={onEdit}>Edit</button>
    </div>
);

export default Settings;
