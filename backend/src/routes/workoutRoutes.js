const express = require('express');
const router = express.Router();
const {
  generateAIWorkout,
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  assignWorkout,
  unassignWorkout,
  getMyWorkouts,
  getPopularWorkouts
} = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/auth');
const { validateWorkoutCreation, validateWorkoutUpdate, validateMongoId, validatePagination, validateWorkoutAssignment, validateAIWorkoutGeneration } = require('../middleware/validation');

/**
 * Workout Routes
 * All routes require authentication (protect middleware)
 */

// Special routes (must be before /:id routes)
router.post(
  '/generate',
  protect,
  authorize('coach', 'admin'),
  validateAIWorkoutGeneration,
  generateAIWorkout
);

router.get(
  '/my/created',
  protect,
  authorize('coach', 'admin'),
  getMyWorkouts
);

router.get(
  '/popular',
  protect,
  getPopularWorkouts
);

// Main CRUD routes
router
  .route('/')
  .get(protect, validatePagination, getWorkouts)
  .post(protect, authorize('coach', 'admin'), validateWorkoutCreation, createWorkout);

router
  .route('/:id')
  .get(protect, ...validateMongoId('id'), getWorkout)
  .put(protect, authorize('coach', 'admin'), ...validateMongoId('id'), validateWorkoutUpdate, updateWorkout)
  .delete(protect, authorize('coach', 'admin'), ...validateMongoId('id'), deleteWorkout);

// Assignment routes
router.post(
  '/:id/assign',
  protect,
  authorize('coach', 'admin'),
  ...validateMongoId('id'),
  validateWorkoutAssignment,
  assignWorkout
);

router.post(
  '/:id/unassign',
  protect,
  authorize('coach', 'admin'),
  ...validateMongoId('id'),
  validateWorkoutAssignment,
  unassignWorkout
);

module.exports = router;
