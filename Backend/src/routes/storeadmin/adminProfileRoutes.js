const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getAdminDashboardDetails,
} = require("../../controllers/storeadmin/adminProfileController");

/*
  Must be:
  1. Logged in
  2. Role = store_admin
*/

router.get(
  "/profile",
  verifyToken,
  allowRoles("store_admin"),
  getAdminDashboardDetails,
);

module.exports = router;
