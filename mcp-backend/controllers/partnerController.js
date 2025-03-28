const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');
const { sendEmail } = require('../utils/email'); // Assume you have an email utility
const { ROLES } = require('../constants/role'); // For role management

// @desc    Get all pickup partners with pagination
// @route   GET /api/partners
// @access  Private (MCP only)
exports.getPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { 
      role: ROLES.PICKUP_PARTNER,
      mcpId: req.user.id 
    };

    if (status) filter.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-password -__v',
      sort: { createdAt: -1 }
    };

    const partners = await User.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: {
        partners: partners.docs,
        pagination: {
          total: partners.totalDocs,
          pages: partners.totalPages,
          page: partners.page,
          limit: partners.limit
        }
      }
    });
  } catch (err) {
    console.error('Error fetching partners:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch partners',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Add new pickup partner
// @route   POST /api/partners
// @access  Private (MCP only)
exports.addPartner = async (req, res) => {
  try {
    const { name, email, phone, vehicleType } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required fields'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if partner already exists
    const existingPartner = await User.findOne({ email });
    if (existingPartner) {
      return res.status(409).json({
        success: false,
        message: 'Partner with this email already exists'
      });
    }

    // Generate temp password and hash
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'; // Stronger temp password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create partner
    const partner = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: ROLES.PICKUP_PARTNER,
      mcpId: req.user.id,
      status: 'active',
      vehicleType,
      createdAt: new Date()
    });

    await partner.save();

    // Send welcome email with temp password
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to MCP System',
        text: `Your temporary password is: ${tempPassword}\nPlease change it after first login.`,
        html: `<p>Your temporary password is: <strong>${tempPassword}</strong></p><p>Please change it after first login.</p>`
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Partner created successfully',
      data: {
        _id: partner._id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        role: partner.role,
        status: partner.status,
        vehicleType: partner.vehicleType
      }
    });

  } catch (err) {
    console.error('Error adding partner:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create partner',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete or deactivate pickup partner
// @route   DELETE /api/partners/:id
// @access  Private (MCP only)
exports.deletePartner = async (req, res) => {
  try {
    // First check if partner has pending orders
    const hasActiveOrders = await Order.exists({
      partnerId: req.params.id,
      status: { $in: ['pending', 'assigned', 'in_progress'] }
    });

    if (hasActiveOrders) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete partner with active orders'
      });
    }

    // Soft delete by marking as inactive instead of actual deletion
    const partner = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        mcpId: req.user.id,
        role: ROLES.PICKUP_PARTNER
      },
      { status: 'inactive', deactivatedAt: new Date() },
      { new: true, select: '-password' }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partner deactivated successfully',
      data: partner
    });

  } catch (err) {
    console.error('Error deleting partner:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate partner',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};