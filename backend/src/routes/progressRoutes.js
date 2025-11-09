const express = require('express');
const router = express.Router();
const {
  logProgress,
  getPlayerProgress,
  getMyProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getAnalytics,
  getWorkoutStats,
  analyzePerformance
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');
const { validateProgressLog } = require('../middleware/validation');

// ==================== PROGRESS LOGGING ====================

// Log new progress entry (Player only)
router.post(
  '/',
  protect,
  authorize('player'),
  validateProgressLog,
  logProgress
);

// ==================== GET PROGRESS ====================

// Get my progress (logged in player/coach/admin)
router.get(
  '/my-progress',
  protect,
  authorize('player', 'coach', 'admin'),
  getMyProgress
);

// Get player progress (Player can view own, Coach can view assigned)
router.get(
  '/player/:playerId',
  protect,
  getPlayerProgress
);

// Get single progress entry by ID
router.get(
  '/:id',
  protect,
  getProgressById
);

// ==================== ANALYTICS & STATS ====================

// Get performance analytics for a player
router.get(
  '/analytics/:playerId',
  protect,
  getAnalytics
);

// Get workout statistics and trends
router.get(
  '/stats/:playerId',
  protect,
  getWorkoutStats
);

// AI Performance Analysis using Gemini (Player, Coach, Admin)
router.post(
  '/analyze',
  protect,
  analyzePerformance
);

// ==================== UPDATE & DELETE ====================

// Update progress entry (Player updates own, Coach adds feedback)
router.put(
  '/:id',
  protect,
  updateProgress
);

// Delete progress entry (soft delete)
router.delete(
  '/:id',
  protect,
  authorize('player'),
  deleteProgress
);

module.exports = router;
