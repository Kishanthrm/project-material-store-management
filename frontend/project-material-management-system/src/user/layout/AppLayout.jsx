import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="al-root">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* ── Top bar ── */}
      <header
        className="al-topbar"
        style={{ left: sidebarOpen ? "230px" : "64px" }}
      >
        <span className="al-topbar-title">
          Project Material Management System
        </span>
      </header>

      {/* ── Main content ── */}
      <main
        className="al-content"
        style={{ marginLeft: sidebarOpen ? "230px" : "64px" }}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
