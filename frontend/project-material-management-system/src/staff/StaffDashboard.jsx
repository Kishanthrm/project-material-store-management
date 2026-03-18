import React, { useState, useEffect } from "react";
import "./StaffDashboard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import profileImg from "../assets/download.jpg";
import Header from "./components/Header";
import { authFetch } from "../authFetch";

/* ─── status → badge class ─── */
const statusClass = (status = "") => {
  const s = status.toUpperCase();
  if (s === "STAFF_APPROVED" || s === "APPROVED" || s === "ISSUED")
    return "approved";
  if (s === "REJECTED") return "rejected";
  return "pending";
};

/* ─── event emoji ─── */
const eventEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("robot")) return "🦾";
  if (n.includes("iot")) return "⚙️";
  if (n.includes("ai") || n.includes("boot")) return "🤖";
  if (n.includes("hack")) return "💡";
  if (n.includes("web")) return "🌐";
  return "🔬";
};

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

  /* ================= FETCH DATA (unchanged) ================= */

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

  /* ================= STATUS UPDATE (unchanged) ================= */

  const handleStatusUpdate = async (requestId, status, remarks) => {
    try {
      const response = await authFetch(
        `/staff/requests/update-status/${requestId}`,
        { method: "PUT", body: JSON.stringify({ status, remarks }) },
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

  if (loading) return <div className="staff-loading">Loading…</div>;
  if (!profile) return <div className="staff-error">No profile found</div>;

  return (
    <>
      <Header />
      <div className="dashboard-content">
        {/* ══ PROFILE CARD ══ */}
        <div className="profile-card">
          {/* top: avatar + name + id */}
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="profile" />
            </div>
            <div className="profile-basic">
              <div>{profile.staff_name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>
                {profile.staff_id} &nbsp;·&nbsp; {profile.email}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                  marginTop: 4,
                }}
              >
                {profile.department_name} &nbsp;·&nbsp; {profile.designation}
              </div>
            </div>
          </div>

          {/* KPI bottom row */}
          <div className="profile-bottom">
            <div className="kpi-box">
              <p className="kpi-box-label">Special Lab</p>
              <p className="kpi-box-value" style={{ fontSize: 15 }}>
                {profile.special_lab_name}
              </p>
              <p className="kpi-box-sub">&nbsp;</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Students &nbsp;/&nbsp; Requests</p>
              <p className="kpi-box-value">
                {profile.number_of_students}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#64748b",
                    marginLeft: 6,
                  }}
                >
                  / {profile.number_of_requests}
                </span>
              </p>
              <p className="kpi-box-sub">total students / requests</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Pending</p>
              <p className="kpi-box-value" style={{ color: "#b45309" }}>
                {pendingRequests.length}
              </p>
              <p className="kpi-box-sub">awaiting review</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Completed</p>
              <p className="kpi-box-value" style={{ color: "#15803d" }}>
                {completedRequests.length}
              </p>
              <p className="kpi-box-sub">approved / rejected</p>
            </div>
          </div>
        </div>

        {/* ══ PENDING REQUESTS ══ */}
        <div className="profile-card pending-section">
          <p className="db-section-head">
            Pending requests
            <span
              style={{
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 400,
                color: "#cbd5e1",
              }}
            >
              ({pendingRequests.length})
            </span>
          </p>

          {pendingRequests.length === 0 && (
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              No pending requests.
            </p>
          )}

          {pendingRequests.map((req) => (
            <Accordion
              key={req.id}
              expanded={expanded === `pending-${req.id}`}
              onChange={handleChange(`pending-${req.id}`)}
              disableGutters
              elevation={0}
              sx={{
                background: "rgba(255,255,255,0)",
                border: "1px solid #e5e7eb",
                borderRadius: "10px !important",
                mb: 1,
                boxShadow: "none",
                "&::before": { display: "none" },
                "&.Mui-expanded": { mb: 1 },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                }
                sx={{ px: 2, minHeight: 52 }}
              >
                <div className="pending-summary">
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {eventEmoji(req.event_name)}
                  </div>
                  <div>
                    <p className="sum-event">{req.student_name}</p>
                    <p className="sum-meta">
                      {req.event_name} &nbsp;·&nbsp; {req.materials_count} item
                      {req.materials_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="sum-badge pending">Pending</span>
                  <span className="sum-time">
                    {new Date(req.request_time).toLocaleString()}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <div style={{ padding: "14px 16px" }}>
                  <ul className="detail-materials">
                    {req.materials_list?.map((mat, index) => (
                      <li key={index}>
                        <span className="detail-dot" />
                        {mat.material_name} &nbsp;×&nbsp; {mat.quantity}
                      </li>
                    ))}
                  </ul>

                  <textarea
                    className="remarks-area"
                    rows={3}
                    placeholder="Add remarks (optional)…"
                    value={remarksMap[req.id] || ""}
                    onChange={(e) =>
                      setRemarksMap({ ...remarksMap, [req.id]: e.target.value })
                    }
                  />

                  <div className="action-buttons">
                    <button
                      className="btn-approve"
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
                      className="btn-reject"
                      onClick={() =>
                        handleStatusUpdate(
                          req.id,
                          "REJECTED",
                          remarksMap[req.id],
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {/* ══ COMPLETED REQUESTS ══ */}
        <div className="profile-card completed-section">
          <p className="db-section-head">
            Completed requests
            <span
              style={{
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 400,
                color: "#cbd5e1",
              }}
            >
              ({completedRequests.length})
            </span>
          </p>

          {completedRequests.length === 0 && (
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              No completed requests.
            </p>
          )}

          {/* scrollable container — shows ~5 rows before scrolling */}
          <div className="completed-scroll">
            {completedRequests.map((req) => (
              <Accordion
                key={req.id}
                expanded={expanded === `completed-${req.id}`}
                onChange={handleChange(`completed-${req.id}`)}
                disableGutters
                elevation={0}
                sx={{
                  background: "rgba(255,255,255,0)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px !important",
                  mb: 1,
                  boxShadow: "none",
                  "&::before": { display: "none" },
                  "&.Mui-expanded": { mb: 1 },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                  }
                  sx={{ px: 2, minHeight: 52 }}
                >
                  <div className="pending-summary">
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {eventEmoji(req.event_name)}
                    </div>
                    <div>
                      <p className="sum-event">{req.student_name}</p>
                      <p className="sum-meta">{req.event_name}</p>
                    </div>
                    <span className={`sum-badge ${statusClass(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="sum-time">
                      {new Date(req.request_time).toLocaleString()}
                    </span>
                  </div>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <div style={{ padding: "12px 16px" }}>
                    <p className="completed-remarks">
                      <strong>Remarks:</strong>{" "}
                      {req.lab_incharge_remarks || "—"}
                    </p>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
