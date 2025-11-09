const { Workout, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const geminiService = require('../services/geminiService');

/**
 * @desc    Generate AI-powered workout
 * @route   POST /api/workouts/generate
 * @access  Private (Coach/Admin only)
 */
exports.generateAIWorkout = async (req, res, next) => {
  try {
    const { playerId, age, skillLevel, goals, pastPerformance, duration, focusAreas, category, playerName } = req.body;

    // Check if Gemini API is configured
    if (!geminiService.isConfigured()) {
      return next(new AppError('AI workout generation is not configured. Please add GEMINI_API_KEY to environment variables.', 503));
    }

    // If playerId is provided, get player details
    let playerProfile = null;
    if (playerId) {
      playerProfile = await User.findById(playerId).select('name age skillLevel height weight position');
      
      if (!playerProfile) {
        return next(new AppError('Player not found', 404));
      }

      // Check if coach has access to this player (if user is a coach)
      if (req.user.role === 'coach' && playerProfile.coachId?.toString() !== req.user.id) {
        return next(new AppError('You do not have access to this player', 403));
      }
    }

    // Prepare player data for AI
    const playerData = {
      age: age || playerProfile?.age || 18,
      skillLevel: skillLevel || playerProfile?.skillLevel || 'intermediate',
      goals: goals || `Improve ${category || 'overall'} basketball skills`,
      pastPerformance: pastPerformance || 'No previous data',
      duration: duration || 7, // Duration in days for workout plan
      focusAreas: focusAreas || category || 'shooting, dribbling, defense, conditioning'
    };

    // Call Gemini AI to generate workout
    const aiResult = await geminiService.generateWorkout(playerData);

    if (!aiResult.success) {
      // If AI fails, use fallback but still save to database
      console.warn('Gemini API failed, using fallback workout');
      
      const fallbackWorkout = await Workout.create({
        title: aiResult.fallbackData.title,
        description: aiResult.fallbackData.description,
        createdBy: req.user.id,
        assignedTo: playerId ? [playerId] : [],
        skillLevel: playerData.skillLevel,
        category: 'full-body',
        exercises: aiResult.fallbackData.exercises,
        isAIGenerated: true,
        aiPrompt: JSON.stringify(playerData),
        aiMetadata: {
          error: aiResult.error,
          isFallback: true,
          generatedAt: new Date()
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Workout created using fallback system (AI temporarily unavailable)',
        data: fallbackWorkout,
        aiInsights: aiResult.fallbackData.weeklyInsights,
        usedFallback: true
      });
    }

    // Create workout from AI-generated data
    const workoutData = {
      title: aiResult.data.title,
      description: aiResult.data.description,
      createdBy: req.user.id,
      assignedTo: playerId ? [playerId] : [],
      skillLevel: aiResult.data.skillLevel || playerData.skillLevel,
      category: category || aiResult.data.category || 'full-body',
      duration: duration || 30, // Duration in minutes for single workout
      exercises: aiResult.data.exercises,
      isAIGenerated: true,
      aiPrompt: JSON.stringify(playerData),
      aiMetadata: {
        model: aiResult.metadata?.model,
        generatedAt: aiResult.metadata?.generatedAt,
        promptTokens: aiResult.metadata?.promptTokens
      }
    };

    const workout = await Workout.create(workoutData);

    // Populate the workout with creator details
    await workout.populate('createdBy', 'name email role');
    if (playerId) {
      await workout.populate('assignedTo', 'name email skillLevel');
    }

    res.status(201).json({
      success: true,
      message: 'AI workout generated successfully',
      data: workout,
      aiInsights: aiResult.data.weeklyInsights,
      safetyNotes: aiResult.data.safetyNotes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new workout
 * @route   POST /api/workouts
 * @access  Private (Coach/Admin only)
 */
exports.createWorkout = async (req, res, next) => {
  try {
    // Set the creator to the logged-in user
    req.body.createdBy = req.user.id;
    
    const workout = await Workout.create(req.body);
    
    res.status(201).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all workouts with filters
 * @route   GET /api/workouts
 * @access  Private
 */
exports.getWorkouts = async (req, res, next) => {
  try {
    const { skillLevel, category, isPublic, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    // Apply filters
    if (skillLevel) filter.skillLevel = skillLevel;
    if (category) filter.category = category;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
    
    // Text search if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Role-based filtering
    if (req.user.role === 'player') {
      // Players can see public workouts OR workouts assigned to them
      filter.$or = [
        { isPublic: true },
        { assignedTo: req.user.id }
      ];
    }
    // Coaches and admins can see all workouts (no additional filter)
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const workouts = await Workout.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email skillLevel')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Workout.countDocuments(filter);
    
    res.json({
      success: true,
      count: workouts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single workout by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
exports.getWorkout = async (req, res, next) => {
  try {
    console.log('Getting workout by ID:', req.params.id);
    const workout = await Workout.findById(req.params.id);
    console.log('Workout found:', !!workout);
    
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }
    
    // Check if player has access to this workout
    if (req.user.role === 'player') {
      const isAssigned = workout.assignedTo.some(
        playerId => playerId.toString() === req.user.id
      );
      
      if (!workout.isPublic && !isAssigned) {
        return next(new AppError('You do not have access to this workout', 403));
      }
    }
    
    console.log('About to send response');
    res.json({
      success: true,
      data: workout
    });
    console.log('Response sent');
  } catch (error) {
    console.error('Error in getWorkout:', error);
    next(error);
  }
};

/**
 * @desc    Update workout
 * @route   PUT /api/workouts/:id
 * @access  Private (Coach/Admin only, must be creator or admin)
 */
exports.updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }
    
    // Check ownership - only creator or admin can update
    if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this workout', 403));
    }
    
    // Prevent updating certain fields
    delete req.body.createdBy;
    delete req.body.viewCount;
    delete req.body.completionCount;
    delete req.body.rating;
    
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email role');
    
    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete workout
 * @route   DELETE /api/workouts/:id
 * @access  Private (Coach/Admin only, must be creator or admin)
 */
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }
    
    // Check ownership - only creator or admin can delete
    if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this workout', 403));
    }
    
    await workout.deleteOne();
    
    res.json({
      success: true,
      message: 'Workout deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign workout to players
 * @route   POST /api/workouts/:id/assign
 * @access  Private (Coach/Admin only)
 */
exports.assignWorkout = async (req, res, next) => {
  try {
    const { playerIds } = req.body;
    
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return next(new AppError('Please provide an array of player IDs', 400));
    }
    
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }
    
    // Use the model method to assign players
    await workout.assignToPlayers(playerIds);
    
    // Fetch updated workout with populated fields
    const updatedWorkout = await Workout.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email skillLevel position');
    
    res.json({
      success: true,
      message: `Workout assigned to ${playerIds.length} player(s)`,
      data: updatedWorkout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unassign workout from players
 * @route   POST /api/workouts/:id/unassign
 * @access  Private (Coach/Admin only)
 */
exports.unassignWorkout = async (req, res, next) => {
  try {
    const { playerIds } = req.body;
    
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return next(new AppError('Please provide an array of player IDs', 400));
    }
    
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return next(new AppError('Workout not found', 404));
    }
    
    // Use the model method to unassign players
    await workout.unassignFromPlayers(playerIds);
    
    // Fetch updated workout with populated fields
    const updatedWorkout = await Workout.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email skillLevel position');
    
    res.json({
      success: true,
      message: `Workout unassigned from ${playerIds.length} player(s)`,
      data: updatedWorkout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get workouts created by logged-in coach
 * @route   GET /api/workouts/my/created
 * @access  Private (Coach/Admin only)
 */
exports.getMyWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ createdBy: req.user.id })
      .populate('assignedTo', 'name email skillLevel')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get popular workouts (most views/completions)
 * @route   GET /api/workouts/popular
 * @access  Private
 */
exports.getPopularWorkouts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const workouts = await Workout.getPopularWorkouts(parseInt(limit));
    
    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};
