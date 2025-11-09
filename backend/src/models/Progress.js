const mongoose = require('mongoose');

// Exercise result schema (embedded in Progress)
const exerciseResultSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Exercise ID is required']
  },
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  shotsMade: {
    type: Number,
    default: 0,
    min: [0, 'Shots made cannot be negative']
  },
  shotsAttempted: {
    type: Number,
    default: 0,
    min: [0, 'Shots attempted cannot be negative']
  },
  accuracy: {
    type: Number, // percentage
    default: 0,
    min: [0, 'Accuracy cannot be less than 0'],
    max: [100, 'Accuracy cannot exceed 100']
  },
  duration: {
    type: Number, // in minutes
    default: 0,
    min: [0, 'Duration cannot be negative']
  },
  sets: {
    type: Number,
    min: [0, 'Sets cannot be negative']
  },
  reps: {
    type: Number,
    min: [0, 'Reps cannot be negative']
  },
  difficultyRating: {
    type: Number, // 1-5
    min: [1, 'Difficulty rating must be at least 1'],
    max: [5, 'Difficulty rating cannot exceed 5']
  },
  performanceNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Performance notes cannot exceed 500 characters']
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: [0, 'Calories burned cannot be negative']
  }
}, { _id: true });

// Main Progress schema
const progressSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Player ID is required'],
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'player';
      },
      message: 'Progress can only be tracked for players'
    }
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: [true, 'Workout ID is required']
  },
  workoutTitle: {
    type: String,
    required: [true, 'Workout title is required'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Date is required']
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Completion percentage cannot be less than 0'],
    max: [100, 'Completion percentage cannot exceed 100']
  },
  completionTime: {
    type: Number, // in minutes
    default: 0,
    min: [0, 'Completion time cannot be negative']
  },
  // Exercise results
  exerciseResults: [exerciseResultSchema],
  
  // Overall shooting metrics
  totalShotsMade: {
    type: Number,
    default: 0,
    min: [0, 'Total shots made cannot be negative']
  },
  totalShotsAttempted: {
    type: Number,
    default: 0,
    min: [0, 'Total shots attempted cannot be negative']
  },
  overallAccuracy: {
    type: Number, // percentage
    default: 0,
    min: [0, 'Overall accuracy cannot be less than 0'],
    max: [100, 'Overall accuracy cannot exceed 100']
  },
  
  // Performance metrics
  caloriesBurned: {
    type: Number,
    default: 0,
    min: [0, 'Calories burned cannot be negative']
  },
  heartRateAvg: {
    type: Number,
    min: [30, 'Heart rate average is too low'],
    max: [220, 'Heart rate average is too high']
  },
  heartRateMax: {
    type: Number,
    min: [30, 'Heart rate max is too low'],
    max: [220, 'Heart rate max is too high']
  },
  intensityLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very-high'],
    default: 'moderate'
  },
  
  // Feedback
  playerNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Player notes cannot exceed 1000 characters']
  },
  coachFeedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Coach feedback cannot exceed 1000 characters']
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedbackDate: {
    type: Date
  },
  
  // Rating
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  enjoymentLevel: {
    type: String,
    enum: ['not-enjoyable', 'slightly-enjoyable', 'enjoyable', 'very-enjoyable', 'extremely-enjoyable']
  },
  difficultyFeedback: {
    type: String,
    enum: ['too-easy', 'just-right', 'too-hard']
  },
  
  // Progress tracking
  improvements: [{
    area: String, // e.g., 'shooting accuracy', 'endurance'
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  challenges: [{
    area: String,
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Media
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tracking
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  deviceInfo: {
    type: String
  },
  appVersion: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Index for finding progress by player
progressSchema.index({ playerId: 1, date: -1 });

// Index for finding progress by workout
progressSchema.index({ workoutId: 1 });

// Index for finding progress by player and date range
progressSchema.index({ playerId: 1, date: -1, completed: 1 });

// Index for coach viewing player progress
progressSchema.index({ coachId: 1, date: -1 });

// Compound index for analytics queries
progressSchema.index({ playerId: 1, completed: 1, date: -1 });

// ==================== VIRTUALS ====================

// Virtual for actual duration (calculated from start and end time)
progressSchema.virtual('actualDuration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
  return this.completionTime;
});

// Virtual for exercise completion rate
progressSchema.virtual('exerciseCompletionRate').get(function() {
  if (!this.exerciseResults || this.exerciseResults.length === 0) return 0;
  
  const completedCount = this.exerciseResults.filter(ex => ex.completed).length;
  return Math.round((completedCount / this.exerciseResults.length) * 100);
});

// Virtual for performance score (0-100)
progressSchema.virtual('performanceScore').get(function() {
  let score = 0;
  
  // Completion (40 points)
  score += this.completionPercentage * 0.4;
  
  // Accuracy (30 points)
  if (this.totalShotsAttempted > 0) {
    score += this.overallAccuracy * 0.3;
  } else {
    score += 30; // Give full points if no shooting exercises
  }
  
  // Rating (30 points)
  if (this.rating) {
    score += (this.rating / 5) * 30;
  } else {
    score += 15; // Give half points if no rating
  }
  
  return Math.round(score);
});

// ==================== MIDDLEWARE (HOOKS) ====================

// Auto-calculate completion percentage before saving
progressSchema.pre('save', function(next) {
  if (this.exerciseResults && this.exerciseResults.length > 0) {
    const completedCount = this.exerciseResults.filter(ex => ex.completed).length;
    this.completionPercentage = Math.round((completedCount / this.exerciseResults.length) * 100);
    
    // Mark as completed only if all exercises are done
    if (completedCount === this.exerciseResults.length) {
      this.completed = true;
    } else {
      this.completed = false;
    }
  }
  
  next();
});

// Auto-calculate overall accuracy before saving
progressSchema.pre('save', function(next) {
  if (this.exerciseResults && this.exerciseResults.length > 0) {
    let totalMade = 0;
    let totalAttempted = 0;
    
    this.exerciseResults.forEach(exercise => {
      totalMade += exercise.shotsMade || 0;
      totalAttempted += exercise.shotsAttempted || 0;
    });
    
    this.totalShotsMade = totalMade;
    this.totalShotsAttempted = totalAttempted;
    this.overallAccuracy = totalAttempted > 0 
      ? Math.round((totalMade / totalAttempted) * 100) 
      : 0;
  }
  
  next();
});

// Auto-calculate total calories burned before saving
progressSchema.pre('save', function(next) {
  if (this.exerciseResults && this.exerciseResults.length > 0) {
    const totalCalories = this.exerciseResults.reduce((sum, exercise) => {
      return sum + (exercise.caloriesBurned || 0);
    }, 0);
    
    if (!this.caloriesBurned || this.caloriesBurned === 0) {
      this.caloriesBurned = totalCalories;
    }
  }
  
  next();
});

// Auto-calculate completion time from start and end time
progressSchema.pre('save', function(next) {
  if (this.startTime && this.endTime && !this.completionTime) {
    this.completionTime = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  
  next();
});

// ==================== INSTANCE METHODS ====================

// Method to add exercise result
progressSchema.methods.addExerciseResult = async function(exerciseResult) {
  this.exerciseResults.push(exerciseResult);
  return await this.save();
};

// Method to update exercise result
progressSchema.methods.updateExerciseResult = async function(exerciseId, updates) {
  const exercise = this.exerciseResults.id(exerciseId);
  if (exercise) {
    Object.assign(exercise, updates);
    return await this.save();
  }
  throw new Error('Exercise result not found');
};

// Method to add coach feedback
progressSchema.methods.addCoachFeedback = async function(coachId, feedback) {
  this.coachFeedback = feedback;
  this.coachId = coachId;
  this.feedbackDate = new Date();
  return await this.save();
};

// Method to mark as completed
progressSchema.methods.markCompleted = async function() {
  this.completed = true;
  this.completionPercentage = 100;
  if (!this.endTime) {
    this.endTime = new Date();
  }
  return await this.save();
};

// Method to add improvement
progressSchema.methods.addImprovement = async function(area, description) {
  this.improvements.push({ area, description });
  return await this.save();
};

// Method to add challenge
progressSchema.methods.addChallenge = async function(area, description) {
  this.challenges.push({ area, description });
  return await this.save();
};

// ==================== STATIC METHODS ====================

// Find progress by player
progressSchema.statics.findByPlayer = function(playerId, filters = {}) {
  const query = { playerId, isActive: true };
  
  if (filters.completed !== undefined) query.completed = filters.completed;
  if (filters.startDate && filters.endDate) {
    query.date = { $gte: filters.startDate, $lte: filters.endDate };
  }
  
  return this.find(query)
    .populate('workoutId', 'title category skillLevel')
    .populate('coachId', 'name email')
    .sort('-date');
};

// Find progress by workout
progressSchema.statics.findByWorkout = function(workoutId) {
  return this.find({ workoutId, isActive: true })
    .populate('playerId', 'name email skillLevel')
    .sort('-date');
};

// Get player statistics
progressSchema.statics.getPlayerStats = async function(playerId, startDate, endDate) {
  const matchQuery = { playerId, isActive: true };
  
  if (startDate && endDate) {
    matchQuery.date = { $gte: startDate, $lte: endDate };
  }
  
  const stats = await this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        completedWorkouts: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        totalCalories: { $sum: '$caloriesBurned' },
        totalTime: { $sum: '$completionTime' },
        avgAccuracy: { $avg: '$overallAccuracy' },
        totalShotsMade: { $sum: '$totalShotsMade' },
        totalShotsAttempted: { $sum: '$totalShotsAttempted' },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  
  return stats.length > 0 ? stats[0] : null;
};

// Get workout completion trends
progressSchema.statics.getCompletionTrends = async function(playerId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        playerId: new mongoose.Types.ObjectId(playerId),
        date: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        avgAccuracy: { $avg: '$overallAccuracy' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Find recent progress entries
progressSchema.statics.getRecentProgress = function(playerId, limit = 10) {
  return this.find({ playerId, isActive: true })
    .populate('workoutId', 'title category')
    .sort('-date')
    .limit(limit);
};

// ==================== MODEL EXPORT ====================

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
