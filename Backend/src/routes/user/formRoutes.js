  const express = require("express");
  const router = express.Router();

  const {
    getEvents,
    getMaterials,
    getStudentById,
  } = require("../../controllers/user/formController");

  router.get("/students/:id", getStudentById);
  router.get("/events", getEvents);
  router.get("/materials", getMaterials);

  module.exports = router;