import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

import profileImg from "../../assets/download.jpg";

const socket = io("http://localhost:5000"); // Connects to backend socket server.

const DashBoardContent = () => {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  const studentId = 2; // later replace with JWT value

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /* ================= FETCH FUNCTIONS ================= */

  const fetchProfile = async () => {
    const res = await fetch(
      `http://localhost:5000/api/users/profile/${studentId}`
    );
    const data = await res.json();
    setProfile(data);
  };

  const fetchPending = async () => {
    const res = await fetch(
      `http://localhost:5000/api/requests/pending/${studentId}`
    );
    const data = await res.json();
    setPendingRequests(data);
  };

  const fetchCompleted = async () => {
    const res = await fetch(
      `http://localhost:5000/api/requests/completed/${studentId}`
    );
    const data = await res.json();
    setCompletedRequests(data);
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchProfile();
    fetchPending();
    fetchCompleted();
  }, []);

  /* ================= SOCKET LISTENER ================= */

  useEffect(() => {
    // Join room using studentId
    socket.emit("joinRoom", studentId.toString());

    // Listen for real-time update
    socket.on("requestStatusUpdated", (data) => {
      console.log("Status updated in real-time:", data);

      // Refetch updated data
      fetchPending();
      fetchCompleted();
    });

    return () => {
      socket.off("requestStatusUpdated");
    };
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
              <strong>Register Number:</strong>{" "}
              <span>{profile.reg_no}</span>
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
              <strong>Special Lab:</strong>{" "}
              <span>{profile.lab_name}</span>
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
                  <strong>Materials:</strong>{" "}
                  {request.materials_count}
                </span>
                <span>
                  <strong>Status:</strong> {request.status}
                </span>
                <span>
                  <strong>Time:</strong>{" "}
                  {new Date(request.time).toLocaleString()}
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
                  <strong>Materials:</strong>{" "}
                  {request.materials_count}
                </span>
                <span>
                  <strong>Status:</strong> {request.status}
                </span>
                <span>
                  <strong>Time:</strong>{" "}
                  {new Date(request.time).toLocaleString()}
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