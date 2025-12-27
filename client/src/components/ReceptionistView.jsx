import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FaUserPlus, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import { fetchReceptionistsAPI, createReceptionistAPI } from '../services/settingService';
import { InputGroup } from './SharedSettingsComponents';

const ITEMS_PER_PAGE = 4;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ReceptionistView = ({ onBack, onDeleteRequest, refreshTrigger, onAddSuccess, onShowStatus }) => {
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ username: '', password: '', email: '', phone: '' });
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Search & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const searchWrapperRef = useRef(null);

    // Load Data
    useEffect(() => { loadStaffData(); }, [refreshTrigger]);

    const loadStaffData = async () => {
        const res = await fetchReceptionistsAPI();
        if (res.success) setStaffList(res.data || []);
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Add Account Logic
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
            setFormError(error.response?.data?.message || "Failed to add account.");
        }
    };

    // Filter Logic
    const filteredStaff = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return staffList.filter(staff => 
            staff.Username.toLowerCase().includes(term) ||
            staff.Email.toLowerCase().includes(term)
        );
    }, [staffList, searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.trim().length > 0);
        setCurrentPage(1);
    };

    const handleSelectSuggestion = (username) => {
        setSearchTerm(username);
        setShowSuggestions(false);
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const displayedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="recep-edit-container">
            <h2 className="recep-title">Receptionist Account Edit</h2>
            
            {/* Form Thêm Nhân Viên */}
            <div className="recep-card">
                <div className="card-header-flex">
                    <h3>Account Information</h3>
                    {formError && <div className="error-message-inline"><FaExclamationCircle /> {formError}</div>}
                    <button className="btn-add-account" onClick={handleAddAccount}><FaUserPlus /> Add Account</button>
                </div>
                <form className="account-form-grid" onSubmit={handleAddAccount} autoComplete="off">
                    <InputGroup label="Username *" value={newStaff.username} onChange={v => setNewStaff({...newStaff, username: v})} onFocus={() => setFormError('')} />
                    <InputGroup 
                        label="Password *" type={showPassword ? "text" : "password"} value={newStaff.password} 
                        onChange={v => setNewStaff({...newStaff, password: v})} isPasswordField={true}
                        showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                    <InputGroup label="Email *" type="email" value={newStaff.email} onChange={v => setNewStaff({...newStaff, email: v})} onFocus={() => setFormError('')} />
                    <InputGroup label="Phone" value={newStaff.phone} onChange={v => setNewStaff({...newStaff, phone: v})} onFocus={() => setFormError('')} placeholder="Optional" />
                </form>
            </div>

            {/* Danh sách & Tìm kiếm */}
            <div className="recep-card mt-20">
                <h3>List Account</h3>
                <div className="search-bar-wrapper" ref={searchWrapperRef}>
                    <FaSearch className="search-icon"/>
                    <input type="text" autoComplete="off" placeholder="Search by username or email" 
                        value={searchTerm} onChange={handleSearchChange} onFocus={() => searchTerm.trim() && setShowSuggestions(true)} />
                    {showSuggestions && filteredStaff.length > 0 && (
                        <ul className="search-suggestions">
                            {filteredStaff.slice(0, 5).map((staff, index) => (
                                <li key={index} className="suggestion-item" onClick={() => handleSelectSuggestion(staff.Username)}>
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
                            <th style={{width: '25%'}}>Username</th><th style={{width: '25%'}}>Phone</th>
                            <th style={{width: '40%'}}>Email</th><th style={{width: '10%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedStaff.length > 0 ? (
                            displayedStaff.map((staff) => (
                                <tr key={staff.Username}>
                                    <td style={{fontWeight: 'bold'}}>{staff.Username}</td>
                                    <td>{staff.Phone || ''}</td><td>{staff.Email}</td>
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
                            <button key={index} className={`page-number-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                        ))}
                        <button className="page-nav-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next &rarr;</button>
                    </div>
                )}
            </div>
            <div className="footer-center"><button className="btn-back" onClick={onBack}>Back</button></div>
        </div>
    );
};

export default ReceptionistView;