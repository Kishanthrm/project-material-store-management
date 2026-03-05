const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getStaffProfile,
} = require("../../controllers/staff/profileController");

/*
  Must be:
  1. Logged in
  2. Role = lab_incharge
*/

router.get(
  "/profile",
  verifyToken,
  allowRoles("lab_incharge"),
  getStaffProfile,
);

module.exports = router;