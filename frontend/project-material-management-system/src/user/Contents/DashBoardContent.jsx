import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { authFetch } from "../../authFetch";
import "./DashBoard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import profileImg from "../../assets/download.jpg";

/* ─── helpers ─── */
const getStatusClass = (status = "") => {
  const s = status.toUpperCase();
  if (s === "APPROVED") return "approved";
  if (s === "ISSUED" || s === "COMPLETED") return "issued";
  if (s === "REJECTED") return "rejected";
  return "default";
};

const eventEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("robot")) return "🦾";
  if (n.includes("iot"))   return "⚙️";
  if (n.includes("ai") || n.includes("boot")) return "🤖";
  if (n.includes("hack"))  return "💡";
  if (n.includes("web"))   return "🌐";
  return "🔬";
};

/* ─── socket (unchanged) ─── */
const socket = io(import.meta.env.VITE_API_URL, {
  auth: { token: localStorage.getItem("token") },
});

/* ══════════════════════════════════════════════ */

const DashBoardContent = () => {
  const [expanded, setExpanded]                   = useState(false);
  const [profile, setProfile]                     = useState(null);
  const [pendingRequests, setPendingRequests]     = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /* ── fetch (unchanged) ── */
  const fetchProfile   = async () => { const res = await authFetch("/users/profile");      setProfile(await res.json()); };
  const fetchPending   = async () => { const res = await authFetch("/requests/pending");   setPendingRequests(await res.json()); };
  const fetchCompleted = async () => { const res = await authFetch("/requests/completed"); setCompletedRequests(await res.json()); };

  useEffect(() => {
    fetchProfile();
    fetchPending();
    fetchCompleted();
  }, []);

  /* ── socket listener (unchanged) ── */
  useEffect(() => {
    socket.on("requestStatusUpdated", (data) => {
      console.log("Status updated in real-time:", data);
      fetchPending();
      fetchCompleted();
    });
    return () => socket.off("requestStatusUpdated");
  }, []);

  if (!profile) return <div className="db-loading">Loading…</div>;

  const totalRequests = profile.total_requests ?? pendingRequests.length + completedRequests.length;
  const overdueCount  = completedRequests.filter(r => (r.status || "").toUpperCase() === "OVERDUE").length;

  /* ── reusable accordion row ── */
  const RequestRow = ({ request }) => {
    const sc = getStatusClass(request.status);
    return (
      <Accordion
        expanded={expanded === request.id}
        onChange={handleChange(request.id)}
        disableGutters
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: "10px !important",
          mb: 1,
          boxShadow: "none",
          "&::before": { display: "none" },
          "&.Mui-expanded": { mb: 1 },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#475569", fontSize: 18 }} />}
          sx={{ px: 2, py: 0.5, minHeight: 52 }}
        >
          <div className="db-summary-row">
            <div className={`db-icon-box ${sc}`}>
              <span>{eventEmoji(request.event_name)}</span>
            </div>

            <div>
              <p className="db-event-name">{request.event_name}</p>
              <p className="db-mat-count">
                {request.materials_count} material{request.materials_count !== 1 ? "s" : ""}
              </p>
            </div>

            <span className={`db-badge ${sc}`}>{request.status}</span>

            <span className="db-time-str">
              {new Date(request.time).toLocaleString()}
            </span>
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <div className="db-details-wrap">
            {request.materials_list?.map((material, index) => (
              <div key={index} className="db-material-row">
                <span className="db-material-dot" />
                {material.material_name} &nbsp;×&nbsp; {material.quantity}
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div className="db-page">

      {/* ══ PROFILE CARD ══ */}
      <div className="db-card">
        <div className="db-top-strip">
          <div className="db-avatar-wrap">
            <img src={profileImg} alt="profile" />
          </div>

          <div className="db-name-block">
            <p className="db-name">{profile.name}</p>
            <p className="db-reg">
              {profile.reg_no} &nbsp;·&nbsp; {profile.lab_incharge_name}
            </p>
          </div>

          <div className="db-pill-row">
            <span className="db-pill">{profile.department_name}</span>
            <span className="db-pill">Year {profile.year}</span>
            <span className="db-pill">Sem {profile.semester}</span>
            <span className="db-pill">{profile.lab_name}</span>
          </div>
        </div>

        <div className="db-kpi-row">
          <div className="db-kpi">
            <p className="db-kpi-num">{totalRequests}</p>
            <p className="db-kpi-lbl">Total requests</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-num amber">{pendingRequests.length}</p>
            <p className="db-kpi-lbl">Pending</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-num green">{completedRequests.length}</p>
            <p className="db-kpi-lbl">Issued</p>
          </div>
          <div className="db-kpi">
            <p className="db-kpi-num blue">{overdueCount}</p>
            <p className="db-kpi-lbl">Overdue</p>
          </div>
        </div>
      </div>

      {/* ══ PENDING REQUESTS ══ */}
      <div className="db-card">
        <p className="db-section-head">Pending requests</p>
        {pendingRequests.length === 0
          ? <p className="db-empty">No pending requests.</p>
          : pendingRequests.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))
        }
      </div>

      {/* ══ COMPLETED REQUESTS ══ */}
      <div className="db-card">
        <p className="db-section-head">Completed requests</p>
        {completedRequests.length === 0
          ? <p className="db-empty">No completed requests.</p>
          : completedRequests.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))
        }
      </div>

    </div>
  );
};

export default DashBoardContent;