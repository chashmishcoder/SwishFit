/**
 * Health Service
 * Handles server health checks and system status
 */

import api from './api';

const healthService = {
  /**
   * Check server health
   * @returns {Promise<Object>} Server health status
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return {
        status: 'Error',
        message: error.message,
        database: 'unknown'
      };
    }
  },

  /**
   * Get API version
   * @returns {Promise<Object>} API version info
   */
  getVersion: async () => {
    try {
      const response = await api.get('/version');
      return response.data;
    } catch (error) {
      return { version: 'unknown', error: error.message };
    }
  },

  /**
   * Ping server
   * @returns {Promise<boolean>} True if server is reachable
   */
  ping: async () => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};

export default healthService;
