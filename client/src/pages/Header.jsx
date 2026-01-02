import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../api/AuthContext";
import "../css/Header.css";
import { FaHotel, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; 

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("home");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    // Lấy thông tin user từ Auth Context thay vì props
    const { user, logout } = useAuth();

    // Fallback nếu chưa đăng nhập hoặc chưa load xong user
    const userName = user?.username || "Guest";
    const userRole = user?.accountTypeName || "Visitor";

    useEffect(() => {
        const path = location.pathname;
        if (path === "/" || path === "/dashboard") setActiveKey("home");
        else if (path.startsWith("/check-in")) setActiveKey("checkin");
        else if (path.startsWith("/check-out")) setActiveKey("checkout");
        else if (path.startsWith("/report")) setActiveKey("report");
        else if (path.startsWith("/settings")) setActiveKey("settings");
    }, [location]);

    const handleNavigate = (key) => {
        setActiveKey(key); 
        switch (key) {
            case "home": navigate("/dashboard"); break;
            case "checkin": navigate("/check-in"); break;
            case "checkout": navigate("/check-out"); break;
            case "report": navigate("/report"); break;
            case "settings": navigate("/settings"); break;
            default: navigate("/dashboard");
        }
    };

    // Hàm xử lý khi click vào Avatar
    const handleProfileClick = () => {
        navigate("/settings/profile");
    };

    // Hàm xử lý Logout
    const confirmLogout = () => {
        logout(); // Xóa token
        setShowLogoutModal(false); // Đóng modal
        navigate("/login"); // Chuyển về trang login
    };

    return (
        <header className="hm-header">
            {/* 1. Left: Logo */}
            <div className="hm-header__brand" onClick={() => navigate("/dashboard")} style={{cursor: "pointer"}}>
                <div className="hm-logo-icon">
                    <FaHotel />
                </div>
                <span className="hm-logo-text">HOTEL</span>
            </div>

            {/* 2. Center: Navigation */}
            <div className="hm-header__nav">
                <NavigationBar activeKey={activeKey} onNavigate={handleNavigate} />
            </div>

            {/* 3. Right: User & Logout */}
            <div className="hm-header__actions">
                {/* User Profile Container */}
                {/* Nên đặt onClick ở container ngoài cùng để vùng click rộng hơn */}
                <div className="hm-user-container">
                    <div className="hm-user-info-trigger" onClick={handleProfileClick}>
                         <FaUserCircle className="hm-user-avatar" />
                    </div>
                    
                    {/* Badge Role (Tooltip) */}
                    <div className="hm-role-tooltip">
                        <div className="tooltip-content">
                            <span className="user-display-name">{userName}</span>
                            <span className="role-badge">{userRole}</span>
                        </div>
                        <div className="tooltip-arrow"></div>
                    </div>

                    {/* Nút Logout */}
                    <div 
                        className="hm-logout-btn" 
                        onClick={() => setShowLogoutModal(true)}
                        title="Log out"
                        >
                        <FaSignOutAlt />
                    </div>
                </div>
            </div>
            {/* --- MODAL CONFIRM LOGOUT --- */}
            {showLogoutModal && (
                <div className="hm-modal-overlay">
                    <div className="hm-modal-content">
                        <h3>Confirm Log out</h3>
                        <p>Are you sure to log out this account</p>
                        <div className="hm-modal-actions">
                            <button 
                                className="hm-btn-secondary" 
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancle
                            </button>
                            <button 
                                className="hm-btn-danger" 
                                onClick={confirmLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}