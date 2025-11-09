/**
 * Services Index
 * Central export point for all API services
 */

export { default as api } from './api';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as workoutService } from './workoutService';
export { default as progressService } from './progressService';
export { default as leaderboardService } from './leaderboardService';
export { default as coachService } from './coachService';
export { default as healthService } from './healthService';
export { default as apiUtils } from './apiUtils';

// Re-export for convenience
import api from './api';
import authService from './authService';
import userService from './userService';
import workoutService from './workoutService';
import progressService from './progressService';
import leaderboardService from './leaderboardService';
import coachService from './coachService';
import healthService from './healthService';
import apiUtils from './apiUtils';

/**
 * Unified services object
 * Usage: import services from '@/services'
 * Then: services.auth.login(), services.workout.getAll(), etc.
 */
export default {
  api,
  auth: authService,
  user: userService,
  workout: workoutService,
  progress: progressService,
  leaderboard: leaderboardService,
  coach: coachService,
  health: healthService,
  utils: apiUtils,
};
