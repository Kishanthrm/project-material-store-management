import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/userdashboard" },
  {
    text: "New Request",
    icon: <AddCircleOutlineIcon />,
    path: "/userhomepage",
  },
  {
    text: "Pending Requests",
    icon: <PendingActionsIcon />,
    path: "/userdashboard",
  },
  {
    text: "Approved Requests",
    icon: <CheckCircleOutlineIcon />,
    path: "/userdashboard",
  },
];

const bottomItems = [
  { text: "Material List", icon: <Inventory2Icon />, path: "/materiallist" },
  { text: "Contact Us", icon: <ContactSupportIcon />, path: "/support" },
  { text: "Logout", icon: <LogoutIcon />, path: "/" },
];

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sb-root ${open ? "sb-open" : "sb-closed"}`}>
      {/* ── Logo / header ── */}
      <div className="sb-header">
        {open && <span className="sb-title">PMMS</span>}
        <button className="sb-toggle" onClick={() => setOpen(!open)}>
          {open ? (
            <ChevronLeftIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </button>
      </div>

      {/* ── Main nav ── */}
      <nav className="sb-nav">
        {menuItems.map(({ text, icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={text}
              className={`sb-item ${active ? "sb-item-active" : ""}`}
              onClick={() => navigate(path)}
              title={!open ? text : undefined}
            >
              <span className="sb-icon">{icon}</span>
              {open && <span className="sb-label">{text}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="sb-divider" />

      {/* ── Bottom nav ── */}
      <nav className="sb-nav sb-bottom">
        {bottomItems.map(({ text, icon, path }) => (
          <button
            key={text}
            className={`sb-item ${text === "Logout" ? "sb-item-logout" : ""}`}
            onClick={() => navigate(path)}
            title={!open ? text : undefined}
          >
            <span className="sb-icon">{icon}</span>
            {open && <span className="sb-label">{text}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
