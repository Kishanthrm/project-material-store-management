import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ================= HANDLERS (unchanged) ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "student") {
        navigate("/userdashboard");
      } else if (data.role === "lab_incharge") {
        navigate("/staffdashboard");
      } else if (data.role === "store_admin") {
        navigate("/storedashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="login-page">
      {/* ── Brand strip ── */}
      <div className="login-brand">
        <div className="login-brand-logo">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
          </svg>
        </div>
        <span className="login-brand-name">PMMS</span>
      </div>

      {/* ── Card ── */}
      <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Project Material Management System</p>
        </div>

        <div className="login-divider" />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              name="email"
              className="login-input"
              placeholder="you@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>
      </div>

      <p className="login-footer">
        © {new Date().getFullYear()} Project Material Management System
      </p>
    </div>
  );
};

export default Login;