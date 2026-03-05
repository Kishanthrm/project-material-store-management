import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      // if(response.ok)alert("success");
      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // Redirect based on role
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center">
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;