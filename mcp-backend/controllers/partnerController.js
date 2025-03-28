const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');

// @desc    Get all pickup partners
// @route   GET /api/partners
// @access  Private (MCP only)
exports.getPartners = async (req, res) => {
  try {
    // Get partners that belong to the current MCP
    const partners = await User.find({ 
      role: 'pickup_partner',
      mcpId: req.user.id 
    }).select('-password');
    
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Add new pickup partner
// @route   POST /api/partners
// @access  Private (MCP only)
exports.addPartner = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if partner already exists
    let partner = await User.findOne({ email });
    if (partner) {
      return res.status(400).json({
        success: false,
        error: 'Partner already exists'
      });
    }

    // Create temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create partner
    partner = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'pickup_partner',
      mcpId: req.user.id
    });

    await partner.save();

    // TODO: Send email with temp password here

    res.status(201).json({
      success: true,
      data: {
        _id: partner._id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        role: partner.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete pickup partner
// @route   DELETE /api/partners/:id
// @access  Private (MCP only)
exports.deletePartner = async (req, res) => {
  try {
    const partner = await User.findOneAndDelete({
      _id: req.params.id,
      mcpId: req.user.id,
      role: 'pickup_partner'
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};