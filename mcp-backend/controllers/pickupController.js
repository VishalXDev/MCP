const PickupPartner = require("../models/PickupPartner");
const Transaction = require("../models/Transaction");

// Pickup partner accepts an order
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status: "In Progress" }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a pickup partner's wallet balance
exports.getWalletBalance = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const partner = await PickupPartner.findById(partnerId);
        res.json({ balance: partner.walletBalance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
