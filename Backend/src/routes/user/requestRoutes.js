const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getPendingRequests,
  getCompletedRequests,
  createRequest,
} = require("../../controllers/user/requestController");

/*
  All routes below:
  1. Must be logged in (verifyToken)
  2. Must have role = student
*/

router.get("/pending", verifyToken, allowRoles("student"), getPendingRequests);

router.get(
  "/completed",
  verifyToken,
  allowRoles("student"),
  getCompletedRequests,
);

router.post("/create", verifyToken, allowRoles("student"), createRequest);

module.exports = router;
