import React, { useEffect, useState } from "react";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import profileImg from "../assets/download.jpg";
import Header from "../staff/components/Header";
import { authFetch } from "../authFetch";

const AdminDashBoard = () => {
  const [expanded, setExpanded] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authFetch("/storeadmin/profile");
        if (!res) return;

        const data = await res.json();
        setAdminData(data.data);
      } catch (err) {
        console.error("Profile error:", err);
      }
    };

    loadProfile();
  }, []);

  /* ================= FETCH REQUESTS ================= */

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const pendingRes = await authFetch("/storeadmin/requests/pending");
        if (!pendingRes) return;

        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData);

        const completedRes = await authFetch("/storeadmin/requests/completed");
        if (!completedRes) return;

        const completedData = await completedRes.json();
        setCompletedRequests(completedData);
      } catch (err) {
        console.error("Request fetch error:", err);
      }
    };

    fetchRequests();
  }, []);

  /* ================= UPDATE STATUS ================= */

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const response = await authFetch(
        `/storeadmin/requests/update-status/${requestId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
            remarks: remarksMap[requestId] || "",
            deliveryDate: remarksMap[`delivery_${requestId}`] || null,
          }),
        },
      );

      if (!response) return;

      const updated = pendingRequests.find((r) => r.id === requestId);

      /* 🔵 APPROVED → Stay in pending */
      if (status === "APPROVED") {
        setPendingRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "APPROVED",
                  delivery_date: remarksMap[`delivery_${requestId}`],
                }
              : r,
          ),
        );
      }

      /* 🟢 ISSUED / 🔴 REJECTED → Move to completed */

      if (status === "ISSUED" || status === "REJECTED") {
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));

        setCompletedRequests((prev) => [
          {
            ...updated,
            status,
            store_remarks: remarksMap[requestId],
            delivery_date: remarksMap[`delivery_${requestId}`],
          },
          ...prev,
        ]);
      }

      alert("Updated successfully");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ================= ACCORDION ================= */

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!adminData) return <h3>Loading...</h3>;

  return (
    <>
      <Header />

      <div className="admin-dashboard-content">
        {/* ================= PROFILE ================= */}

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="store-admin" />
            </div>

            <div className="profile-basic">
              <div>
                <strong>Name:</strong> {adminData.name}
              </div>

              <div>
                <strong>Employee ID:</strong> {adminData.employee_id}
              </div>

              <div>
                <strong>Role:</strong> {adminData.role}
              </div>
            </div>
          </div>

          <hr />

          <div className="profile-bottom">
            <div className="profile-left">
              <div>
                <strong>Email:</strong> {adminData.email}
              </div>
            </div>

            <div className="vertical-divider"></div>

            <div className="profile-right">
              <div>
                <strong>Total Requests:</strong> {adminData.total_requests}
              </div>

              <div>
                <strong>Pending Deliveries:</strong>{" "}
                {adminData.pending_deliveries}
              </div>
            </div>
          </div>
        </div>

        {/* ================= PENDING REQUESTS ================= */}

        <div className="profile-card pending-section">
          <Typography variant="h6" gutterBottom>
            Requests Waiting for Store Action
          </Typography>

          {pendingRequests.map((req) => (
            <Accordion
              key={req.id}
              expanded={expanded === `pending-${req.id}`}
              onChange={handleChange(`pending-${req.id}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="pending-summary">
                  <span>
                    <strong>Student:</strong> {req.student_name}
                  </span>

                  <span>
                    <strong>Event:</strong> {req.event_name}
                  </span>

                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(req.request_time).toLocaleDateString()}
                  </span>

                  {req.status === "APPROVED" && (
                    <span className="status approved">APPROVED</span>
                  )}
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <strong>Requested Materials</strong>

                <ul>
                  {req.materials_list?.map((mat, index) => (
                    <li key={index}>
                      {mat.material_name} x {mat.requested_qty}
                    </li>
                  ))}
                </ul>

                <div>
                  <label>Delivery Date:</label>

                  <input
                    type="date"
                    onChange={(e) =>
                      setRemarksMap({
                        ...remarksMap,
                        [`delivery_${req.id}`]: e.target.value,
                      })
                    }
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Store remarks..."
                  value={remarksMap[req.id] || ""}
                  onChange={(e) =>
                    setRemarksMap({
                      ...remarksMap,
                      [req.id]: e.target.value,
                    })
                  }
                />

                <div className="action-buttons">
                  {req.status !== "APPROVED" && (
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                      disabled={!remarksMap[`delivery_${req.id}`]}
                    >
                      Approve
                    </button>
                  )}

                  {req.status === "APPROVED" && (
                    <button
                      className="issue-btn"
                      onClick={() => handleStatusUpdate(req.id, "ISSUED")}
                    >
                      Mark as Issued
                    </button>
                  )}

                  {req.status !== "APPROVED" && (
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {/* ================= COMPLETED REQUESTS ================= */}

        <div className="profile-card completed-section">
          <Typography variant="h6" gutterBottom>
            Completed Requests
          </Typography>

          {completedRequests.map((req) => (
            <Accordion
              key={req.id}
              expanded={expanded === `completed-${req.id}`}
              onChange={handleChange(`completed-${req.id}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="pending-summary">
                  <span>
                    <strong>Student:</strong> {req.student_name}
                  </span>

                  <span>
                    <strong>Event:</strong> {req.event_name}
                  </span>

                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(req.request_time).toLocaleDateString()}
                  </span>

                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>

                  <span>
                    <strong>Materials:</strong> {req.materials_count}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <Typography>
                  <strong>Store Remarks:</strong>
                  <br />
                  {req.store_remarks || "No remarks"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
