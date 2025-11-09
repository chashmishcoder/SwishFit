import api from './api';

/**
 * Workout Service
 * Handles all workout-related API calls
 */
const workoutService = {
  /**
   * Get all workouts with optional filters
   * @param {Object} filters - Query parameters (skillLevel, category, isPublic, search, page, limit)
   * @returns {Promise<Object>} Workouts list with pagination
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query string
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/workouts?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch workouts' };
    }
  },

  /**
   * Get single workout by ID
   * @param {string} id - Workout ID
   * @returns {Promise<Object>} Workout details
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch workout' };
    }
  },

  /**
   * Create new workout
   * @param {Object} workoutData - Workout information
   * @returns {Promise<Object>} Created workout
   */
  create: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create workout' };
    }
  },

  /**
   * Generate AI-powered workout
   * @param {Object} playerData - Player profile and preferences
   * @returns {Promise<Object>} Generated workout with AI insights
   */
  generateAI: async (playerData) => {
    try {
      const response = await api.post('/workouts/generate', playerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to generate AI workout' };
    }
  },

  /**
   * Update existing workout
   * @param {string} id - Workout ID
   * @param {Object} workoutData - Updated workout data
   * @returns {Promise<Object>} Updated workout
   */
  update: async (id, workoutData) => {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update workout' };
    }
  },

  /**
   * Delete workout
   * @param {string} id - Workout ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete workout' };
    }
  },

  /**
   * Assign workout to players
   * @param {string} id - Workout ID
   * @param {Array<string>} playerIds - Array of player IDs
   * @returns {Promise<Object>} Updated workout
   */
  assign: async (id, playerIds) => {
    try {
      const response = await api.post(`/workouts/${id}/assign`, { playerIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to assign workout' };
    }
  },

  /**
   * Unassign workout from players
   * @param {string} id - Workout ID
   * @param {Array<string>} playerIds - Array of player IDs
   * @returns {Promise<Object>} Updated workout
   */
  unassign: async (id, playerIds) => {
    try {
      const response = await api.post(`/workouts/${id}/unassign`, { playerIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to unassign workout' };
    }
  },

  /**
   * Get workouts created by logged-in coach
   * @returns {Promise<Object>} Coach's workouts
   */
  getMyCreated: async () => {
    try {
      const response = await api.get('/workouts/my/created');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch your workouts' };
    }
  },

  /**
   * Get popular workouts
   * @param {number} limit - Number of workouts to return
   * @returns {Promise<Object>} Popular workouts
   */
  getPopular: async (limit = 10) => {
    try {
      const response = await api.get(`/workouts/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch popular workouts' };
    }
  }
};

export default workoutService;
