const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getPendingRequests,
  getCompletedRequests,
  updateRequestStatus,
} = require("../../controllers/storeadmin/adminRequestController");

/*
  All routes below:
  1. Must be logged in
  2. Must have role = store_admin
*/

router.get(
  "/pending",
  verifyToken,
  allowRoles("store_admin"),
  getPendingRequests,
);

router.get(
  "/completed",
  verifyToken,
  allowRoles("store_admin"),
  getCompletedRequests,
);

router.put(
  "/update-status/:requestId",
  verifyToken,
  allowRoles("store_admin"),
  updateRequestStatus,
);

module.exports = router;