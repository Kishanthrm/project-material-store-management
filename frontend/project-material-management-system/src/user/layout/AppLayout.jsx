import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className="layout-content"
        style={{
          marginLeft: sidebarOpen ? "240px" : "70px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
