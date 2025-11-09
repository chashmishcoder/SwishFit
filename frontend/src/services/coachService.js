/**
 * Coach Service
 * Handles coach-specific API calls for player management
 */

import api from './api';

const coachService = {
  /**
   * Get all players assigned to coach
   * @param {Object} params - Query parameters (skillLevel, active)
   * @returns {Promise<Object>} List of assigned players
   */
  getMyPlayers: async (params = {}) => {
    return api.get('/coach/players', { params });
  },

  /**
   * Get player overview
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Player overview data
   */
  getPlayerOverview: async (playerId) => {
    return api.get(`/coach/players/${playerId}`);
  },

  /**
   * Get player progress
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters (limit, page, startDate, endDate)
   * @returns {Promise<Object>} Player progress data
   */
  getPlayerProgress: async (playerId, params = {}) => {
    return api.get(`/coach/players/${playerId}/progress`, { params });
  },

  /**
   * Add feedback to progress entry
   * @param {string} progressId - Progress entry ID
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise<Object>} Updated progress entry
   */
  addFeedback: async (progressId, feedbackData) => {
    return api.put(`/coach/feedback/${progressId}`, feedbackData);
  },

  /**
   * Assign workout to player
   * @param {Object} assignmentData - Assignment details (playerId, workoutId)
   * @returns {Promise<Object>} Assignment confirmation
   */
  assignWorkout: async (assignmentData) => {
    return api.post('/coach/assign-workout', assignmentData);
  },

  /**
   * Unassign workout from player
   * @param {Object} unassignmentData - Unassignment details (playerId, workoutId)
   * @returns {Promise<Object>} Unassignment confirmation
   */
  unassignWorkout: async (unassignmentData) => {
    return api.post('/coach/unassign-workout', unassignmentData);
  },

  /**
   * Assign workout to all players
   * @param {Object} assignmentData - Assignment details (workoutId)
   * @returns {Promise<Object>} Assignment confirmation
   */
  assignWorkoutToAll: async (assignmentData) => {
    return api.post('/coach/assign-workout-all', assignmentData);
  },

  /**
   * Get coach dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  getDashboardStats: async () => {
    return api.get('/coach/dashboard');
  },

  /**
   * Compare players
   * @param {Array<string>} playerIds - Array of player IDs to compare
   * @returns {Promise<Object>} Comparison data
   */
  compareMyPlayers: async (playerIds) => {
    return api.post('/coach/compare-players', { playerIds });
  },

  /**
   * Get player statistics summary
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters (period)
   * @returns {Promise<Object>} Player statistics
   */
  getPlayerStats: async (playerId, params = {}) => {
    return api.get(`/coach/players/${playerId}/stats`, { params });
  },

  /**
   * Get all feedback for a player
   * @param {string} playerId - Player ID
   * @param {Object} params - Query parameters (limit, page)
   * @returns {Promise<Object>} Feedback history
   */
  getPlayerFeedback: async (playerId, params = {}) => {
    return api.get(`/coach/players/${playerId}/feedback`, { params });
  },

  /**
   * Get assigned workouts for a player
   * @param {string} playerId - Player ID
   * @returns {Promise<Object>} Assigned workouts
   */
  getPlayerWorkouts: async (playerId) => {
    return api.get(`/coach/players/${playerId}/workouts`);
  },

  /**
   * Bulk feedback submission
   * @param {Array<Object>} feedbackList - Array of feedback objects
   * @returns {Promise<Object>} Submission confirmation
   */
  bulkFeedback: async (feedbackList) => {
    return api.post('/coach/bulk-feedback', { feedbackList });
  },
};

export default coachService;
