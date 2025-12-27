import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Settings.css';

// Services
import { fetchSettings, updateSurchargeAPI, resetSurchargeAPI } from '../services/settingService';

// Components
import MainSettingsView from '../components/MainSettingsView';
import EditValueModal from '../components/EditValueModal';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusModal from '../components/StatusModal';

const FALLBACK_SURCHARGE = { foreignGuest: 1.5, extraPerson: 1.5, holiday: 1.5 };

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // Data States
    const [surcharge, setSurcharge] = useState({ ...FALLBACK_SURCHARGE });
    const [receptionistCount, setReceptionistCount] = useState(0);

    // Modal States
    const [editModal, setEditModal] = useState({ isOpen: false, key: '', label: '', value: 0 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '' });
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    useEffect(() => {
        loadSettingsData();
    }, []);

    const loadSettingsData = async () => {
        try {
            setLoading(true);
            const res = await fetchSettings();
            if (res.success) {
                setSurcharge(res.data?.surcharge || FALLBACK_SURCHARGE);
                setReceptionistCount(res.data?.receptionistCount ?? 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    
    // 1. Chuyển hướng sang trang User Profile
    const handleEditAccount = () => {
        navigate('/settings/profile');
    };

    // 2. Các handler cho Surcharge
    const handleStatusModal = (type, message) => setStatusModal({ isOpen: true, type, message });

    const handleConfirmAction = async () => {
        const { type } = confirmModal;
        setConfirmModal({ ...confirmModal, isOpen: false }); 

        try {
            if (type === 'SAVE_SURCHARGE') {
                const res = await updateSurchargeAPI(surcharge);
                if (res.success) handleStatusModal('success', res.message);
                else handleStatusModal('error', res.message);
            } 
            else if (type === 'RESET_SURCHARGE') {
                const res = await resetSurchargeAPI();
                if (res.success) {
                    if (res.data?.data) setSurcharge(res.data.data);
                    handleStatusModal('success', res.message);
                } else handleStatusModal('error', res.message);
            }
        } catch (error) {
            handleStatusModal('error', error.message);
        }
    };

    const handleSurchargeChange = (val) => {
        const floatVal = parseFloat(val);
        if (floatVal <= 0 || isNaN(floatVal)) return alert("Value > 0");
        setSurcharge(prev => ({ ...prev, [editModal.key]: floatVal }));
        setEditModal({ ...editModal, isOpen: false });
    };

    if (loading) return <div className="loading-screen">Loading settings...</div>;

    return (
        <div className="settings-page">
            <MainSettingsView 
                receptionistCount={receptionistCount}
                surcharge={surcharge}
                onEditReceptionist={handleEditAccount} 
                onEditSurcharge={(key, label) => setEditModal({ isOpen: true, key, label, value: surcharge[key] })}
                onSave={() => setConfirmModal({ isOpen: true, type: 'SAVE_SURCHARGE', title: 'Save Settings', message: 'Save surcharge changes?' })}
                onReset={() => setConfirmModal({ isOpen: true, type: 'RESET_SURCHARGE', title: 'Reset Default', message: 'Revert all to defaults?' })}
            />

            {/* Chỉ còn giữ lại Modal liên quan đến Surcharge */}
            {editModal.isOpen && (
                <EditValueModal 
                    data={editModal} 
                    onClose={() => setEditModal({ ...editModal, isOpen: false })} 
                    onConfirm={handleSurchargeChange} 
                />
            )}
            {confirmModal.isOpen && (
                <ConfirmationModal 
                    data={confirmModal} 
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
                    onConfirm={handleConfirmAction} 
                />
            )}
            {statusModal.isOpen && (
                <StatusModal 
                    data={statusModal} 
                    onClose={() => setStatusModal({ ...statusModal, isOpen: false })} 
                />
            )}
        </div>
    );
};

export default Settings;