# SwishFit India - Phase-Wise Implementation Guide

## 📋 Document Overview

**Project:** SwishFit India - AI-Powered Basketball Training Web Application  
**Architecture:** MERN Stack (MongoDB, Express.js, React.js, Node.js) + Google Gemini AI  
**Approach:** Agile development with incremental phases  
**Timeline:** 9 weeks for MVP  
**Budget:** Free-tier services only  

This implementation guide provides a detailed roadmap for building SwishFit India from ground zero to a fully functional MVP, broken down into actionable phases with specific tasks, deliverables, and technical requirements.

---

## 🎯 Implementation Philosophy

### Core Principles
1. **Start Simple, Build Iteratively** - Begin with core functionality, add features progressively
2. **Test as You Build** - Write tests alongside features
3. **Documentation First** - Document APIs and components as they're created
4. **Mobile-First Design** - Build responsive from the start
5. **Security by Default** - Implement security measures from day one

### Success Metrics
- ✅ All features functional and tested
- ✅ Responsive design across devices
- ✅ API response times < 200ms
- ✅ Page load times < 3 seconds
- ✅ Zero critical security vulnerabilities

---

## 📊 Phase Overview Table

| Phase | Duration | Focus Area | Key Deliverables | Dependencies |
|-------|----------|------------|------------------|--------------|
| **Phase 0** | 3-4 days | Project Setup | Dev environment, Git repo, initial structure | None |
| **Phase 1** | Week 1-2 | Foundation & Auth | Backend API, Database, Authentication | Phase 0 |
| **Phase 2** | Week 3-4 | Core Features | Dashboards, Workout CRUD, Gemini Integration | Phase 1 |
| **Phase 3** | Week 5-6 | Advanced Features | Progress Charts, Coach Portal, Leaderboard | Phase 2 |
| **Phase 4** | Week 7-8 | Polish & Testing | UI refinements, Testing, Bug fixes | Phase 3 |
| **Phase 5** | Week 9 | Deployment | Production deployment, Launch | Phase 4 |

---

## 🚀 Ready to Begin?

This guide contains detailed information for each phase including:
- **Objectives** - What we aim to achieve
- **Key Tasks** - Specific implementation steps
- **Technical Stack** - Technologies and tools used
- **Deliverables** - Concrete outputs expected
- **Testing Requirements** - How to validate the work
- **Dependencies** - What must be completed first
- **Success Criteria** - How to know the phase is complete

---

## 📝 How to Use This Guide

1. **Sequential Execution** - Complete phases in order (0 → 5)
2. **Task Completion** - Mark off tasks as you complete them
3. **Quality Checks** - Verify success criteria before moving to next phase
4. **Flexibility** - Adjust timelines based on your pace, but maintain order
5. **Reference Documents** - Keep SYSTEM_ARCHITECTURE.md and PROJECT_OVERVIEW.md handy

---

## ⚠️ Important Notes Before Starting

### Prerequisites
- **Skills Required:** JavaScript/TypeScript, React.js, Node.js, MongoDB basics
- **Accounts Needed:** 
  - GitHub account
  - MongoDB Atlas account (free tier)
  - Google Cloud account (for Gemini API)
  - Vercel/Netlify account (for frontend hosting)
  - Render/Railway account (for backend hosting)

### Development Environment
- **OS:** macOS, Linux, or Windows with WSL2
- **Node.js:** v18+ LTS
- **Package Manager:** npm or yarn
- **Code Editor:** VS Code (recommended)
- **Git:** Version control

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- GitLens

---

## 🎓 Learning Resources

Before diving in, familiarize yourself with:
- [React.js Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [JWT Authentication](https://jwt.io/introduction)

---

## 🔧 PHASE 0: Project Setup & Initialization

**Duration:** 3-4 days  
**Focus:** Development environment setup and project scaffolding  
**Complexity:** Low  

### 📌 Phase Objectives
- Set up development environment with all necessary tools
- Initialize Git repository with proper structure
- Create initial project structure for frontend and backend
- Configure essential development tools and linters
- Set up free-tier cloud accounts
- Establish coding standards and conventions

### ✅ Key Tasks

#### Task 0.1: Development Environment Setup
- [ ] Install Node.js v18+ LTS
- [ ] Install MongoDB Compass (local testing)
- [ ] Install VS Code with recommended extensions
- [ ] Install Git and configure user credentials
- [ ] Set up Postman or Thunder Client for API testing

#### Task 0.2: Cloud Accounts Creation
- [ ] Create GitHub account (if not exists)
- [ ] Create MongoDB Atlas account
  - Set up free M0 cluster
  - Configure IP whitelist (allow from anywhere for development)
  - Create database user with credentials
- [ ] Create Google Cloud account
  - Enable Gemini API
  - Generate API key for development
- [ ] Create Vercel account (frontend hosting)
- [ ] Create Render or Railway account (backend hosting)

#### Task 0.3: Project Repository Setup
- [ ] Create GitHub repository: `swishfit-india`
- [ ] Initialize with README.md
- [ ] Create .gitignore file (Node.js template)
- [ ] Set up branch protection rules (main branch)
- [ ] Clone repository locally

#### Task 0.4: Project Structure Creation
- [ ] Create root-level folders:
  ```
  swishfit-india/
  ├── frontend/          # React application
  ├── backend/           # Node.js + Express API
  ├── docs/              # Documentation
  └── README.md
  ```

#### Task 0.5: Backend Initialization
- [ ] Navigate to `backend/` folder
- [ ] Initialize npm project: `npm init -y`
- [ ] Install core dependencies:
  ```bash
  npm install express mongoose dotenv cors helmet
  npm install jsonwebtoken bcryptjs joi express-validator
  npm install @google/generative-ai
  npm install morgan winston
  ```
- [ ] Install dev dependencies:
  ```bash
  npm install -D nodemon eslint prettier
  ```
- [ ] Create folder structure:
  ```
  backend/
  ├── src/
  │   ├── config/        # Configuration files
  │   ├── controllers/   # Route controllers
  │   ├── models/        # Mongoose models
  │   ├── routes/        # API routes
  │   ├── middleware/    # Custom middleware
  │   ├── services/      # Business logic
  │   ├── utils/         # Helper functions
  │   └── server.js      # Entry point
  ├── .env.example       # Environment variables template
  ├── .env               # Actual env vars (gitignored)
  ├── .eslintrc.json     # ESLint config
  ├── .prettierrc        # Prettier config
  └── package.json
  ```

#### Task 0.6: Frontend Initialization
- [ ] Navigate to root folder
- [ ] Create React app with Vite:
  ```bash
  npm create vite@latest frontend -- --template react
  ```
- [ ] Navigate to `frontend/` folder
- [ ] Install dependencies:
  ```bash
  npm install
  npm install axios react-router-dom
  npm install react-hook-form yup
  npm install chart.js react-chartjs-2
  npm install @headlessui/react @heroicons/react
  ```
- [ ] Install and configure TailwindCSS:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Create folder structure:
  ```
  frontend/
  ├── src/
  │   ├── components/    # Reusable components
  │   ├── pages/         # Page components
  │   ├── services/      # API calls
  │   ├── hooks/         # Custom hooks
  │   ├── store/         # State management
  │   ├── utils/         # Helper functions
  │   ├── styles/        # Global styles
  │   ├── App.jsx        # Main app component
  │   └── main.jsx       # Entry point
  ├── public/            # Static assets
  ├── .env.example
  ├── .env
  ├── tailwind.config.js
  └── package.json
  ```

#### Task 0.7: Configuration Files Setup
- [ ] Configure TailwindCSS with custom colors:
  ```javascript
  // frontend/tailwind.config.js
  module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          'basketball-orange': '#FF6600',
          'court-blue': '#1E3A8A',
          'success-green': '#10B981',
        }
      }
    },
    plugins: []
  }
  ```
- [ ] Create ESLint config for backend
- [ ] Create Prettier config for code formatting
- [ ] Set up nodemon config for backend:
  ```json
  // backend/package.json scripts
  {
    "scripts": {
      "start": "node src/server.js",
      "dev": "nodemon src/server.js",
      "test": "jest"
    }
  }
  ```

#### Task 0.8: Environment Variables Setup
- [ ] Create backend `.env.example`:
  ```
  NODE_ENV=development
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  JWT_EXPIRE=7d
  GEMINI_API_KEY=your_gemini_api_key
  GEMINI_MODEL=gemini-pro
  FRONTEND_URL=http://localhost:5173
  ```
- [ ] Create frontend `.env.example`:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Copy `.env.example` to `.env` and fill in actual values
- [ ] Add `.env` to `.gitignore`

#### Task 0.9: Documentation Setup
- [ ] Move PROJECT_OVERVIEW.md to `docs/` folder
- [ ] Move SYSTEM_ARCHITECTURE.md to `docs/` folder
- [ ] Move IMPLEMENTATION_GUIDE.md to `docs/` folder
- [ ] Create README.md with project description and setup instructions
- [ ] Create CONTRIBUTING.md with coding standards

#### Task 0.10: Git Configuration
- [ ] Create comprehensive .gitignore:
  ```
  # Dependencies
  node_modules/
  
  # Environment variables
  .env
  .env.local
  
  # Build outputs
  dist/
  build/
  
  # IDE
  .vscode/
  .idea/
  
  # OS
  .DS_Store
  Thumbs.db
  
  # Logs
  *.log
  npm-debug.log*
  ```
- [ ] Initial commit with project structure
- [ ] Create development branch
- [ ] Push to GitHub

### 🛠️ Technical Stack (Phase 0)
- **Version Control:** Git, GitHub
- **Backend Runtime:** Node.js v18+
- **Backend Framework:** Express.js (to be configured in Phase 1)
- **Frontend:** React.js 18+ with Vite
- **Styling:** TailwindCSS v3+
- **Database:** MongoDB Atlas (free tier)
- **Code Quality:** ESLint, Prettier
- **Development Tools:** Nodemon, VS Code

### 📦 Deliverables
✅ Fully initialized Git repository on GitHub  
✅ Backend project structure with dependencies installed  
✅ Frontend project structure with React + TailwindCSS configured  
✅ All cloud accounts created and configured  
✅ Environment variables template files  
✅ Documentation moved to proper location  
✅ Development environment ready for coding  

### 🧪 Testing Requirements
- [ ] Backend server starts without errors: `cd backend && npm run dev`
- [ ] Frontend dev server starts: `cd frontend && npm run dev`
- [ ] MongoDB Atlas connection successful (test in next phase)
- [ ] TailwindCSS classes work in React components
- [ ] ESLint runs without configuration errors

### 🔗 Dependencies
**Prerequisites:** None (starting point)

### ✨ Success Criteria
- ✅ All npm packages installed successfully
- ✅ No errors when running dev servers
- ✅ Git repository pushed to GitHub
- ✅ All cloud accounts active with credentials saved
- ✅ Folder structure matches specification
- ✅ Environment variables properly configured
- ✅ Documentation organized in `docs/` folder

### 💡 Implementation Tips
- Use `npm ls` to verify installed packages
- Keep credentials secure - never commit .env files
- Test MongoDB connection string before proceeding
- Save all API keys and credentials in a password manager
- Create a project checklist document for tracking progress

### 📚 Reference Documentation
- [Vite React Template](https://vitejs.dev/guide/)
- [TailwindCSS Installation](https://tailwindcss.com/docs/guides/vite)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Express.js Getting Started](https://expressjs.com/en/starter/installing.html)

---

## 🏗️ PHASE 1: Foundation & Authentication System

**Duration:** Week 1-2 (10-12 days)  
**Focus:** Backend API foundation, database models, and authentication  
**Complexity:** Medium  

### 📌 Phase Objectives
- Set up Express.js server with middleware
- Design and implement MongoDB schemas
- Build complete authentication system with JWT
- Create user registration and login APIs
- Implement role-based access control (RBAC)
- Set up error handling and validation
- Create basic API documentation

### ✅ Key Tasks

#### Task 1.1: Express Server Setup
- [ ] Create `backend/src/server.js`:
  ```javascript
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  require('dotenv').config();
  
  const app = express();
  
  // Middleware
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  
  // Database connection
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
  
  // Routes (to be added)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  ```
- [ ] Test server starts successfully
- [ ] Test health endpoint: `http://localhost:5000/api/health`

#### Task 1.2: Database Models Creation

**User Model:**
- [ ] Create `backend/src/models/User.js`:
  ```javascript
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['player', 'coach', 'admin'],
      default: 'player'
    },
    profileImage: {
      type: String,
      default: ''
    },
    phoneNumber: String,
    dateOfBirth: Date,
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  }, {
    timestamps: true
  });
  
  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // Compare password method
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  module.exports = mongoose.model('User', userSchema);
  ```

**Workout Model:**
- [ ] Create `backend/src/models/Workout.js`:
  ```javascript
  const mongoose = require('mongoose');
  
  const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    sets: Number,
    reps: Number,
    duration: Number,
    difficulty: String,
    videoUrl: String,
    instructions: String,
    day: Number,
    week: Number
  });
  
  const workoutSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    duration: Number,
    category: {
      type: String,
      enum: ['shooting', 'dribbling', 'defense', 'conditioning', 'full-body'],
      required: true
    },
    exercises: [exerciseSchema],
    isAIGenerated: {
      type: Boolean,
      default: false
    },
    aiPrompt: String,
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false
    },
    difficulty: String,
    estimatedTime: Number,
    equipmentNeeded: [String]
  }, {
    timestamps: true
  });
  
  // Indexes for better query performance
  workoutSchema.index({ skillLevel: 1, category: 1 });
  workoutSchema.index({ isPublic: 1 });
  workoutSchema.index({ assignedTo: 1 });
  
  module.exports = mongoose.model('Workout', workoutSchema);
  ```

**Progress Model:**
- [ ] Create `backend/src/models/Progress.js`:
  ```javascript
  const mongoose = require('mongoose');
  
  const exerciseMetricSchema = new mongoose.Schema({
    exerciseId: mongoose.Schema.Types.ObjectId,
    exerciseName: String,
    completed: Boolean,
    metrics: {
      shotsMade: Number,
      shotsAttempted: Number,
      accuracy: Number,
      duration: Number,
      sets: Number,
      reps: Number
    }
  });
  
  const progressSchema = new mongoose.Schema({
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    },
    completionTime: Number,
    exercises: [exerciseMetricSchema],
    overallMetrics: {
      totalShotsMade: Number,
      totalShotsAttempted: Number,
      overallAccuracy: Number,
      caloriesBurned: Number,
      heartRate: Number
    },
    playerNotes: String,
    coachFeedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }, {
    timestamps: true
  });
  
  // Compound index for queries
  progressSchema.index({ playerId: 1, date: -1 });
  progressSchema.index({ workoutId: 1 });
  
  module.exports = mongoose.model('Progress', progressSchema);
  ```

**Leaderboard Model:**
- [ ] Create `backend/src/models/Leaderboard.js`:
  ```javascript
  const mongoose = require('mongoose');
  
  const achievementSchema = new mongoose.Schema({
    achievementId: String,
    title: String,
    earnedDate: Date
  });
  
  const leaderboardSchema = new mongoose.Schema({
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    playerName: String,
    teamId: mongoose.Schema.Types.ObjectId,
    statistics: {
      totalWorkoutsCompleted: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      totalShotsMade: { type: Number, default: 0 },
      averageAccuracy: { type: Number, default: 0 },
      totalTrainingHours: { type: Number, default: 0 },
      rank: Number,
      points: { type: Number, default: 0 }
    },
    achievements: [achievementSchema],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
  leaderboardSchema.index({ 'statistics.rank': 1 });
  leaderboardSchema.index({ teamId: 1 });
  
  module.exports = mongoose.model('Leaderboard', leaderboardSchema);
  ```

#### Task 1.3: Authentication Utilities
- [ ] Create `backend/src/utils/jwtUtils.js`:
  ```javascript
  const jwt = require('jsonwebtoken');
  
  exports.generateToken = (userId, role) => {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  };
  
  exports.verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  };
  ```

- [ ] Create `backend/src/middleware/auth.js`:
  ```javascript
  const { verifyToken } = require('../utils/jwtUtils');
  const User = require('../models/User');
  
  exports.protect = async (req, res, next) => {
    try {
      let token;
      
      if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route'
        });
      }
      
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  };
  
  exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `Role ${req.user.role} is not authorized to access this route`
        });
      }
      next();
    };
  };
  ```

#### Task 1.4: Validation Middleware
- [ ] Create `backend/src/middleware/validation.js`:
  ```javascript
  const { body, validationResult } = require('express-validator');
  
  exports.validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role')
      .optional()
      .isIn(['player', 'coach'])
      .withMessage('Role must be player or coach'),
    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      next();
    }
  ];
  
  exports.validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      next();
    }
  ];
  ```

#### Task 1.5: Authentication Controllers
- [ ] Create `backend/src/controllers/authController.js`:
  ```javascript
  const User = require('../models/User');
  const Leaderboard = require('../models/Leaderboard');
  const { generateToken } = require('../utils/jwtUtils');
  
  // @desc    Register new user
  // @route   POST /api/auth/register
  // @access  Public
  exports.register = async (req, res) => {
    try {
      const { name, email, password, role, skillLevel } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }
      
      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'player',
        skillLevel: skillLevel || 'beginner'
      });
      
      // If player, create leaderboard entry
      if (user.role === 'player') {
        await Leaderboard.create({
          playerId: user._id,
          playerName: user.name
        });
      }
      
      // Generate token
      const token = generateToken(user._id, user.role);
      
      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skillLevel: user.skillLevel
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user and include password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      // Generate token
      const token = generateToken(user._id, user.role);
      
      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skillLevel: user.skillLevel
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Private
  exports.logout = (req, res) => {
    res.json({
      success: true,
      message: 'User logged out successfully'
    });
  };
  ```

#### Task 1.6: Authentication Routes
- [ ] Create `backend/src/routes/authRoutes.js`:
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    register,
    login,
    getMe,
    logout
  } = require('../controllers/authController');
  const { protect } = require('../middleware/auth');
  const {
    validateRegistration,
    validateLogin
  } = require('../middleware/validation');
  
  router.post('/register', validateRegistration, register);
  router.post('/login', validateLogin, login);
  router.get('/me', protect, getMe);
  router.post('/logout', protect, logout);
  
  module.exports = router;
  ```

- [ ] Update `backend/src/server.js` to include auth routes:
  ```javascript
  // Add after other middleware
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  ```

#### Task 1.7: User Profile Controllers & Routes
- [ ] Create `backend/src/controllers/userController.js`:
  ```javascript
  const User = require('../models/User');
  
  // @desc    Get user profile
  // @route   GET /api/users/profile
  // @access  Private
  exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate('coachId', 'name email')
        .populate('teamId', 'name');
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  exports.updateProfile = async (req, res) => {
    try {
      const allowedUpdates = ['name', 'phoneNumber', 'dateOfBirth', 'profileImage', 'skillLevel'];
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  ```

- [ ] Create `backend/src/routes/userRoutes.js`:
  ```javascript
  const express = require('express');
  const router = express.Router();
  const { getProfile, updateProfile } = require('../controllers/userController');
  const { protect } = require('../middleware/auth');
  
  router.get('/profile', protect, getProfile);
  router.put('/profile', protect, updateProfile);
  
  module.exports = router;
  ```

- [ ] Add user routes to server.js

#### Task 1.8: Error Handling Middleware
- [ ] Create `backend/src/middleware/errorHandler.js`:
  ```javascript
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = new AppError(message, 404);
    }
    
    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new AppError(message, 400);
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new AppError(message, 400);
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  module.exports = { AppError, errorHandler };
  ```

- [ ] Add error handler to server.js

#### Task 1.9: API Testing
- [ ] Create Postman/Thunder Client collection
- [ ] Test POST `/api/auth/register` (create player)
- [ ] Test POST `/api/auth/register` (create coach)
- [ ] Test POST `/api/auth/login`
- [ ] Test GET `/api/auth/me` (with token)
- [ ] Test GET `/api/users/profile`
- [ ] Test PUT `/api/users/profile`
- [ ] Test error cases (invalid email, duplicate user, wrong password)

#### Task 1.10: Database Seeding (Optional)
- [ ] Create `backend/src/utils/seeder.js` for test data
- [ ] Add sample users (2 coaches, 5 players)
- [ ] Test data integrity

### 🛠️ Technical Stack (Phase 1)
- **Backend:** Node.js, Express.js v4.18+
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Validation:** express-validator, Joi
- **Security:** helmet, cors, express-rate-limit
- **Logging:** morgan, winston
- **Testing Tools:** Postman/Thunder Client

### 📦 Deliverables
✅ Fully functional Express.js API server  
✅ MongoDB database with 4 collections (Users, Workouts, Progress, Leaderboard)  
✅ Complete authentication system (register, login, logout, get user)  
✅ JWT-based token authentication  
✅ Role-based access control middleware  
✅ Input validation for all auth routes  
✅ Error handling middleware  
✅ API documentation (Postman collection)  
✅ User profile management endpoints  

### 🧪 Testing Requirements
- [ ] All authentication endpoints return correct status codes
- [ ] JWT tokens are generated and verified correctly
- [ ] Password hashing works (cannot retrieve plain password)
- [ ] Role-based access control prevents unauthorized access
- [ ] Validation catches invalid inputs
- [ ] Error handling returns proper error messages
- [ ] MongoDB indexes are created correctly
- [ ] Can create both player and coach accounts
- [ ] Leaderboard entry created for new players

### 🔗 Dependencies
**Prerequisites:** Phase 0 completed  
**Required:** MongoDB Atlas running, environment variables configured

### ✨ Success Criteria
- ✅ Server runs without errors
- ✅ Can register new users (player and coach roles)
- ✅ Can login and receive JWT token
- ✅ Protected routes require valid token
- ✅ Role-based routes enforce correct permissions
- ✅ All database models save data correctly
- ✅ Validation prevents invalid data
- ✅ Error messages are clear and helpful
- ✅ API endpoints follow RESTful conventions
- ✅ Code is clean, commented, and follows best practices

### 💡 Implementation Tips
- Test each endpoint immediately after creating it
- Use Postman environments for dev/prod API URLs
- Keep JWT_SECRET strong and random (use online generator)
- Log all errors during development for debugging
- Use async/await with try-catch for clean error handling
- Keep controllers thin - move complex logic to services
- Document all API endpoints with comments
- Use HTTP status codes correctly (200, 201, 400, 401, 403, 500)

### 📁 File Structure After Phase 1
```
backend/src/
├── config/
├── controllers/
│   ├── authController.js ✅
│   └── userController.js ✅
├── models/
│   ├── User.js ✅
│   ├── Workout.js ✅
│   ├── Progress.js ✅
│   └── Leaderboard.js ✅
├── routes/
│   ├── authRoutes.js ✅
│   └── userRoutes.js ✅
├── middleware/
│   ├── auth.js ✅
│   ├── validation.js ✅
│   └── errorHandler.js ✅
├── services/
├── utils/
│   └── jwtUtils.js ✅
└── server.js ✅
```

### 📚 Reference Documentation
- [Express.js Routing](https://expressjs.com/en/guide/routing.html)
- [Mongoose Schema](https://mongoosejs.com/docs/guide.html)
- [JWT Best Practices](https://jwt.io/introduction)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

---

## 🚀 PHASE 2: Core Features Implementation

**Duration:** Week 3-4 (10-12 days)  
**Focus:** Workout management, Gemini AI integration, Dashboard UI, Workout Library  
**Complexity:** High  

### 📌 Phase Objectives
- Build complete workout CRUD API
- Integrate Google Gemini API for AI workout generation
- Create frontend authentication flow
- Build Player Dashboard with workout display
- Build Workout Library page with filtering
- Implement API service layer in frontend
- Set up state management (Context API or Redux Toolkit)

### ✅ Key Tasks

#### Task 2.1: Workout CRUD Controllers
- [ ] Create `backend/src/controllers/workoutController.js`:
  ```javascript
  const Workout = require('../models/Workout');
  const { AppError } = require('../middleware/errorHandler');
  
  // @desc    Create new workout
  // @route   POST /api/workouts
  // @access  Private (Coach only)
  exports.createWorkout = async (req, res, next) => {
    try {
      req.body.createdBy = req.user.id;
      const workout = await Workout.create(req.body);
      
      res.status(201).json({
        success: true,
        data: workout
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get all workouts
  // @route   GET /api/workouts
  // @access  Private
  exports.getWorkouts = async (req, res, next) => {
    try {
      const { skillLevel, category, isPublic } = req.query;
      const filter = {};
      
      if (skillLevel) filter.skillLevel = skillLevel;
      if (category) filter.category = category;
      if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
      
      // If player, show public workouts + assigned workouts
      if (req.user.role === 'player') {
        filter.$or = [
          { isPublic: true },
          { assignedTo: req.user.id }
        ];
      }
      
      const workouts = await Workout.find(filter)
        .populate('createdBy', 'name email')
        .sort('-createdAt');
      
      res.json({
        success: true,
        count: workouts.length,
        data: workouts
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get single workout
  // @route   GET /api/workouts/:id
  // @access  Private
  exports.getWorkout = async (req, res, next) => {
    try {
      const workout = await Workout.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email skillLevel');
      
      if (!workout) {
        return next(new AppError('Workout not found', 404));
      }
      
      res.json({
        success: true,
        data: workout
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Update workout
  // @route   PUT /api/workouts/:id
  // @access  Private (Coach/Creator only)
  exports.updateWorkout = async (req, res, next) => {
    try {
      let workout = await Workout.findById(req.params.id);
      
      if (!workout) {
        return next(new AppError('Workout not found', 404));
      }
      
      // Check ownership
      if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to update this workout', 403));
      }
      
      workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      
      res.json({
        success: true,
        data: workout
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Delete workout
  // @route   DELETE /api/workouts/:id
  // @access  Private (Coach/Creator only)
  exports.deleteWorkout = async (req, res, next) => {
    try {
      const workout = await Workout.findById(req.params.id);
      
      if (!workout) {
        return next(new AppError('Workout not found', 404));
      }
      
      // Check ownership
      if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to delete this workout', 403));
      }
      
      await workout.deleteOne();
      
      res.json({
        success: true,
        message: 'Workout deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Assign workout to players
  // @route   POST /api/workouts/:id/assign
  // @access  Private (Coach only)
  exports.assignWorkout = async (req, res, next) => {
    try {
      const { playerIds } = req.body;
      
      const workout = await Workout.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { assignedTo: { $each: playerIds } } },
        { new: true }
      ).populate('assignedTo', 'name email');
      
      res.json({
        success: true,
        data: workout
      });
    } catch (error) {
      next(error);
    }
  };
  ```

#### Task 2.2: Gemini AI Service
- [ ] Create `backend/src/services/geminiService.js`:
  ```javascript
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  class GeminiService {
    constructor() {
      this.model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
    }
    
    async generateWorkout(playerData) {
      try {
        const { age, skillLevel, goals, pastPerformance } = playerData;
        
        const prompt = `
        You are an expert basketball coach AI. Generate a personalized 7-day basketball training routine.
        
        Player Profile:
        - Age: ${age || 'Not specified'}
        - Skill Level: ${skillLevel}
        - Goals: ${goals || 'General skill improvement'}
        - Past Performance: ${pastPerformance || 'No data available'}
        
        Create a comprehensive weekly workout plan with:
        1. Daily exercises (3-5 exercises per day)
        2. Each exercise should include: name, description, sets, reps, duration, and difficulty
        3. Focus areas: shooting, dribbling, defense, and conditioning
        4. Progressive difficulty throughout the week
        5. Rest days if appropriate
        
        Return the response in valid JSON format with this structure:
        {
          "title": "Personalized Training Plan",
          "description": "Brief overview",
          "duration": 7,
          "skillLevel": "${skillLevel}",
          "exercises": [
            {
              "day": 1,
              "name": "Exercise name",
              "description": "Detailed description",
              "sets": 3,
              "reps": 10,
              "duration": 15,
              "difficulty": "moderate",
              "instructions": "Step-by-step instructions"
            }
          ],
          "weeklyInsights": "Performance insights and recommendations"
        }
        `;
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response (handle markdown code blocks)
        let jsonText = text;
        if (text.includes('```json')) {
          jsonText = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
          jsonText = text.split('```')[1].split('```')[0].trim();
        }
        
        const workoutPlan = JSON.parse(jsonText);
        
        return {
          success: true,
          data: workoutPlan,
          rawResponse: text
        };
      } catch (error) {
        console.error('Gemini API Error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    async analyzePerformance(performanceData) {
      try {
        const { workoutHistory, progressMetrics } = performanceData;
        
        const prompt = `
        Analyze this basketball player's performance data and provide insights:
        
        Workout History: ${JSON.stringify(workoutHistory)}
        Progress Metrics: ${JSON.stringify(progressMetrics)}
        
        Provide:
        1. Strengths and weaknesses analysis
        2. Improvement trends
        3. Recommendations for next training phase
        4. Motivational feedback
        
        Return as JSON with structure:
        {
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "trends": "Performance trend analysis",
          "recommendations": ["rec1", "rec2"],
          "motivationalMessage": "Encouraging message"
        }
        `;
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        let jsonText = text;
        if (text.includes('```json')) {
          jsonText = text.split('```json')[1].split('```')[0].trim();
        }
        
        const analysis = JSON.parse(jsonText);
        
        return {
          success: true,
          data: analysis
        };
      } catch (error) {
        console.error('Gemini Analysis Error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
  
  module.exports = new GeminiService();
  ```

#### Task 2.3: AI Workout Generation Controller
- [ ] Add to `workoutController.js`:
  ```javascript
  const geminiService = require('../services/geminiService');
  
  // @desc    Generate AI workout
  // @route   POST /api/workouts/generate
  // @access  Private (Coach only)
  exports.generateAIWorkout = async (req, res, next) => {
    try {
      const { playerId, age, skillLevel, goals, pastPerformance } = req.body;
      
      // Call Gemini API
      const aiResult = await geminiService.generateWorkout({
        age,
        skillLevel,
        goals,
        pastPerformance
      });
      
      if (!aiResult.success) {
        return next(new AppError('Failed to generate AI workout', 500));
      }
      
      // Save to database
      const workout = await Workout.create({
        ...aiResult.data,
        createdBy: req.user.id,
        assignedTo: playerId ? [playerId] : [],
        isAIGenerated: true,
        aiPrompt: JSON.stringify({ age, skillLevel, goals, pastPerformance }),
        category: 'full-body'
      });
      
      res.status(201).json({
        success: true,
        data: workout,
        aiInsights: aiResult.data.weeklyInsights
      });
    } catch (error) {
      next(error);
    }
  };
  ```

#### Task 2.4: Workout Routes
- [ ] Create `backend/src/routes/workoutRoutes.js`:
  ```javascript
  const express = require('express');
  const router = express.Router();
  const {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    assignWorkout,
    generateAIWorkout
  } = require('../controllers/workoutController');
  const { protect, authorize } = require('../middleware/auth');
  
  router
    .route('/')
    .get(protect, getWorkouts)
    .post(protect, authorize('coach', 'admin'), createWorkout);
  
  router.post('/generate', protect, authorize('coach', 'admin'), generateAIWorkout);
  
  router
    .route('/:id')
    .get(protect, getWorkout)
    .put(protect, authorize('coach', 'admin'), updateWorkout)
    .delete(protect, authorize('coach', 'admin'), deleteWorkout);
  
  router.post('/:id/assign', protect, authorize('coach', 'admin'), assignWorkout);
  
  module.exports = router;
  ```

- [ ] Add workout routes to `server.js`

#### Task 2.5: Frontend Auth Service
- [ ] Create `frontend/src/services/api.js`:
  ```javascript
  import axios from 'axios';
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Add token to requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Handle response errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export default api;
  ```

- [ ] Create `frontend/src/services/authService.js`:
  ```javascript
  import api from './api';
  
  const authService = {
    register: async (userData) => {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    },
    
    login: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    }
  };
  
  export default authService;
  ```

- [ ] Create `frontend/src/services/workoutService.js`:
  ```javascript
  import api from './api';
  
  const workoutService = {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/workouts?${params}`);
      return response.data;
    },
    
    getById: async (id) => {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    },
    
    create: async (workoutData) => {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    },
    
    generateAI: async (playerData) => {
      const response = await api.post('/workouts/generate', playerData);
      return response.data;
    },
    
    update: async (id, workoutData) => {
      const response = await api.put(`/workouts/${id}`, workoutData);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await api.delete(`/workouts/${id}`);
      return response.data;
    },
    
    assign: async (id, playerIds) => {
      const response = await api.post(`/workouts/${id}/assign`, { playerIds });
      return response.data;
    }
  };
  
  export default workoutService;
  ```

#### Task 2.6: Auth Context (State Management)
- [ ] Create `frontend/src/context/AuthContext.jsx`:
  ```javascript
  import { createContext, useContext, useState, useEffect } from 'react';
  import authService from '../services/authService';
  
  const AuthContext = createContext();
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    }, []);
    
    const login = async (credentials) => {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    };
    
    const register = async (userData) => {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    };
    
    const logout = () => {
      authService.logout();
      setUser(null);
    };
    
    const value = {
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    };
    
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  };
  ```

#### Task 2.7: Protected Route Component
- [ ] Create `frontend/src/components/ProtectedRoute.jsx`:
  ```javascript
  import { Navigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };
  
  export default ProtectedRoute;
  ```

#### Task 2.8: Login & Register Pages
- [ ] Create `frontend/src/pages/Login.jsx`:
  ```javascript
  import { useState } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  
  const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      try {
        await login(formData);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-court-blue to-basketball-orange">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-court-blue mb-6">
            SwishFit Login
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-basketball-orange text-white py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-basketball-orange hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    );
  };
  
  export default Login;
  ```

- [ ] Create similar `Register.jsx` page
- [ ] Update TailwindCSS in `frontend/src/index.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  body {
    font-family: 'Inter', sans-serif;
  }
  ```

#### Task 2.9: Player Dashboard Page
- [ ] Create `frontend/src/pages/PlayerDashboard.jsx`:
  ```javascript
  import { useState, useEffect } from 'react';
  import { useAuth } from '../context/AuthContext';
  import workoutService from '../services/workoutService';
  
  const PlayerDashboard = () => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetchWorkouts();
    }, []);
    
    const fetchWorkouts = async () => {
      try {
        const response = await workoutService.getAll();
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-court-blue">
              Welcome back, {user?.name}! 🏀
            </h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Workouts This Week</h3>
              <p className="text-3xl font-bold text-basketball-orange">5</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Current Streak</h3>
              <p className="text-3xl font-bold text-success-green">7 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg Accuracy</h3>
              <p className="text-3xl font-bold text-court-blue">78%</p>
            </div>
          </div>
          
          {/* Workouts List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Your Workouts</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <p>Loading workouts...</p>
              ) : workouts.length === 0 ? (
                <p className="text-gray-500">No workouts assigned yet.</p>
              ) : (
                <div className="space-y-4">
                  {workouts.map((workout) => (
                    <div
                      key={workout._id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{workout.title}</h3>
                          <p className="text-gray-600 mt-1">{workout.description}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {workout.skillLevel}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {workout.category}
                            </span>
                            {workout.isAIGenerated && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                AI Generated
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600">
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default PlayerDashboard;
  ```

#### Task 2.10: Router Setup
- [ ] Update `frontend/src/App.jsx`:
  ```javascript
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider } from './context/AuthContext';
  import ProtectedRoute from './components/ProtectedRoute';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import PlayerDashboard from './pages/PlayerDashboard';
  import WorkoutLibrary from './pages/WorkoutLibrary';
  
  function App() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PlayerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <WorkoutLibrary />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
  
  export default App;
  ```

### 🛠️ Technical Stack (Phase 2)
- **Backend:** Express.js, Mongoose, Gemini AI SDK
- **Frontend:** React.js 18+, React Router v6, TailwindCSS
- **State Management:** React Context API
- **API Client:** Axios with interceptors
- **AI Integration:** Google Gemini Pro API
- **Authentication:** JWT with localStorage

### 📦 Deliverables
✅ Complete workout CRUD API with role-based access  
✅ Gemini AI integration for workout generation and analysis  
✅ Frontend authentication system (login, register, logout)  
✅ Protected routes with role-based access  
✅ Player Dashboard with workout cards  
✅ API service layer for frontend-backend communication  
✅ Responsive UI with TailwindCSS  
✅ Error handling for API calls  

### 🧪 Testing Requirements
- [ ] Test workout creation, retrieval, update, delete
- [ ] Test AI workout generation with different player profiles
- [ ] Test workout assignment to players
- [ ] Test login/register flow
- [ ] Test protected routes redirect unauthenticated users
- [ ] Test dashboard displays correct workouts for logged-in player
- [ ] Test API error handling (network errors, 401, 403, 500)
- [ ] Test mobile responsiveness

### 🔗 Dependencies
**Prerequisites:** Phase 1 completed  
**Required:** Gemini API key configured, authentication working

### ✨ Success Criteria
- ✅ Coaches can create manual and AI-generated workouts
- ✅ AI generates realistic basketball training plans
- ✅ Players see only their assigned workouts + public workouts
- ✅ Login/register works and persists user session
- ✅ Dashboard displays user-specific data
- ✅ UI is responsive and matches design guidelines
- ✅ API calls handle errors gracefully
- ✅ Loading states show during API requests
- ✅ Token authentication works across all routes

### 💡 Implementation Tips
- Test Gemini API separately before integrating
- Use loading spinners for better UX
- Implement toast notifications for success/error messages
- Keep components small and reusable
- Use environment variables for API URL
- Test with different user roles (player vs coach)
- Handle API rate limits for Gemini (60 req/min free tier)
- Cache Gemini responses to reduce API calls

### 📁 Key Files Added (Phase 2)
```
backend/src/
├── controllers/
│   └── workoutController.js ✅
├── routes/
│   └── workoutRoutes.js ✅
└── services/
    └── geminiService.js ✅

frontend/src/
├── context/
│   └── AuthContext.jsx ✅
├── services/
│   ├── api.js ✅
│   ├── authService.js ✅
│   └── workoutService.js ✅
├── components/
│   └── ProtectedRoute.jsx ✅
└── pages/
    ├── Login.jsx ✅
    ├── Register.jsx ✅
    └── PlayerDashboard.jsx ✅
```

### 📚 Reference Documentation
- [Gemini API Documentation](https://ai.google.dev/docs)
- [React Router v6](https://reactrouter.com/en/main)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

## 📊 PHASE 3: Advanced Features

**Duration:** Week 5-6 (10-12 days)  
**Focus:** Progress tracking, Charts, Coach Portal, Leaderboard  
**Complexity:** High  

### 📌 Phase Objectives
- Implement progress tracking API
- Build Progress Charts page with Chart.js
- Create Coach Portal with player management
- Build Leaderboard system with rankings
- Add performance analytics with Gemini AI
- Implement real-time data updates

### ✅ Key Tasks

#### Task 3.1: Progress Tracking Controllers
- [ ] Create `backend/src/controllers/progressController.js`:
  ```javascript
  const Progress = require('../models/Progress');
  const Leaderboard = require('../models/Leaderboard');
  const Workout = require('../models/Workout');
  const geminiService = require('../services/geminiService');
  
  // @desc    Log workout progress
  // @route   POST /api/progress
  // @access  Private (Player only)
  exports.logProgress = async (req, res, next) => {
    try {
      req.body.playerId = req.user.id;
      
      const progress = await Progress.create(req.body);
      
      // Update leaderboard statistics
      await updateLeaderboardStats(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        data: progress
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get player progress history
  // @route   GET /api/progress/:playerId
  // @access  Private
  exports.getPlayerProgress = async (req, res, next) => {
    try {
      const { playerId } = req.params;
      const { startDate, endDate, workoutId } = req.query;
      
      const filter = { playerId };
      
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (workoutId) filter.workoutId = workoutId;
      
      const progress = await Progress.find(filter)
        .populate('workoutId', 'title category')
        .sort('-date');
      
      res.json({
        success: true,
        count: progress.length,
        data: progress
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get performance analytics
  // @route   GET /api/progress/analytics/:playerId
  // @access  Private
  exports.getAnalytics = async (req, res, next) => {
    try {
      const { playerId } = req.params;
      
      const progressData = await Progress.find({ playerId })
        .sort('-date')
        .limit(20)
        .populate('workoutId');
      
      // Calculate metrics
      const metrics = calculateMetrics(progressData);
      
      // Get AI insights
      const aiAnalysis = await geminiService.analyzePerformance({
        workoutHistory: progressData,
        progressMetrics: metrics
      });
      
      res.json({
        success: true,
        data: {
          metrics,
          aiInsights: aiAnalysis.data,
          recentProgress: progressData
        }
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Helper function
  const updateLeaderboardStats = async (playerId, progressData) => {
    const leaderboard = await Leaderboard.findOne({ playerId });
    
    if (!leaderboard) return;
    
    if (progressData.completed) {
      leaderboard.statistics.totalWorkoutsCompleted += 1;
      leaderboard.statistics.points += 10;
      
      // Update streak logic here
    }
    
    if (progressData.overallMetrics) {
      leaderboard.statistics.totalShotsMade += progressData.overallMetrics.totalShotsMade || 0;
    }
    
    await leaderboard.save();
  };
  
  const calculateMetrics = (progressData) => {
    // Implementation for calculating avg accuracy, completion rate, etc.
    return {
      averageAccuracy: 75,
      completionRate: 85,
      totalWorkouts: progressData.length,
      improvementTrend: 'improving'
    };
  };
  ```

#### Task 3.2: Leaderboard Controllers
- [ ] Create `backend/src/controllers/leaderboardController.js`:
  ```javascript
  const Leaderboard = require('../models/Leaderboard');
  
  // @desc    Get global leaderboard
  // @route   GET /api/leaderboard
  // @access  Private
  exports.getLeaderboard = async (req, res, next) => {
    try {
      const { limit = 50, teamId } = req.query;
      
      const filter = {};
      if (teamId) filter.teamId = teamId;
      
      const leaderboard = await Leaderboard.find(filter)
        .sort('-statistics.points')
        .limit(parseInt(limit))
        .populate('playerId', 'name profileImage');
      
      // Assign ranks
      leaderboard.forEach((entry, index) => {
        entry.statistics.rank = index + 1;
      });
      
      await Promise.all(leaderboard.map(entry => entry.save()));
      
      res.json({
        success: true,
        count: leaderboard.length,
        data: leaderboard
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get player leaderboard entry
  // @route   GET /api/leaderboard/:playerId
  // @access  Private
  exports.getPlayerRank = async (req, res, next) => {
    try {
      const { playerId } = req.params;
      
      const entry = await Leaderboard.findOne({ playerId })
        .populate('playerId', 'name profileImage email');
      
      if (!entry) {
        return next(new AppError('Leaderboard entry not found', 404));
      }
      
      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      next(error);
    }
  };
  ```

#### Task 3.3: Coach Controllers
- [ ] Create `backend/src/controllers/coachController.js`:
  ```javascript
  const User = require('../models/User');
  const Progress = require('../models/Progress');
  const Workout = require('../models/Workout');
  
  // @desc    Get all players assigned to coach
  // @route   GET /api/coach/players
  // @access  Private (Coach only)
  exports.getMyPlayers = async (req, res, next) => {
    try {
      const players = await User.find({
        role: 'player',
        coachId: req.user.id
      }).select('-password');
      
      res.json({
        success: true,
        count: players.length,
        data: players
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Get player detailed overview
  // @route   GET /api/coach/players/:playerId
  // @access  Private (Coach only)
  exports.getPlayerOverview = async (req, res, next) => {
    try {
      const { playerId } = req.params;
      
      const player = await User.findById(playerId);
      const recentProgress = await Progress.find({ playerId })
        .sort('-date')
        .limit(10)
        .populate('workoutId');
      const assignedWorkouts = await Workout.find({ assignedTo: playerId });
      
      res.json({
        success: true,
        data: {
          player,
          recentProgress,
          assignedWorkouts
        }
      });
    } catch (error) {
      next(error);
    }
  };
  
  // @desc    Add feedback to player's progress
  // @route   PUT /api/coach/feedback/:progressId
  // @access  Private (Coach only)
  exports.addFeedback = async (req, res, next) => {
    try {
      const { progressId } = req.params;
      const { coachFeedback } = req.body;
      
      const progress = await Progress.findByIdAndUpdate(
        progressId,
        { coachFeedback },
        { new: true }
      );
      
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      next(error);
    }
  };
  ```

#### Task 3.4: Create Routes for Progress, Leaderboard, Coach
- [ ] Create `backend/src/routes/progressRoutes.js`
- [ ] Create `backend/src/routes/leaderboardRoutes.js`
- [ ] Create `backend/src/routes/coachRoutes.js`
- [ ] Add all routes to server.js

#### Task 3.5: Progress Charts Component
- [ ] Create `frontend/src/pages/ProgressCharts.jsx`:
  ```javascript
  import { useState, useEffect } from 'react';
  import { Line, Bar } from 'react-chartjs-2';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import progressService from '../services/progressService';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const ProgressCharts = () => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetchProgress();
    }, []);
    
    const fetchProgress = async () => {
      try {
        const response = await progressService.getMyProgress();
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const accuracyData = {
      labels: progressData.map((p, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: 'Shooting Accuracy (%)',
          data: progressData.map(p => p.overallMetrics?.overallAccuracy || 0),
          borderColor: 'rgb(255, 102, 0)',
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          tension: 0.3
        }
      ]
    };
    
    const workoutCompletionData = {
      labels: progressData.map((p, i) => `Week ${Math.floor(i / 7) + 1}`),
      datasets: [
        {
          label: 'Workouts Completed',
          data: progressData.map(p => (p.completed ? 1 : 0)),
          backgroundColor: 'rgba(16, 185, 129, 0.6)'
        }
      ]
    };
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shooting Accuracy Trend</h2>
            <Line data={accuracyData} options={{ responsive: true }} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Workout Completion</h2>
            <Bar data={workoutCompletionData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressCharts;
  ```

#### Task 3.6: Coach Portal Page
- [ ] Create `frontend/src/pages/CoachPortal.jsx`:
  ```javascript
  import { useState, useEffect } from 'react';
  import coachService from '../services/coachService';
  import workoutService from '../services/workoutService';
  
  const CoachPortal = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showAIModal, setShowAIModal] = useState(false);
    
    useEffect(() => {
      fetchPlayers();
    }, []);
    
    const fetchPlayers = async () => {
      try {
        const response = await coachService.getMyPlayers();
        setPlayers(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    const handleGenerateAIWorkout = async (player) => {
      try {
        await workoutService.generateAI({
          playerId: player._id,
          age: player.age,
          skillLevel: player.skillLevel,
          goals: 'Improve overall basketball skills'
        });
        alert('AI Workout generated and assigned!');
      } catch (error) {
        console.error('Error generating workout:', error);
      }
    };
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Coach Portal</h1>
          <button className="px-6 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600">
            Create Workout
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player._id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{player.name}</h3>
              <p className="text-gray-600 mb-2">{player.email}</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {player.skillLevel}
              </span>
              
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleGenerateAIWorkout(player)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Generate AI Workout
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  View Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CoachPortal;
  ```

#### Task 3.7: Leaderboard Page
- [ ] Create `frontend/src/pages/Leaderboard.jsx`:
  ```javascript
  import { useState, useEffect } from 'react';
  import leaderboardService from '../services/leaderboardService';
  
  const Leaderboard = () => {
    const [rankings, setRankings] = useState([]);
    
    useEffect(() => {
      fetchLeaderboard();
    }, []);
    
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardService.getGlobalLeaderboard();
        setRankings(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">🏆 Leaderboard</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Player</th>
                <th className="px-6 py-3 text-left">Points</th>
                <th className="px-6 py-3 text-left">Workouts</th>
                <th className="px-6 py-3 text-left">Streak</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry, index) => (
                <tr key={entry._id} className="border-t">
                  <td className="px-6 py-4 font-bold">{index + 1}</td>
                  <td className="px-6 py-4">{entry.playerName}</td>
                  <td className="px-6 py-4 text-basketball-orange font-semibold">
                    {entry.statistics.points}
                  </td>
                  <td className="px-6 py-4">{entry.statistics.totalWorkoutsCompleted}</td>
                  <td className="px-6 py-4">🔥 {entry.statistics.currentStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;
  ```

#### Task 3.8: Create Additional Services
- [ ] Create `frontend/src/services/progressService.js`
- [ ] Create `frontend/src/services/leaderboardService.js`
- [ ] Create `frontend/src/services/coachService.js`

#### Task 3.9: Add Routes to App.jsx
- [ ] Add Progress Charts route
- [ ] Add Coach Portal route (coach-only)
- [ ] Add Leaderboard route

#### Task 3.10: Testing & Integration
- [ ] Test progress logging workflow
- [ ] Test charts render correctly with real data
- [ ] Test coach can view player progress
- [ ] Test AI analysis generates insights
- [ ] Test leaderboard updates after workout completion
- [ ] Test role-based access (coach vs player)

### 🛠️ Technical Stack (Phase 3)
- **Charts:** Chart.js with react-chartjs-2
- **Data Visualization:** Line charts, Bar charts
- **Real-time Updates:** Polling or WebSockets (optional)
- **AI Analytics:** Gemini API for performance insights
- **Complex Queries:** MongoDB aggregation pipelines

### 📦 Deliverables
✅ Progress tracking API with full CRUD  
✅ Leaderboard system with rankings and points  
✅ Coach Portal for player management  
✅ Progress Charts page with visual analytics  
✅ AI-powered performance insights  
✅ Feedback system (coach to player)  
✅ Role-specific dashboards  

### 🧪 Testing Requirements
- [ ] Progress is correctly logged and saved
- [ ] Leaderboard updates automatically
- [ ] Charts display accurate data
- [ ] AI analysis provides meaningful insights
- [ ] Coach can view all assigned players
- [ ] Coach can generate AI workouts for players
- [ ] Permissions enforce role-based access

### 🔗 Dependencies
**Prerequisites:** Phase 2 completed  
**Required:** Workout and auth systems working

### ✨ Success Criteria
- ✅ Players can log workout progress
- ✅ Progress is visualized with charts
- ✅ Leaderboard ranks players correctly
- ✅ Coaches can manage players from portal
- ✅ AI generates performance insights
- ✅ All role-based features work correctly
- ✅ UI is responsive and intuitive

### 💡 Implementation Tips
- Use Chart.js options for customization
- Implement pagination for large leaderboards
- Cache leaderboard data to reduce DB queries
- Add WebSockets for live leaderboard updates (optional)
- Use date range pickers for progress filtering
- Implement CSV export for coach reports
- Add notifications for new feedback

### 📁 Key Files Added (Phase 3)
```
backend/src/
├── controllers/
│   ├── progressController.js ✅
│   ├── leaderboardController.js ✅
│   └── coachController.js ✅
└── routes/
    ├── progressRoutes.js ✅
    ├── leaderboardRoutes.js ✅
    └── coachRoutes.js ✅

frontend/src/
├── pages/
│   ├── ProgressCharts.jsx ✅
│   ├── CoachPortal.jsx ✅
│   └── Leaderboard.jsx ✅
└── services/
    ├── progressService.js ✅
    ├── leaderboardService.js ✅
    └── coachService.js ✅
```

### 📚 Reference Documentation
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [React Chart.js 2](https://react-chartjs-2.js.org/)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)

---

## 🎨 PHASE 4: Polish, Testing & Optimization

**Duration:** Week 7-8 (10-12 days)  
**Focus:** UI/UX refinement, testing, performance optimization, bug fixes  
**Complexity:** Medium  

### 📌 Phase Objectives
- Complete UI/UX polish across all pages
- Implement comprehensive testing (unit, integration, E2E)
- Optimize performance (frontend and backend)
- Add error boundaries and loading states
- Implement search and filtering features
- Add notifications and toast messages
- Fix bugs and improve user experience
- Prepare documentation for deployment

### ✅ Key Tasks

#### Task 4.1: UI/UX Improvements

**Navigation Component:**
- [ ] Create `frontend/src/components/Navbar.jsx`:
  ```javascript
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  import { Menu, Transition } from '@headlessui/react';
  import { Fragment } from 'react';
  
  const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
    
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-basketball-orange">
                🏀 SwishFit
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/dashboard" className="text-gray-700 hover:text-basketball-orange">
                  Dashboard
                </Link>
                <Link to="/workouts" className="text-gray-700 hover:text-basketball-orange">
                  Workouts
                </Link>
                <Link to="/progress" className="text-gray-700 hover:text-basketball-orange">
                  Progress
                </Link>
                <Link to="/leaderboard" className="text-gray-700 hover:text-basketball-orange">
                  Leaderboard
                </Link>
                {user?.role === 'coach' && (
                  <Link to="/coach" className="text-gray-700 hover:text-basketball-orange">
                    Coach Portal
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2">
                  <img
                    src={user?.profileImage || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{user?.name}</span>
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  ```

**Loading Spinner:**
- [ ] Create `frontend/src/components/LoadingSpinner.jsx`:
  ```javascript
  const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`${sizeClasses[size]} border-4 border-basketball-orange border-t-transparent rounded-full animate-spin`}></div>
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    );
  };
  
  export default LoadingSpinner;
  ```

**Toast Notifications:**
- [ ] Install react-toastify: `npm install react-toastify`
- [ ] Create `frontend/src/utils/toast.js`:
  ```javascript
  import { toast } from 'react-toastify';
  
  export const showSuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  };
  
  export const showError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000
    });
  };
  
  export const showInfo = (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000
    });
  };
  ```

- [ ] Add ToastContainer to App.jsx:
  ```javascript
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  
  // In App component
  <ToastContainer />
  ```

**Error Boundary:**
- [ ] Create `frontend/src/components/ErrorBoundary.jsx`:
  ```javascript
  import { Component } from 'react';
  
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">We're sorry for the inconvenience.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        );
      }
      
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;
  ```

- [ ] Wrap App with ErrorBoundary in main.jsx

**Search & Filter Component:**
- [ ] Create `frontend/src/components/WorkoutFilter.jsx`:
  ```javascript
  const WorkoutFilter = ({ filters, onFilterChange }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Level
            </label>
            <select
              value={filters.skillLevel || ''}
              onChange={(e) => onFilterChange('skillLevel', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange"
            >
              <option value="">All Categories</option>
              <option value="shooting">Shooting</option>
              <option value="dribbling">Dribbling</option>
              <option value="defense">Defense</option>
              <option value="conditioning">Conditioning</option>
              <option value="full-body">Full Body</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search workouts..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => onFilterChange('reset', true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default WorkoutFilter;
  ```

#### Task 4.2: Backend Performance Optimization

**Database Indexing:**
- [ ] Add indexes to models (already done in Phase 1, verify):
  ```javascript
  // In User model
  userSchema.index({ email: 1 });
  
  // In Workout model
  workoutSchema.index({ skillLevel: 1, category: 1 });
  workoutSchema.index({ assignedTo: 1 });
  
  // In Progress model
  progressSchema.index({ playerId: 1, date: -1 });
  
  // In Leaderboard model
  leaderboardSchema.index({ 'statistics.rank': 1 });
  ```

**Request Rate Limiting:**
- [ ] Install: `npm install express-rate-limit`
- [ ] Create `backend/src/middleware/rateLimiter.js`:
  ```javascript
  const rateLimit = require('express-rate-limit');
  
  exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
  
  exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later'
  });
  ```

- [ ] Add to server.js:
  ```javascript
  const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
  
  app.use('/api/', apiLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  ```

**Caching Strategy:**
- [ ] Install: `npm install node-cache`
- [ ] Create `backend/src/utils/cache.js`:
  ```javascript
  const NodeCache = require('node-cache');
  const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default
  
  exports.get = (key) => cache.get(key);
  exports.set = (key, value, ttl) => cache.set(key, value, ttl);
  exports.del = (key) => cache.del(key);
  exports.flush = () => cache.flushAll();
  
  module.exports = cache;
  ```

- [ ] Use in leaderboard controller:
  ```javascript
  const cache = require('../utils/cache');
  
  exports.getLeaderboard = async (req, res, next) => {
    const cacheKey = 'leaderboard_global';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({
        success: true,
        count: cached.length,
        data: cached,
        cached: true
      });
    }
    
    // ... fetch from database
    cache.set(cacheKey, leaderboard, 300); // Cache for 5 minutes
    // ... return response
  };
  ```

**Input Sanitization:**
- [ ] Install: `npm install express-mongo-sanitize xss-clean`
- [ ] Add to server.js:
  ```javascript
  const mongoSanitize = require('express-mongo-sanitize');
  const xss = require('xss-clean');
  
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(xss()); // Prevent XSS attacks
  ```

#### Task 4.3: Frontend Performance Optimization

**Code Splitting:**
- [ ] Update App.jsx with lazy loading:
  ```javascript
  import { lazy, Suspense } from 'react';
  import LoadingSpinner from './components/LoadingSpinner';
  
  const PlayerDashboard = lazy(() => import('./pages/PlayerDashboard'));
  const ProgressCharts = lazy(() => import('./pages/ProgressCharts'));
  const CoachPortal = lazy(() => import('./pages/CoachPortal'));
  const WorkoutLibrary = lazy(() => import('./pages/WorkoutLibrary'));
  const Leaderboard = lazy(() => import('./pages/Leaderboard'));
  
  // In Routes
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <PlayerDashboard />
        </Suspense>
      </ProtectedRoute>
    }
  />
  ```

**React Performance Hooks:**
- [ ] Use useMemo and useCallback in Dashboard:
  ```javascript
  import { useMemo, useCallback } from 'react';
  
  const PlayerDashboard = () => {
    // ... existing code
    
    const sortedWorkouts = useMemo(() => {
      return workouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [workouts]);
    
    const handleWorkoutClick = useCallback((workoutId) => {
      navigate(`/workouts/${workoutId}`);
    }, [navigate]);
    
    // ... rest of component
  };
  ```

**Image Optimization:**
- [ ] Add lazy loading to images:
  ```javascript
  <img
    src={workout.imageUrl}
    alt={workout.title}
    loading="lazy"
    className="w-full h-48 object-cover rounded-t-lg"
  />
  ```

#### Task 4.4: Testing Implementation

**Backend Unit Tests:**
- [ ] Install Jest: `npm install -D jest supertest @types/jest`
- [ ] Create `backend/__tests__/auth.test.js`:
  ```javascript
  const request = require('supertest');
  const app = require('../src/server');
  const User = require('../src/models/User');
  
  describe('Auth Endpoints', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });
    
    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'player'
          });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
      });
      
      it('should not register user with duplicate email', async () => {
        await User.create({
          name: 'Existing User',
          email: 'test@example.com',
          password: 'password123'
        });
        
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          });
        
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
    
    describe('POST /api/auth/login', () => {
      it('should login with correct credentials', async () => {
        // Register user first
        await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          });
        
        // Try to login
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('token');
      });
      
      it('should not login with incorrect password', async () => {
        await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
          });
        
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });
        
        expect(res.statusCode).toBe(401);
      });
    });
  });
  ```

- [ ] Add test script to package.json:
  ```json
  "scripts": {
    "test": "jest --coverage --detectOpenHandles",
    "test:watch": "jest --watch"
  }
  ```

**Frontend Component Tests:**
- [ ] Install testing libraries:
  ```bash
  npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
  ```

- [ ] Create `frontend/src/__tests__/Login.test.jsx`:
  ```javascript
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import { AuthProvider } from '../context/AuthContext';
  import Login from '../pages/Login';
  
  describe('Login Component', () => {
    it('renders login form', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );
      
      expect(screen.getByText('SwishFit Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
    
    it('shows error with invalid credentials', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Login');
      
      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });
  ```

- [ ] Run tests: `npm test`

#### Task 4.5: Accessibility (A11y) Improvements

- [ ] Add ARIA labels to forms:
  ```javascript
  <input
    type="email"
    id="email"
    aria-label="Email address"
    aria-required="true"
    // ... other props
  />
  ```

- [ ] Add keyboard navigation:
  ```javascript
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    }
  };
  
  <div
    tabIndex={0}
    role="button"
    onKeyPress={(e) => handleKeyPress(e, handleAction)}
    onClick={handleAction}
  >
    Click me
  </div>
  ```

- [ ] Add focus indicators in CSS:
  ```css
  button:focus,
  input:focus,
  select:focus {
    outline: 2px solid #FF6600;
    outline-offset: 2px;
  }
  ```

#### Task 4.6: Documentation

- [ ] Create API documentation using Postman
- [ ] Export Postman collection as JSON
- [ ] Create `docs/API_DOCUMENTATION.md`
- [ ] Update README.md with:
  - Project description
  - Features list
  - Installation instructions
  - Environment variables guide
  - Running instructions
  - Testing instructions
  - Contributing guidelines
  - License information

- [ ] Create `docs/USER_GUIDE.md`:
  - How to register and login
  - How to view workouts
  - How to log progress
  - How to use coach portal
  - FAQ section

#### Task 4.7: Bug Fixes & Edge Cases

- [ ] Handle empty states (no workouts, no progress)
- [ ] Handle API errors gracefully
- [ ] Add retry mechanism for failed API calls
- [ ] Fix mobile responsiveness issues
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Fix any console errors/warnings
- [ ] Validate all forms properly
- [ ] Add confirmation dialogs for delete actions
- [ ] Handle expired JWT tokens
- [ ] Add offline detection

#### Task 4.8: Security Audit

- [ ] Review all environment variables
- [ ] Ensure no sensitive data in frontend
- [ ] Check CORS configuration
- [ ] Review JWT expiration times
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Verify rate limiting works
- [ ] Check password strength requirements
- [ ] Review API authorization checks
- [ ] Add security headers (Content-Security-Policy, etc.)

#### Task 4.9: Performance Testing

- [ ] Test with large datasets (100+ workouts, 50+ users)
- [ ] Measure page load times
- [ ] Use Lighthouse for performance audit
- [ ] Optimize bundle size (check with `npm run build`)
- [ ] Test database query performance
- [ ] Monitor memory leaks
- [ ] Test concurrent user loads (use tools like Apache JMeter)

#### Task 4.10: Final QA Checklist

- [ ] All pages load correctly
- [ ] All forms submit successfully
- [ ] All API endpoints work as expected
- [ ] Authentication flow is smooth
- [ ] Authorization prevents unauthorized access
- [ ] Charts display correct data
- [ ] Filters work properly
- [ ] Search functionality works
- [ ] Mobile view is fully functional
- [ ] No console errors in production
- [ ] All images load properly
- [ ] Loading states show appropriately
- [ ] Error messages are clear and helpful

### 🛠️ Technical Stack (Phase 4)
- **Testing:** Jest, Supertest, React Testing Library, Vitest
- **Performance:** node-cache, React.lazy, useMemo, useCallback
- **Security:** express-rate-limit, mongo-sanitize, xss-clean, helmet
- **UI Components:** @headlessui/react, react-toastify
- **Monitoring:** Morgan (logging), Lighthouse (performance)

### 📦 Deliverables
✅ Polished UI with navigation and better UX  
✅ Toast notifications for user feedback  
✅ Loading states and error boundaries  
✅ Search and filter functionality  
✅ Rate limiting and security hardening  
✅ Caching for better performance  
✅ Comprehensive test coverage (unit + integration)  
✅ API documentation  
✅ User guide and README  
✅ Accessibility improvements  
✅ Performance optimization  
✅ Bug fixes and edge case handling  

### 🧪 Testing Requirements
- [ ] Backend unit tests pass (>70% coverage)
- [ ] Frontend component tests pass
- [ ] Manual testing on all pages
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Performance metrics meet targets (Lighthouse score >80)
- [ ] Security audit passed
- [ ] Load testing passed

### 🔗 Dependencies
**Prerequisites:** Phases 0-3 completed  
**Required:** All features functional

### ✨ Success Criteria
- ✅ All automated tests pass
- ✅ No critical bugs remaining
- ✅ Performance is optimized
- ✅ Security vulnerabilities addressed
- ✅ UI is polished and responsive
- ✅ Documentation is complete
- ✅ Code is clean and well-commented
- ✅ Ready for deployment

### 💡 Implementation Tips
- Use Git branches for testing features
- Test one feature at a time
- Keep a bug tracker (GitHub Issues)
- Prioritize critical bugs over minor ones
- Get user feedback if possible
- Use browser dev tools for debugging
- Profile performance with React DevTools
- Test with slow network (throttle in DevTools)

### 📁 Key Files Added (Phase 4)
```
frontend/src/
├── components/
│   ├── Navbar.jsx ✅
│   ├── LoadingSpinner.jsx ✅
│   ├── ErrorBoundary.jsx ✅
│   └── WorkoutFilter.jsx ✅
├── utils/
│   └── toast.js ✅
└── __tests__/
    └── Login.test.jsx ✅

backend/
├── middleware/
│   └── rateLimiter.js ✅
├── utils/
│   └── cache.js ✅
└── __tests__/
    └── auth.test.js ✅

docs/
├── API_DOCUMENTATION.md ✅
└── USER_GUIDE.md ✅
```

### 📚 Reference Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🚀 PHASE 5: Deployment & Launch

**Duration:** Week 9 (5-7 days)  
**Focus:** Production deployment, monitoring setup, final testing, launch  
**Complexity:** Medium  

### 📌 Phase Objectives
- Prepare application for production
- Deploy backend to Render/Railway
- Deploy frontend to Vercel/Netlify
- Configure production environment variables
- Set up MongoDB Atlas production database
- Implement monitoring and logging
- Perform production testing
- Create backup and recovery plan
- Launch application

### ✅ Key Tasks

#### Task 5.1: Production Preparation

**Backend Production Config:**
- [ ] Create `backend/src/config/production.js`:
  ```javascript
  module.exports = {
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10
      }
    },
    server: {
      port: process.env.PORT || 5000,
      env: 'production'
    },
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expire: '7d'
    },
    rateLimits: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  };
  ```

**Environment Variables Checklist:**
- [ ] Backend `.env` for production:
  ```
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swishfit
  JWT_SECRET=super_secure_random_string_min_32_chars
  JWT_EXPIRE=7d
  GEMINI_API_KEY=your_production_gemini_key
  GEMINI_MODEL=gemini-pro
  FRONTEND_URL=https://your-frontend-app.vercel.app
  ```

- [ ] Frontend `.env.production`:
  ```
  VITE_API_URL=https://your-backend-app.render.com/api
  ```

**Build Scripts:**
- [ ] Update `backend/package.json`:
  ```json
  {
    "scripts": {
      "start": "node src/server.js",
      "dev": "nodemon src/server.js",
      "build": "echo 'No build step required'",
      "test": "jest"
    },
    "engines": {
      "node": ">=18.0.0",
      "npm": ">=9.0.0"
    }
  }
  ```

- [ ] Update `frontend/package.json`:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "test": "vitest"
    }
  }
  ```

#### Task 5.2: MongoDB Atlas Production Setup

- [ ] Log in to MongoDB Atlas
- [ ] Create production cluster (M0 free tier)
- [ ] Configure network access:
  - Add `0.0.0.0/0` to IP whitelist (allow all IPs)
  - Or add specific IPs from hosting provider
- [ ] Create database user with strong password
- [ ] Get connection string
- [ ] Test connection from local environment
- [ ] Create database indexes:
  ```javascript
  // Run in MongoDB Compass or Atlas console
  db.users.createIndex({ email: 1 }, { unique: true });
  db.workouts.createIndex({ skillLevel: 1, category: 1 });
  db.progress.createIndex({ playerId: 1, date: -1 });
  db.leaderboards.createIndex({ "statistics.rank": 1 });
  ```
- [ ] Set up automated backups (free tier has snapshots)
- [ ] Configure database alerts

#### Task 5.3: Backend Deployment to Render/Railway

**Option A: Render Deployment**

- [ ] Sign up at [Render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `swishfit-backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Plan: `Free`
- [ ] Add environment variables:
  - Click "Environment" tab
  - Add all variables from `.env`
- [ ] Deploy service
- [ ] Wait for deployment (5-10 minutes)
- [ ] Test endpoint: `https://swishfit-backend.onrender.com/api/health`

**Option B: Railway Deployment**

- [ ] Sign up at [Railway.app](https://railway.app)
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select backend folder
- [ ] Add environment variables in Settings
- [ ] Railway will auto-detect Node.js and deploy
- [ ] Get production URL
- [ ] Test endpoint

**Post-Deployment Backend Checklist:**
- [ ] Health endpoint responds: `GET /api/health`
- [ ] Test auth endpoint: `POST /api/auth/login`
- [ ] Check logs for errors
- [ ] Verify MongoDB connection in logs
- [ ] Test CORS with frontend URL
- [ ] Check response times

#### Task 5.4: Frontend Deployment to Vercel/Netlify

**Option A: Vercel Deployment**

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Navigate to frontend folder: `cd frontend`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Follow prompts:
  - Setup and deploy? `Y`
  - Which scope? (select your account)
  - Link to existing project? `N`
  - Project name: `swishfit-frontend`
  - Directory: `./`
  - Override settings? `N`
- [ ] Set production environment variables:
  ```bash
  vercel env add VITE_API_URL production
  # Enter: https://your-backend-app.render.com/api
  ```
- [ ] Deploy to production: `vercel --prod`
- [ ] Get production URL: `https://swishfit-frontend.vercel.app`

**Option B: Netlify Deployment**

- [ ] Sign up at [Netlify.com](https://netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Add environment variables:
  - Go to Site settings → Environment variables
  - Add `VITE_API_URL` with backend URL
- [ ] Deploy site
- [ ] Get production URL

**Post-Deployment Frontend Checklist:**
- [ ] Site loads correctly
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard displays
- [ ] All pages accessible
- [ ] No console errors
- [ ] Images load properly
- [ ] API calls work
- [ ] Check mobile view

#### Task 5.5: SSL/HTTPS Configuration

- [ ] Verify Render provides free SSL (automatic)
- [ ] Verify Vercel/Netlify provides free SSL (automatic)
- [ ] Test HTTPS endpoints
- [ ] Update CORS to only allow HTTPS origins
- [ ] Force HTTPS redirects:
  ```javascript
  // In backend server.js (for production)
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  ```

#### Task 5.6: Production Testing

**Functional Testing:**
- [ ] Register new user account
- [ ] Login with new account
- [ ] Create workout (as coach)
- [ ] Generate AI workout (as coach)
- [ ] Assign workout to player
- [ ] View workouts (as player)
- [ ] Log workout progress
- [ ] View progress charts
- [ ] Check leaderboard updates
- [ ] Test all filters and search
- [ ] Test logout and re-login
- [ ] Test error handling (wrong password, etc.)

**Performance Testing:**
- [ ] Run Lighthouse audit (target score >80)
- [ ] Check page load times (<3 seconds)
- [ ] Test with slow 3G network
- [ ] Check API response times
- [ ] Monitor database query performance
- [ ] Test with multiple concurrent users

**Security Testing:**
- [ ] Verify JWT expiration works
- [ ] Test unauthorized access attempts
- [ ] Check rate limiting works
- [ ] Verify CORS blocks unauthorized origins
- [ ] Test input validation
- [ ] Check for exposed environment variables
- [ ] Scan for vulnerabilities (use npm audit)

**Cross-Browser Testing:**
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop)
- [ ] Safari (Mac & iOS)
- [ ] Edge (desktop)

#### Task 5.7: Monitoring & Logging Setup

**Backend Logging:**
- [ ] Set up Winston logger for production:
  ```javascript
  // backend/src/utils/logger.js
  const winston = require('winston');
  
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
  
  module.exports = logger;
  ```

**Error Tracking:**
- [ ] Sign up for free Sentry account (optional)
- [ ] Install Sentry SDK: `npm install @sentry/node`
- [ ] Configure Sentry in server.js:
  ```javascript
  const Sentry = require('@sentry/node');
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: 'production'
    });
    
    app.use(Sentry.Handlers.errorHandler());
  }
  ```

**Uptime Monitoring:**
- [ ] Sign up for UptimeRobot (free tier)
- [ ] Add monitor for backend: `https://your-backend.render.com/api/health`
- [ ] Add monitor for frontend: `https://your-frontend.vercel.app`
- [ ] Set up email alerts
- [ ] Configure check interval (5 minutes)

#### Task 5.8: Backup & Recovery Plan

- [ ] Document MongoDB connection string securely
- [ ] Set up MongoDB Atlas automated backups
- [ ] Export initial database snapshot
- [ ] Document deployment steps
- [ ] Create rollback plan
- [ ] Store environment variables securely (use password manager)
- [ ] Create disaster recovery checklist

#### Task 5.9: Post-Launch Checklist

**Documentation:**
- [ ] Update README with production URLs
- [ ] Create deployment guide in `docs/DEPLOYMENT.md`
- [ ] Document common issues and solutions
- [ ] Create admin guide for managing users
- [ ] Document backup and restore procedures

**Communication:**
- [ ] Announce launch to beta testers
- [ ] Share production URLs
- [ ] Create feedback form (Google Forms)
- [ ] Set up support email
- [ ] Prepare launch post for social media

**Monitoring:**
- [ ] Check server logs daily (first week)
- [ ] Monitor error rates in Sentry
- [ ] Track user registrations
- [ ] Monitor API response times
- [ ] Watch for server downtime alerts
- [ ] Check database storage usage

#### Task 5.10: Launch Day Activities

- [ ] Final smoke test of all features
- [ ] Verify all monitoring is active
- [ ] Double-check environment variables
- [ ] Clear any test data from production database
- [ ] Announce to initial users
- [ ] Monitor logs actively for first 24 hours
- [ ] Be ready to hotfix critical bugs
- [ ] Gather initial user feedback
- [ ] Document any issues encountered
- [ ] Celebrate! 🎉🏀

### 🛠️ Technical Stack (Phase 5)
- **Hosting:** Render/Railway (backend), Vercel/Netlify (frontend)
- **Database:** MongoDB Atlas (cloud)
- **Monitoring:** UptimeRobot, Sentry (optional)
- **Logging:** Winston
- **SSL:** Automatic via hosting providers
- **CI/CD:** Automatic deployment via Git push

### 📦 Deliverables
✅ Backend deployed to Render/Railway  
✅ Frontend deployed to Vercel/Netlify  
✅ Production MongoDB Atlas database configured  
✅ SSL/HTTPS enabled  
✅ Environment variables configured  
✅ Monitoring and logging active  
✅ Production testing completed  
✅ Backup plan in place  
✅ Documentation updated  
✅ Application launched! 🚀  

### 🧪 Testing Requirements
- [ ] All functional tests pass in production
- [ ] Performance meets targets (Lighthouse >80)
- [ ] Security tests pass
- [ ] Cross-browser tests pass
- [ ] Mobile testing complete
- [ ] Load testing passed
- [ ] Monitoring alerts work

### 🔗 Dependencies
**Prerequisites:** Phase 4 completed  
**Required:** All tests passing, no critical bugs

### ✨ Success Criteria
- ✅ Application is live and accessible
- ✅ All features work in production
- ✅ No critical errors in logs
- ✅ Performance is acceptable
- ✅ Security is hardened
- ✅ Monitoring is active
- ✅ Documentation is complete
- ✅ Users can register and use the app
- ✅ Backend and frontend communicate correctly
- ✅ Database is secure and backed up

### 💡 Implementation Tips
- Deploy backend first, test thoroughly, then deploy frontend
- Use staging environment for testing before production
- Keep deployment credentials secure
- Document every step of deployment
- Have rollback plan ready
- Monitor closely for first 48 hours
- Start with small user base, scale gradually
- Respond quickly to user feedback
- Keep backups updated
- Use environment-specific configs

### 📁 Key Files Added (Phase 5)
```
backend/
├── src/
│   ├── config/
│   │   └── production.js ✅
│   └── utils/
│       └── logger.js ✅
└── .env.production ✅

frontend/
└── .env.production ✅

docs/
├── DEPLOYMENT.md ✅
└── DISASTER_RECOVERY.md ✅

Production URLs:
- Frontend: https://swishfit-frontend.vercel.app ✅
- Backend: https://swishfit-backend.render.com ✅
```

### 📚 Reference Documentation
- [Render Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments/overview)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- [SSL Best Practices](https://letsencrypt.org/docs/)

---

## 🎯 FINAL NOTES & NEXT STEPS

### 🏆 Congratulations!

You've successfully completed all 6 phases of the SwishFit India MVP implementation! Your AI-powered basketball training platform is now live and ready to help players improve their skills.

### 📊 What You've Built

- ✅ **Backend API:** Complete RESTful API with authentication, authorization, and CRUD operations
- ✅ **Frontend SPA:** Responsive React application with TailwindCSS
- ✅ **AI Integration:** Google Gemini API for personalized workout generation and performance analysis
- ✅ **Database:** MongoDB Atlas with 4 collections and proper indexing
- ✅ **Authentication:** JWT-based auth with role-based access control
- ✅ **5 Key Pages:** Dashboard, Workout Library, Progress Charts, Coach Portal, Leaderboard
- ✅ **Production Ready:** Deployed, monitored, and documented

### 🔮 Future Enhancements (Post-MVP)

**Phase 6+ Ideas:**
1. **Mobile App:** React Native or Flutter app
2. **Video Upload:** Allow coaches to add workout videos (Cloudinary integration)
3. **Real-time Features:** WebSocket for live leaderboard updates
4. **Social Features:** Follow friends, share achievements
5. **Advanced Analytics:** More detailed performance metrics with ML
6. **Payment Integration:** Stripe for premium features
7. **Team Management:** Full team rosters, schedules, tournaments
8. **Notifications:** Push notifications, email reminders
9. **Offline Mode:** PWA with service workers
10. **Gamification:** Badges, achievements, rewards system

### 📈 Growth Checklist

- [ ] Gather user feedback (surveys, interviews)
- [ ] Analyze usage metrics (Google Analytics)
- [ ] Prioritize feature requests
- [ ] Fix bugs reported by users
- [ ] Optimize based on real usage patterns
- [ ] Scale infrastructure as needed
- [ ] Add marketing materials
- [ ] Create tutorial videos
- [ ] Build community (Discord, WhatsApp group)
- [ ] Plan version 2.0

### 🛠️ Maintenance Tasks

**Daily:**
- Monitor uptime and error logs
- Respond to user support requests

**Weekly:**
- Review performance metrics
- Update dependencies (security patches)
- Backup database manually if needed

**Monthly:**
- Review and optimize database queries
- Clean up old data (if applicable)
- Update documentation
- Review and respond to feedback

### 📞 Support Resources

- **Documentation:** Check `/docs` folder for detailed guides
- **GitHub Issues:** Track bugs and feature requests
- **MongoDB Support:** [MongoDB Community](https://www.mongodb.com/community/forums/)
- **React Help:** [React Documentation](https://react.dev/)
- **Gemini API:** [Google AI Studio](https://makersuite.google.com/)

### 🙏 Acknowledgments

Built using free-tier services:
- MongoDB Atlas (512MB free)
- Google Gemini API (60 requests/min free)
- Vercel/Netlify (free hosting)
- Render/Railway (free tier with limitations)

### 🎓 Learning Resources

- [MERN Stack Playlist](https://www.youtube.com/results?search_query=mern+stack+tutorial)
- [React Official Tutorial](https://react.dev/learn)
- [MongoDB University](https://university.mongodb.com/)
- [TailwindCSS Course](https://tailwindcss.com/docs)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

## 📝 Document Summary

**Total Implementation Time:** 9 weeks (Phases 0-5)

**Phase Breakdown:**
- **Phase 0:** Project Setup (3-4 days)
- **Phase 1:** Foundation & Auth (Week 1-2)
- **Phase 2:** Core Features (Week 3-4)
- **Phase 3:** Advanced Features (Week 5-6)
- **Phase 4:** Polish & Testing (Week 7-8)
- **Phase 5:** Deployment (Week 9)

**Total Tasks:** 50+ detailed tasks across 6 phases

**Technologies Used:**
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT
- Frontend: React.js, TailwindCSS, React Router, Chart.js
- AI: Google Gemini API
- Hosting: Render, Vercel, MongoDB Atlas
- Testing: Jest, React Testing Library
- Tools: Postman, VS Code, Git

---

*Document Version: 3.0 - COMPLETE*  
*Created: November 9, 2025*  
*Last Updated: November 9, 2025*  
*Status: All 6 Phases Documented - Ready for Full Implementation*  
*Based on: SYSTEM_ARCHITECTURE.md v1.2 & PROJECT_OVERVIEW.md v2.0*

**🎉 YOU'RE ALL SET! START WITH PHASE 0 AND BUILD YOUR MVP! 🚀🏀**
