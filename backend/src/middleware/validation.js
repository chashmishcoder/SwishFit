const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Middleware using express-validator
 */

/**
 * Handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['player', 'coach', 'admin'])
    .withMessage('Role must be either player, coach, or admin'),

  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 6 || age > 100) {
        throw new Error('Age must be between 6 and 100 years');
      }
      
      return true;
    }),

  body('skillLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Skill level must be beginner, intermediate, or advanced'),

  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  body('weight')
    .optional()
    .isFloat({ min: 20, max: 200 })
    .withMessage('Weight must be between 20 and 200 kg'),

  body('position')
    .optional()
    .isIn(['point-guard', 'shooting-guard', 'small-forward', 'power-forward', 'center'])
    .withMessage('Invalid basketball position'),

  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

/**
 * Validation rules for updating user profile
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 6 || age > 100) {
        throw new Error('Age must be between 6 and 100 years');
      }
      
      return true;
    }),

  body('skillLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Skill level must be beginner, intermediate, or advanced'),

  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  body('weight')
    .optional()
    .isFloat({ min: 20, max: 200 })
    .withMessage('Weight must be between 20 and 200 kg'),

  body('position')
    .optional()
    .isIn(['point-guard', 'shooting-guard', 'small-forward', 'power-forward', 'center', 'not-specified'])
    .withMessage('Invalid basketball position'),

  body('profileImage')
    .optional()
    .isURL()
    .withMessage('Profile image must be a valid URL'),

  body('password')
    .not().exists()
    .withMessage('Password cannot be updated through this endpoint'),

  body('role')
    .not().exists()
    .withMessage('Role cannot be updated through this endpoint'),

  body('email')
    .not().exists()
    .withMessage('Email cannot be updated through this endpoint'),

  handleValidationErrors
];

/**
 * Validation rules for password change
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation rules for creating a workout
 */
const validateWorkoutCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Workout title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('skillLevel')
    .notEmpty()
    .withMessage('Skill level is required')
    .isIn(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .withMessage('Invalid skill level'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['shooting', 'dribbling', 'defense', 'conditioning', 'full-body', 'strength', 'agility'])
    .withMessage('Invalid workout category'),

  body('exercises')
    .isArray({ min: 1 })
    .withMessage('Workout must have at least one exercise'),

  body('exercises.*.name')
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required'),

  body('exercises.*.sets')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Sets must be between 1 and 20'),

  body('exercises.*.reps')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Reps must be between 1 and 100'),

  body('exercises.*.duration')
    .optional()
    .isInt({ min: 1, max: 180 })
    .withMessage('Duration must be between 1 and 180 minutes'),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'moderate', 'hard', 'very-hard'])
    .withMessage('Invalid difficulty level'),

  handleValidationErrors
];

/**
 * Validation rules for updating workout
 */
const validateWorkoutUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('skillLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .withMessage('Invalid skill level'),

  body('category')
    .optional()
    .isIn(['shooting', 'dribbling', 'defense', 'conditioning', 'full-body', 'strength', 'agility'])
    .withMessage('Invalid workout category'),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'moderate', 'hard', 'very-hard'])
    .withMessage('Invalid difficulty level'),

  handleValidationErrors
];

/**
 * Validation rules for recording progress
 */
const validateProgressCreation = [
  body('workoutId')
    .notEmpty()
    .withMessage('Workout ID is required')
    .isMongoId()
    .withMessage('Invalid workout ID format'),

  body('workoutTitle')
    .trim()
    .notEmpty()
    .withMessage('Workout title is required'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),

  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),

  body('completionTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Completion time must be a positive number'),

  body('totalShotsMade')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total shots made must be a positive number'),

  body('totalShotsAttempted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total shots attempted must be a positive number'),

  body('caloriesBurned')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories burned must be a positive number'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('playerNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Player notes cannot exceed 1000 characters'),

  handleValidationErrors
];

/**
 * Validation rules for coach feedback
 */
const validateCoachFeedback = [
  body('coachFeedback')
    .trim()
    .notEmpty()
    .withMessage('Coach feedback is required')
    .isLength({ max: 1000 })
    .withMessage('Coach feedback cannot exceed 1000 characters'),

  handleValidationErrors
];

/**
 * Validation rules for MongoDB ID parameters
 */
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),

  handleValidationErrors
];

/**
 * Validation rules for pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'points', '-points', 'rank', '-rank'])
    .withMessage('Invalid sort field'),

  handleValidationErrors
];

/**
 * Validation rules for email
 */
const validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  handleValidationErrors
];

/**
 * Validation rules for assigning workout to players
 */
const validateWorkoutAssignment = [
  body('playerIds')
    .isArray({ min: 1 })
    .withMessage('At least one player ID is required'),

  body('playerIds.*')
    .isMongoId()
    .withMessage('Invalid player ID format'),

  handleValidationErrors
];

/**
 * Validation rules for AI workout generation
 */
const validateAIWorkoutGeneration = [
  body('skillLevel')
    .notEmpty()
    .withMessage('Skill level is required')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid skill level'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['shooting', 'dribbling', 'passing', 'defense', 'conditioning', 'full-body', 'strength', 'agility'])
    .withMessage('Invalid workout category'),

  body('duration')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Duration must be between 5 and 180 minutes'),

  body('focusAreas')
    .optional()
    .isArray()
    .withMessage('Focus areas must be an array'),

  body('preferences')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Preferences cannot exceed 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for logging workout progress
 */
const validateProgressLog = [
  body('workoutId')
    .notEmpty()
    .withMessage('Workout ID is required')
    .isMongoId()
    .withMessage('Invalid workout ID format'),

  body('exerciseResults')
    .optional()
    .isArray()
    .withMessage('Exercise results must be an array'),

  body('exerciseResults.*.exerciseId')
    .optional()
    .isMongoId()
    .withMessage('Invalid exercise ID format'),

  body('exerciseResults.*.exerciseName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required'),

  body('exerciseResults.*.completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),

  body('exerciseResults.*.shotsMade')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Shots made must be a non-negative integer'),

  body('exerciseResults.*.shotsAttempted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Shots attempted must be a non-negative integer'),

  body('exerciseResults.*.accuracy')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),

  body('exerciseResults.*.duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),

  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid date'),

  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid date'),

  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),

  body('playerNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Player notes cannot exceed 1000 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('enjoymentLevel')
    .optional()
    .isIn(['not-enjoyable', 'slightly-enjoyable', 'enjoyable', 'very-enjoyable', 'extremely-enjoyable'])
    .withMessage('Invalid enjoyment level'),

  body('difficultyFeedback')
    .optional()
    .isIn(['too-easy', 'just-right', 'too-hard'])
    .withMessage('Invalid difficulty feedback'),

  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateWorkoutCreation,
  validateWorkoutUpdate,
  validateProgressCreation,
  validateCoachFeedback,
  validateMongoId,
  validatePagination,
  validateEmail,
  validateWorkoutAssignment,
  validateAIWorkoutGeneration,
  validateProgressLog,
  handleValidationErrors
};
