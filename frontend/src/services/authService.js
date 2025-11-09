import api from './api';

/**
 * Authentication Service
 * Handles user registration, login, logout, and auth state
 */
const authService = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response with user and token
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data.token) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      throw { 
        error: errorData.message || errorData.error || 'Registration failed. Please try again.' 
      };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Response with user and token
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data.token) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage = errorData.message || errorData.error || 'Login failed. Please check your credentials.';
      throw { 
        error: errorMessage
      };
    }
  },

  /**
   * Logout user
   * Clears localStorage and calls logout endpoint
   */
  logout: async () => {
    try {
      // Call backend logout endpoint (optional)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get current user token
   * @returns {string|null} JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Get current user from backend (refreshes user data)
   * @returns {Promise<Object>} User data with leaderboard
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user data' };
    }
  },

  /**
   * Update password
   * @param {Object} passwordData - Current, new, and confirm passwords
   * @returns {Promise<Object>} Success response
   */
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update password' };
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Success response
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to send reset email' };
    }
  },

  /**
   * Reset password with token
   * @param {string} resetToken - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success response
   */
  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to reset password' };
    }
  }
};

export default authService;
