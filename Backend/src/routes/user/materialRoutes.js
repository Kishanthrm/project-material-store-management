const express = require("express");
const router = express.Router();
const {
  getAllMaterials,
} = require("../../controllers/user/materialController");

router.get("/list", getAllMaterials);

module.exports = router;
