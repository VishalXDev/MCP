const express = require("express");
const { assignOrder, getOrders, updateOrderStatus } = require("../controllers/mcpController");
const router = express.Router();

router.post("/assign-order", assignOrder);
router.get("/orders", getOrders);
router.put("/update-order", updateOrderStatus);

module.exports = router;
