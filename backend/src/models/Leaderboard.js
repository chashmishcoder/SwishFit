const mongoose = require('mongoose');

// Achievement schema (embedded in Leaderboard)
const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: [true, 'Achievement ID is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['workout', 'shooting', 'streak', 'milestone', 'special'],
    default: 'workout'
  },
  icon: {
    type: String,
    trim: true
  },
  earnedDate: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Streak data schema
const streakDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  workoutsCompleted: {
    type: Number,
    default: 1
  }
}, { _id: false });

// Main Leaderboard schema
const leaderboardSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Player ID is required'],
    unique: true,
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'player';
      },
      message: 'Leaderboard entry can only be created for players'
    }
  },
  
  // Workout statistics
  totalWorkoutsCompleted: {
    type: Number,
    default: 0,
    min: [0, 'Total workouts cannot be negative']
  },
  totalWorkoutsAssigned: {
    type: Number,
    default: 0,
    min: [0, 'Total assigned workouts cannot be negative']
  },
  completionRate: {
    type: Number, // percentage
    default: 0,
    min: [0, 'Completion rate cannot be less than 0'],
    max: [100, 'Completion rate cannot exceed 100']
  },
  
  // Streak tracking
  currentStreak: {
    type: Number,
    default: 0,
    min: [0, 'Current streak cannot be negative']
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: [0, 'Longest streak cannot be negative']
  },
  lastWorkoutDate: {
    type: Date
  },
  streakHistory: [streakDataSchema],
  
  // Performance metrics
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
  averageAccuracy: {
    type: Number, // percentage
    default: 0,
    min: [0, 'Average accuracy cannot be less than 0'],
    max: [100, 'Average accuracy cannot exceed 100']
  },
  bestAccuracy: {
    type: Number, // percentage
    default: 0,
    min: [0, 'Best accuracy cannot be less than 0'],
    max: [100, 'Best accuracy cannot exceed 100']
  },
  
  // Time and effort
  totalTrainingHours: {
    type: Number,
    default: 0,
    min: [0, 'Total training hours cannot be negative']
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0,
    min: [0, 'Total calories burned cannot be negative']
  },
  averageWorkoutDuration: {
    type: Number, // in minutes
    default: 0,
    min: [0, 'Average workout duration cannot be negative']
  },
  
  // Rankings
  rank: {
    type: Number,
    default: 0,
    min: [0, 'Rank cannot be negative']
  },
  previousRank: {
    type: Number,
    default: 0
  },
  teamRank: {
    type: Number,
    default: 0
  },
  nationalRank: {
    type: Number,
    default: 0
  },
  
  // Points system
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  weeklyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Weekly points cannot be negative']
  },
  monthlyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Monthly points cannot be negative']
  },
  
  // Achievements
  achievements: [achievementSchema],
  totalAchievements: {
    type: Number,
    default: 0,
    min: [0, 'Total achievements cannot be negative']
  },
  
  // Team information
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Skill development
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'elite'],
    default: 'beginner'
  },
  skillPoints: {
    shooting: { type: Number, default: 0 },
    dribbling: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    conditioning: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  
  // Personal bests
  personalBests: {
    mostShotsInSession: { type: Number, default: 0 },
    highestAccuracy: { type: Number, default: 0 },
    longestWorkout: { type: Number, default: 0 }, // in minutes
    mostCaloriesInSession: { type: Number, default: 0 }
  },
  
  // Recent activity
  recentWorkouts: [{
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout'
    },
    completedAt: Date,
    accuracy: Number,
    duration: Number
  }],
  
  // Social metrics
  followersCount: {
    type: Number,
    default: 0,
    min: [0, 'Followers count cannot be negative']
  },
  followingCount: {
    type: Number,
    default: 0,
    min: [0, 'Following count cannot be negative']
  },
  
  // Activity tracking
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  season: {
    type: String, // e.g., "2024-25"
    default: function() {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Index for ranking queries (most common)
leaderboardSchema.index({ rank: 1 });

// Index for team rankings
leaderboardSchema.index({ teamId: 1, rank: 1 });

// Index for points-based queries
leaderboardSchema.index({ points: -1 });

// Index for seasonal rankings
leaderboardSchema.index({ season: 1, points: -1 });

// Compound index for leaderboard listings
leaderboardSchema.index({ isActive: 1, points: -1, rank: 1 });

// Index for skill level filtering
leaderboardSchema.index({ skillLevel: 1, points: -1 });

// ==================== VIRTUALS ====================

// Virtual for rank change
leaderboardSchema.virtual('rankChange').get(function() {
  if (this.previousRank === 0) return 0;
  return this.previousRank - this.rank;
});

// Virtual for completion percentage
leaderboardSchema.virtual('workoutCompletionPercentage').get(function() {
  if (this.totalWorkoutsAssigned === 0) return 0;
  return Math.round((this.totalWorkoutsCompleted / this.totalWorkoutsAssigned) * 100);
});

// Virtual for total achievements count
leaderboardSchema.virtual('achievementCount').get(function() {
  return this.achievements ? this.achievements.length : 0;
});

// Virtual for average points per workout
leaderboardSchema.virtual('averagePointsPerWorkout').get(function() {
  if (this.totalWorkoutsCompleted === 0) return 0;
  return Math.round(this.points / this.totalWorkoutsCompleted);
});

// Virtual for activity level
leaderboardSchema.virtual('activityLevel').get(function() {
  if (!this.lastWorkoutDate) return 'inactive';
  
  const daysSinceLastWorkout = Math.floor((Date.now() - this.lastWorkoutDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastWorkout === 0) return 'very-active';
  if (daysSinceLastWorkout <= 3) return 'active';
  if (daysSinceLastWorkout <= 7) return 'moderate';
  if (daysSinceLastWorkout <= 14) return 'low';
  return 'inactive';
});

// ==================== MIDDLEWARE (HOOKS) ====================

// Auto-calculate completion rate before saving
leaderboardSchema.pre('save', function(next) {
  if (this.totalWorkoutsAssigned > 0) {
    this.completionRate = Math.round((this.totalWorkoutsCompleted / this.totalWorkoutsAssigned) * 100);
  }
  next();
});

// Auto-calculate average accuracy before saving
leaderboardSchema.pre('save', function(next) {
  if (this.totalShotsAttempted > 0) {
    this.averageAccuracy = Math.round((this.totalShotsMade / this.totalShotsAttempted) * 100);
    
    // Update best accuracy if current is better
    if (this.averageAccuracy > this.bestAccuracy) {
      this.bestAccuracy = this.averageAccuracy;
    }
  }
  next();
});

// Auto-calculate average workout duration
leaderboardSchema.pre('save', function(next) {
  if (this.totalWorkoutsCompleted > 0 && this.totalTrainingHours > 0) {
    this.averageWorkoutDuration = Math.round((this.totalTrainingHours * 60) / this.totalWorkoutsCompleted);
  }
  next();
});

// Update lastUpdated timestamp
leaderboardSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Calculate overall skill points
leaderboardSchema.pre('save', function(next) {
  if (this.skillPoints) {
    this.skillPoints.overall = Math.round(
      (this.skillPoints.shooting + 
       this.skillPoints.dribbling + 
       this.skillPoints.defense + 
       this.skillPoints.conditioning) / 4
    );
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Method to update after workout completion
leaderboardSchema.methods.updateAfterWorkout = async function(progressData) {
  // Update workout count
  this.totalWorkoutsCompleted += 1;
  
  // Update shooting stats
  this.totalShotsMade += progressData.totalShotsMade || 0;
  this.totalShotsAttempted += progressData.totalShotsAttempted || 0;
  
  // Update time and calories
  const hoursSpent = (progressData.completionTime || 0) / 60;
  this.totalTrainingHours += hoursSpent;
  this.totalCaloriesBurned += progressData.caloriesBurned || 0;
  
  // Update streak
  const today = new Date().toDateString();
  const lastWorkout = this.lastWorkoutDate ? new Date(this.lastWorkoutDate).toDateString() : null;
  
  if (lastWorkout !== today) {
    if (lastWorkout === new Date(Date.now() - 86400000).toDateString()) {
      // Consecutive day
      this.currentStreak += 1;
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
    
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
    
    this.lastWorkoutDate = new Date();
    this.streakHistory.push({ date: new Date(), workoutsCompleted: 1 });
  }
  
  // Update personal bests
  if (progressData.totalShotsAttempted > this.personalBests.mostShotsInSession) {
    this.personalBests.mostShotsInSession = progressData.totalShotsAttempted;
  }
  if (progressData.overallAccuracy > this.personalBests.highestAccuracy) {
    this.personalBests.highestAccuracy = progressData.overallAccuracy;
  }
  if (progressData.completionTime > this.personalBests.longestWorkout) {
    this.personalBests.longestWorkout = progressData.completionTime;
  }
  if (progressData.caloriesBurned > this.personalBests.mostCaloriesInSession) {
    this.personalBests.mostCaloriesInSession = progressData.caloriesBurned;
  }
  
  // Add points (base 10 points per workout + bonuses)
  let pointsEarned = 10;
  if (progressData.completed) pointsEarned += 5;
  if (progressData.overallAccuracy >= 80) pointsEarned += 10;
  if (progressData.overallAccuracy >= 90) pointsEarned += 15;
  
  this.points += pointsEarned;
  this.weeklyPoints += pointsEarned;
  this.monthlyPoints += pointsEarned;
  
  // Add to recent workouts (keep last 10)
  this.recentWorkouts.unshift({
    workoutId: progressData.workoutId,
    completedAt: new Date(),
    accuracy: progressData.overallAccuracy,
    duration: progressData.completionTime
  });
  
  if (this.recentWorkouts.length > 10) {
    this.recentWorkouts = this.recentWorkouts.slice(0, 10);
  }
  
  return await this.save();
};

// Method to add achievement
leaderboardSchema.methods.addAchievement = async function(achievement) {
  // Check if achievement already exists
  const exists = this.achievements.some(a => a.achievementId === achievement.achievementId);
  
  if (!exists) {
    this.achievements.push(achievement);
    this.totalAchievements = this.achievements.length;
    this.points += achievement.points || 0;
    return await this.save();
  }
  
  return this;
};

// Method to update rank
leaderboardSchema.methods.updateRank = async function(newRank) {
  this.previousRank = this.rank;
  this.rank = newRank;
  return await this.save();
};

// Method to reset weekly points
leaderboardSchema.methods.resetWeeklyPoints = async function() {
  this.weeklyPoints = 0;
  return await this.save();
};

// Method to reset monthly points
leaderboardSchema.methods.resetMonthlyPoints = async function() {
  this.monthlyPoints = 0;
  return await this.save();
};

// ==================== STATIC METHODS ====================

// Get global leaderboard
leaderboardSchema.statics.getGlobalLeaderboard = function(limit = 100, season = null) {
  const query = { isActive: true };
  if (season) query.season = season;
  
  return this.find(query)
    .populate('playerId', 'name email profileImage skillLevel')
    .populate('teamId', 'name')
    .sort('-points -averageAccuracy')
    .limit(limit);
};

// Get team leaderboard
leaderboardSchema.statics.getTeamLeaderboard = function(teamId, limit = 50) {
  return this.find({ teamId, isActive: true })
    .populate('playerId', 'name email profileImage')
    .sort('-teamRank -points')
    .limit(limit);
};

// Get leaderboard by skill level
leaderboardSchema.statics.getLeaderboardBySkill = function(skillLevel, limit = 50) {
  return this.find({ skillLevel, isActive: true })
    .populate('playerId', 'name email profileImage')
    .sort('-points -averageAccuracy')
    .limit(limit);
};

// Update all rankings (called periodically)
leaderboardSchema.statics.updateAllRankings = async function() {
  const entries = await this.find({ isActive: true }).sort('-points');
  
  for (let i = 0; i < entries.length; i++) {
    entries[i].previousRank = entries[i].rank;
    entries[i].rank = i + 1;
    await entries[i].save();
  }
  
  return entries.length;
};

// Get top performers
leaderboardSchema.statics.getTopPerformers = function(metric = 'points', limit = 10) {
  const sortField = `-${metric}`;
  
  return this.find({ isActive: true })
    .populate('playerId', 'name email profileImage')
    .sort(sortField)
    .limit(limit);
};

// Get player's rank position
leaderboardSchema.statics.getPlayerRank = async function(playerId) {
  const entry = await this.findOne({ playerId });
  if (!entry) return null;
  
  const rank = await this.countDocuments({
    points: { $gt: entry.points },
    isActive: true
  });
  
  return rank + 1;
};

// ==================== MODEL EXPORT ====================

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
