import api from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

const adminService = {
  // ==================== DASHBOARD STATS ====================
  
  /**
   * Get admin dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    try {
      const [coachesRes, playersRes, leaderboardRes, workoutsRes] = await Promise.all([
        api.get('/users/coaches'),
        api.get('/users/players'),
        api.get('/leaderboard', { params: { limit: 10 } }),
        api.get('/workouts', { params: { limit: 1000 } }) // Get all workouts for count
      ]);

      // Backend returns: { success, data: { players: [...] } } or { coaches: [...] }
      const coaches = coachesRes.data?.data?.coaches || [];
      const players = playersRes.data?.data?.players || [];
      const leaderboard = leaderboardRes.data?.data || [];
      const workouts = workoutsRes.data?.data || [];

      return {
        totalUsers: coaches.length + players.length,
        totalCoaches: coaches.length,
        totalPlayers: players.length,
        totalWorkouts: workouts.length,
        activeUsers: leaderboard.length
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return {
        totalUsers: 0,
        totalCoaches: 0,
        totalPlayers: 0,
        totalWorkouts: 0,
        activeUsers: 0
      };
    }
  },

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users (players and coaches)
   * @param {Object} params - Query parameters (page, limit, search, role)
   * @returns {Promise} Users list
   */
  getAllUsers: async (params = {}) => {
    try {
      const [playersRes, coachesRes] = await Promise.all([
        api.get('/users/players', { params }),
        api.get('/users/coaches', { params })
      ]);
      
      // Backend returns: { success, data: { players: [...], pagination: {...} } }
      // or { success, data: { coaches: [...], pagination: {...} } }
      const players = playersRes.data?.data?.players || [];
      const coaches = coachesRes.data?.data?.coaches || [];
      
      return {
        success: true,
        data: [...players, ...coaches],
        pagination: {
          total: players.length + coaches.length,
          players: players.length,
          coaches: coaches.length
        }
      };
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          players: 0,
          coaches: 0
        }
      };
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} User details
   */
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} role - New role (player, coach, admin)
   * @returns {Promise} Updated user
   */
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}`, { role });
    return response.data;
  },

  /**
   * Assign coach to player
   * @param {string} playerId - Player ID
   * @param {string} coachId - Coach ID
   * @returns {Promise} Updated player
   */
  assignCoach: async (playerId, coachId) => {
    const response = await api.put(`/users/${playerId}/assign-coach`, { coachId });
    return response.data;
  },

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Promise} Success response
   */
  deactivateUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get all players
   * @param {Object} params - Query parameters
   * @returns {Promise} Players list
   */
  getPlayers: async (params = {}) => {
    const response = await api.get('/users/players', { params });
    return response.data;
  },

  /**
   * Get all coaches
   * @param {Object} params - Query parameters
   * @returns {Promise} Coaches list
   */
  getCoaches: async (params = {}) => {
    const response = await api.get('/users/coaches', { params });
    return response.data;
  },

  // ==================== WORKOUT MANAGEMENT ====================
  
  /**
   * Get all workouts
   * @param {Object} params - Query parameters (page, limit, category, difficulty)
   * @returns {Promise} Workouts list
   */
  getAllWorkouts: async (params = {}) => {
    const response = await api.get('/workouts', { params: { ...params, limit: params.limit || 50 } });
    return response.data;
  },

  /**
   * Delete workout
   * @param {string} workoutId - Workout ID
   * @returns {Promise} Success response
   */
  deleteWorkout: async (workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
  },

  /**
   * Update workout
   * @param {string} workoutId - Workout ID
   * @param {Object} data - Workout data
   * @returns {Promise} Updated workout
   */
  updateWorkout: async (workoutId, data) => {
    const response = await api.put(`/workouts/${workoutId}`, data);
    return response.data;
  },

  // ==================== LEADERBOARD MANAGEMENT ====================
  
  /**
   * Update all leaderboard rankings
   * @returns {Promise} Success response
   */
  updateRankings: async () => {
    const response = await api.post('/leaderboard/update-rankings');
    return response.data;
  },

  /**
   * Award achievement to player
   * @param {string} playerId - Player ID
   * @param {Object} achievement - Achievement data
   * @returns {Promise} Success response
   */
  awardAchievement: async (playerId, achievement) => {
    const response = await api.post(`/leaderboard/achievement/${playerId}`, achievement);
    return response.data;
  },

  /**
   * Reset weekly points
   * @returns {Promise} Success response
   */
  resetWeeklyPoints: async () => {
    const response = await api.post('/leaderboard/reset-weekly');
    return response.data;
  },

  /**
   * Reset monthly points
   * @returns {Promise} Success response
   */
  resetMonthlyPoints: async () => {
    const response = await api.post('/leaderboard/reset-monthly');
    return response.data;
  },

  /**
   * Get global leaderboard
   * @param {Object} params - Query parameters
   * @returns {Promise} Leaderboard data
   */
  getLeaderboard: async (params = {}) => {
    const response = await api.get('/leaderboard', { params });
    return response.data;
  },

  // ==================== ANALYTICS ====================
  
  /**
   * Get system analytics
   * @returns {Promise} Analytics data
   */
  getAnalytics: async () => {
    try {
      const [leaderboard, workouts, players] = await Promise.all([
        api.get('/leaderboard', { params: { limit: 100 } }),
        api.get('/workouts', { params: { limit: 100 } }),
        api.get('/users/players', { params: { limit: 100 } })
      ]);

      const leaderboardData = leaderboard.data?.data || [];
      const workoutsData = workouts.data?.data || [];
      const playersData = players.data?.data || [];

    // Calculate analytics
    const totalWorkouts = leaderboardData.reduce((sum, user) => sum + (user.stats?.totalWorkouts || 0), 0);
    const avgCompletionRate = leaderboardData.reduce((sum, user) => sum + (user.stats?.completionRate || 0), 0) / (leaderboardData.length || 1);
    const activeToday = playersData.filter(p => {
      const lastActive = new Date(p.lastActive);
      const today = new Date();
      return lastActive.toDateString() === today.toDateString();
    }).length;

    // Workout categories distribution
    const categoryDistribution = workoutsData.reduce((acc, workout) => {
      acc[workout.category] = (acc[workout.category] || 0) + 1;
      return acc;
    }, {});

    // Activity trend (last 7 days)
    const activityTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 50) + 10 // Mock data - replace with real API
      };
    });

      return {
        success: true,
        data: {
          totalWorkouts,
          avgCompletionRate: avgCompletionRate.toFixed(1),
          activeToday,
          categoryDistribution,
          activityTrend,
          topPerformers: leaderboardData.slice(0, 5),
          recentWorkouts: workoutsData.slice(0, 5)
        }
      };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      return {
        success: false,
        data: {
          totalWorkouts: 0,
          avgCompletionRate: '0.0',
          activeToday: 0,
          categoryDistribution: {},
          activityTrend: [],
          topPerformers: [],
          recentWorkouts: []
        }
      };
    }
  }
};

export default adminService;
