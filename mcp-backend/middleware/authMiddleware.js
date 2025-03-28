const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/role');
const { sendEmail } = require('../utils/email');

// Password complexity requirements
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, password, role and phone are required' 
      });
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Valid roles are: ${Object.values(ROLES).join(', ')}`
      });
    }

    // Validate password complexity
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      status: 'active' // or 'pending' if email verification needed
    });

    await user.save();

    // Generate verification token (if implementing email verification)
    const verificationToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_VERIFICATION_SECRET, 
      { expiresIn: '1d' }
    );

    // Send welcome email (optional)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to MCP System',
        html: `<p>Welcome ${name}! Your account has been successfully created as a ${role}.</p>`
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if email fails
    }

    // Generate auth token
    const authToken = generateAuthToken(user);

    // Omit sensitive data from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt
    };

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token: authToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check account status
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateAuthToken(user);

    // Set secure HTTP-only cookie (optional)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Omit sensitive data from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status
    };

    res.json({ 
      success: true,
      data: {
        user: userResponse,
        token // Also send token in response for mobile apps
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to authenticate user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  // Clear cookie if using cookie-based auth
  res.clearCookie('token');
  
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
};

// Helper function to generate JWT token
function generateAuthToken(user) {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      name: user.name
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'mcp-system-api'
    }
  );
}