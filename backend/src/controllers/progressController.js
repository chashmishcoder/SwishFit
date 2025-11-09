const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const Leaderboard = require('../models/Leaderboard');
const Workout = require('../models/Workout');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const { AppError } = require('../middleware/errorHandler');
const cache = require('../utils/cache');

// @desc    Log workout progress
// @route   POST /api/progress
// @access  Private (Player only)
exports.logProgress = async (req, res, next) => {
  try {
    const playerId = req.user.id;
    const { workoutId, exerciseResults, playerNotes, rating, enjoymentLevel, difficultyFeedback } = req.body;

    // Validate workout exists
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }

    // Check if player is authorized to log this workout
    const isAssignedOrPublic = workout.isPublic || 
                                workout.assignedTo.some(id => id.toString() === playerId);
    
    if (!isAssignedOrPublic) {
      return next(new AppError('You are not assigned to this workout', 403));
    }

    // Create progress entry with auto-calculated fields
    const progressData = {
      playerId,
      workoutId,
      workoutTitle: workout.title,
      exerciseResults: exerciseResults || [],
      playerNotes,
      rating,
      enjoymentLevel,
      difficultyFeedback,
      startTime: req.body.startTime || new Date(),
      endTime: req.body.endTime,
      completed: req.body.completed || false
    };

    const progress = await Progress.create(progressData);

    // Update leaderboard statistics
    if (progress.completed) {
      await updateLeaderboardStats(playerId, progress);
      
      // Invalidate related caches after leaderboard update
      cache.invalidateRelated('progress', playerId);
      
      // Increment workout completion count
      await workout.incrementCompletionCount();
      
      // Update workout rating if provided
      if (rating) {
        await workout.updateRating(rating);
      }
    }

    // Populate workout details before returning
    await progress.populate('workoutId', 'title category skillLevel duration');

    res.status(201).json({
      success: true,
      message: 'Progress logged successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get player progress history
// @route   GET /api/progress/player/:playerId
// @access  Private (Player can view own, Coach can view assigned players)
exports.getPlayerProgress = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { startDate, endDate, workoutId, completed, limit = 50, page = 1 } = req.query;

    // Authorization check: Player can only view own progress, Coach can view assigned players
    if (req.user.role === 'player' && req.user.id !== playerId) {
      return next(new AppError('You can only view your own progress', 403));
    }

    if (req.user.role === 'coach') {
      const player = await require('../models/User').findById(playerId);
      if (!player || player.coachId?.toString() !== req.user.id) {
        return next(new AppError('You can only view progress of your assigned players', 403));
      }
    }

    // Build filter query
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

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get progress entries
    const progress = await Progress.find(filter)
      .populate('workoutId', 'title category skillLevel duration')
      .populate('coachId', 'name email')
      .sort('-date')
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
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

// @desc    Get my progress (logged in player)
// @route   GET /api/progress/my-progress
// @access  Private (Player only)
exports.getMyProgress = async (req, res, next) => {
  try {
    const playerId = req.user.id;
    const { startDate, endDate, workoutId, completed, limit = 50 } = req.query;

    const filter = { playerId, isActive: true };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (workoutId) filter.workoutId = workoutId;
    if (completed !== undefined) filter.completed = completed === 'true';

    const progress = await Progress.find(filter)
      .populate('workoutId', 'title category skillLevel duration caloriesBurn')
      .populate('coachId', 'name email')
      .sort('-date')
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single progress entry
// @route   GET /api/progress/:id
// @access  Private
exports.getProgressById = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('playerId', 'name email skillLevel')
      .populate('workoutId', 'title category skillLevel exercises')
      .populate('coachId', 'name email');

    if (!progress) {
      return next(new AppError('Progress entry not found', 404));
    }

    // Authorization check
    if (req.user.role === 'player' && progress.playerId._id.toString() !== req.user.id) {
      return next(new AppError('You can only view your own progress', 403));
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress entry
// @route   PUT /api/progress/:id
// @access  Private (Player can update own, Coach can add feedback)
exports.updateProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return next(new AppError('Progress entry not found', 404));
    }

    // Authorization check
    const isOwner = progress.playerId.toString() === req.user.id;
    const isCoach = req.user.role === 'coach';

    if (!isOwner && !isCoach) {
      return next(new AppError('Not authorized to update this progress', 403));
    }

    // Players can update their own data
    if (isOwner && req.user.role === 'player') {
      const allowedUpdates = [
        'exerciseResults', 'playerNotes', 'rating', 'enjoymentLevel', 
        'difficultyFeedback', 'endTime', 'completed'
      ];
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          progress[field] = req.body[field];
        }
      });
    }

    // Coaches can only add feedback
    if (isCoach) {
      if (req.body.coachFeedback) {
        progress.coachFeedback = req.body.coachFeedback;
        progress.coachId = req.user.id;
        progress.feedbackDate = new Date();
      }
    }

    const updatedProgress = await progress.save();

    // Update leaderboard if workout was just completed
    if (req.body.completed && !progress.completed) {
      await updateLeaderboardStats(progress.playerId, updatedProgress);
      
      // Invalidate related caches after leaderboard update
      cache.invalidateRelated('progress', progress.playerId);
    }

    await updatedProgress.populate('workoutId', 'title category');

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: updatedProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete progress entry
// @route   DELETE /api/progress/:id
// @access  Private (Player can delete own)
exports.deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return next(new AppError('Progress entry not found', 404));
    }

    // Authorization check: Only owner can delete
    if (progress.playerId.toString() !== req.user.id) {
      return next(new AppError('You can only delete your own progress', 403));
    }

    // Soft delete: Mark as inactive
    progress.isActive = false;
    await progress.save();

    res.json({
      success: true,
      message: 'Progress entry deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance analytics for a player
// @route   GET /api/progress/analytics/:playerId
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    // Authorization check
    if (req.user.role === 'player' && req.user.id !== playerId) {
      return next(new AppError('You can only view your own analytics', 403));
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get progress data
    const progressData = await Progress.find({ 
      playerId, 
      isActive: true,
      date: { $gte: startDate, $lte: endDate }
    })
      .sort('-date')
      .populate('workoutId', 'title category');

    // Calculate metrics
    const metrics = calculateMetrics(progressData);

    // Get comparison with previous period
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(days));
    
    const previousProgressData = await Progress.find({
      playerId,
      isActive: true,
      date: { $gte: previousStartDate, $lt: startDate }
    });

    const previousMetrics = calculateMetrics(previousProgressData);
    const trends = calculateTrends(metrics, previousMetrics);

    // Get leaderboard stats
    const leaderboardStats = await Leaderboard.findOne({ playerId })
      .select('rank points currentStreak averageAccuracy totalWorkoutsCompleted');

    res.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate,
          days: parseInt(days)
        },
        metrics,
        trends,
        leaderboardStats,
        recentProgress: progressData.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout statistics (completion trends, etc.)
// @route   GET /api/progress/stats/:playerId
// @access  Private
exports.getWorkoutStats = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    // Authorization check
    if (req.user.role === 'player' && req.user.id !== playerId) {
      return next(new AppError('You can only view your own statistics', 403));
    }

    // Get overall stats using model static method
    const overallStats = await Progress.getPlayerStats(playerId);
    
    // If no stats found, return default values
    if (!overallStats) {
      return res.json({
        success: true,
        data: {
          overallStats: {
            totalWorkouts: 0,
            completedWorkouts: 0,
            totalCalories: 0,
            totalTime: 0,
            avgAccuracy: 0,
            totalShotsMade: 0,
            totalShotsAttempted: 0,
            avgRating: 0
          },
          completionTrends: [],
          categoryStats: []
        }
      });
    }

    // Get completion trends (last 30 days)
    const completionTrends = await Progress.getCompletionTrends(playerId, 30);

    // Get category breakdown
    const categoryStats = await Progress.aggregate([
      { 
        $match: { 
          playerId: new mongoose.Types.ObjectId(playerId),
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
          avgAccuracy: { $avg: '$overallAccuracy' },
          totalCalories: { $sum: '$caloriesBurned' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overallStats,
        completionTrends,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Update leaderboard statistics after workout completion
 */
const updateLeaderboardStats = async (playerId, progressData) => {
  try {
    let leaderboard = await Leaderboard.findOne({ playerId });

    // Create leaderboard entry if doesn't exist
    if (!leaderboard) {
      leaderboard = await Leaderboard.create({ playerId });
    }

    // Use the model's built-in method to update stats
    await leaderboard.updateAfterWorkout(progressData);

    return leaderboard;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

/**
 * Calculate performance metrics from progress data
 */
const calculateMetrics = (progressData) => {
  if (!progressData || progressData.length === 0) {
    return {
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0,
      averageAccuracy: 0,
      totalCaloriesBurned: 0,
      totalTrainingTime: 0,
      averageWorkoutDuration: 0,
      totalShotsMade: 0,
      totalShotsAttempted: 0,
      improvementTrend: 'insufficient-data'
    };
  }

  const completed = progressData.filter(p => p.completed);
  const totalWorkouts = progressData.length;
  const completedWorkouts = completed.length;

  // Calculate averages
  const totalAccuracy = completed.reduce((sum, p) => sum + (p.overallAccuracy || 0), 0);
  const averageAccuracy = completedWorkouts > 0 ? Math.round(totalAccuracy / completedWorkouts) : 0;

  const totalCaloriesBurned = progressData.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
  const totalTrainingTime = progressData.reduce((sum, p) => sum + (p.completionTime || 0), 0);
  
  const averageWorkoutDuration = totalWorkouts > 0 
    ? Math.round(totalTrainingTime / totalWorkouts) 
    : 0;

  const totalShotsMade = progressData.reduce((sum, p) => sum + (p.totalShotsMade || 0), 0);
  const totalShotsAttempted = progressData.reduce((sum, p) => sum + (p.totalShotsAttempted || 0), 0);

  // Determine improvement trend by comparing first half vs second half
  const midpoint = Math.floor(completedWorkouts / 2);
  const firstHalf = completed.slice(0, midpoint);
  const secondHalf = completed.slice(midpoint);

  let improvementTrend = 'stable';
  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstHalfAvg = firstHalf.reduce((sum, p) => sum + (p.overallAccuracy || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, p) => sum + (p.overallAccuracy || 0), 0) / secondHalf.length;
    
    const improvement = secondHalfAvg - firstHalfAvg;
    if (improvement > 5) improvementTrend = 'improving';
    else if (improvement < -5) improvementTrend = 'declining';
    else improvementTrend = 'stable';
  }

  return {
    totalWorkouts,
    completedWorkouts,
    completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0,
    averageAccuracy,
    totalCaloriesBurned,
    totalTrainingTime,
    averageWorkoutDuration,
    totalShotsMade,
    totalShotsAttempted,
    improvementTrend
  };
};

/**
 * Calculate trends by comparing current vs previous metrics
 */
const calculateTrends = (currentMetrics, previousMetrics) => {
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    workoutCountChange: calculateChange(
      currentMetrics.totalWorkouts, 
      previousMetrics.totalWorkouts
    ),
    accuracyChange: calculateChange(
      currentMetrics.averageAccuracy,
      previousMetrics.averageAccuracy
    ),
    completionRateChange: calculateChange(
      currentMetrics.completionRate,
      previousMetrics.completionRate
    ),
    caloriesChange: calculateChange(
      currentMetrics.totalCaloriesBurned,
      previousMetrics.totalCaloriesBurned
    )
  };
};

// @desc    AI Performance Analysis - Analyze player's performance using Gemini AI
// @route   POST /api/progress/analyze
// @access  Private (Player, Coach, Admin)
exports.analyzePerformance = async (req, res, next) => {
  try {
    const { playerId, days = 30 } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Determine which player's data to analyze
    let targetPlayerId = playerId;
    
    // If no playerId specified or player role, analyze own data
    if (!playerId || requesterRole === 'player') {
      targetPlayerId = requesterId;
    }

    // If coach/admin analyzing another player, verify access
    if (playerId && playerId !== requesterId) {
      if (requesterRole === 'coach') {
        // Verify player is assigned to this coach
        const player = await User.findById(playerId);
        if (!player || player.assignedCoach?.toString() !== requesterId) {
          return next(new AppError('You can only analyze your assigned players', 403));
        }
      } else if (requesterRole !== 'admin') {
        return next(new AppError('Not authorized to analyze other players', 403));
      }
    }

    // Get player profile
    const player = await User.findById(targetPlayerId)
      .select('name email age skillLevel position preferredTrainingTime goals');
    
    if (!player) {
      return next(new AppError('Player not found', 404));
    }

    // Get leaderboard stats
    const leaderboardStats = await Leaderboard.findOne({ playerId: targetPlayerId })
      .select('totalPoints weeklyPoints monthlyPoints rank totalWorkoutsCompleted averageAccuracy totalWorkoutsAssigned');

    // Get workout history (last N days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const workoutHistory = await Progress.find({
      playerId: targetPlayerId,
      createdAt: { $gte: startDate },
      completed: true
    })
      .populate('workoutId', 'title category skillLevel')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Calculate progress metrics
    const progressMetrics = await calculateProgressMetrics(targetPlayerId, days);

    // Prepare data for Gemini analysis
    const performanceData = {
      playerProfile: {
        name: player.name,
        age: player.age,
        skillLevel: player.skillLevel,
        position: player.position,
        goals: player.goals,
        leaderboardRank: leaderboardStats?.rank || 'N/A',
        totalPoints: leaderboardStats?.totalPoints || 0
      },
      workoutHistory: workoutHistory.map(w => ({
        date: w.createdAt,
        workout: w.workoutTitle,
        category: w.workoutId?.category,
        duration: w.duration,
        caloriesBurned: w.caloriesBurned,
        rating: w.rating,
        enjoymentLevel: w.enjoymentLevel,
        difficultyFeedback: w.difficultyFeedback,
        exerciseResults: w.exerciseResults.map(e => ({
          exercise: e.exerciseName,
          shotsMade: e.shotsMade,
          shotsAttempted: e.shotsAttempted,
          accuracy: e.accuracy,
          reps: e.repsCompleted
        }))
      })),
      progressMetrics: {
        totalWorkouts: progressMetrics.totalWorkouts,
        completionRate: progressMetrics.completionRate,
        averageAccuracy: progressMetrics.averageAccuracy,
        totalCaloriesBurned: progressMetrics.totalCaloriesBurned,
        averageDuration: progressMetrics.averageDuration,
        averageRating: progressMetrics.averageRating,
        mostCommonCategory: progressMetrics.categoryBreakdown?.[0]?.category || 'N/A',
        leaderboardStats: {
          totalPoints: leaderboardStats?.totalPoints || 0,
          weeklyPoints: leaderboardStats?.weeklyPoints || 0,
          monthlyPoints: leaderboardStats?.monthlyPoints || 0,
          rank: leaderboardStats?.rank || 'N/A',
          totalWorkoutsCompleted: leaderboardStats?.totalWorkoutsCompleted || 0,
          averageAccuracy: leaderboardStats?.averageAccuracy || 0
        }
      }
    };

    // Check if Gemini API is configured
    if (!geminiService.isConfigured()) {
      return res.status(200).json({
        success: false,
        error: 'AI analysis service not configured',
        fallbackAnalysis: {
          message: 'Gemini AI is not configured. Add GEMINI_API_KEY to environment variables.',
          basicInsights: {
            totalWorkouts: progressMetrics.totalWorkouts,
            completionRate: `${progressMetrics.completionRate.toFixed(1)}%`,
            averageAccuracy: `${progressMetrics.averageAccuracy.toFixed(1)}%`,
            trend: progressMetrics.totalWorkouts > 10 ? 'Active' : 'Needs improvement'
          }
        }
      });
    }

    // Call Gemini AI for analysis
    const aiAnalysis = await geminiService.analyzePerformance(performanceData);

    if (!aiAnalysis.success) {
      return res.status(200).json({
        success: false,
        error: aiAnalysis.error,
        fallbackAnalysis: {
          message: 'AI analysis failed. Here are basic metrics.',
          basicInsights: {
            totalWorkouts: progressMetrics.totalWorkouts,
            completionRate: `${progressMetrics.completionRate.toFixed(1)}%`,
            averageAccuracy: `${progressMetrics.averageAccuracy.toFixed(1)}%`,
            recommendation: 'Continue regular training and track your progress'
          }
        }
      });
    }

    // Return AI analysis with metrics
    res.status(200).json({
      success: true,
      data: {
        analysis: aiAnalysis.data,
        metrics: progressMetrics,
        playerInfo: {
          name: player.name,
          skillLevel: player.skillLevel,
          rank: leaderboardStats?.rank || 'N/A'
        },
        analyzedPeriod: {
          days,
          startDate,
          endDate: new Date(),
          totalWorkoutsAnalyzed: workoutHistory.length
        },
        analyzedAt: aiAnalysis.analyzedAt
      }
    });

  } catch (error) {
    next(error);
  }
};

// Helper function to calculate progress metrics for AI analysis
const calculateProgressMetrics = async (playerId, days) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const progressData = await Progress.find({
    playerId,
    createdAt: { $gte: startDate }
  }).lean();

  const completedWorkouts = progressData.filter(p => p.completed);

  if (progressData.length === 0) {
    return {
      totalWorkouts: 0,
      completionRate: 0,
      averageAccuracy: 0,
      totalCaloriesBurned: 0,
      averageDuration: 0,
      averageRating: 0,
      categoryBreakdown: []
    };
  }

  // Calculate metrics
  const totalAccuracy = completedWorkouts.reduce((sum, p) => {
    const exerciseAccuracies = p.exerciseResults.map(e => e.accuracy || 0);
    const avgAccuracy = exerciseAccuracies.length > 0 
      ? exerciseAccuracies.reduce((a, b) => a + b, 0) / exerciseAccuracies.length 
      : 0;
    return sum + avgAccuracy;
  }, 0);

  const totalCalories = completedWorkouts.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
  const totalDuration = completedWorkouts.reduce((sum, p) => sum + (p.duration || 0), 0);
  const totalRating = completedWorkouts.filter(p => p.rating).reduce((sum, p) => sum + p.rating, 0);
  const ratedWorkouts = completedWorkouts.filter(p => p.rating).length;

  return {
    totalWorkouts: progressData.length,
    completedWorkouts: completedWorkouts.length,
    completionRate: (completedWorkouts.length / progressData.length) * 100,
    averageAccuracy: completedWorkouts.length > 0 ? totalAccuracy / completedWorkouts.length : 0,
    totalCaloriesBurned: totalCalories,
    averageDuration: completedWorkouts.length > 0 ? totalDuration / completedWorkouts.length : 0,
    averageRating: ratedWorkouts > 0 ? totalRating / ratedWorkouts : 0
  };
};
