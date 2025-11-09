const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const logger = require('./utils/logger');
const { requestLogger, performanceMonitor } = require('./middleware/monitoring');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(requestLogger);
  app.use(performanceMonitor);
} else {
  app.use(morgan('dev'));
}

// Security middleware - Sanitize data
app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(xss()); // Prevent XSS attacks

// Database connection
const connectDB = async () => {
  try {
    const startTime = Date.now();
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swishfit');
    const duration = Date.now() - startTime;
    
    console.log('✅ MongoDB Connected Successfully');
    logger.info('Database Connected', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    logger.error('Database Connection Failed', {
      error: error.message,
      stack: error.stack,
    });
    
    console.log('⚠️  Continuing without database connection (development mode)');
    // Don't exit process in development, allow manual connection retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Import middleware
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const coachRoutes = require('./routes/coachRoutes');

// Health check route
app.get('/api/health', (req, res) => {
  // Check MongoDB connection status
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const isHealthy = dbStatus === 1;
  
  res.status(isHealthy ? 200 : 503).json({ 
    status: isHealthy ? 'OK' : 'Service Unavailable',
    database: dbStates[dbStatus] || 'unknown',
    message: isHealthy 
      ? 'SwishFit Backend Server is running!' 
      : 'Server running but database connection issue',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    mongodb: {
      status: dbStates[dbStatus],
      host: mongoose.connection.host || 'not connected',
      name: mongoose.connection.name || 'not connected'
    }
  });
});

// Test route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to SwishFit India API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      workouts: '/api/workouts/*',
      progress: '/api/progress/*',
      leaderboard: '/api/leaderboard/*',
      coach: '/api/coach/*'
    }
  });
});

// Apply rate limiting
app.use('/api/', apiLimiter); // General API rate limiter
app.use('/api/auth/login', authLimiter); // Stricter limit for login
app.use('/api/auth/register', authLimiter); // Stricter limit for register

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/coach', coachRoutes);

// Mount test routes (development only)
if (process.env.NODE_ENV !== 'production') {
  const testSecurityRoutes = require('./routes/testSecurityRoutes');
  app.use('/api/test-security', testSecurityRoutes);
}

// Import error handlers
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Error handling - must be after all routes
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🏀 SwishFit India Backend Server                      ║
║                                                          ║
║   🚀 Server running on port ${PORT}                        ║
║   🌐 http://localhost:${PORT}                              ║
║   📚 API Docs: http://localhost:${PORT}/api                ║
║   ❤️  Health Check: http://localhost:${PORT}/api/health    ║
║                                                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  logger.error('Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack,
  });
  
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  logger.info('Server Shutdown Initiated', { signal: 'SIGTERM' });
  
  server.close(() => {
    console.log('✅ Server closed');
    logger.info('Server Closed Successfully');
    mongoose.connection.close();
  });
});

module.exports = app;
