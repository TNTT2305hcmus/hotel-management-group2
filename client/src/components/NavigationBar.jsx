import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../api/AuthContext";   
import { hasRole } from "../api/accessControl"; 
import "../css/NavigationBar.css";

const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/dashboard" }, // Đổi path cho khớp App.jsx
  { key: "checkin", label: "Check In", path: "/checkin" },
  { key: "checkout", label: "Check Out", path: "/checkout" },
  { key: "report", label: "Report", path: "/report" },
  { key: "settings", label: "Setting", path: "/settings" },
];

export default function NavigationBar({ activeKey, onNavigate }) {
  const navigate = useNavigate(); 
  const { user } = useAuth();     

  // --- 1. LỌC MENU THEO QUYỀN (GIỮ NGUYÊN LOGIC CỦA BẠN) ---
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.key === 'settings') {
      return hasRole(user, ['Manager']);
    }
    if (item.key === 'checkout') {
      return hasRole(user, ['Manager', 'Receptionist']);
    }
    return true;
  });

  // --- 2. HÀM XỬ LÝ CLICK ---
  const handleClick = (key, path) => {
    // Cập nhật trạng thái active (để đổi màu nút)
    if (onNavigate) {
      onNavigate(key);
    }
    
    // Thực hiện chuyển trang thực tế
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="hm-nav">
      <ul className="hm-nav__list">
        {/* --- 3. SỬA TẠI ĐÂY: Dùng filteredNavItems để hiển thị --- */}
        {filteredNavItems.map(({ key, label, path }) => (
          <li key={key} className="hm-nav__item-wrapper">
            <button
              className={`hm-nav__link ${activeKey === key ? "active" : ""}`}
              onClick={() => handleClick(key, path)} // Gọi hàm handleClick mới
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}