const express = require("express");
const { acceptOrder, getWalletBalance } = require("../controllers/pickupController");
const router = express.Router();

router.post("/accept-order", acceptOrder);
router.get("/wallet/:partnerId", getWalletBalance);

module.exports = router;
