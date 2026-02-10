import React, { useState } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import profileImg from "../../assets/download.jpg";

const DashBoardContent = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {/* ===== PROFILE CARD ===== */}
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-img">
            <img src={profileImg} alt="profile" />
          </div>

          <div className="profile-basic">
            <div>
              <strong>Name:</strong> <span>Kishanth</span>
            </div>
            <div>
              <strong>Register Number:</strong> <span>7376231MZ118</span>
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
              <strong>Semester:</strong> <span>IV</span>
            </div>
            <div>
              <strong>Special Lab Incharge:</strong> <span>XYZ</span>
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="profile-right">
            <div>
              <strong>Year:</strong> <span>3</span>
            </div>
            <div>
              <strong>Special Lab:</strong> <span>XYZ</span>
            </div>
            <div>
              <strong>No. of Requests:</strong> <span>3</span>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="pending-summary">
              <span>
                <strong>Event:</strong> Robotics Workshop
              </span>
              <span>
                <strong>Materials:</strong> 5
              </span>
              <span>
                <strong>Remarks:</strong> Waiting approval
              </span>
              <span>
                <strong>Time:</strong> 12 Feb 2026, 10:30 AM
              </span>
              <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            Arduino Uno x 2 <br />
            Servo Motor x 4 <br />
            Jumper Wires x 10
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "pending-2"}
          onChange={handleChange("pending-2")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="pending-summary">
              <span>
                <strong>Event:</strong> IoT Hackathon
              </span>
              <span>
                <strong>Materials:</strong> 3
              </span>
              <span>
                <strong>Remarks:</strong> Waiting delivery
              </span>
              <span>
                <strong>Time:</strong> 10 Feb 2026, 2:00 PM
              </span>
              <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            Breadboard x 1 <br />
            Sensor Module x 2
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
                <strong>Event:</strong> Robotics Workshop
              </span>
              <span>
                <strong>Materials:</strong> 5
              </span>
              <span>
                <strong>Remarks:</strong> Completed
              </span>
              <span>
                <strong>Time:</strong> 12 Feb 2026, 10:30 AM
              </span>
              <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            Arduino Uno x 2 <br />
            Servo Motor x 4
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default DashBoardContent;
