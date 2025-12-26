import React, { useState, useEffect } from "react";
import { useAuth } from "../api/AuthContext";
import "../css/UserProfile.css";
import { FaUserShield, FaTrash, FaPlus } from "react-icons/fa";
import { axiosClient } from "../api/axiosClient";
import { 
    fetchUserProfile, 
    fetchAccounts, 
    createAccount, 
    deleteAccount 
} from "../services/accountService";

// Component con: Hiển thị thông tin cá nhân (Dùng chung)
const PersonalInfo = ({ user }) => {
  return (
    <div className="profile-card">
      <h3 className="card-title">Personal Information</h3>
      <div className="info-row">
        <div className="info-group">
          <label>Username</label>
          <input type="text" value={user?.username || ""} disabled className="input-readonly" />
        </div>
        <div className="info-group">
          <label>Role</label>
          <input type="text" value={user?.accountTypeName || ""} disabled className="input-readonly" />
        </div>
        {/* Các trường giả định thêm nếu có trong user object */}
        <div className="info-group">
          <label>Email</label>
          <input type="text" value="user@example.com" disabled className="input-readonly" />
        </div>
        <div className="info-group">
          <label>Phone</label>
          <input type="text" value="0909xxxxxx" disabled className="input-readonly" />
        </div>
      </div>
    </div>
  );
};

export default function UserProfile() {
  const { user } = useAuth();
  const isManager = user?.accountTypeID === 1; 

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // State quản lý danh sách account (Dành cho Manager)
  const [accounts, setAccounts] = useState([


  ]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // State form thêm mới
  const [newAcc, setNewAcc] = useState({
    username: "", email: "", password: "", phone: "", role: "Receptionist"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if(!user?.username) return;
      try{
        setLoadingProfile(true);

        const userProfile = await fetchUserProfile(user.username);
        setProfileData(userProfile);
      } catch (err){
        console.error("Error fetching profile data", err);
        // fetch hỏng thì dùng tạm thông tin từ token
        setProfileData(user);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchAllAccounts = async () => {
        if (!isManager) return;
        try {
            setLoadingAccounts(true);
            const res = await fetchAccounts();
            setAccounts(res.data);
        } catch (error) {
            console.error("Error fetching accounts list:", error);
        } finally {
            setLoadingAccounts(false);
        }
    };

    fetchAllAccounts();
  }, [isManager]);


  // Xử lý Input Change
  const handleChange = (e) => {
    setNewAcc({ ...newAcc, [e.target.name]: e.target.value });
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newAcc.username || !newAcc.password) return alert("Vui lòng điền đủ thông tin!");

    try {
        const payload = {
            ...newAcc,
            accountTypeID: newAcc.role === "Manager" ? 1 : 2 
        };
        
        const res = await createAccount(payload);
        
        setAccounts([...accounts, res.data]); 
        setNewAcc({ username: "", email: "", password: "", phone: "", role: "Receptionist" });
        alert("Thêm nhân viên thành công!");

    } catch (error) {
        console.error("Error adding account:", error);
        alert("Lỗi khi thêm tài khoản.");
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) {
        try {
            await deleteAccount(username);
            
            setAccounts(accounts.filter(acc => acc.username !== username));
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Không thể xóa tài khoản này.");
        }
    }
  };

  return (
    <div className="profile-page-container">
      <h1 className="page-header">User Profile</h1>
      
      {/* 1. Phần thông tin cá nhân */}
      <PersonalInfo profileData={profileData} loading={loadingProfile} />

      {/* 2. Phần quản lý */}
      {isManager && (
        <>
          <div className="manager-section-grid">
            {/* Form Thêm Nhân Viên */}
            <div className="profile-card">
              <h3 className="card-title"><FaUserShield /> Create New Account</h3>
              <form onSubmit={handleAddAccount} className="create-acc-form">
                <div className="form-grid">
                   <div className="form-group">
                      <label>Username</label>
                      <input name="username" value={newAcc.username} onChange={handleChange} placeholder="Enter username" />
                   </div>
                   <div className="form-group">
                      <label>Password</label>
                      <input name="password" type="password" value={newAcc.password} onChange={handleChange} placeholder="Enter password" />
                   </div>
                   <div className="form-group">
                      <label>Email</label>
                      <input name="email" value={newAcc.email} onChange={handleChange} placeholder="Enter email" />
                   </div>
                   <div className="form-group">
                      <label>Phone</label>
                      <input name="phone" value={newAcc.phone} onChange={handleChange} placeholder="Enter phone" />
                   </div>
                   <div className="form-group full-width">
                      <label>Role</label>
                      <select name="role" value={newAcc.role} onChange={handleChange}>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Manager">Manager</option>
                      </select>
                   </div>
                </div>
                <button type="submit" className="btn-add-acc"><FaPlus /> Create Account</button>
              </form>
            </div>
            
            {/* Bảng Danh Sách Nhân Viên */}
            <div className="profile-card">
               <h3 className="card-title">Existing Accounts</h3>
               {loadingAccounts ? <p>Loading list...</p> : (
                   <div className="table-responsive">
                     <table className="acc-table">
                       <thead>
                         <tr>
                           <th>Username</th>
                           <th>Email</th>
                           <th>Phone</th>
                           <th>Role</th>
                           <th>Action</th>
                         </tr>
                       </thead>
                       <tbody>
                         {accounts.length > 0 ? accounts.map((acc, index) => (
                           <tr key={acc.username || index}>
                             <td>{acc.username}</td>
                             <td>{acc.email}</td>
                             <td>{acc.phone}</td>
                             <td>
                               <span className={`role-tag ${acc.accountTypeName?.toLowerCase() || 'receptionist'}`}>
                                 {acc.accountTypeName || "N/A"}
                               </span>
                             </td>
                             <td>
                               {/* Không cho phép tự xóa chính mình */}
                               {acc.username !== user.username && (
                                   <button className="btn-delete" onClick={() => handleDelete(acc.username)}>
                                     <FaTrash />
                                   </button>
                               )}
                             </td>
                           </tr>
                         )) : (
                             <tr><td colSpan="5" style={{textAlign:"center"}}>No accounts found.</td></tr>
                         )}
                       </tbody>
                     </table>
                   </div>
               )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}