const Order = require("../models/Order");
const PickupPartner = require("../models/PickupPartner"); // Assuming you have this model

// Valid order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Assign an order to a pickup partner
exports.assignOrder = async (req, res) => {
  try {
    const { pickupPartnerId, amount, location, customerDetails } = req.body;

    // Validation
    if (!pickupPartnerId || !amount || !location) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: pickupPartnerId, amount, location" 
      });
    }

    // Verify pickup partner exists and is active
    const partner = await PickupPartner.findById(pickupPartnerId);
    if (!partner) {
      return res.status(404).json({ 
        success: false,
        message: "Pickup partner not found" 
      });
    }

    if (partner.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: "Cannot assign order to inactive partner" 
      });
    }

    // Create order
    const order = await Order.create({ 
      pickupPartner: pickupPartnerId, 
      amount,
      location,
      customerDetails,
      status: ORDER_STATUS.PENDING,
      assignedAt: new Date()
    });

    // Update partner's assigned orders count
    await PickupPartner.findByIdAndUpdate(pickupPartnerId, {
      $inc: { assignedOrders: 1 }
    });

    res.status(201).json({ 
      success: true, 
      message: "Order assigned successfully", 
      data: order 
    });

  } catch (error) {
    console.error("Error in assignOrder:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to assign order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders with filtering and pagination
exports.getOrders = async (req, res) => {
  try {
    const { status, pickupPartner, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (pickupPartner) filter.pickupPartner = pickupPartner;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'pickupPartner',
        select: 'name phone rating' // Only include essential fields
      }
    };

    const orders = await Order.paginate(filter, options);

    if (!orders.docs.length) {
      return res.status(200).json({ 
        success: true,
        message: "No orders found",
        data: [] 
      });
    }

    res.json({ 
      success: true,
      data: orders 
    });

  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false,
        message: "orderId and status are required" 
      });
    }

    // Validate status
    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Valid values are: ${Object.values(ORDER_STATUS).join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status, $set: { updatedAt: new Date() } },
      { new: true, runValidators: true }
    ).populate('pickupPartner');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // If order is completed, update partner's completed orders count
    if (status === ORDER_STATUS.COMPLETED) {
      await PickupPartner.findByIdAndUpdate(order.pickupPartner._id, {
        $inc: { completedOrders: 1 },
        $set: { lastActiveAt: new Date() }
      });
    }

    res.json({ 
      success: true, 
      message: "Order status updated successfully", 
      data: order 
    });

  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};