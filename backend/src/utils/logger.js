const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logs directory path
const logsDir = path.join(__dirname, '../../logs');

// Define transports based on environment
const transports = [];

// Console transport for all environments
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
  })
);

// File transports for production
if (process.env.NODE_ENV === 'production') {
  // Error log - only errors
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 20971520, // 20MB
      maxFiles: 14, // Keep 14 days of logs
      tailable: true,
    })
  );

  // Combined log - all levels
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 20971520, // 20MB
      maxFiles: 14, // Keep 14 days of logs
      tailable: true,
    })
  );

  // Access log - info and above
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'info',
      maxsize: 20971520, // 20MB
      maxFiles: 7, // Keep 7 days
      tailable: true,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports,
  exitOnError: false,
});

// Stream for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Helper methods for common logging patterns
logger.logRequest = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });
};

logger.logError = (error, req = null) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    name: error.name,
  };

  if (req) {
    errorLog.request = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id,
    };
  }

  logger.error('Application Error', errorLog);
};

logger.logDatabaseOperation = (operation, duration, success = true) => {
  logger.info('Database Operation', {
    operation,
    duration: `${duration}ms`,
    success,
  });
};

logger.logAuthentication = (userId, action, success = true, details = {}) => {
  logger.info('Authentication Event', {
    userId,
    action,
    success,
    ...details,
  });
};

logger.logAPICall = (service, endpoint, duration, success = true) => {
  logger.info('External API Call', {
    service,
    endpoint,
    duration: `${duration}ms`,
    success,
  });
};

// Log uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack,
    });
    // Give logger time to write before exiting
    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
      reason: reason,
      promise: promise,
    });
  });
}

module.exports = logger;
