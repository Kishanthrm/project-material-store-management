import React, { useEffect, useState } from "react";
import "./AdminDashBoard.css";

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
  if (s === "APPROVED") return "approved";
  if (s === "ISSUED") return "issued";
  if (s === "REJECTED") return "rejected";
  if (s === "STAFF_APPROVED") return "staff_approved";
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

const AdminDashBoard = () => {
  const [expanded, setExpanded] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});

  /* ================= FETCH PROFILE (unchanged) ================= */

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

  /* ================= FETCH REQUESTS (unchanged) ================= */

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const pendingRes = await authFetch("/storeadmin/requests/pending");
        if (!pendingRes) return;
        setPendingRequests(await pendingRes.json());

        const completedRes = await authFetch("/storeadmin/requests/completed");
        if (!completedRes) return;
        setCompletedRequests(await completedRes.json());
      } catch (err) {
        console.error("Request fetch error:", err);
      }
    };
    fetchRequests();
  }, []);

  /* ================= UPDATE STATUS (unchanged) ================= */

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

  /* ================= ACCORDION (unchanged) ================= */

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!adminData) return <div className="admin-loading">Loading…</div>;

  return (
    <>
      <Header />

      <div className="admin-dashboard-content">
        {/* ══ PROFILE CARD ══ */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-img">
              <img src={profileImg} alt="store-admin" />
            </div>
            <div className="profile-basic">
              <div>{adminData.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {adminData.employee_id} &nbsp;·&nbsp; {adminData.email}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {adminData.role}
              </div>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="profile-bottom">
            <div className="kpi-box">
              <p className="kpi-box-label">Email</p>
              <p className="kpi-box-value" style={{ fontSize: 13 }}>
                {adminData.email}
              </p>
              <p className="kpi-box-sub">&nbsp;</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Role</p>
              <p className="kpi-box-value" style={{ fontSize: 13 }}>
                {adminData.role}
              </p>
              <p className="kpi-box-sub">&nbsp;</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Pending</p>
              <p className="kpi-box-value amber">{pendingRequests.length}</p>
              <p className="kpi-box-sub">awaiting action</p>
            </div>
            <div className="kpi-box">
              <p className="kpi-box-label">Completed</p>
              <p className="kpi-box-value green">{completedRequests.length}</p>
              <p className="kpi-box-sub">issued / rejected</p>
            </div>
          </div>
        </div>

        {/* ══ PENDING REQUESTS ══ */}
        <div className="profile-card pending-section">
          <p className="db-section-head">
            Requests waiting for store action
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
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              No pending requests.
            </p>
          )}

          <div className="completed-scroll">
            {pendingRequests.map((req) => (
              <Accordion
                key={req.id}
                expanded={expanded === `pending-${req.id}`}
                onChange={handleChange(`pending-${req.id}`)}
                disableGutters
                elevation={0}
                sx={{
                  background: "transparent",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px !important",
                  mb: 1,
                  boxShadow: "none",
                  "&::before": { display: "none" },
                  "&.Mui-expanded": { mb: 1 },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
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

                <AccordionDetails>
                  <div className="detail-inner">
                    {/* Materials list */}
                    <ul className="detail-materials">
                      {req.materials_list?.map((mat, index) => (
                        <li key={index}>
                          <span className="detail-dot" />
                          {mat.material_name} &nbsp;×&nbsp; {mat.requested_qty}
                        </li>
                      ))}
                    </ul>

                    {/* Delivery date + remarks */}
                    <div className="store-actions">
                      <div className="field-group">
                        <label className="field-label">Delivery date</label>
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
                      <div className="field-group">
                        <label className="field-label">Store remarks</label>
                        <input
                          type="text"
                          placeholder="Optional remarks…"
                          value={remarksMap[req.id] || ""}
                          onChange={(e) =>
                            setRemarksMap({
                              ...remarksMap,
                              [req.id]: e.target.value,
                            })
                          }
                          style={{
                            padding: "9px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: 10,
                            fontFamily: "Sora, sans-serif",
                            fontSize: 13,
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
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
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
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
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              No completed requests.
            </p>
          )}

          <div className="completed-scroll">
            {completedRequests.map((req) => (
              <Accordion
                key={req.id}
                expanded={expanded === `completed-${req.id}`}
                onChange={handleChange(`completed-${req.id}`)}
                disableGutters
                elevation={0}
                sx={{
                  background: "transparent",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px !important",
                  mb: 1,
                  boxShadow: "none",
                  "&::before": { display: "none" },
                  "&.Mui-expanded": { mb: 1 },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
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
                      <p className="sum-meta">
                        {req.event_name} &nbsp;·&nbsp; {req.materials_count}{" "}
                        material{req.materials_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`sum-badge ${statusClass(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="sum-time">
                      {new Date(req.request_time).toLocaleString()}
                    </span>
                  </div>
                </AccordionSummary>

                <AccordionDetails>
                  <div className="detail-inner">
                    <p className="completed-remarks">
                      <strong>Store remarks:</strong> {req.store_remarks || "—"}
                    </p>
                    {req.delivery_date && (
                      <p className="completed-remarks" style={{ marginTop: 6 }}>
                        <strong>Delivery date:</strong>{" "}
                        {new Date(req.delivery_date).toLocaleDateString()}
                      </p>
                    )}
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

export default AdminDashBoard;
