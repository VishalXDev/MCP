const Order = require("../models/Order");
const PickupPartner = require("../models/PickupPartner");
const Transaction = require("../models/Transaction");

// Pickup partner accepts an order
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status: "In Progress" }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ success: true, message: "Order accepted successfully", order });
    } catch (error) {
        console.error("Error in acceptOrder:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get a pickup partner's wallet balance
exports.getWalletBalance = async (req, res) => {
    try {
        const { partnerId } = req.params;

        if (!partnerId) {
            return res.status(400).json({ message: "Partner ID is required." });
        }

        const partner = await PickupPartner.findById(partnerId);

        if (!partner) {
            return res.status(404).json({ message: "Pickup Partner not found." });
        }

        res.json({ success: true, balance: partner.walletBalance });
    } catch (error) {
        console.error("Error in getWalletBalance:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
