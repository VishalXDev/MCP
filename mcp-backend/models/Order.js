const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  mcpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  destination: String,
  amount: Number,
  assignedAt: Date,
  completedAt: Date
}, { timestamps: true });

// Indexes
orderSchema.index({ mcpId: 1, status: 1 });
orderSchema.index({ partnerId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);