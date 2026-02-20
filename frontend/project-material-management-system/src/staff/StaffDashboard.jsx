import React, { useState, useEffect } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "./components/Header";
import profileImg from "../assets/download.jpg";

const StaffDashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  const staffId = 1; // later get from JWT

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    // Profile
    fetch(`http://localhost:5000/api/staff/profile/${staffId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));

    // Pending Requests
    fetch(`http://localhost:5000/api/staff/requests/pending/${staffId}`)
      .then((res) => res.json())
      .then((data) => setPendingRequests(data));

    // Completed Requests
    fetch(`http://localhost:5000/api/staff/requests/complete/${staffId}`)
      .then((res) => res.json())
      .then((data) => setCompletedRequests(data));
  }, []);

  const handleStatusUpdate = async (requestId, status, remarks) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/requests/update-status/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            remarks,
          }),
        },
      );

      if (response.ok) {
        alert("updated successfully");
        
        const updatedRequest = pendingRequests.find(
          (req) => req.id === requestId,
        );

        // Remove from pending
        setPendingRequests((prev) =>
          prev.filter((req) => req.id !== requestId),
        );

        // Add to completed with new status
        setCompletedRequests((prev) => [
          {
            ...updatedRequest,
            status: status,
            lab_incharge_remarks:
              remarks ||
              (status === "STAFF_APPROVED"
                ? "Approved by staff"
                : "Rejected by staff"),
          },
          ...prev,
        ]);
      } else {
        alert("Error updating status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) return <h3>Loading...</h3>;

  return (
    <>
      <Header />

      <div className="dashboard-content">
        {/* ===== PROFILE CARD ===== */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="profile" />
            </div>

            <div className="profile-basic">
              <div>
                <strong>Name:</strong> <span>{profile.staff_name}</span>
              </div>
              <div>
                <strong>Faculty Id:</strong> <span>{profile.staff_id}</span>
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
                <strong>Designation:</strong> <span>{profile.designation}</span>
              </div>
              <div>
                <strong>Email:</strong> <span>{profile.email}</span>
              </div>
            </div>

            <div className="vertical-divider"></div>

            <div className="profile-right">
              <div>
                <strong>Special Lab:</strong>{" "}
                <span>{profile.special_lab_name}</span>
              </div>
              <div>
                <strong>Number of Students:</strong>{" "}
                <span>{profile.number_of_students}</span>
              </div>
              <div>
                <strong>Number of Requests:</strong>{" "}
                <span>{profile.number_of_requests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PENDING REQUESTS ===== */}
        <div className="profile-card pending-section">
          <Typography variant="h6">Pending Requests</Typography>

          {pendingRequests.map((req) => (
            <Accordion
              key={req.id}
              expanded={expanded === `pending-${req.id}`}
              onChange={handleChange(`pending-${req.id}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="pending-summary">
                  <span>
                    <strong>Name:</strong> {req.student_name}
                  </span>
                  <span>
                    <strong>Event:</strong> {req.event_name}
                  </span>
                  <span>
                    <strong>Items:</strong> {req.materials_count}
                  </span>
                  <span>
                    <strong>Time:</strong>{" "}
                    {new Date(req.request_time).toLocaleString()}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className="materials-list">
                  <strong>Requested Materials</strong>
                  <ul>
                    {req.materials_list?.map((mat, index) => (
                      <li key={index}>
                        {mat.material_name} x {mat.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="remarks-box">
                  <textarea
                    rows={3}
                    placeholder="Add remarks..."
                    value={remarksMap[req.id] || ""}
                    onChange={(e) =>
                      setRemarksMap({
                        ...remarksMap,
                        [req.id]: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() =>
                      handleStatusUpdate(
                        req.id,
                        "STAFF_APPROVED",
                        remarksMap[req.id],
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleStatusUpdate(req.id, "REJECTED", remarksMap[req.id])
                    }
                  >
                    Reject
                  </button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {/* ===== COMPLETED REQUESTS ===== */}
        <div className="profile-card completed-section">
          <Typography variant="h6">Completed Requests</Typography>

          {completedRequests.map((req) => (
            <Accordion
              key={req.id}
              expanded={expanded === `completed-${req.id}`}
              onChange={handleChange(`completed-${req.id}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="pending-summary">
                  <span>
                    <strong>Name:</strong> {req.student_name}
                  </span>
                  <span>
                    <strong>Event:</strong> {req.event_name}
                  </span>
                  <span>
                    <strong>Items:</strong> {req.materials_count}
                  </span>
                  <span>
                    <strong>Time:</strong>{" "}
                    {new Date(req.request_time).toLocaleString()}
                  </span>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className="materials-list">
                  <strong>Materials</strong>
                  <ul>
                    {req.materials_list?.map((mat, index) => (
                      <li key={index}>
                        {mat.material_name} × {mat.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="final-remarks">
                  <strong>Remarks</strong>
                  <p>{req.lab_incharge_remarks}</p>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
