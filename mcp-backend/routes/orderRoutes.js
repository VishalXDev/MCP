const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  assignOrder
} = require('../controllers/orderController'); // Destructure the functions

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.post('/:id/assign', protect, assignOrder);

module.exports = router;