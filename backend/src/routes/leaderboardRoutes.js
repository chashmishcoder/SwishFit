const express = require('express');
const router = express.Router();
const {
  getGlobalLeaderboard,
  getTeamLeaderboard,
  getPlayerRank,
  getMyRank,
  getTopPerformers,
  updateAllRankings,
  getLeaderboardStats,
  awardAchievement,
  resetWeeklyPoints,
  resetMonthlyPoints,
  getLeaderboardHistory,
  getSkillLevelLeaderboard,
  comparePlayers
} = require('../controllers/leaderboardController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// ==================== PUBLIC LEADERBOARDS ====================

// Get global leaderboard
router.get(
  '/',
  protect,
  getGlobalLeaderboard
);

// Get leaderboard statistics
router.get(
  '/stats',
  protect,
  getLeaderboardStats
);

// Get my leaderboard rank (logged in player/coach)
router.get(
  '/my-rank',
  protect,
  authorize('player', 'coach', 'admin'),
  getMyRank
);

// Get leaderboard history (weekly/monthly)
router.get(
  '/history/:period',
  protect,
  getLeaderboardHistory
);

// Get top performers by metric
router.get(
  '/top/:metric',
  protect,
  getTopPerformers
);

// Get skill level leaderboard
router.get(
  '/skill/:skillLevel',
  protect,
  getSkillLevelLeaderboard
);

// Compare two players
router.get(
  '/compare/:playerId1/:playerId2',
  protect,
  comparePlayers
);

// Get team leaderboard
router.get(
  '/team/:teamId',
  protect,
  getTeamLeaderboard
);

// Get player leaderboard entry and rank
router.get(
  '/player/:playerId',
  protect,
  getPlayerRank
);

// ==================== ADMIN OPERATIONS ====================

// Update all rankings (Admin only)
router.post(
  '/update-rankings',
  protect,
  authorize('admin'),
  updateAllRankings
);

// Award achievement to player (Admin/Coach only)
router.post(
  '/achievement/:playerId',
  protect,
  authorize('coach', 'admin'),
  [
    body('achievementId')
      .notEmpty()
      .withMessage('Achievement ID is required'),
    body('title')
      .notEmpty()
      .withMessage('Achievement title is required'),
    body('description')
      .optional()
      .trim(),
    body('category')
      .optional()
      .isIn(['workout', 'shooting', 'streak', 'milestone', 'special'])
      .withMessage('Invalid achievement category'),
    body('points')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Points must be a non-negative integer'),
    handleValidationErrors
  ],
  awardAchievement
);

// Reset weekly points (Admin only)
router.post(
  '/reset-weekly',
  protect,
  authorize('admin'),
  resetWeeklyPoints
);

// Reset monthly points (Admin only)
router.post(
  '/reset-monthly',
  protect,
  authorize('admin'),
  resetMonthlyPoints
);

module.exports = router;
