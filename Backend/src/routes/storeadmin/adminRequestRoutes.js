const express = require("express");
const router = express.Router();
const { getPendingRequests,getCompletedRequests,updateRequestStatus } = require("../../controllers/storeadmin/adminRequestController");

router.get("/pending", getPendingRequests);
router.get("/completed", getCompletedRequests);
router.put("/update-status/:requestId", updateRequestStatus);

module.exports = router;