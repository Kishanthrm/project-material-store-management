  const express = require("express");
  const router = express.Router();

  const {
    getPendingRequests,
    getCompletedRequests,
    createRequest,
  } = require("../../controllers/user/requestController");

  router.get("/pending/:id", getPendingRequests);
  router.get("/completed/:id", getCompletedRequests);
  router.post("/create", createRequest);

  module.exports = router;
