const Order = require('../models/Order');
const PickupPartner = require('../models/PickupPartner');
const { ORDER_STATUS } = require('../constants/orderStatus'); // Recommended for status management

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, location, specialInstructions } = req.body;

    // Validate required fields
    if (!items || !location) {
      return res.status(400).json({
        success: false,
        message: 'Items and location are required fields'
      });
    }

    // Verify items is an array with at least one item
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    const order = await Order.create({
      mcpId: req.user.id,
      items,
      location,
      specialInstructions: specialInstructions || '',
      status: ORDER_STATUS.PENDING,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get all orders for current MCP
exports.getOrders = async (req, res) => {
  try {
    const { status, from, to, limit = 10, page = 1 } = req.query;
    
    const filter = { mcpId: req.user.id };
    if (status) filter.status = status;
    
    // Date range filtering
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: { createdAt: -1 },
      populate: {
        path: 'partnerId',
        select: 'name phone rating' // Only necessary fields
      }
    };

    const orders = await Order.paginate(filter, options);

    res.json({
      success: true,
      data: {
        orders: orders.docs,
        pagination: {
          total: orders.totalDocs,
          pages: orders.totalPages,
          page: orders.page,
          limit: orders.limit
        }
      }
    });

  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Assign order to pickup partner
exports.assignOrder = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const { id } = req.params;

    // Validate inputs
    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: 'partnerId is required'
      });
    }

    // Verify partner exists and is active
    const partner = await PickupPartner.findOne({
      _id: partnerId,
      status: 'active'
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Active pickup partner not found'
      });
    }

    // Verify order exists and belongs to this MCP
    const order = await Order.findOne({
      _id: id,
      mcpId: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or unauthorized'
      });
    }

    // Prevent reassignment if already assigned
    if (order.partnerId && order.partnerId.toString() !== partnerId) {
      return res.status(400).json({
        success: false,
        message: 'Order is already assigned to another partner'
      });
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        partnerId,
        status: ORDER_STATUS.ASSIGNED,
        assignedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('partnerId', 'name phone');

    // Update partner's stats
    await PickupPartner.findByIdAndUpdate(partnerId, {
      $inc: { assignedOrders: 1 },
      $set: { lastActiveAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Order assigned successfully',
      data: updatedOrder
    });

  } catch (err) {
    console.error('Error assigning order:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to assign order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};