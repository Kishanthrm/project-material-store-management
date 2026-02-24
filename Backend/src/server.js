const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/user/userRoutes");
const requestRoutes = require("./routes/user/requestRoutes");
const formRoutes = require("./routes/user/formRoutes");
const materialRoutes = require("./routes/user/materialRoutes");

const profileRoutes = require("./routes/staff/profileRoutes");
const staffrequestRoutes = require("./routes/staff/staffrequestRoutes");

const adminProfileRoutes = require("./routes/storeadmin/adminProfileRoutes");
const adminRequestRoutes = require("./routes/storeadmin/adminRequestRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});

app.set("io", io);
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (studentId) => {
    socket.join(studentId);
    console.log("Student joined room:", studentId);
  });

  // Frontend sends event "joinRoom"
  // Server listens
  // Puts that socket into room named studentId
  // Rooms allow us to send message to specific student.
  // Without rooms → all users receive update.

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

//users route
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/form", formRoutes);
app.use("/api/material", materialRoutes);

//staff route
app.use("/api/staff", profileRoutes);
app.use("/api/staff/requests", staffrequestRoutes);

//storeAdmin route
app.use("/api/storeadmin", adminProfileRoutes);
app.use("/api/storeadmin/requests", adminRequestRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// app.listen() internally creates http server to listen to port for request. but socket io need to access the http server , which is hidden by express, so we manually create a server.
