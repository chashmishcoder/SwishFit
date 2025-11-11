const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');

/**
 * User Profile Controllers
 */

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // Get user with populated relationships
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('coachId', 'name email phoneNumber profileImage')
      .populate('teamId', 'name description');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a player, include leaderboard data
    let leaderboardData = null;
    if (user.role === 'player') {
      leaderboardData = await Leaderboard.findOne({ playerId: user._id })
        .populate('teamId', 'name');
    }

    // If user is a coach, include their players
    let players = [];
    if (user.role === 'coach') {
      players = await User.find({ coachId: user._id, isActive: true })
        .select('name email skillLevel profileImage lastLogin')
        .sort('name');
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        leaderboard: leaderboardData,
        players: user.role === 'coach' ? players : undefined
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    // Fields allowed to be updated
    const allowedFields = [
      'name',
      'phoneNumber',
      'dateOfBirth',
      'skillLevel',
      'height',
      'weight',
      'position',
      'profileImage'
    ];

    // Filter request body to only include allowed fields
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if there are any valid updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);

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
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get user by ID (for coaches viewing player profiles)
 * @route   GET /api/users/:userId
 * @access  Private (Coach/Admin)
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId)
      .select('-password')
      .populate('coachId', 'name email')
      .populate('teamId', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Authorization check
    // Admin can view any profile
    // Coach can view their assigned players
    // Users can view their own profile
    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== userId &&
      !(req.user.role === 'coach' && user.coachId && user.coachId._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }

    // If viewing a player, include leaderboard data
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
    console.error('Get user by ID error:', error);

    // Handle invalid MongoDB ID
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all players (for coaches/admins)
 * @route   GET /api/users/players
 * @access  Private (Coach/Admin)
 */
const getPlayers = async (req, res) => {
  try {
    // Build query based on user role
    let query = { role: 'player', isActive: true };

    // If coach, only show their assigned players
    if (req.user.role === 'coach') {
      query.coachId = req.user._id;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    if (req.query.skillLevel) {
      query.skillLevel = req.query.skillLevel;
    }
    if (req.query.teamId) {
      query.teamId = req.query.teamId;
    }

    // Find players
    const players = await User.find(query)
      .select('-password')
      .populate('coachId', 'name email')
      .populate('teamId', 'name')
      .sort(req.query.sort || 'name')
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        players,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get players error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error fetching players',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all coaches (for admins)
 * @route   GET /api/users/coaches
 * @access  Private (Admin)
 */
const getCoaches = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find coaches
    const coaches = await User.find({ role: 'coach', isActive: true })
      .select('-password')
      .sort('name')
      .skip(skip)
      .limit(limit);

    // Get player count for each coach
    const coachesWithCounts = await Promise.all(
      coaches.map(async (coach) => {
        const playerCount = await User.countDocuments({ 
          coachId: coach._id, 
          role: 'player',
          isActive: true 
        });
        
        return {
          ...coach.toObject(),
          playerCount
        };
      })
    );

    // Get total count
    const total = await User.countDocuments({ role: 'coach', isActive: true });

    res.status(200).json({
      success: true,
      data: {
        coaches: coachesWithCounts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get coaches error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error fetching coaches',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Assign coach to player
 * @route   PUT /api/users/:userId/assign-coach
 * @access  Private (Admin or player themselves)
 */
const assignCoach = async (req, res) => {
  try {
    const { userId } = req.params;
    const { coachId } = req.body;

    // Authorization check - only admin or the player themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign coach'
      });
    }

    // Find player
    const player = await User.findById(userId);
    if (!player || player.role !== 'player') {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Verify coach exists
    const coach = await User.findById(coachId);
    if (!coach || coach.role !== 'coach') {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Update player's coach
    player.coachId = coachId;
    await player.save();

    res.status(200).json({
      success: true,
      message: 'Coach assigned successfully',
      data: {
        player: await player.populate('coachId', 'name email')
      }
    });
  } catch (error) {
    console.error('Assign coach error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error assigning coach',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Deactivate user account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
const deactivateAccount = async (req, res) => {
  try {
    // Find user and deactivate
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Deactivate account error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error deactivating account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Deactivate any user account (Admin only)
 * @route   DELETE /api/users/:userId
 * @access  Private (Admin)
 */
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user and deactivate
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Deactivate user error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error deactivating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:userId/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['player', 'coach', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be player, coach, or admin'
      });
    }

    // Find user and update role
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error updating user role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  getPlayers,
  getCoaches,
  assignCoach,
  deactivateAccount,
  deactivateUser,
  updateUserRole
};
