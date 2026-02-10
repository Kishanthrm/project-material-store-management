import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #f5f7fb)",
      }}
    >
      <Card sx={{ width: 380, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Project Material Management System
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email / Username"
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
              sx={{ mt: 3, py: 1.2 }}
            >
              Login
            </Button>
          </form>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={2}
            color="text.secondary"
          >
            © 2026 College Project Store
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
