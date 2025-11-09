const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs all incoming requests with response time
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log when response is finished
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
  });

  next();
};

/**
 * Performance monitoring middleware
 * Tracks slow requests and logs warnings
 */
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Warn on slow requests (>1 second)
    if (responseTime > 1000) {
      logger.warn('Slow Request Detected', {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        status: res.statusCode,
      });
    }

    // Alert on very slow requests (>5 seconds)
    if (responseTime > 5000) {
      logger.error('Very Slow Request', {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        status: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Database query performance monitor
 * Tracks database operation times
 */
const dbPerformanceMonitor = (operation, startTime) => {
  const duration = Date.now() - startTime;
  
  if (duration > 500) {
    logger.warn('Slow Database Query', {
      operation,
      duration: `${duration}ms`,
    });
  }

  logger.logDatabaseOperation(operation, duration);
};

/**
 * Error tracking middleware
 * Captures and logs all errors
 */
const errorTracker = (err, req, res, next) => {
  logger.logError(err, req);
  
  // Send error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler
 * Logs and handles not found routes
 */
const notFoundHandler = (req, res) => {
  logger.warn('Route Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

/**
 * Health check metrics
 * Returns system health information
 */
const healthMetrics = async (req, res) => {
  const mongoose = require('mongoose');
  
  const metrics = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB',
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    },
  };

  logger.info('Health Check', metrics);
  res.json(metrics);
};

module.exports = {
  requestLogger,
  performanceMonitor,
  dbPerformanceMonitor,
  errorTracker,
  notFoundHandler,
  healthMetrics,
};
