const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

const {
  getAllMaterials,
} = require("../../controllers/user/materialController");

// Only logged-in users can see materials
router.get(
  "/list",
  verifyToken,
  allowRoles("student"),
  getAllMaterials
);

module.exports = router;