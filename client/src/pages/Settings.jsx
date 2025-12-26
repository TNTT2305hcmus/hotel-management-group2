import { useState, useEffect, useMemo, useRef } from 'react';
import '../css/Settings.css';
import '../css/modal.css'; 
import { 
    fetchSettings, 
    updateSurchargeAPI, 
    resetSurchargeAPI, 
    fetchReceptionistsAPI, 
    deleteReceptionistAPI, 
    createReceptionistAPI 
} from '../services/settingService';
import { FaSave, FaTimes, FaUserPlus, FaSearch, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

// --- CONSTANTS & UTILS ---
const FALLBACK_SURCHARGE = { foreignGuest: 1.5, extraPerson: 1.5, holiday: 1.5 };
const ITEMS_PER_PAGE = 4;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// --- MAIN COMPONENT ---
const Settings = () => {
    // Global State
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('MAIN'); 
    
    // Shared Data
    const [surcharge, setSurcharge] = useState({ ...FALLBACK_SURCHARGE });
    const [originalSurcharge, setOriginalSurcharge] = useState({ ...FALLBACK_SURCHARGE }); // Used for comparison if needed
    const [receptionistCount, setReceptionistCount] = useState(0);

    // Modal States (Global)
    const [editModal, setEditModal] = useState({ isOpen: false, key: '', label: '', value: 0 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '', data: null });
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    // --- INITIAL DATA LOADING ---
    useEffect(() => {
        loadSettingsData();
    }, []);

    const loadSettingsData = async () => {
        try {
            const res = await fetchSettings();
            if (res.success) {
                const dataFromDB = res.data?.surcharge || FALLBACK_SURCHARGE;
                setSurcharge(dataFromDB);
                setOriginalSurcharge(dataFromDB);
                setReceptionistCount(res.data?.receptionistCount ?? 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- GLOBAL HANDLERS ---
    const handleStatusModal = (type, message) => setStatusModal({ isOpen: true, type, message });

    const handleConfirmAction = async () => {
        const { type, data } = confirmModal;
        setConfirmModal({ ...confirmModal, isOpen: false }); 

        try {
            if (type === 'DELETE_RECEPTIONIST') {
                const res = await deleteReceptionistAPI(data);
                if (res.success) {
                    setReceptionistCount(prev => prev - 1);
                    handleStatusModal('success', res.message);
                } else {
                    handleStatusModal('error', res.message);
                }
            } 
            else if (type === 'SAVE_SURCHARGE') {
                const res = await updateSurchargeAPI(surcharge);
                if (res.success) {
                    const newValues = res.data?.data || surcharge;
                    setSurcharge(newValues);
                    setOriginalSurcharge(newValues);
                    handleStatusModal('success', res.message);
                } else {
                    handleStatusModal('error', res.message);
                }
            } 
            else if (type === 'RESET_SURCHARGE') {
                const res = await resetSurchargeAPI();
                if (res.success) {
                    const defaultValues = res.data?.data;
                    if (defaultValues) {
                        setSurcharge(defaultValues);
                        setOriginalSurcharge(defaultValues);
                        handleStatusModal('success', res.message);
                    }
                } else {
                    handleStatusModal('error', res.message || "Failed to reset");
                }
            }
        } catch (error) {
            handleStatusModal('error', error.message || "An unexpected error occurred");
        }
    };

    // --- SURCHARGE HANDLERS ---
    const handleSurchargeChange = (val) => {
        const floatVal = parseFloat(val);
        if (floatVal <= 0 || isNaN(floatVal)) { 
            alert("Value must be greater than 0"); 
            return; 
        }
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
                        isOpen: true, 
                        type: 'DELETE_RECEPTIONIST', 
                        title: 'Delete Account', 
                        message: `Are you sure you want to delete account "${username}"?`, 
                        data: username 
                    })}
                    refreshTrigger={receptionistCount} // Simple way to trigger re-fetch if count changes
                    onAddSuccess={() => setReceptionistCount(prev => prev + 1)}
                    onShowStatus={handleStatusModal}
                />
            ) : (
                <MainSettingsView 
                    receptionistCount={receptionistCount}
                    surcharge={surcharge}
                    onEditReceptionist={() => setViewMode('RECEPTIONIST_EDIT')}
                    onEditSurcharge={(key, label) => setEditModal({ isOpen: true, key, label, value: surcharge[key] })}
                    onSave={() => setConfirmModal({ isOpen: true, type: 'SAVE_SURCHARGE', title: 'Save Settings', message: 'Are you sure you want to save these changes?' })}
                    onReset={() => setConfirmModal({ isOpen: true, type: 'RESET_SURCHARGE', title: 'Reset to Default', message: 'Are you sure? This will revert all values to defaults.' })}
                />
            )}

            {/* MODALS */}
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

// --- SUB-COMPONENTS ---

const MainSettingsView = ({ receptionistCount, surcharge, onEditReceptionist, onEditSurcharge, onSave, onReset }) => (
    <div className="settings-container-width">
        <h1 className="page-title">Settings</h1>
        
        {/* Receptionist Card */}
        <div className="setting-card">
            <h3>Receptionist Account Management</h3>
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
                    {/* --- THÊM DÒNG NÀY ĐỂ CĂN CHỈNH --- */}
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

const SurchargeRow = ({ label, value, onEdit }) => (
    <div className="setting-row">
        <span className="setting-label">{label}</span>
        <span className="setting-value-display">{value ?? 0}</span>
        <button className="btn-edit" onClick={onEdit}>Edit</button>
    </div>
);

const ReceptionistView = ({ onBack, onDeleteRequest, refreshTrigger, onAddSuccess, onShowStatus }) => {
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ username: '', password: '', email: '', phone: '' });
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // Search & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const searchWrapperRef = useRef(null);

    useEffect(() => {
        loadStaffData();
    }, [refreshTrigger]); // Reload when count changes in parent

    const loadStaffData = async () => {
        const res = await fetchReceptionistsAPI();
        if (res.success) setStaffList(res.data || []);
    };

    // Click outside handler for search suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddAccount = async (e) => {
        e.preventDefault();
        if (!newStaff.username || !newStaff.password || !newStaff.email) {
            setFormError("Please fill in required fields!"); return;
        }
        if (!isValidEmail(newStaff.email)) {
            setFormError("Invalid email format!"); return;
        }

        try {
            await createReceptionistAPI(newStaff);
            onShowStatus('success', "Account added successfully!");
            setNewStaff({ username: '', password: '', email: '', phone: '' });
            setFormError('');
            loadStaffData();
            onAddSuccess();
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to add account.";
            setFormError(msg);
        }
    };

    // Filter Logic
    const filteredStaff = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return staffList.filter(staff => 
            staff.Username.toLowerCase().includes(term) ||
            staff.Email.toLowerCase().includes(term)
        );
    }, [staffList, searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length > 0) {
            setSuggestions(filteredStaff);
            setShowSuggestions(true);
        } else { setShowSuggestions(false); }
        setCurrentPage(1);
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const displayedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 3) { start = 2; end = 4; }
            if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1; }
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="recep-edit-container">
            <h2 className="recep-title">Receptionist Account Edit</h2>
            
            {/* Add Form */}
            <div className="recep-card">
                <div className="card-header-flex">
                    <h3>Account Information</h3>
                    {formError && <div className="error-message-inline"><FaExclamationCircle /> {formError}</div>}
                    <button className="btn-add-account" onClick={handleAddAccount}><FaUserPlus /> Add Account</button>
                </div>
                <form className="account-form-grid" onSubmit={handleAddAccount} autoComplete="off">
                    <InputGroup label="Username *" value={newStaff.username} onChange={v => setNewStaff({...newStaff, username: v})} onFocus={() => setFormError('')} />
                    <InputGroup 
                        label="Password *" 
                        type={showPassword ? "text" : "password"} 
                        value={newStaff.password} 
                        onChange={v => setNewStaff({...newStaff, password: v})} 
                        isPasswordField={true}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                    <InputGroup label="Email *" type="email" value={newStaff.email} onChange={v => setNewStaff({...newStaff, email: v})} onFocus={() => setFormError('')} />
                    <InputGroup label="Phone" value={newStaff.phone} onChange={v => setNewStaff({...newStaff, phone: v})} onFocus={() => setFormError('')} placeholder="Optional" />
                </form>
            </div>

            {/* List Table */}
            <div className="recep-card mt-20">
                <h3>List Account</h3>
                <div className="search-bar-wrapper" ref={searchWrapperRef}>
                    <FaSearch className="search-icon"/>
                    <input type="text" autoComplete="off" placeholder="Search by username or email" 
                        value={searchTerm} onChange={handleSearchChange} onFocus={() => searchTerm && setShowSuggestions(true)} />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="search-suggestions">
                            {suggestions.map((staff, index) => (
                                <li key={index} className="suggestion-item" onClick={() => { setSearchTerm(staff.Username); setShowSuggestions(false); }}>
                                    <span className="sugg-username">{staff.Username}</span>
                                    <span className="sugg-email">{staff.Email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <table className="recep-table">
                    <thead>
                        <tr>
                            <th style={{width: '25%'}}>Username</th>
                            <th style={{width: '25%'}}>Phone</th>
                            <th style={{width: '40%'}}>Email</th>
                            <th style={{width: '10%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedStaff.length > 0 ? (
                            displayedStaff.map((staff) => (
                                <tr key={staff.Username}>
                                    <td style={{fontWeight: 'bold'}}>{staff.Username}</td>
                                    <td>{staff.Phone || ''}</td>
                                    <td>{staff.Email}</td>
                                    <td style={{textAlign: 'right'}}>
                                        <button className="btn-delete-pill" onClick={() => onDeleteRequest(staff.Username)}>delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (<tr><td colSpan="4" className="empty-state">No accounts found.</td></tr>)}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-nav-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>&lt; Previous</button>
                        {getPageNumbers().map((page, index) => (
                            <button key={index} className={`page-number-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)} disabled={page === '...'}>{page}</button>
                        ))}
                        <button className="page-nav-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next &rarr;</button>
                    </div>
                )}
            </div>
            <div className="footer-center"><button className="btn-back" onClick={onBack}>Back</button></div>
        </div>
    );
};

const InputGroup = ({ label, type="text", value, onChange, placeholder, isPasswordField, showPassword, onTogglePassword }) => (
    <div className="form-group">
        <label>{label}</label>
        <div style={{ position: 'relative', width: '100%' }}>
            <input 
                type={type} 
                className="input-styled" 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                value={value} 
                onChange={e => onChange(e.target.value)}
                style={{ width: '100%', paddingRight: isPasswordField ? '45px' : '15px' }}
            />
            {isPasswordField && (
                <div 
                    onClick={onTogglePassword}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
            )}
        </div>
    </div>
);

// --- MODAL COMPONENTS ---

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

export default Settings;