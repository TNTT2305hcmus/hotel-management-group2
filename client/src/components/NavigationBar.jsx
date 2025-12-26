// components/NavigationBar.js
import "../css/NavigationBar.css";

// Cập nhật danh sách menu theo yêu cầu mới
const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "checkin", label: "Check In" },
  { key: "checkout", label: "Check Out" },
  { key: "report", label: "Report" },
  { key: "settings", label: "Setting" },
];

export default function NavigationBar({ activeKey, onNavigate }) {
  return (
    <nav className="hm-nav">
      <ul className="hm-nav__list">
        {NAV_ITEMS.map(({ key, label }) => (
          <li key={key} className="hm-nav__item-wrapper">
            <button
              className={`hm-nav__link ${activeKey === key ? "active" : ""}`}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}