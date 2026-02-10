import React, { useState } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import Header from "./components/Header";
import profileImg from "../assets/download.jpg";

const StaffDashboard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {/* FIXED HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <div className="dashboard-content">
        {/* ===== PROFILE CARD ===== */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="profile" />
            </div>

            <div className="profile-basic">
              <div>
                <strong>Name:</strong> <span>XYZ</span>
              </div>
              <div>
                <strong>Faculty Id:</strong> <span>MC10237</span>
              </div>
            </div>
          </div>

          <hr />

          <div className="profile-bottom">
            <div className="profile-left">
              <div>
                <strong>Department:</strong> <span>Mechatronics</span>
              </div>
              <div>
                <strong>Designation:</strong> <span>Professor</span>
              </div>
              <div>
                <strong>Email:</strong> <span>XYZ@gmail.com</span>
              </div>
            </div>

            <div className="vertical-divider"></div>

            <div className="profile-right">
              <div>
                <strong>Special Lab:</strong> <span>XYZ</span>
              </div>
              <div>
                <strong>Number of Students:</strong> <span>38</span>
              </div>
              <div>
                <strong>Number of Requests:</strong> <span>3</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PENDING REQUESTS ===== */}
        <div className="profile-card pending-section">
          <Typography variant="h6" gutterBottom>
            Pending Requests
          </Typography>

          <Accordion
            expanded={expanded === "pending-1"}
            onChange={handleChange("pending-1")}
          >
            {/* ===== SUMMARY ===== */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Name:</strong> Kishanth
                </span>
                <span>
                  <strong>Event:</strong> Robotics Workshop
                </span>
                <span>
                  <strong>Items:</strong> 5
                </span>
                <span>
                  <strong>Time:</strong> 12 Feb 2026, 10:30 AM
                </span>
              </div>
            </AccordionSummary>

            {/* ===== DETAILS ===== */}
            <AccordionDetails>
              {/* Materials list */}
              <div className="materials-list">
                <strong>Requested Materials</strong>
                <ul>
                  <li>Arduino Uno × 2</li>
                  <li>Servo Motor × 4</li>
                  <li>Jumper Wires × 10</li>
                </ul>
              </div>

              {/* Remarks */}
              <div className="remarks-box">
                <label>Remarks (optional)</label>
                <textarea
                  placeholder="Add remarks for approval / rejection"
                  rows={3}
                />
              </div>

              {/* Action buttons */}
              <div className="action-buttons">
                <button className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
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
            {/* ===== SUMMARY ===== */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Name:</strong> Kishanth
                </span>
                <span>
                  <strong>Event:</strong> Robotics Workshop
                </span>
                <span>
                  <strong>Items:</strong> 5
                </span>
                <span>
                  <strong>Time:</strong> 12 Feb 2026, 4:15 PM
                </span>
                <span className="status approved">Approved</span>
              </div>
            </AccordionSummary>

            {/* ===== DETAILS ===== */}
            <AccordionDetails>
              {/* Materials list */}
              <div className="materials-list">
                <strong>Issued Materials</strong>
                <ul>
                  <li>Arduino Uno × 2</li>
                  <li>Servo Motor × 4</li>
                  <li>Jumper Wires × 10</li>
                </ul>
              </div>

              {/* Final remarks */}
              <div className="final-remarks">
                <strong>Lab In-charge Remarks</strong>
                <p>
                  Approved for Robotics Workshop. Materials must be returned by
                  18 Feb 2026.
                </p>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Example: Rejected case */}
          <Accordion
            expanded={expanded === "completed-2"}
            onChange={handleChange("completed-2")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Name:</strong> Arjun
                </span>
                <span>
                  <strong>Event:</strong> IoT Hackathon
                </span>
                <span>
                  <strong>Items:</strong> 3
                </span>
                <span>
                  <strong>Time:</strong> 10 Feb 2026, 11:00 AM
                </span>
                <span className="status rejected">Rejected</span>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              <div className="materials-list">
                <strong>Requested Materials</strong>
                <ul>
                  <li>Sensor Module × 2</li>
                  <li>Breadboard × 1</li>
                </ul>
              </div>

              <div className="final-remarks">
                <strong>Lab In-charge Remarks</strong>
                <p>Rejected due to insufficient stock at the moment.</p>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
