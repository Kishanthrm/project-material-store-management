const express = require("express");
const router = express.Router();
const { getAdminDashboardDetails } = require("../../controllers/storeadmin/adminProfileController");

router.get("/profile", getAdminDashboardDetails);

module.exports = router;