import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registerNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Registration Data:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 8, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
            <PersonAddIcon />
          </Avatar>

          <Typography variant="h5" mb={3}>
            Project Material System - Registration
          </Typography>

          <Box component="form" onSubmit={handleSubmit} width="100%">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Register Number / Staff ID"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
              helperText="Used to identify Student or Staff"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Register
            </Button>

            <Typography variant="body2" align="center" mt={2}>
              Already have an account? Login instead
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
