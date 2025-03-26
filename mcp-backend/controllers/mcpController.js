const Order = require("../models/Order");

// Assign an order to a pickup partner
exports.assignOrder = async (req, res) => {
    try {
        const { pickupPartnerId, amount, location } = req.body;
        const order = await Order.create({ pickupPartner: pickupPartnerId, amount, location });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("pickupPartner");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
