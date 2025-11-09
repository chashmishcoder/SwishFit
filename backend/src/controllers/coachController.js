const User = require('../models/User');
const Progress = require('../models/Progress');
const Workout = require('../models/Workout');
const Leaderboard = require('../models/Leaderboard');
const { AppError } = require('../middleware/errorHandler');
const mongoose = require('mongoose');
const cache = require('../utils/cache');

// @desc    Get all players assigned to coach
// @route   GET /api/coach/players
// @access  Private (Coach only)
exports.getMyPlayers = async (req, res, next) => {
  try {
    const coachId = req.user.id;
    const { skillLevel, position, sortBy = 'name', limit = 100, page = 1 } = req.query;

    // Build filter query
    const filter = {
      role: 'player',
      coachId: coachId
    };

    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    if (position) {
      filter.position = position;
    }

    // Determine sort order
    let sortField;
    switch (sortBy) {
      case 'name':
        sortField = 'name';
        break;
      case 'skillLevel':
        sortField = 'skillLevel name';
        break;
      case 'recentActivity':
        sortField = '-updatedAt';
        break;
      default:
        sortField = 'name';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get players
    const players = await User.find(filter)
      .select('-password')
      .sort(sortField)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await User.countDocuments(filter);

    // Enrich with leaderboard and recent progress data
    const enrichedPlayers = await Promise.all(
      players.map(async (player) => {
        // Get leaderboard stats
        const leaderboardStats = await Leaderboard.findOne({ playerId: player._id })
          .select('rank points currentStreak averageAccuracy totalWorkoutsCompleted')
          .lean();

        // Get recent progress count (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentProgressCount = await Progress.countDocuments({
          playerId: player._id,
          date: { $gte: sevenDaysAgo },
          isActive: true
        });

        // Get last workout date
        const lastProgress = await Progress.findOne({
          playerId: player._id,
          isActive: true
        })
          .sort('-date')
          .select('date')
          .lean();

        return {
          ...player,
          leaderboardStats: leaderboardStats || {},
          recentProgressCount,
          lastWorkoutDate: lastProgress?.date || null
        };
      })
    );

    res.json({
      success: true,
      count: enrichedPlayers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: enrichedPlayers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed player overview
// @route   GET /api/coach/players/:playerId
// @access  Private (Coach only)
exports.getPlayerOverview = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const coachId = req.user.id;

    // Verify player is assigned to this coach
    const player = await User.findById(playerId).select('-password');

    if (!player) {
      return next(new AppError('Player not found', 404));
    }

    if (player.coachId?.toString() !== coachId) {
      return next(new AppError('This player is not assigned to you', 403));
    }

    // Get recent progress (last 10 entries)
    const recentProgress = await Progress.find({ 
      playerId,
      isActive: true 
    })
      .sort('-date')
      .limit(10)
      .populate('workoutId', 'title category skillLevel duration')
      .lean();

    // Get assigned workouts
    const assignedWorkouts = await Workout.find({ 
      assignedTo: playerId,
      isActive: true 
    })
      .sort('-createdAt')
      .lean();

    // Get leaderboard stats
    const leaderboardStats = await Leaderboard.findOne({ playerId })
      .lean();

    // Calculate performance summary (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const performanceSummary = await Progress.aggregate([
      {
        $match: {
          playerId: new mongoose.Types.ObjectId(playerId),
          date: { $gte: thirtyDaysAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          completedWorkouts: { $sum: { $cond: ['$completed', 1, 0] } },
          avgAccuracy: { $avg: '$overallAccuracy' },
          totalCalories: { $sum: '$caloriesBurned' },
          totalTime: { $sum: '$completionTime' }
        }
      }
    ]);

    // Get workout completion by category
    const categoryBreakdown = await Progress.aggregate([
      {
        $match: {
          playerId: new mongoose.Types.ObjectId(playerId),
          completed: true,
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'workouts',
          localField: 'workoutId',
          foreignField: '_id',
          as: 'workout'
        }
      },
      { $unwind: '$workout' },
      {
        $group: {
          _id: '$workout.category',
          count: { $sum: 1 },
          avgAccuracy: { $avg: '$overallAccuracy' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        player,
        recentProgress,
        assignedWorkouts,
        leaderboardStats,
        performanceSummary: performanceSummary[0] || {
          totalWorkouts: 0,
          completedWorkouts: 0,
          avgAccuracy: 0,
          totalCalories: 0,
          totalTime: 0
        },
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get player progress details
// @route   GET /api/coach/players/:playerId/progress
// @access  Private (Coach only)
exports.getPlayerProgress = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const coachId = req.user.id;
    const { startDate, endDate, workoutId, limit = 50, page = 1 } = req.query;

    // Verify player is assigned to this coach
    const player = await User.findById(playerId);

    if (!player) {
      return next(new AppError('Player not found', 404));
    }

    if (player.coachId?.toString() !== coachId) {
      return next(new AppError('This player is not assigned to you', 403));
    }

    // Build filter
    const filter = { playerId, isActive: true };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (workoutId) {
      filter.workoutId = workoutId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get progress
    const progress = await Progress.find(filter)
      .populate('workoutId', 'title category skillLevel duration')
      .sort('-date')
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await Progress.countDocuments(filter);

    res.json({
      success: true,
      count: progress.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add feedback to player's progress
// @route   PUT /api/coach/feedback/:progressId
// @access  Private (Coach only)
exports.addFeedback = async (req, res, next) => {
  try {
    const { progressId } = req.params;
    const { coachFeedback } = req.body;
    const coachId = req.user.id;

    if (!coachFeedback || coachFeedback.trim() === '') {
      return next(new AppError('Feedback cannot be empty', 400));
    }

    // Get progress entry
    const progress = await Progress.findById(progressId)
      .populate('playerId', 'coachId name email');

    if (!progress) {
      return next(new AppError('Progress entry not found', 404));
    }

    // Verify player is assigned to this coach
    if (progress.playerId.coachId?.toString() !== coachId) {
      return next(new AppError('You can only provide feedback to your assigned players', 403));
    }

    // Add feedback using model method
    await progress.addCoachFeedback(coachId, coachFeedback);

    await progress.populate('workoutId', 'title category');

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign workout to players
// @route   POST /api/coach/assign-workout
// @access  Private (Coach only)
exports.assignWorkout = async (req, res, next) => {
  try {
    const { workoutId, playerIds } = req.body;
    const coachId = req.user.id;

    if (!workoutId || !playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return next(new AppError('Workout ID and player IDs array are required', 400));
    }

    // Verify workout exists and coach has access
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }

    // Check if coach created the workout or if it's public
    if (workout.createdBy.toString() !== coachId && !workout.isPublic) {
      return next(new AppError('You can only assign your own workouts or public workouts', 403));
    }

    // Verify all players are assigned to this coach
    const players = await User.find({
      _id: { $in: playerIds },
      role: 'player'
    });

    if (players.length !== playerIds.length) {
      return next(new AppError('Some player IDs are invalid', 400));
    }

    const unauthorizedPlayers = players.filter(
      player => player.coachId?.toString() !== coachId
    );

    if (unauthorizedPlayers.length > 0) {
      return next(new AppError('You can only assign workouts to your own players', 403));
    }

    // Assign workout to players
    await workout.assignToPlayers(playerIds);

    // Update totalWorkoutsAssigned in leaderboard for each player
    await Promise.all(
      playerIds.map(async (playerId) => {
        const leaderboard = await Leaderboard.findOne({ playerId });
        if (leaderboard) {
          leaderboard.totalWorkoutsAssigned += 1;
          await leaderboard.save();
        }
      })
    );

    res.json({
      success: true,
      message: `Workout assigned to ${playerIds.length} player(s)`,
      data: {
        workout: {
          id: workout._id,
          title: workout.title,
          category: workout.category
        },
        assignedTo: playerIds.length,
        playerNames: players.map(p => p.name)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unassign workout from players
// @route   POST /api/coach/unassign-workout
// @access  Private (Coach only)
exports.unassignWorkout = async (req, res, next) => {
  try {
    const { workoutId, playerIds } = req.body;
    const coachId = req.user.id;

    if (!workoutId || !playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return next(new AppError('Workout ID and player IDs array are required', 400));
    }

    // Verify workout exists
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }

    // Check if coach created the workout
    if (workout.createdBy.toString() !== coachId) {
      return next(new AppError('You can only unassign your own workouts', 403));
    }

    // Verify all players are assigned to this coach
    const players = await User.find({
      _id: { $in: playerIds },
      role: 'player',
      coachId: coachId
    });

    if (players.length !== playerIds.length) {
      return next(new AppError('Some players are not assigned to you', 403));
    }

    // Unassign workout from players
    await workout.unassignFromPlayers(playerIds);

    res.json({
      success: true,
      message: `Workout unassigned from ${playerIds.length} player(s)`,
      data: {
        workout: {
          id: workout._id,
          title: workout.title
        },
        unassignedFrom: playerIds.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get coach dashboard statistics
// @route   GET /api/coach/dashboard
// @access  Private (Coach only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const coachId = req.user.id;

    // Check cache first
    const cacheKey = cache.coachStatsKey(coachId);
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ ...cachedData, cached: true });
    }

    // Get total players
    const totalPlayers = await User.countDocuments({
      role: 'player',
      coachId: coachId
    });

    // Get total workouts created by coach
    const totalWorkouts = await Workout.countDocuments({
      createdBy: coachId,
      isActive: true
    });

    // Get player IDs
    const players = await User.find({
      role: 'player',
      coachId: coachId
    }).select('_id');

    const playerIds = players.map(p => p._id);

    // Get total progress entries from players (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalProgress = await Progress.countDocuments({
      playerId: { $in: playerIds },
      date: { $gte: thirtyDaysAgo },
      isActive: true
    });

    const completedProgress = await Progress.countDocuments({
      playerId: { $in: playerIds },
      date: { $gte: thirtyDaysAgo },
      completed: true,
      isActive: true
    });

    // Get average accuracy of all players
    const accuracyStats = await Progress.aggregate([
      {
        $match: {
          playerId: { $in: playerIds },
          date: { $gte: thirtyDaysAgo },
          completed: true,
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$overallAccuracy' }
        }
      }
    ]);

    // Get top performing players (by points)
    const topPlayers = await Leaderboard.find({
      playerId: { $in: playerIds },
      isActive: true
    })
      .populate('playerId', 'name profileImage skillLevel')
      .sort('-points')
      .limit(5)
      .lean();

    // Get players needing attention (no activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activePlayerIds = await Progress.distinct('playerId', {
      playerId: { $in: playerIds },
      date: { $gte: sevenDaysAgo },
      isActive: true
    });

    const inactivePlayers = await User.find({
      _id: { $in: playerIds, $nin: activePlayerIds }
    })
      .select('name email skillLevel profileImage')
      .limit(5)
      .lean();

    // Get recent feedback provided
    const recentFeedback = await Progress.find({
      coachId: coachId,
      coachFeedback: { $exists: true, $ne: '' }
    })
      .populate('playerId', 'name profileImage')
      .populate('workoutId', 'title')
      .sort('-feedbackDate')
      .limit(5)
      .select('coachFeedback feedbackDate playerId workoutId')
      .lean();

    const responseData = {
      success: true,
      data: {
        overview: {
          totalPlayers,
          totalWorkouts,
          totalProgress,
          completedProgress,
          completionRate: totalProgress > 0 
            ? Math.round((completedProgress / totalProgress) * 100) 
            : 0,
          avgAccuracy: accuracyStats[0]?.avgAccuracy 
            ? Math.round(accuracyStats[0].avgAccuracy) 
            : 0
        },
        topPlayers,
        inactivePlayers,
        recentFeedback
      }
    };

    // Cache the response for 3 minutes (coach stats change frequently)
    cache.set(cacheKey, responseData, 180);

    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get player comparison report
// @route   GET /api/coach/compare
// @access  Private (Coach only)
exports.compareMyPlayers = async (req, res, next) => {
  try {
    const coachId = req.user.id;
    const { metric = 'points', limit = 10 } = req.query;

    // Valid metrics
    const validMetrics = [
      'points', 'averageAccuracy', 'currentStreak', 
      'totalWorkoutsCompleted', 'completionRate'
    ];

    if (!validMetrics.includes(metric)) {
      return next(new AppError(`Invalid metric. Valid: ${validMetrics.join(', ')}`, 400));
    }

    // Get player IDs
    const players = await User.find({
      role: 'player',
      coachId: coachId
    }).select('_id');

    const playerIds = players.map(p => p._id);

    // Get leaderboard stats for comparison
    const sortField = `-${metric}`;

    const comparison = await Leaderboard.find({
      playerId: { $in: playerIds },
      isActive: true
    })
      .populate('playerId', 'name email profileImage skillLevel position')
      .sort(sortField)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      metric,
      count: comparison.length,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk assign workout to all players
// @route   POST /api/coach/assign-workout-all
// @access  Private (Coach only)
exports.assignWorkoutToAll = async (req, res, next) => {
  try {
    const { workoutId, skillLevel } = req.body;
    const coachId = req.user.id;

    if (!workoutId) {
      return next(new AppError('Workout ID is required', 400));
    }

    // Verify workout exists and coach has access
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }

    if (workout.createdBy.toString() !== coachId && !workout.isPublic) {
      return next(new AppError('You can only assign your own workouts or public workouts', 403));
    }

    // Get all players assigned to coach (optionally filter by skill level)
    const filter = {
      role: 'player',
      coachId: coachId
    };

    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }

    const players = await User.find(filter).select('_id name');

    if (players.length === 0) {
      const errorMessage = skillLevel 
        ? `No players found with skill level "${skillLevel}". Please assign players to your account first or try without skill level filter.`
        : 'No players assigned to you yet. Please ask an admin to assign players to your coaching account first.';
      return next(new AppError(errorMessage, 404));
    }

    const playerIds = players.map(p => p._id);

    // Assign workout to all players
    await workout.assignToPlayers(playerIds);

    // Update leaderboard
    await Promise.all(
      playerIds.map(async (playerId) => {
        const leaderboard = await Leaderboard.findOne({ playerId });
        if (leaderboard) {
          leaderboard.totalWorkoutsAssigned += 1;
          await leaderboard.save();
        }
      })
    );

    res.json({
      success: true,
      message: `Workout assigned to ${players.length} player(s)`,
      data: {
        workout: {
          id: workout._id,
          title: workout.title,
          category: workout.category
        },
        assignedTo: players.length,
        skillLevelFilter: skillLevel || 'all'
      }
    });
  } catch (error) {
    next(error);
  }
};
