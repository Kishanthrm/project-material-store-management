const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user/userRoutes");
const requestRoutes = require("./routes/user/requestRoutes");
const formRoutes = require("./routes/user/formRoutes");
const materialRoutes = require("./routes/user/materialRoutes");

const profileRoutes = require("./routes/staff/profileRoutes");
const staffrequestRoutes = require("./routes/staff/staffrequestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/form", formRoutes);
app.use("/api/material", materialRoutes);

app.use("/api/staff",profileRoutes);
app.use("/api/staff/requests",staffrequestRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
