const jwt = require('jsonwebtoken');

/**
 * JWT Utilities for token generation and verification
 */

/**
 * Generate JWT token for a user
 * @param {String} userId - User's MongoDB _id
 * @param {String} role - User's role (player/coach/admin)
 * @returns {String} JWT token
 */
const generateToken = (userId, role) => {
  if (!userId || !role) {
    throw new Error('UserId and role are required to generate token');
  }

  const payload = {
    id: userId,
    role: role
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d', // 7 days default
      issuer: 'swishfit-india',
      audience: 'swishfit-users'
    }
  );

  return token;
};

/**
 * Verify and decode JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required for verification');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        issuer: 'swishfit-india',
        audience: 'swishfit-users'
      }
    );

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired. Please login again.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token. Please login again.');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet.');
    } else {
      throw new Error('Token verification failed.');
    }
  }
};

/**
 * Generate refresh token (longer expiry)
 * @param {String} userId - User's MongoDB _id
 * @returns {String} Refresh token
 */
const generateRefreshToken = (userId) => {
  if (!userId) {
    throw new Error('UserId is required to generate refresh token');
  }

  const payload = {
    id: userId,
    type: 'refresh'
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: '30d', // 30 days for refresh token
      issuer: 'swishfit-india',
      audience: 'swishfit-users'
    }
  );

  return token;
};

/**
 * Verify refresh token
 * @param {String} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  if (!token) {
    throw new Error('Refresh token is required for verification');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        issuer: 'swishfit-india',
        audience: 'swishfit-users'
      }
    );

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired. Please login again.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token. Please login again.');
    } else {
      throw new Error('Refresh token verification failed.');
    }
  }
};

/**
 * Decode token without verification (useful for debugging)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload (unverified)
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired without throwing error
 * @param {String} token - JWT token to check
 * @returns {Boolean} True if expired, false if valid
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiry time
 * @param {String} token - JWT token
 * @returns {Date|null} Expiry date or null if invalid
 */
const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiry
};
