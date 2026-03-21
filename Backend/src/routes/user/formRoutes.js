const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getEvents,
  getMaterials,
  getStudentById,
} = require("../../controllers/user/formController");

/*
  All routes require login
*/

router.get(
  "/student",
  verifyToken,
  allowRoles("student"),
  getStudentById
);

router.get(
  "/events",
  verifyToken,
  allowRoles("student"),
  getEvents
);

router.get(
  "/materials",
  verifyToken,
  allowRoles("student"),
  getMaterials
);

module.exports = router;