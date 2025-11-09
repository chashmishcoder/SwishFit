const mongoose = require('mongoose');

// Exercise schema (embedded in Workout)
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  sets: {
    type: Number,
    min: [1, 'Sets must be at least 1'],
    max: [20, 'Sets cannot exceed 20']
  },
  reps: {
    type: Number,
    min: [1, 'Reps must be at least 1'],
    max: [100, 'Reps cannot exceed 100']
  },
  duration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute'],
    max: [180, 'Duration cannot exceed 180 minutes']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'very-hard'],
    default: 'moderate'
  },
  videoUrl: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  day: {
    type: Number, // Day of the week or workout program
    min: [1, 'Day must be at least 1'],
    max: [7, 'Day cannot exceed 7']
  },
  week: {
    type: Number, // Week number in a training program
    min: [1, 'Week must be at least 1'],
    max: [52, 'Week cannot exceed 52']
  },
  targetArea: {
    type: String,
    enum: ['upper-body', 'lower-body', 'core', 'cardio', 'full-body', 'skill-specific']
  },
  caloriesBurn: {
    type: Number, // Estimated calories burned
    min: [0, 'Calories cannot be negative']
  }
}, { _id: true });

// Main Workout schema
const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Workout title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Workout must have a creator']
    // Note: Role validation removed to prevent populate hanging
    // This is validated in the authorize middleware instead
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  skillLevel: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      message: 'Invalid skill level'
    },
    required: [true, 'Skill level is required']
  },
  duration: {
    type: Number, // Total duration in minutes
    min: [5, 'Duration must be at least 5 minutes'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  category: {
    type: String,
    enum: {
      values: ['shooting', 'dribbling', 'defense', 'conditioning', 'full-body', 'strength', 'agility'],
      message: 'Invalid workout category'
    },
    required: [true, 'Workout category is required']
  },
  exercises: {
    type: [exerciseSchema],
    validate: {
      validator: function(exercises) {
        return exercises && exercises.length > 0;
      },
      message: 'Workout must have at least one exercise'
    }
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String,
    trim: true
  },
  aiMetadata: {
    model: String,
    generatedAt: Date,
    inputParameters: mongoose.Schema.Types.Mixed
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'very-hard'],
    default: 'moderate'
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [5, 'Estimated time must be at least 5 minutes']
  },
  equipmentNeeded: [{
    type: String,
    trim: true
  }],
  targetMuscleGroups: [{
    type: String,
    enum: ['legs', 'arms', 'core', 'chest', 'back', 'shoulders', 'full-body']
  }],
  caloriesBurn: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  viewCount: {
    type: Number,
    default: 0
  },
  completionCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Index for filtering by skill level and category
workoutSchema.index({ skillLevel: 1, category: 1 });

// Index for public workouts
workoutSchema.index({ isPublic: 1, isActive: 1 });

// Index for finding workouts assigned to specific users
workoutSchema.index({ assignedTo: 1 });

// Index for finding workouts created by specific coach
workoutSchema.index({ createdBy: 1 });

// Text index for searching workout titles and descriptions
workoutSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound index for popular public workouts
workoutSchema.index({ isPublic: 1, 'rating.average': -1, completionCount: -1 });

// ==================== VIRTUALS ====================

// Virtual for total exercise count
workoutSchema.virtual('exerciseCount').get(function() {
  return this.exercises ? this.exercises.length : 0;
});

// Virtual for difficulty score (calculated from exercises)
workoutSchema.virtual('difficultyScore').get(function() {
  if (!this.exercises || this.exercises.length === 0) return 0;
  
  const difficultyMap = { 'easy': 1, 'moderate': 2, 'hard': 3, 'very-hard': 4 };
  const totalScore = this.exercises.reduce((sum, exercise) => {
    return sum + (difficultyMap[exercise.difficulty] || 2);
  }, 0);
  
  return Math.round(totalScore / this.exercises.length);
});

// ==================== MIDDLEWARE (HOOKS) ====================

// Auto-calculate estimated time if not provided
workoutSchema.pre('save', function(next) {
  if (!this.estimatedTime && this.exercises && this.exercises.length > 0) {
    this.estimatedTime = this.exercises.reduce((total, exercise) => {
      return total + (exercise.duration || 5);
    }, 0);
  }
  
  // Set duration equal to estimatedTime if not provided
  if (!this.duration && this.estimatedTime) {
    this.duration = this.estimatedTime;
  }
  
  next();
});

// Auto-calculate calories burn if not provided
workoutSchema.pre('save', function(next) {
  if (!this.caloriesBurn && this.exercises && this.exercises.length > 0) {
    this.caloriesBurn = this.exercises.reduce((total, exercise) => {
      return total + (exercise.caloriesBurn || 50);
    }, 0);
  }
  
  next();
});

// ==================== INSTANCE METHODS ====================

// Method to increment view count
workoutSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return await this.save();
};

// Method to increment completion count
workoutSchema.methods.incrementCompletionCount = async function() {
  this.completionCount += 1;
  return await this.save();
};

// Method to update rating
workoutSchema.methods.updateRating = async function(newRating) {
  if (newRating < 1 || newRating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  
  return await this.save();
};

// Method to assign workout to players
workoutSchema.methods.assignToPlayers = async function(playerIds) {
  // Add only unique player IDs
  const uniquePlayerIds = [...new Set([...this.assignedTo.map(id => id.toString()), ...playerIds.map(id => id.toString())])];
  this.assignedTo = uniquePlayerIds;
  
  return await this.save();
};

// Method to remove assignment
workoutSchema.methods.unassignFromPlayers = async function(playerIds) {
  this.assignedTo = this.assignedTo.filter(
    id => !playerIds.map(pid => pid.toString()).includes(id.toString())
  );
  
  return await this.save();
};

// ==================== STATIC METHODS ====================

// Find workouts by creator
workoutSchema.statics.findByCreator = function(creatorId) {
  return this.find({ createdBy: creatorId, isActive: true })
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email skillLevel')
    .sort('-createdAt');
};

// Find public workouts
workoutSchema.statics.findPublicWorkouts = function(filters = {}) {
  const query = { isPublic: true, isActive: true };
  
  if (filters.skillLevel) query.skillLevel = filters.skillLevel;
  if (filters.category) query.category = filters.category;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  
  return this.find(query)
    .populate('createdBy', 'name email role')
    .sort('-rating.average -completionCount -createdAt');
};

// Find workouts assigned to a player
workoutSchema.statics.findAssignedWorkouts = function(playerId) {
  return this.find({
    assignedTo: playerId,
    isActive: true
  })
    .populate('createdBy', 'name email role')
    .sort('-createdAt');
};

// Search workouts by text
workoutSchema.statics.searchWorkouts = function(searchText) {
  return this.find(
    { $text: { $search: searchText }, isActive: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('createdBy', 'name email role');
};

// Get popular workouts
workoutSchema.statics.getPopularWorkouts = function(limit = 10) {
  return this.find({ isPublic: true, isActive: true })
    .sort('-completionCount -rating.average')
    .limit(limit)
    .populate('createdBy', 'name email role');
};

// ==================== MODEL EXPORT ====================

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
