/**
 * Production Configuration
 * Configuration settings for production environment
 */

module.exports = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Maximum connection pool size
      minPoolSize: 2,  // Minimum connection pool size
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if can't connect
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: 'production',
    host: '0.0.0.0' // Listen on all network interfaces
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'https://your-frontend-app.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // Cache preflight requests for 10 minutes
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
    cookieExpire: 7 // 7 days in cookie
  },

  // Rate Limiting Configuration
  rateLimits: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // 1000 requests per 15 minutes
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 10 // 10 login attempts per 15 minutes
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3 // 3 password reset requests per hour
    },
    ai: {
      windowMs: 60 * 60 * 1000,
      max: 20 // 20 AI generations per hour
    },
    upload: {
      windowMs: 60 * 60 * 1000,
      max: 5 // 5 uploads per hour
    }
  },

  // Gemini AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 1024
  },

  // Cache Configuration
  cache: {
    ttl: 600, // 10 minutes default TTL
    checkPeriod: 120, // Check for expired entries every 2 minutes
    leaderboardTTL: 300, // 5 minutes for leaderboard
    coachStatsTTL: 180, // 3 minutes for coach stats
    userTTL: 600 // 10 minutes for user data
  },

  // Security Configuration
  security: {
    bcryptRounds: 10,
    passwordMinLength: 8,
    sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    httpsOnly: true,
    sameSite: 'strict'
  },

  // Logging Configuration
  logging: {
    level: 'info', // Log level: error, warn, info, debug
    format: 'json',
    errorLogFile: 'logs/error.log',
    combinedLogFile: 'logs/combined.log',
    maxFiles: '14d', // Keep logs for 14 days
    maxSize: '20m' // Max log file size 20MB
  },

  // Email Configuration (for future use)
  email: {
    from: process.env.EMAIL_FROM || 'noreply@swishfit.com',
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    uploadDir: 'uploads/'
  },

  // Pagination Defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  // Feature Flags
  features: {
    aiWorkoutGeneration: true,
    leaderboard: true,
    coachPortal: true,
    adminDashboard: true,
    chatSupport: false, // Future feature
    videoUploads: false, // Future feature
    socialSharing: false // Future feature
  }
};
