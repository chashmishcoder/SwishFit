const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const { generateToken } = require('../utils/jwtUtils');

/**
 * Authentication Controllers
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, dateOfBirth, skillLevel, height, weight, position } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user object
    const userData = {
      name,
      email,
      password,
      role,
      phoneNumber,
      dateOfBirth,
      skillLevel: role === 'player' ? skillLevel : undefined,
      height: role === 'player' ? height : undefined,
      weight: role === 'player' ? weight : undefined,
      position: role === 'player' ? position : undefined
    };

    // Create new user
    const user = await User.create(userData);

    // If user is a player, create leaderboard entry
    if (role === 'player') {
      try {
        await Leaderboard.create({
          playerId: user._id,
          skillLevel: skillLevel || 'beginner'
        });
      } catch (leaderboardError) {
        console.error('Error creating leaderboard entry:', leaderboardError);
        // Don't fail registration if leaderboard creation fails
        // Admin can fix this manually later
      }
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Get user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login timestamp
    await user.updateLastLogin();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Get user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('coachId', 'name email phoneNumber')
      .populate('teamId', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a player, include leaderboard data
    let leaderboardData = null;
    if (user.role === 'player') {
      leaderboardData = await Leaderboard.findOne({ playerId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        leaderboard: leaderboardData
      }
    });
  } catch (error) {
    console.error('Get me error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    // For JWT-based auth, logout is primarily handled on client side
    // by removing the token from storage
    
    // If using cookies, clear the cookie
    if (req.cookies && req.cookies.token) {
      res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Update password error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Forgot password - Send reset email (placeholder for future implementation)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // TODO: Implement email sending logic with reset token
    // For now, return success message
    
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error processing forgot password request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Reset password with token (placeholder for future implementation)
 * @route   POST /api/auth/reset-password/:resetToken
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // TODO: Implement reset token verification and password reset logic
    
    res.status(200).json({
      success: true,
      message: 'Password reset functionality coming soon'
    });
  } catch (error) {
    console.error('Reset password error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Verify email (placeholder for future implementation)
 * @route   GET /api/auth/verify-email/:verificationToken
 * @access  Public
 */
const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // TODO: Implement email verification logic
    
    res.status(200).json({
      success: true,
      message: 'Email verification functionality coming soon'
    });
  } catch (error) {
    console.error('Verify email error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error verifying email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Refresh access token (placeholder for future implementation)
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // TODO: Implement refresh token logic using jwtUtils
    
    res.status(200).json({
      success: true,
      message: 'Refresh token functionality coming soon'
    });
  } catch (error) {
    console.error('Refresh token error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken
};
