import { useEffect, useState } from "react";
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
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /* ===== FETCH REQUESTS ===== */
  useEffect(() => {
    fetch("http://localhost:5000/api/requests/pending")
      .then((res) => res.json())
      .then((data) => setPendingRequests(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/requests/completed")
      .then((res) => res.json())
      .then((data) => setCompletedRequests(data))
      .catch((err) => console.error(err));
  }, []);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const studentId = 2;

    fetch(`http://localhost:5000/api/users/profile/${studentId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) return <h3>Loading...</h3>;

  return (
    <>
      {/* ================= PROFILE CARD ================= */}
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-img">
            <img src={profileImg} alt="profile" />
          </div>

          <div className="profile-basic">
            <div>
              <strong>Name:</strong> <span>{profile.name}</span>
            </div>
            <div>
              <strong>Register Number:</strong> <span>{profile.reg_no}</span>
            </div>
          </div>
        </div>

        <hr />

        <div className="profile-bottom">
          <div className="profile-left">
            <div>
              <strong>Department:</strong>{" "}
              <span>{profile.department_name}</span>
            </div>
            <div>
              <strong>Semester:</strong> <span>{profile.semester}</span>
            </div>
            <div>
              <strong>Special Lab Incharge:</strong>{" "}
              <span>{profile.lab_incharge_name}</span>
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="profile-right">
            <div>
              <strong>Year:</strong> <span>{profile.year}</span>
            </div>
            <div>
              <strong>Special Lab:</strong> <span>{profile.lab_name}</span>
            </div>
            <div>
              <strong>No. of Requests:</strong>{" "}
              <span>{profile.total_requests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PENDING REQUESTS ================= */}
      <div className="profile-card pending-section">
        <Typography variant="h6" gutterBottom>
          Pending Requests
        </Typography>

        {pendingRequests.map((request) => (
          <Accordion
            key={request.id}
            expanded={expanded === request.id}
            onChange={handleChange(request.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Event:</strong> {request.event_name}
                </span>
                <span>
                  <strong>Materials:</strong> {request.materials_count}
                </span>
                <span>
                  <strong>Status:</strong> {request.status}
                </span>
                <span>
                  <strong>Time:</strong>{" "}
                  {new Date(request.time).toLocaleString()}
                </span>

                <span
                  className="edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit clicked");
                  }}
                >
                  <EditIcon fontSize="small" />
                </span>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              {request.materials_list?.map((material, index) => (
                <div key={index}>
                  {material.material_name} x {material.quantity}
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* ================= COMPLETED REQUESTS ================= */}
      <div className="profile-card completed-section">
        <Typography variant="h6" gutterBottom>
          Completed Requests
        </Typography>

        {completedRequests.map((request) => (
          <Accordion
            key={request.id}
            expanded={expanded === request.id}
            onChange={handleChange(request.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="pending-summary">
                <span>
                  <strong>Event:</strong> {request.event_name}
                </span>
                <span>
                  <strong>Materials:</strong> {request.materials_count}
                </span>
                <span>
                  <strong>Status:</strong> {request.status}
                </span>
                <span>
                  <strong>Time:</strong>{" "}
                  {new Date(request.time).toLocaleString()}
                </span>

                <span
                  className="edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit clicked");
                  }}
                >
                  <EditIcon fontSize="small" />
                </span>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              {request.materials_list?.map((material, index) => (
                <div key={index}>
                  {material.material_name} x {material.quantity}
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default DashBoardContent;
