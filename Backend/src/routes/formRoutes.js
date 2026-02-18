  const express = require("express");
  const router = express.Router();

  const {
    getEvents,
    getLabs,
    getMaterials,
    getStudentById,
  } = require("../controllers/formController");

  router.get("/students/:id", getStudentById);
  router.get("/events", getEvents);
  router.get("/labs", getLabs);
  router.get("/materials", getMaterials);

  module.exports = router;