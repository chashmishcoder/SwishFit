const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { AppError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');
const cache = require('../utils/cache');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { 
      limit = 50, 
      page = 1,
      skillLevel, 
      season,
      sortBy = 'points' // points, rank, averageAccuracy, currentStreak
    } = req.query;

    // Generate cache key based on query parameters
    const cacheKey = cache.leaderboardKey('global') + `:${limit}:${page}:${skillLevel || 'all'}:${season || 'current'}:${sortBy}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true
      });
    }

    // Build filter query
    const filter = { isActive: true };
    
    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }
    
    if (season) {
      filter.season = season;
    }

    // Determine sort order
    let sortField;
    switch (sortBy) {
      case 'rank':
        sortField = 'rank';
        break;
      case 'averageAccuracy':
        sortField = '-averageAccuracy -points';
        break;
      case 'currentStreak':
        sortField = '-currentStreak -points';
        break;
      case 'points':
      default:
        sortField = '-points -averageAccuracy';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get leaderboard entries
    const leaderboard = await Leaderboard.find(filter)
      .populate('playerId', 'name email profileImage skillLevel position')
      .populate('teamId', 'name logo')
      .sort(sortField)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await Leaderboard.countDocuments(filter);

    // Assign display ranks based on current page
    const entries = leaderboard.map((entry, index) => ({
      ...entry,
      displayRank: skip + index + 1
    }));

    const responseData = {
      success: true,
      count: entries.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: entries
    };

    // Cache the response for 5 minutes
    cache.set(cacheKey, responseData, 300);

    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get team leaderboard
// @route   GET /api/leaderboard/team/:teamId
// @access  Private
exports.getTeamLeaderboard = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { limit = 50, sortBy = 'points' } = req.query;

    // Determine sort order
    let sortField;
    switch (sortBy) {
      case 'teamRank':
        sortField = 'teamRank';
        break;
      case 'averageAccuracy':
        sortField = '-averageAccuracy -points';
        break;
      case 'points':
      default:
        sortField = '-points -averageAccuracy';
    }

    const leaderboard = await Leaderboard.find({ 
      teamId, 
      isActive: true 
    })
      .populate('playerId', 'name email profileImage skillLevel position')
      .sort(sortField)
      .limit(parseInt(limit))
      .lean();

    // Update team ranks
    const entries = leaderboard.map((entry, index) => ({
      ...entry,
      teamRank: index + 1
    }));

    res.json({
      success: true,
      count: entries.length,
      teamId,
      data: entries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get player leaderboard entry and rank
// @route   GET /api/leaderboard/player/:playerId
// @access  Private
exports.getPlayerRank = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    // Authorization check: Player can only view own rank, others can view any
    if (req.user.role === 'player' && req.user.id !== playerId) {
      return next(new AppError('You can only view your own leaderboard rank', 403));
    }

    const entry = await Leaderboard.findOne({ playerId })
      .populate('playerId', 'name email profileImage skillLevel position height weight')
      .populate('teamId', 'name logo');

    if (!entry) {
      return next(new AppError('Leaderboard entry not found for this player', 404));
    }

    // Calculate actual rank based on points
    const rank = await Leaderboard.countDocuments({
      points: { $gt: entry.points },
      isActive: true
    }) + 1;

    // Update rank if different
    if (entry.rank !== rank) {
      entry.previousRank = entry.rank;
      entry.rank = rank;
      await entry.save();
    }

    // Get nearby players (3 above, 3 below)
    const nearbyPlayers = await Leaderboard.find({ isActive: true })
      .populate('playerId', 'name profileImage')
      .sort('-points')
      .skip(Math.max(0, rank - 4))
      .limit(7)
      .lean();

    res.json({
      success: true,
      data: {
        playerEntry: entry,
        rank,
        rankChange: entry.rankChange,
        nearbyPlayers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my leaderboard rank (logged in player)
// @route   GET /api/leaderboard/my-rank
// @access  Private (Player only)
exports.getMyRank = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Coaches and admins don't have leaderboard entries - return a special response
    if (userRole !== 'player') {
      return res.json({
        success: true,
        data: {
          playerEntry: null,
          rank: null,
          rankChange: 0,
          message: `Leaderboard rankings are only available for players. As a ${userRole}, you can view the global leaderboard to see player rankings.`,
          isNonPlayer: true
        }
      });
    }

    const entry = await Leaderboard.findOne({ playerId: userId })
      .populate('playerId', 'name email profileImage skillLevel')
      .populate('teamId', 'name logo');

    if (!entry) {
      // Create leaderboard entry if doesn't exist (only for players)
      const newEntry = await Leaderboard.create({ playerId: userId });
      return res.json({
        success: true,
        data: {
          playerEntry: newEntry,
          rank: 0,
          rankChange: 0,
          message: 'New leaderboard entry created. Complete workouts to start ranking!'
        }
      });
    }

    // Calculate actual rank
    const rank = await Leaderboard.countDocuments({
      points: { $gt: entry.points },
      isActive: true
    }) + 1;

    // Get nearby players
    const nearbyPlayers = await Leaderboard.find({ isActive: true })
      .populate('playerId', 'name profileImage')
      .sort('-points')
      .skip(Math.max(0, rank - 4))
      .limit(7)
      .lean();

    res.json({
      success: true,
      data: {
        playerEntry: entry,
        rank,
        rankChange: entry.rankChange,
        nearbyPlayers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top performers by metric
// @route   GET /api/leaderboard/top/:metric
// @access  Private
exports.getTopPerformers = async (req, res, next) => {
  try {
    const { metric } = req.params;
    const { limit = 10 } = req.query;

    // Valid metrics
    const validMetrics = [
      'points', 'averageAccuracy', 'currentStreak', 'longestStreak',
      'totalWorkoutsCompleted', 'totalCaloriesBurned', 'totalTrainingHours'
    ];

    if (!validMetrics.includes(metric)) {
      return next(new AppError(`Invalid metric. Valid metrics: ${validMetrics.join(', ')}`, 400));
    }

    const sortField = `-${metric}`;

    const topPerformers = await Leaderboard.find({ isActive: true })
      .populate('playerId', 'name email profileImage skillLevel position')
      .sort(sortField)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      metric,
      count: topPerformers.length,
      data: topPerformers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update all leaderboard rankings
// @route   POST /api/leaderboard/update-rankings
// @access  Private (Admin only)
exports.updateAllRankings = async (req, res, next) => {
  try {
    // Get all active leaderboard entries sorted by points
    const entries = await Leaderboard.find({ isActive: true })
      .sort('-points -averageAccuracy')
      .lean();

    let updated = 0;

    // Update ranks in bulk
    const bulkOps = entries.map((entry, index) => {
      const newRank = index + 1;
      return {
        updateOne: {
          filter: { _id: entry._id },
          update: {
            $set: {
              previousRank: entry.rank,
              rank: newRank
            }
          }
        }
      };
    });

    if (bulkOps.length > 0) {
      const result = await Leaderboard.bulkWrite(bulkOps);
      updated = result.modifiedCount;
    }

    res.json({
      success: true,
      message: `Rankings updated for ${updated} players`,
      totalEntries: entries.length,
      updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard statistics
// @route   GET /api/leaderboard/stats
// @access  Private
exports.getLeaderboardStats = async (req, res, next) => {
  try {
    // Get overall statistics using aggregation
    const stats = await Leaderboard.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalPlayers: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          avgPoints: { $avg: '$points' },
          avgAccuracy: { $avg: '$averageAccuracy' },
          totalWorkouts: { $sum: '$totalWorkoutsCompleted' },
          totalCalories: { $sum: '$totalCaloriesBurned' },
          totalTrainingHours: { $sum: '$totalTrainingHours' },
          maxStreak: { $max: '$currentStreak' },
          avgStreak: { $avg: '$currentStreak' }
        }
      }
    ]);

    // Get skill level distribution
    const skillDistribution = await Leaderboard.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$skillLevel',
          count: { $sum: 1 },
          avgPoints: { $avg: '$points' },
          avgAccuracy: { $avg: '$averageAccuracy' }
        }
      },
      { $sort: { avgPoints: -1 } }
    ]);

    // Get top 3 players
    const topThree = await Leaderboard.find({ isActive: true })
      .populate('playerId', 'name profileImage skillLevel')
      .sort('-points')
      .limit(3)
      .lean();

    // Get recent achievements (players who earned achievements recently)
    const recentAchievements = await Leaderboard.find({
      isActive: true,
      'achievements.0': { $exists: true }
    })
      .populate('playerId', 'name profileImage')
      .sort('-achievements.earnedDate')
      .limit(5)
      .lean()
      .then(entries => {
        return entries.map(entry => {
          const latestAchievement = entry.achievements.sort((a, b) => 
            new Date(b.earnedDate) - new Date(a.earnedDate)
          )[0];
          return {
            player: entry.playerId,
            achievement: latestAchievement
          };
        });
      });

    res.json({
      success: true,
      data: {
        overall: stats[0] || {},
        skillDistribution,
        topThree,
        recentAchievements
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Award achievement to player
// @route   POST /api/leaderboard/achievement/:playerId
// @access  Private (Admin/Coach)
exports.awardAchievement = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { achievementId, title, description, category, icon, points = 0 } = req.body;

    if (!achievementId || !title) {
      return next(new AppError('Achievement ID and title are required', 400));
    }

    const leaderboard = await Leaderboard.findOne({ playerId });

    if (!leaderboard) {
      return next(new AppError('Leaderboard entry not found', 404));
    }

    // Check if achievement already exists
    const existingAchievement = leaderboard.achievements.find(
      a => a.achievementId === achievementId
    );

    if (existingAchievement) {
      return next(new AppError('Player already has this achievement', 400));
    }

    // Add achievement
    await leaderboard.addAchievement({
      achievementId,
      title,
      description,
      category: category || 'milestone',
      icon,
      points: parseInt(points)
    });

    res.json({
      success: true,
      message: 'Achievement awarded successfully',
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset weekly points for all players
// @route   POST /api/leaderboard/reset-weekly
// @access  Private (Admin only)
exports.resetWeeklyPoints = async (req, res, next) => {
  try {
    const result = await Leaderboard.updateMany(
      { isActive: true },
      { $set: { weeklyPoints: 0 } }
    );

    res.json({
      success: true,
      message: `Weekly points reset for ${result.modifiedCount} players`,
      affected: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset monthly points for all players
// @route   POST /api/leaderboard/reset-monthly
// @access  Private (Admin only)
exports.resetMonthlyPoints = async (req, res, next) => {
  try {
    const result = await Leaderboard.updateMany(
      { isActive: true },
      { $set: { monthlyPoints: 0 } }
    );

    res.json({
      success: true,
      message: `Monthly points reset for ${result.modifiedCount} players`,
      affected: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard history (weekly/monthly)
// @route   GET /api/leaderboard/history/:period
// @access  Private
exports.getLeaderboardHistory = async (req, res, next) => {
  try {
    const { period } = req.params; // 'weekly' or 'monthly'
    const { limit = 10 } = req.query;

    if (!['weekly', 'monthly'].includes(period)) {
      return next(new AppError('Period must be weekly or monthly', 400));
    }

    const pointsField = period === 'weekly' ? 'weeklyPoints' : 'monthlyPoints';
    const sortField = `-${pointsField}`;

    const leaderboard = await Leaderboard.find({ 
      isActive: true,
      [pointsField]: { $gt: 0 }
    })
      .populate('playerId', 'name email profileImage skillLevel')
      .sort(sortField)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      period,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill level leaderboard
// @route   GET /api/leaderboard/skill/:skillLevel
// @access  Private
exports.getSkillLevelLeaderboard = async (req, res, next) => {
  try {
    const { skillLevel } = req.params;
    const { limit = 50 } = req.query;

    const validSkillLevels = ['beginner', 'intermediate', 'advanced', 'elite'];
    
    if (!validSkillLevels.includes(skillLevel)) {
      return next(new AppError(`Invalid skill level. Must be: ${validSkillLevels.join(', ')}`, 400));
    }

    const leaderboard = await Leaderboard.find({ 
      skillLevel, 
      isActive: true 
    })
      .populate('playerId', 'name email profileImage position')
      .sort('-points -averageAccuracy')
      .limit(parseInt(limit))
      .lean();

    // Assign ranks within skill level
    const entries = leaderboard.map((entry, index) => ({
      ...entry,
      skillRank: index + 1
    }));

    res.json({
      success: true,
      skillLevel,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare two players
// @route   GET /api/leaderboard/compare/:playerId1/:playerId2
// @access  Private
exports.comparePlayers = async (req, res, next) => {
  try {
    const { playerId1, playerId2 } = req.params;

    const [player1, player2] = await Promise.all([
      Leaderboard.findOne({ playerId: playerId1 })
        .populate('playerId', 'name email profileImage skillLevel position'),
      Leaderboard.findOne({ playerId: playerId2 })
        .populate('playerId', 'name email profileImage skillLevel position')
    ]);

    if (!player1 || !player2) {
      return next(new AppError('One or both players not found in leaderboard', 404));
    }

    // Calculate differences
    const comparison = {
      player1: player1,
      player2: player2,
      differences: {
        pointsDiff: player1.points - player2.points,
        rankDiff: player2.rank - player1.rank, // Lower rank is better
        accuracyDiff: player1.averageAccuracy - player2.averageAccuracy,
        workoutsDiff: player1.totalWorkoutsCompleted - player2.totalWorkoutsCompleted,
        streakDiff: player1.currentStreak - player2.currentStreak,
        caloriesDiff: player1.totalCaloriesBurned - player2.totalCaloriesBurned
      },
      winner: {
        points: player1.points > player2.points ? 'player1' : 'player2',
        rank: player1.rank < player2.rank ? 'player1' : 'player2',
        accuracy: player1.averageAccuracy > player2.averageAccuracy ? 'player1' : 'player2',
        workouts: player1.totalWorkoutsCompleted > player2.totalWorkoutsCompleted ? 'player1' : 'player2',
        streak: player1.currentStreak > player2.currentStreak ? 'player1' : 'player2'
      }
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};
