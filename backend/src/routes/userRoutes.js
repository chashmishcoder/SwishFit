const express = require('express');
const router = express.Router();

// Import controllers
const {
  getProfile,
  updateProfile,
  getUserById,
  getPlayers,
  getCoaches,
  assignCoach,
  deactivateAccount
} = require('../controllers/userController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validateMongoId,
  validatePagination
} = require('../middleware/validation');

/**
 * User Profile Routes
 */

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', protect, validateProfileUpdate, updateProfile);

// @route   DELETE /api/users/profile
// @desc    Deactivate current user's account
// @access  Private
router.delete('/profile', protect, deactivateAccount);

// @route   GET /api/users/players
// @desc    Get all players (coaches see their players, admins see all)
// @access  Private (Coach/Admin)
router.get('/players', protect, authorize('coach', 'admin'), validatePagination, getPlayers);

// @route   GET /api/users/coaches
// @desc    Get all coaches
// @access  Private (Admin)
router.get('/coaches', protect, authorize('admin'), validatePagination, getCoaches);

// @route   GET /api/users/:userId
// @desc    Get user by ID
// @access  Private (Own profile, assigned coach, or admin)
router.get('/:userId', protect, validateMongoId('userId'), getUserById);

// @route   PUT /api/users/:userId/assign-coach
// @desc    Assign coach to player
// @access  Private (Admin or player themselves)
router.put('/:userId/assign-coach', protect, validateMongoId('userId'), assignCoach);

module.exports = router;
