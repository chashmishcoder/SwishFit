const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['player', 'coach', 'admin'],
      message: 'Role must be either player, coach, or admin'
    },
    default: 'player'
  },
  profileImage: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        // User must be at least 6 years old
        if (!value) return true; // Optional field
        const age = (new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 6 && age <= 100;
      },
      message: 'Age must be between 6 and 100 years'
    }
  },
  skillLevel: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Skill level must be beginner, intermediate, or advanced'
    },
    default: 'beginner'
  },
  height: {
    type: Number, // in cm
    min: [100, 'Height must be at least 100 cm'],
    max: [250, 'Height cannot exceed 250 cm']
  },
  weight: {
    type: Number, // in kg
    min: [20, 'Weight must be at least 20 kg'],
    max: [200, 'Weight cannot exceed 200 kg']
  },
  position: {
    type: String,
    enum: ['point-guard', 'shooting-guard', 'small-forward', 'power-forward', 'center', 'not-specified'],
    default: 'not-specified'
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Note: Validation removed to prevent populate hanging issues
    // Coach validation should be done in the controller/service layer
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  accountCreated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Index for faster email lookups (unique already creates an index)
userSchema.index({ email: 1 });

// Index for role-based queries
userSchema.index({ role: 1 });

// Index for coach assignment lookups
userSchema.index({ coachId: 1 });

// Compound index for active players with specific skill level
userSchema.index({ role: 1, skillLevel: 1, isActive: 1 });

// ==================== VIRTUALS ====================

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for full profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  const fields = ['name', 'email', 'phoneNumber', 'dateOfBirth', 'skillLevel', 'height', 'weight', 'profileImage'];
  const filledFields = fields.filter(field => this[field]).length;
  return Math.round((filledFields / fields.length) * 100);
});

// ==================== MIDDLEWARE (HOOKS) ====================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin before saving
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.accountCreated = new Date();
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.__v;
  
  return userObject;
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return await this.save();
};

// ==================== STATIC METHODS ====================

// Find players by coach ID
userSchema.statics.findPlayersByCoach = function(coachId) {
  return this.find({
    role: 'player',
    coachId: coachId,
    isActive: true
  }).select('-password');
};

// Find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true }).select('-password');
};

// Find users by skill level
userSchema.statics.findBySkillLevel = function(skillLevel) {
  return this.find({
    role: 'player',
    skillLevel,
    isActive: true
  }).select('-password');
};

// Check if email exists
userSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

// ==================== MODEL EXPORT ====================

const User = mongoose.model('User', userSchema);

module.exports = User;
