import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../api/AuthContext';
import { fetchUserProfile } from '../services/accountService';
import { 
    fetchAccountsAPI, 
    createAccountsAPI, 
    deleteAccount, 
} from '../services/settingService';

import InputGroup from '../components/InputGroup';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusModal from '../components/StatusModal';
import '../css/userProfile.css'; 

const ITEMS_PER_PAGE = 4;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// --- COMPONENT CON: PERSONAL INFO ---
const PersonalInfo = ({ userProfile, loading }) => {
    if (loading) return <div>Loading profile...</div>;
    return (
        <div className="recep-card" style={{ marginBottom: '40px' }}>
            <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px' }}>
                Personal Information
            </h3>
            <div className="account-form-grid">
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={userProfile?.username || ""} disabled className="input-styled" style={{backgroundColor: '#f3f4f6'}} />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <input type="text" value={userProfile?.accountTypeName || ""} disabled className="input-styled" style={{backgroundColor: '#f3f4f6'}} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="text" value={userProfile?.email || ""} disabled className="input-styled" style={{backgroundColor: '#f3f4f6'}} />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={userProfile?.phone || ""} disabled className="input-styled" style={{backgroundColor: '#f3f4f6'}} />
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Lấy user từ context
    
    // Kiểm tra quyền Manager (AccountTypeID = 1)
    const isManager = user?.accountTypeID === 1;

    // --- STATE CHO PROFILE ---
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // --- STATE CHO STAFF MANAGEMENT ---
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ username: '', password: '', email: '', phone: '', role: 'Receptionist' });
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Modals
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null });
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', message: '' });

    // Search & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const searchWrapperRef = useRef(null);

    // Fetch user profile
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.username) return;
            try {
                setLoadingProfile(true);
                // Gọi API lấy thông tin chi tiết user
                const res = await fetchUserProfile(user.username);
                
                setProfileData(res.data);
            } catch (err) {
                console.error("Error fetching profile", err);
                setProfileData(user); 
            } finally {
                setLoadingProfile(false);
            }
        };
        loadProfile();
    }, [user]);

    // Fetch list account (manager)
    useEffect(() => {
        if (isManager) {
            loadStaffData();
        }
    }, [isManager]);

    const loadStaffData = async () => {
        try {
            const res = await fetchAccountsAPI();
            if (res.success) setStaffList(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Handler add, delete
    const handleAddAccount = async (e) => {
        e.preventDefault();
        if (!newStaff.username || !newStaff.password || !newStaff.email) {
            setFormError("Please fill in required fields!"); return;
        }
        if (!isValidEmail(newStaff.email)) {
            setFormError("Invalid email format!"); return;
        }
        try {
            const accountTypeID = newStaff.role === 'Manager' ? 1 : 2;
            const payload = {
                ...newStaff,
                accountTypeID: accountTypeID
            };

            await createAccountsAPI(payload);
            setStatusModal({ isOpen: true, type: 'success', message: "Account added successfully!" });
            setNewStaff({ username: '', password: '', email: '', phone: '', role: 'Receptionist' });
            setFormError('');
            loadStaffData(); 
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to add account.";
            setFormError(msg);
        }
    };

    const handleDeleteClick = (username) => {
        setConfirmModal({ isOpen: true, data: username });
    };

    const confirmDelete = async () => {
        const username = confirmModal.data;
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
            const res = await deleteAccount(username);
            if (res.success) {
                setStatusModal({ isOpen: true, type: 'success', message: res.message });
                loadStaffData();
            } else {
                setStatusModal({ isOpen: true, type: 'error', message: res.message });
            }
        } catch (error) {
            setStatusModal({ isOpen: true, type: 'error', message: "Failed to delete account." });
        }
    };

    // --- LOGIC SEARCH & PAGINATION ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const displayedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="settings-page"> 
            <div className="recep-edit-container">
                <h1 className="recep-title">My Profile</h1>
      
                <PersonalInfo userProfile={profileData} loading={loadingProfile} />
                
                {isManager && (
                    <>
                        {/* Add Form */}
                        <div className="recep-card">
                            <div className="card-header-flex">
                                <h3>Create New Account</h3>
                                {formError && <div className="error-message-inline"><FaExclamationCircle /> {formError}</div>}
                                <button className="btn-add-account" onClick={handleAddAccount}><FaUserPlus /> Add</button>
                            </div>
                            <form className="account-form-grid" onSubmit={handleAddAccount} autoComplete="off">
                                <InputGroup 
                                    label="Username *" value={newStaff.username} 
                                    onChange={v => setNewStaff({...newStaff, username: v})} onFocus={() => setFormError('')} 
                                />
                                <InputGroup 
                                    label="Password *" type={showPassword ? "text" : "password"} 
                                    value={newStaff.password} onChange={v => setNewStaff({...newStaff, password: v})} 
                                    isPasswordField={true} showPassword={showPassword} 
                                    onTogglePassword={() => setShowPassword(!showPassword)} 
                                />
                                <InputGroup 
                                    label="Email *" type="email" value={newStaff.email} 
                                    onChange={v => setNewStaff({...newStaff, email: v})} onFocus={() => setFormError('')} 
                                />
                                <InputGroup 
                                    label="Phone" value={newStaff.phone} 
                                    onChange={v => setNewStaff({...newStaff, phone: v})} onFocus={() => setFormError('')} 
                                    placeholder="Optional" 
                                />
                                <InputGroup 
                                    label="Role" 
                                    type="select"
                                    wrapperClass="full-width" 
                                    value={newStaff.role}
                                    onChange={v => setNewStaff({...newStaff, role: v})} 
                                    options={[
                                        { value: 'Receptionist', label: 'Receptionist' },
                                        { value: 'Manager', label: 'Manager' }
                                    ]}
                                />
                            </form>
                        </div>

                        {/* List Table */}
                        <div className="recep-card mt-20">
                            <h3>Staff List</h3>
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
                                        <th style={{width: '20%'}}>Username</th>
                                        <th style={{width: '20%'}}>Phone</th>
                                        <th style={{width: '30%'}}>Email</th>
                                        <th style={{width: '20%'}}>Role</th> {/* <-- Thêm cột Role */}
                                        <th style={{width: '10%'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedStaff.length > 0 ? (
                                        displayedStaff.map((staff) => (
                                            <tr key={staff.Username}>
                                                <td style={{fontWeight: 'bold'}}>{staff.Username}</td>
                                                <td>{staff.Phone || ''}</td>
                                                <td>{staff.Email}</td>
                                                
                                                {/* Hiển thị Role */}
                                                <td>
                                                    <span className={staff.AccountTypeName === 'Manager' ? 'role-badge-manager' : 'role-badge-receptionist'}>
                                                        {staff.AccountTypeName}
                                                    </span>
                                                </td>

                                                <td style={{textAlign: 'right'}}>
                                                    {/* Không cho tự xóa chính mình */}
                                                    {staff.Username !== user.username && (
                                                        <button className="btn-delete-pill" onClick={() => handleDeleteClick(staff.Username)}>delete</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr><td colSpan="5" className="empty-state">No accounts found.</td></tr>)} {/* Sửa colSpan từ 4 lên 5 */}
                                </tbody>
                            </table>
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button className="page-nav-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                                    <span>{currentPage} / {totalPages}</span>
                                    <button className="page-nav-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* MODALS */}
            {confirmModal.isOpen && (
                <ConfirmationModal 
                    data={{ type: 'DELETE', title: 'Delete Account', message: `Are you sure you want to delete "${confirmModal.data}"?` }} 
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
                    onConfirm={confirmDelete} 
                />
            )}
            {statusModal.isOpen && <StatusModal data={statusModal} onClose={() => setStatusModal({ ...statusModal, isOpen: false })} />}
        </div>
    );
};

export default UserProfile;