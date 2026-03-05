import React, { useState, useEffect } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "./components/Header";
import profileImg from "../assets/download.jpg";
import { authFetch } from "../authFetch";

const StaffDashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [loading, setLoading] = useState(true);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await authFetch("/staff/profile");
        if (!profileRes) return;
        setProfile(await profileRes.json());

        const pendingRes = await authFetch("/staff/requests/pending");
        if (!pendingRes) return;
        setPendingRequests(await pendingRes.json());

        const completedRes = await authFetch("/staff/requests/complete");
        if (!completedRes) return;
        setCompletedRequests(await completedRes.json());
      } catch (err) {
        console.error("Error loading staff dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= STATUS UPDATE ================= */

  const handleStatusUpdate = async (requestId, status, remarks) => {
    try {
      const response = await authFetch(
        `/staff/requests/update-status/${requestId}`,
        {
          method: "PUT",
          body: JSON.stringify({ status, remarks }),
        },
      );

      if (!response) return;

      if (response.ok) {
        alert("Updated successfully");

        const updatedRequest = pendingRequests.find(
          (req) => req.id === requestId,
        );

        setPendingRequests((prev) =>
          prev.filter((req) => req.id !== requestId),
        );

        setCompletedRequests((prev) => [
          {
            ...updatedRequest,
            status,
            lab_incharge_remarks:
              remarks ||
              (status === "STAFF_APPROVED"
                ? "Approved by staff"
                : "Rejected by staff"),
          },
          ...prev,
        ]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error updating status");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (!profile) return <h3>No Profile Found</h3>;

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
                <strong>Name:</strong> {profile.staff_name}
              </div>
              <div>
                <strong>Faculty Id:</strong> {profile.staff_id}
              </div>
            </div>
          </div>

          <hr />

          <div className="profile-bottom">
            <div className="profile-left">
              <div>
                <strong>Department:</strong> {profile.department_name}
              </div>
              <div>
                <strong>Designation:</strong> {profile.designation}
              </div>
              <div>
                <strong>Email:</strong> {profile.email}
              </div>
            </div>

            <div className="vertical-divider"></div>

            <div className="profile-right">
              <div>
                <strong>Special Lab:</strong> {profile.special_lab_name}
              </div>
              <div>
                <strong>Number of Students:</strong>{" "}
                {profile.number_of_students}
              </div>
              <div>
                <strong>Number of Requests:</strong>{" "}
                {profile.number_of_requests}
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
                <ul>
                  {req.materials_list?.map((mat, index) => (
                    <li key={index}>
                      {mat.material_name} × {mat.quantity}
                    </li>
                  ))}
                </ul>

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

                <div className="action-buttons">
                  <button
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
            <Accordion key={req.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="pending-summary">
                  <span>
                    <strong>Name:</strong> {req.student_name}
                  </span>
                  <span>
                    <strong>Event:</strong> {req.event_name}
                  </span>
                  <span>
                    <strong>Status:</strong> {req.status}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <p>
                  <strong>Remarks:</strong> {req.lab_incharge_remarks}
                </p>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
