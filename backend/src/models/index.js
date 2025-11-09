/**
 * Models Index
 * Central export point for all Mongoose models
 */

const User = require('./User');
const Workout = require('./Workout');
const Progress = require('./Progress');
const Leaderboard = require('./Leaderboard');

module.exports = {
  User,
  Workout,
  Progress,
  Leaderboard
};
