import "../css/NavigationBar.css";
import { FaBed, FaSignInAlt, FaSignOutAlt, FaChartBar, FaCog } from "react-icons/fa";

const NAV_ITEMS = [
  { key: "rooms", label: "Room Management", Icon: FaBed },
  { key: "checkin", label: "Check-in", Icon: FaSignInAlt },
  { key: "checkout", label: "Check-out", Icon: FaSignOutAlt },
  { key: "report", label: "Report", Icon: FaChartBar },
  { key: "settings", label: "Settings", Icon: FaCog },
];

export default function NavigationBar({ activeKey, onNavigate }) {
  return (
    <nav className="hm-nav">
      {NAV_ITEMS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={`hm-nav__item${activeKey === key ? " active" : ""}`}
          onClick={() => onNavigate(key)}
        >
          <Icon className="hm-nav__icon" />
          <span className="hm-nav__text">{label}</span>
        </button>
      ))}
    </nav>
  );
}
