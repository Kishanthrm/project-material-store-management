const express = require("express");
const router = express.Router();
const { getStaffProfile } = require("../../controllers/staff/profileController");

router.get("/profile/:id", getStaffProfile);

module.exports = router;