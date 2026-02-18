  const express = require("express");
  const router = express.Router();

  const {
    getPendingRequests,
    getCompletedRequests,
    createRequest,
  } = require("../controllers/requestController");

  router.get("/pending", getPendingRequests);
  router.get("/completed", getCompletedRequests);
  router.post("/create", createRequest);

  module.exports = router;
