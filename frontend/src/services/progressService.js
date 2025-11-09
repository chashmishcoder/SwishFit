/**
 * Progress Service
 * Handles progress tracking and analytics API calls
 */

import api from './api';

const progressService = {
  /**
   * Log workout progress
   * @param {Object} progressData - Progress data
   * @returns {Promise<Object>} Created progress entry
   */
  logProgress: async (progressData) => {
    return api.post('/progress', progressData);
  },

  /**
   * Get player progress with filters
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters (startDate, endDate, workout, limit, page)
   * @returns {Promise<Object>} Progress entries
   */
  getPlayerProgress: async (playerId, params = {}) => {
    return api.get(`/progress/player/${playerId}`, { params });
  },

  /**
   * Get current user's progress
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Progress entries
   */
  getMyProgress: async (params = {}) => {
    return api.get('/progress/my-progress', { params });
  },

  /**
   * Get progress analytics
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters (period: 7, 14, 30, 60, 90)
   * @returns {Promise<Object>} Analytics data
   */
  getAnalytics: async (playerId, params = {}) => {
    return api.get(`/progress/analytics/${playerId}`, { params });
  },

  /**
   * Get workout statistics
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Workout statistics
   */
  getWorkoutStats: async (playerId, params = {}) => {
    return api.get(`/progress/stats/${playerId}`, { params });
  },

  /**
   * Update progress entry
   * @param {string} progressId - Progress entry ID
   * @param {Object} progressData - Updated progress data
   * @returns {Promise<Object>} Updated progress entry
   */
  updateProgress: async (progressId, progressData) => {
    return api.put(`/progress/${progressId}`, progressData);
  },

  /**
   * Delete progress entry
   * @param {string} progressId - Progress entry ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteProgress: async (progressId) => {
    return api.delete(`/progress/${progressId}`);
  },

  /**
   * Get AI performance analysis
   * @param {string} playerId - Player ID (optional, defaults to current user)
   * @param {Object} data - Request data (days: 7, 14, 30, 60, 90)
   * @returns {Promise<Object>} AI analysis and recommendations
   */
  analyzePerformance: async (playerId = null, data = {}) => {
    return api.post('/progress/analyze', {
      playerId,
      days: data.days || data.params?.days || 30
    });
  },

  /**
   * Get progress by date range
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Progress entries
   */
  getProgressByDateRange: async (startDate, endDate, params = {}) => {
    return api.get('/progress/my-progress', { params: { startDate, endDate, ...params } });
  },

  /**
   * Get progress summary
   * @returns {Promise<Object>} Summary statistics
   */
  getProgressSummary: async () => {
    return api.get('/progress/my-progress', { params: { limit: 1000 } });
  },
};

export default progressService;
