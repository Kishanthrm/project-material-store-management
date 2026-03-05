const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getPendingRequests,
  getCompletedRequests,
  updateRequestStatus,
} = require("../../controllers/staff/requestController");

/*
  All routes:
  1. Must be logged in
  2. Must have role = lab_incharge
*/

router.get(
  "/pending",
  verifyToken,
  allowRoles("lab_incharge"),
  getPendingRequests,
);

router.get(
  "/complete",
  verifyToken,
  allowRoles("lab_incharge"),
  getCompletedRequests,
);

router.put(
  "/update-status/:id",
  verifyToken,
  allowRoles("lab_incharge"),
  updateRequestStatus,
);

module.exports = router;