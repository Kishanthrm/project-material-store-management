import React, { useState } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import profileImg from "../assets/download.jpg";
import Header from "../staff/components/Header";

const AdminDashBoard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Header />

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="admin-dashboard-content">
        {/* ===== STORE ADMIN PROFILE CARD ===== */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="store-admin" />
            </div>

            <div className="profile-basic">
              <div>
                <strong>Name:</strong> <span>Mr. Rajesh Kumar</span>
              </div>
              <div>
                <strong>Employee ID:</strong> <span>ST-ADM-102</span>
              </div>
              <div>
                <strong>Role:</strong> <span>Store Admin</span>
              </div>
            </div>
          </div>

          <hr />

          <div className="profile-bottom">
            <div className="profile-left">
              <div>
                <strong>Store / Lab:</strong> <span>Central Project Store</span>
              </div>
              <div>
                <strong>Email:</strong> <span>storeadmin@college.edu</span>
              </div>
              <div>
                <strong>Phone:</strong> <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="vertical-divider"></div>

            <div className="profile-right">
              <div>
                <strong>Total Requests Handled:</strong> <span>148</span>
              </div>
              <div>
                <strong>Pending Deliveries:</strong> <span>6</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== REQUESTS WAITING FOR STORE ACTION ===== */}
        <div className="profile-card pending-section">
          <Typography variant="h6" gutterBottom>
            Requests Waiting for Store Action
          </Typography>

          <Accordion
            expanded={expanded === "pending-1"}
            onChange={handleChange("pending-1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Student:</strong> Kishanth
                </span>
                <span>
                  <strong>Event:</strong> Robotics Workshop
                </span>
                <span>
                  <strong>Date:</strong> 12 Feb 2026
                </span>
                <span>
                  <strong>Lab Approval:</strong> Approved
                </span>
                <span>
                  <strong>Materials:</strong> 5
                </span>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="subtitle2">
                Student & Event Details
              </Typography>
              <p>
                <strong>Register No:</strong> 7376231MZ118 <br />
                <strong>Department:</strong> Mechatronics <br />
                <strong>Lab:</strong> Robotics Lab <br />
                <strong>Lab In-charge:</strong> Dr. XYZ
              </p>

              <Typography variant="subtitle2">Requested Materials</Typography>
              <ul>
                <li>Arduino Uno — Req: 2 | Avl: 5 | Status: Available</li>
                <li>Servo Motor — Req: 4 | Avl: 2 | Status: Partial</li>
                <li>Jumper Wires — Req: 10 | Avl: 50 | Status: Available</li>
              </ul>

              <Typography variant="subtitle2">Store Actions</Typography>

              <div className="store-actions">
                <div>
                  <label>Delivery Date</label>
                  <input type="date" />
                </div>

                <div>
                  <label>Issue Type</label>
                  <select>
                    <option>Full Issue</option>
                    <option>Partial Issue</option>
                  </select>
                </div>

                <div>
                  <label>Store Remarks</label>
                  <textarea rows="3" />
                </div>
              </div>

              <div className="action-buttons">
                <button className="approve-btn">✅ Mark as Issued</button>
                <button className="delay-btn">⏳ Mark as Delayed</button>
                <button className="reject-btn">❌ Reject</button>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* ===== COMPLETED REQUESTS ===== */}
        <div className="profile-card completed-section">
          <Typography variant="h6" gutterBottom>
            Completed Requests
          </Typography>

          <Accordion
            expanded={expanded === "completed-1"}
            onChange={handleChange("completed-1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Student:</strong> Kishanth
                </span>
                <span>
                  <strong>Event:</strong> IoT Hackathon
                </span>
                <span>
                  <strong>Date:</strong> 08 Feb 2026
                </span>
                <span>
                  <strong>Status:</strong> Issued
                </span>
                <span>
                  <strong>Materials:</strong> 3
                </span>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                Materials successfully issued on <strong>09 Feb 2026</strong>.
                <br />
                Store Remarks: All items issued in good condition.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
