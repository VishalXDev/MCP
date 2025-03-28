const Order = require("../models/Order");

// Assign an order to a pickup partner
exports.assignOrder = async (req, res) => {
    try {
        const { pickupPartnerId, amount, location } = req.body;

        if (!pickupPartnerId || !amount || !location) {
            return res.status(400).json({ message: "All fields are required (pickupPartnerId, amount, location)." });
        }

        const order = await Order.create({ pickupPartner: pickupPartnerId, amount, location });

        res.status(201).json({ success: true, message: "Order assigned successfully", order });
    } catch (error) {
        console.error("Error in assignOrder:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("pickupPartner");

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ message: "orderId and status are required." });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ success: true, message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
