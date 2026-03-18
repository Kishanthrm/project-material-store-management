import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import LogoutIcon from "@mui/icons-material/Logout";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="staff-topbar">
      <span className="staff-topbar-title">
        Project Material Management System
      </span>

      <div className="staff-topbar-actions">
        <button
          className="staff-topbar-btn"
          onClick={() => navigate("/support")}
          title="Contact Us"
        >
          <ContactSupportIcon fontSize="small" />
          <span className="staff-topbar-btn-label">Contact</span>
        </button>

        <div className="staff-topbar-divider" />

        <button
          className="staff-topbar-btn staff-topbar-btn-logout"
          onClick={() => navigate("/")}
          title="Logout"
        >
          <LogoutIcon fontSize="small" />
          <span className="staff-topbar-btn-label">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
