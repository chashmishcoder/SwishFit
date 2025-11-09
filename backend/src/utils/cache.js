const NodeCache = require('node-cache');

/**
 * Cache Utility
 * Provides centralized caching functionality using node-cache
 * Reduces database queries for frequently accessed data
 */

// Create cache instance with default TTL of 10 minutes
const cache = new NodeCache({
  stdTTL: 600, // Default: 10 minutes (600 seconds)
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Don't clone data for better performance
  deleteOnExpire: true // Automatically delete expired keys
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {any} Cached value or undefined
 */
const get = (key) => {
  try {
    const value = cache.get(key);
    if (value !== undefined) {
      console.log(`✅ Cache HIT: ${key}`);
    } else {
      console.log(`❌ Cache MISS: ${key}`);
    }
    return value;
  } catch (err) {
    console.error('Cache get error:', err);
    return undefined;
  }
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} Success status
 */
const set = (key, value, ttl) => {
  try {
    const success = cache.set(key, value, ttl);
    if (success) {
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl || 'default'}s)`);
    }
    return success;
  } catch (err) {
    console.error('Cache set error:', err);
    return false;
  }
};

/**
 * Delete specific key from cache
 * @param {string} key - Cache key to delete
 * @returns {number} Number of deleted keys
 */
const del = (key) => {
  try {
    const deletedCount = cache.del(key);
    if (deletedCount > 0) {
      console.log(`🗑️  Cache DELETE: ${key}`);
    }
    return deletedCount;
  } catch (err) {
    console.error('Cache delete error:', err);
    return 0;
  }
};

/**
 * Delete multiple keys from cache
 * @param {string[]} keys - Array of cache keys to delete
 * @returns {number} Number of deleted keys
 */
const delMany = (keys) => {
  try {
    const deletedCount = cache.del(keys);
    if (deletedCount > 0) {
      console.log(`🗑️  Cache DELETE (multiple): ${keys.join(', ')}`);
    }
    return deletedCount;
  } catch (err) {
    console.error('Cache delete many error:', err);
    return 0;
  }
};

/**
 * Clear all cache
 */
const flush = () => {
  try {
    cache.flushAll();
    console.log('🧹 Cache FLUSHED: All keys cleared');
  } catch (err) {
    console.error('Cache flush error:', err);
  }
};

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {boolean} True if key exists
 */
const has = (key) => {
  return cache.has(key);
};

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
const getStats = () => {
  return cache.getStats();
};

/**
 * Get all cache keys
 * @returns {string[]} Array of cache keys
 */
const keys = () => {
  return cache.keys();
};

/**
 * Get TTL for a specific key
 * @param {string} key - Cache key
 * @returns {number} TTL in seconds, or undefined if key doesn't exist
 */
const getTtl = (key) => {
  return cache.getTtl(key);
};

/**
 * Update TTL for a specific key
 * @param {string} key - Cache key
 * @param {number} ttl - New TTL in seconds
 * @returns {boolean} Success status
 */
const updateTtl = (key, ttl) => {
  return cache.ttl(key, ttl);
};

/**
 * Generate cache key for leaderboard
 * @param {string} type - 'global' or 'team'
 * @param {string} teamId - Team ID (optional for team leaderboard)
 * @returns {string} Cache key
 */
const leaderboardKey = (type = 'global', teamId = null) => {
  return teamId ? `leaderboard:${type}:${teamId}` : `leaderboard:${type}`;
};

/**
 * Generate cache key for user profile
 * @param {string} userId - User ID
 * @returns {string} Cache key
 */
const userKey = (userId) => {
  return `user:${userId}`;
};

/**
 * Generate cache key for workout
 * @param {string} workoutId - Workout ID
 * @returns {string} Cache key
 */
const workoutKey = (workoutId) => {
  return `workout:${workoutId}`;
};

/**
 * Generate cache key for coach dashboard stats
 * @param {string} coachId - Coach ID
 * @returns {string} Cache key
 */
const coachStatsKey = (coachId) => {
  return `coach:stats:${coachId}`;
};

/**
 * Generate cache key for player progress
 * @param {string} playerId - Player ID
 * @returns {string} Cache key
 */
const playerProgressKey = (playerId) => {
  return `player:progress:${playerId}`;
};

/**
 * Invalidate all related caches when data changes
 * @param {string} type - Type of data changed ('workout', 'progress', 'user', 'leaderboard')
 * @param {string} id - Related ID
 */
const invalidateRelated = (type, id = null) => {
  const patterns = {
    workout: ['workout:', 'coach:stats:', 'player:progress:'],
    progress: ['player:progress:', 'leaderboard:', 'coach:stats:'],
    user: ['user:', 'leaderboard:', 'coach:stats:'],
    leaderboard: ['leaderboard:']
  };

  const keysToDelete = keys().filter(key => {
    return patterns[type]?.some(pattern => key.startsWith(pattern));
  });

  if (keysToDelete.length > 0) {
    delMany(keysToDelete);
  }
};

// Export all functions
module.exports = {
  get,
  set,
  del,
  delMany,
  flush,
  has,
  getStats,
  keys,
  getTtl,
  updateTtl,
  leaderboardKey,
  userKey,
  workoutKey,
  coachStatsKey,
  playerProgressKey,
  invalidateRelated,
  cache // Export raw cache instance for advanced usage
};
