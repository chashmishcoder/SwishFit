const express = require('express');
const router = express.Router();
const {
  getMyPlayers,
  getPlayerOverview,
  getPlayerProgress,
  addFeedback,
  assignWorkout,
  unassignWorkout,
  getDashboardStats,
  compareMyPlayers,
  assignWorkoutToAll
} = require('../controllers/coachController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// All routes are coach-only, so apply protect and authorize middleware to all
router.use(protect);
router.use(authorize('coach', 'admin'));

// ==================== PLAYER MANAGEMENT ====================

// Get all players assigned to coach
router.get('/players', getMyPlayers);

// Get player overview with stats
router.get('/players/:playerId', getPlayerOverview);

// Get player progress history
router.get('/players/:playerId/progress', getPlayerProgress);

// ==================== FEEDBACK ====================

// Add feedback to player's progress
router.put(
  '/feedback/:progressId',
  [
    body('coachFeedback')
      .trim()
      .notEmpty()
      .withMessage('Feedback is required')
      .isLength({ max: 1000 })
      .withMessage('Feedback cannot exceed 1000 characters'),
    handleValidationErrors
  ],
  addFeedback
);

// ==================== WORKOUT ASSIGNMENT ====================

// Assign workout to specific players
router.post(
  '/assign-workout',
  [
    body('workoutId')
      .notEmpty()
      .withMessage('Workout ID is required')
      .isMongoId()
      .withMessage('Invalid workout ID'),
    body('playerIds')
      .isArray({ min: 1 })
      .withMessage('Player IDs must be a non-empty array'),
    body('playerIds.*')
      .isMongoId()
      .withMessage('Invalid player ID'),
    handleValidationErrors
  ],
  assignWorkout
);

// Unassign workout from players
router.post(
  '/unassign-workout',
  [
    body('workoutId')
      .notEmpty()
      .withMessage('Workout ID is required')
      .isMongoId()
      .withMessage('Invalid workout ID'),
    body('playerIds')
      .isArray({ min: 1 })
      .withMessage('Player IDs must be a non-empty array'),
    body('playerIds.*')
      .isMongoId()
      .withMessage('Invalid player ID'),
    handleValidationErrors
  ],
  unassignWorkout
);

// Assign workout to all players (or filtered by skill level)
router.post(
  '/assign-workout-all',
  [
    body('workoutId')
      .notEmpty()
      .withMessage('Workout ID is required')
      .isMongoId()
      .withMessage('Invalid workout ID'),
    body('skillLevel')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid skill level'),
    handleValidationErrors
  ],
  assignWorkoutToAll
);

// ==================== DASHBOARD & ANALYTICS ====================

// Get coach dashboard statistics
router.get('/dashboard', getDashboardStats);

// Compare players by metric
router.get('/compare', compareMyPlayers);

module.exports = router;
