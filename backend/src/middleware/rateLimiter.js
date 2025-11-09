const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse by limiting request rates
 */

/**
 * General API Rate Limiter
 * Applied to all API routes
 * Limits: 1000 requests per 15 minutes per IP
 * (Increased from 100 to allow normal dashboard usage with multiple API calls)
 */
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs (allows ~1 req/sec average)
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Authentication Rate Limiter
 * Applied to login and register endpoints
 * Limits: 10 attempts per 15 minutes per IP
 * Stricter to prevent brute force attacks but allows for typos
 */
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register attempts per windowMs (allows for mistakes)
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many login attempts, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Password Reset Rate Limiter
 * Applied to forgot-password endpoint
 * Limits: 3 attempts per hour per IP
 */
exports.passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    error: 'Too many password reset requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Password reset limit reached, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * AI Generation Rate Limiter
 * Applied to AI workout generation endpoint
 * Limits: 20 requests per hour per IP
 * Prevents excessive use of AI API while allowing normal usage
 */
exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI generations per hour
  message: {
    success: false,
    error: 'AI generation limit reached, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many AI workout generation requests, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * File Upload Rate Limiter
 * For profile image uploads
 * Limits: 5 uploads per hour per IP
 */
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 uploads per hour
  message: {
    success: false,
    error: 'Upload limit reached, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = exports;
