const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateEmail
} = require('../middleware/validation');

/**
 * Authentication Routes
 */

// @route   POST /api/auth/register
// @desc    Register a new user (player, coach, or admin)
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookies if used)
// @access  Private
router.post('/logout', protect, logout);

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', protect, validatePasswordChange, updatePassword);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validateEmail, forgotPassword);

// @route   POST /api/auth/reset-password/:resetToken
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:resetToken', resetPassword);

// @route   GET /api/auth/verify-email/:verificationToken
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:verificationToken', verifyEmail);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', refreshToken);

module.exports = router;
