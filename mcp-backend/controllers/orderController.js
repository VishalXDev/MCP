// controllers/orderController.js
const Order = require('../models/Order');
exports.createOrder = async (req, res) => { /* ... */ };
exports.getOrders = async (req, res) => { /* ... */ };
exports.assignOrder = async (req, res) => { /* ... */ };
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      mcpId: req.user.id,
      ...req.body
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ mcpId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { partnerId: req.body.partnerId, status: 'assigned' },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};