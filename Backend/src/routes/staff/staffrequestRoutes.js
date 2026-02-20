const express = require("express");
const router = express.Router();
const { getPendingRequests, getCompletedRequests, updateRequestStatus } = require("../../controllers/staff/requestController");

router.get("/pending/:id", getPendingRequests);
router.get("/complete/:id", getCompletedRequests);
router.put("/update-status/:id", updateRequestStatus);

module.exports = router;