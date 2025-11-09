import api from './api';

/**
 * User Service
 * Handles user profile and user-related API calls
 */
const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile with populated data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      // Update user in localStorage if successful
      if (response.data.success) {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          const updatedUser = { ...user, ...response.data.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  /**
   * Get all players (Coach/Admin only)
   * @param {Object} filters - Query parameters (page, limit, skillLevel, etc.)
   * @returns {Promise<Object>} Players list
   */
  getPlayers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/users/players?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch players' };
    }
  },

  /**
   * Get all coaches (Admin only)
   * @param {Object} filters - Query parameters (page, limit)
   * @returns {Promise<Object>} Coaches list
   */
  getCoaches: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/users/coaches?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch coaches' };
    }
  },

  /**
   * Assign coach to player
   * @param {string} userId - Player user ID
   * @param {string} coachId - Coach ID to assign
   * @returns {Promise<Object>} Success response
   */
  assignCoach: async (userId, coachId) => {
    try {
      const response = await api.put(`/users/${userId}/assign-coach`, { coachId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to assign coach' };
    }
  },

  /**
   * Deactivate user account
   * @returns {Promise<Object>} Success message
   */
  deactivateAccount: async () => {
    try {
      const response = await api.delete('/users/profile');
      
      // Clear localStorage after deactivation
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to deactivate account' };
    }
  }
};

export default userService;
