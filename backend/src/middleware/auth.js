const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

/**
 * Protect routes - Verify JWT token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (if using cookie-based auth)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Find user by id from token payload
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token may be invalid.'
        });
      }

      // Check if user account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Attach user to request object
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Not authorized to access this route.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Authorize specific roles
 * @param {...String} roles - Allowed roles (e.g., 'player', 'coach', 'admin')
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is attached to request (protect middleware must run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login first.'
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication - Attach user if token exists, but don't require it
 * Useful for routes that work differently for authenticated/unauthenticated users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, just continue without attaching user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Find user by id
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive) {
        // Attach user to request if valid
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
      }
    } catch (error) {
      // Token invalid, but that's okay for optional auth
      // Just continue without user attached
    }

    next();
  } catch (error) {
    // Don't fail the request, just continue without user
    next();
  }
};

/**
 * Check if user owns the resource or is admin
 * @param {String} resourceUserIdField - Field name in req.params or req.body that contains the user ID
 * @returns {Function} Express middleware function
 */
const checkOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login first.'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Get resource user ID from params or body
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (!resourceUserId) {
      return res.status(400).json({
        success: false,
        message: `Resource user ID field '${resourceUserIdField}' not found`
      });
    }

    // Check if user owns the resource
    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

/**
 * Check if coach has access to player's data
 * @param {String} playerIdField - Field name that contains the player ID
 * @returns {Function} Express middleware function
 */
const checkCoachAccess = (playerIdField = 'playerId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Please login first.'
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Get player ID from params or body
      const playerId = req.params[playerIdField] || req.body[playerIdField];

      if (!playerId) {
        return res.status(400).json({
          success: false,
          message: `Player ID field '${playerIdField}' not found`
        });
      }

      // If user is the player themselves, allow access
      if (req.user._id.toString() === playerId.toString()) {
        return next();
      }

      // If user is a coach, check if player is assigned to them
      if (req.user.role === 'coach') {
        const player = await User.findById(playerId);

        if (!player) {
          return res.status(404).json({
            success: false,
            message: 'Player not found'
          });
        }

        if (player.coachId && player.coachId.toString() === req.user._id.toString()) {
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this player\'s data'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization check',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

/**
 * Rate limiting helper - Track requests by user
 * @param {Number} maxRequests - Maximum requests allowed
 * @param {Number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const userKey = `${userId}-${Math.floor(now / windowMs)}`;

    const currentCount = requestCounts.get(userKey) || 0;

    if (currentCount >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    requestCounts.set(userKey, currentCount + 1);

    // Clean up old entries
    if (requestCounts.size > 10000) {
      const cutoff = Math.floor(now / windowMs) - 1;
      for (const [key] of requestCounts) {
        const keyTime = parseInt(key.split('-')[1]);
        if (keyTime < cutoff) {
          requestCounts.delete(key);
        }
      }
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  checkCoachAccess,
  userRateLimit
};
