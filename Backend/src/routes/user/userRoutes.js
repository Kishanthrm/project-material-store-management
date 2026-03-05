const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const { getUserProfile } = require("../../controllers/user/userController");

router.get(
  "/profile",
  verifyToken,
  allowRoles("student"),
  getUserProfile
);

module.exports = router;