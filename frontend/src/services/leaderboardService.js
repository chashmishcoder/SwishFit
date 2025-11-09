/**
 * Leaderboard Service
 * Handles leaderboard and ranking API calls
 */

import api from './api';

const leaderboardService = {
  /**
   * Get global leaderboard
   * @param {Object} params - Query parameters (period, limit, page)
   * @returns {Promise<Object>} Leaderboard data
   */
  getGlobalLeaderboard: async (params = {}) => {
    return api.get('/leaderboard', { params });
  },

  /**
   * Get team leaderboard
   * @param {string} teamId - Team ID
   * @param {Object} params - Query parameters (period, limit, page)
   * @returns {Promise<Object>} Team leaderboard data
   */
  getTeamLeaderboard: async (teamId, params = {}) => {
    return api.get(`/leaderboard/team/${teamId}`, { params });
  },

  /**
   * Get player rank
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Player rank details
   */
  getPlayerRank: async (playerId) => {
    return api.get(`/leaderboard/player/${playerId}`);
  },

  /**
   * Get current user's rank
   * @returns {Promise<Object>} Current user's rank
   */
  getMyRank: async () => {
    return api.get('/leaderboard/my-rank');
  },

  /**
   * Get top performers
   * @param {Object} params - Query parameters (limit, period)
   * @returns {Promise<Object>} Top performers list
   */
  getTopPerformers: async (params = {}) => {
    return api.get('/leaderboard/top-performers', { params });
  },

  /**
   * Get leaderboard statistics
   * @returns {Promise<Object>} Overall leaderboard stats
   */
  getLeaderboardStats: async () => {
    return api.get('/leaderboard/stats');
  },

  /**
   * Compare players
   * @param {string} playerId - Player ID to compare with
   * @returns {Promise<Object>} Comparison data
   */
  comparePlayers: async (playerId) => {
    return api.get(`/leaderboard/compare/${playerId}`);
  },

  /**
   * Get skill level leaderboard
   * @param {string} skillLevel - Skill level (beginner, intermediate, advanced)
   * @param {Object} params - Query parameters (limit, page)
   * @returns {Promise<Object>} Skill-level leaderboard
   */
  getSkillLevelLeaderboard: async (skillLevel, params = {}) => {
    return api.get(`/leaderboard/skill/${skillLevel}`, { params });
  },

  /**
   * Get leaderboard history
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise<Object>} Historical leaderboard data
   */
  getLeaderboardHistory: async (params = {}) => {
    return api.get('/leaderboard/history', { params });
  },

  /**
   * Update all rankings (Admin only)
   * @returns {Promise<Object>} Update confirmation
   */
  updateAllRankings: async () => {
    return api.post('/leaderboard/update-rankings');
  },

  /**
   * Award achievement to player (Admin only)
   * @param {string} playerId - Player ID
   * @param {Object} achievementData - Achievement details
   * @returns {Promise<Object>} Updated player data
   */
  awardAchievement: async (playerId, achievementData) => {
    return api.post(`/leaderboard/achievement/${playerId}`, achievementData);
  },

  /**
   * Reset weekly points (Admin only)
   * @returns {Promise<Object>} Reset confirmation
   */
  resetWeeklyPoints: async () => {
    return api.post('/leaderboard/reset-weekly');
  },

  /**
   * Reset monthly points (Admin only)
   * @returns {Promise<Object>} Reset confirmation
   */
  resetMonthlyPoints: async () => {
    return api.post('/leaderboard/reset-monthly');
  },
};

export default leaderboardService;
