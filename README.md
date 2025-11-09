# 🏀 SwishFit - AI-Powered Basketball Training Platform

SwishFit is an AI-powered basketball training web application designed to help players improve their skills through personalized workout plans, progress tracking, and performance analytics powered by Google Gemini AI.

## 🚀 Live Application

- **Frontend:** https://swishfit.vercel.app
- **Backend API:** https://swishfit-backend.onrender.com
- **Health Check:** https://swishfit-backend.onrender.com/api/health

**Status:** 🟢 Live and operational

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Players
- 📊 **Personalized Dashboard** - View assigned workouts and training stats
- 🏋️ **Workout Library** - Browse and filter basketball training exercises
- 📈 **Progress Tracking** - Log workout completion and track performance metrics
- 📉 **Progress Charts** - Visualize improvement over time with interactive charts
- 🏆 **Leaderboard** - Compete with other players and earn achievements
- 🤖 **AI-Generated Workouts** - Get personalized training plans based on your profile

### For Coaches
- 👥 **Player Management** - View and manage assigned players
- ✍️ **Workout Creation** - Create custom training plans manually or with AI
- 🎯 **Workout Assignment** - Assign workouts to specific players
- 💬 **Feedback System** - Provide feedback on player progress
- 📊 **Performance Analytics** - Track player improvement with AI insights
- 🤖 **AI Assistant** - Generate workouts using Google Gemini AI

### For Admins
- 🔐 **User Management** - Manage players, coaches, and administrators
- 📊 **Platform Analytics** - View overall platform usage and statistics

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js v4.18+
- **Database:** MongoDB Atlas (Cloud NoSQL)
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator, Joi
- **Security:** Helmet.js, CORS, express-rate-limit, mongo-sanitize, xss-clean
- **AI Integration:** Google Gemini API (@google/generative-ai)
- **Logging:** Morgan, Winston
- **Caching:** node-cache
- **Testing:** Jest, Supertest

### Frontend
- **Framework:** React.js v18+ with Vite
- **Styling:** TailwindCSS v3+
- **UI Components:** Headless UI, Heroicons
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API
- **Forms:** React Hook Form, Yup
- **Charts:** Chart.js, react-chartjs-2
- **Notifications:** react-toastify

### Deployment & Infrastructure
- **Frontend Hosting:** Vercel (Deployed ✅)
- **Backend Hosting:** Render.com (Deployed ✅)
- **Database:** MongoDB Atlas M0 Sandbox - 512MB (Connected ✅)
- **AI Service:** Google Gemini 2.5 Flash API
- **Monitoring:** Winston Logger + UptimeRobot
- **SSL/HTTPS:** Automatic on both services

## 📁 Project Structure

```
swishfit-india/
├── backend/                    # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # Business logic (Gemini AI, etc.)
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Entry point
│   ├── .env.example           # Environment variables template
│   ├── .eslintrc.json         # ESLint configuration
│   ├── .prettierrc            # Prettier configuration
│   └── package.json           # Backend dependencies
│
├── frontend/                   # Frontend React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── context/           # React Context for state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── .env.example           # Environment variables template
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── package.json           # Frontend dependencies
│
├── docs/                       # Project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── IMPLEMENTATION_GUIDE.md
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/downloads)
- **MongoDB Compass** (Optional, for local database testing) - [Download](https://www.mongodb.com/products/compass)

### Required Accounts (Free Tier) ✅ Configured

1. **MongoDB Atlas** - [Sign up](https://www.mongodb.com/cloud/atlas/register) ✅ Active
2. **Google Gemini AI** - [Get API Key](https://ai.google.dev/) ✅ Configured
3. **GitHub** - [Sign up](https://github.com/join) ✅ Repository: chashmishcoder/SwishFit
4. **Vercel** (Frontend Hosting) - [Sign up](https://vercel.com/signup) ✅ Deployed
5. **Render** (Backend Hosting) - [Sign up](https://dashboard.render.com/register) ✅ Deployed

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/chashmishcoder/SwishFit.git
cd SwishFit
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the environment variables template:

```bash
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy the environment variables template:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend server port | `5001` (dev) / `5000` (prod) |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/swishfit` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `generate with: openssl rand -base64 32` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `generate with: openssl rand -base64 32` |
| `GEMINI_API_KEY` | Google Gemini API key | Get from https://ai.google.dev/ |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` (dev) / `https://swishfit.vercel.app` (prod) |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## ▶️ Running the Application

### Development Mode

#### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5001` (development)

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

**Note:** First request may take 30-60 seconds if backend was sleeping (Render free tier).

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend

```bash
cd backend
npm start
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚢 Deployment

### Production Deployment Status ✅

**Current Deployment (Live):**

| Service | Platform | URL | Status |
|---------|----------|-----|--------|
| Frontend | Vercel | https://swishfit.vercel.app | 🟢 Live |
| Backend | Render | https://swishfit-backend.onrender.com | 🟢 Live |
| Database | MongoDB Atlas | swishfitindia.kd9giyy.mongodb.net | 🟢 Connected |
| Monitoring | UptimeRobot | Dashboard | 🟢 Active |

### Deployment Documentation

- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment guide
- **[MONGODB_ATLAS_SETUP.md](docs/MONGODB_ATLAS_SETUP.md)** - Database setup
- **[MONITORING.md](docs/MONITORING.md)** - Monitoring and logging
- **[UPTIMEROBOT_SETUP.md](docs/UPTIMEROBOT_SETUP.md)** - Uptime monitoring

### Quick Redeploy Steps

1. **Update Code**: Make changes and commit to GitHub
2. **Push Changes**: `git push origin main`
3. **Auto-Deploy**: 
   - Vercel auto-deploys frontend (2-3 minutes)
   - Render auto-deploys backend (5-10 minutes)
4. **Verify**: Check health endpoint and test features

## 📚 Documentation

### Project Planning
- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Comprehensive project planning and features
- **[SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)** - Technical architecture and system design
- **[IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md)** - Phase-wise implementation guide

### Deployment & Operations
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete deployment guide
- **[MONGODB_ATLAS_SETUP.md](docs/MONGODB_ATLAS_SETUP.md)** - Database configuration
- **[MONGODB_ATLAS_CHECKLIST.md](docs/MONGODB_ATLAS_CHECKLIST.md)** - Quick setup checklist
- **[MONITORING.md](docs/MONITORING.md)** - Logging and monitoring guide
- **[UPTIMEROBOT_SETUP.md](docs/UPTIMEROBOT_SETUP.md)** - Uptime monitoring setup

### Development
- **[API Documentation](backend/docs/API_TESTING_PHASE3.md)** - API endpoints and testing
- **[Testing Guide](backend/docs/TESTING_README.md)** - Comprehensive testing guide

## 🎯 API Endpoints

**Base URL (Production):** `https://swishfit-backend.onrender.com/api`  
**Base URL (Development):** `http://localhost:5001/api`

### Health & Status
- `GET /api/health` - Health check endpoint (public)
- `GET /api` - API information and available endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/change-password` - Change password (authenticated)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

### Workouts
- `GET /api/workouts` - Get all workouts (with filters)
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout (Coach only)
- `PUT /api/workouts/:id` - Update workout (Coach only)
- `DELETE /api/workouts/:id` - Delete workout (Coach only)
- `POST /api/workouts/generate` - Generate AI workout (Coach only)
- `POST /api/workouts/:id/assign` - Assign workout to players (Coach only)

### Progress
- `POST /api/progress` - Log workout progress (Player only)
- `GET /api/progress/player/:playerId` - Get player progress history
- `GET /api/progress/workout/:workoutId` - Get progress for specific workout
- `GET /api/progress/analytics/:playerId` - Get AI-powered analytics

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard (with filters)
- `GET /api/leaderboard/:playerId` - Get player rank and stats
- `GET /api/leaderboard/top/:limit` - Get top N players

### Coach Portal
- `GET /api/coach/players` - Get assigned players (Coach only)
- `GET /api/coach/players/:playerId` - Get player detailed overview
- `GET /api/coach/players/:playerId/progress` - Get player progress
- `POST /api/coach/feedback/:progressId` - Add feedback to progress entry
- `GET /api/coach/stats` - Get coach dashboard statistics

**Note:** All authenticated endpoints require `Authorization: Bearer <token>` header.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Write tests for new features

## � Security Features

- **Authentication:** JWT-based with refresh tokens
- **Password Security:** bcrypt hashing (10 rounds)
- **Rate Limiting:** 
  - API: 1000 requests/15 min
  - Auth: 10 attempts/15 min
  - AI: 20 requests/hour
- **Input Validation:** express-validator + Joi schemas
- **Sanitization:** mongo-sanitize, xss-clean
- **CORS:** Configured for production origins only
- **Helmet.js:** Security headers
- **HTTPS:** Enforced on production

## 📊 Monitoring & Logging

- **Logger:** Winston (production-ready)
- **Log Files:** error.log, combined.log, access.log
- **Uptime Monitoring:** UptimeRobot (5-min intervals)
- **Performance Tracking:** Response time monitoring
- **Error Tracking:** Comprehensive error logging with context

## 🚀 Performance

- **Frontend:**
  - Code splitting with React lazy loading
  - Optimized bundle size (70% reduction)
  - Image optimization
  - TailwindCSS purging
- **Backend:**
  - Database indexing (90% faster queries)
  - Response caching (node-cache)
  - Query optimization
  - Rate limiting protection

## �📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer:** @chashmishcoder
- **AI Integration:** Powered by Google Gemini 2.5 Flash
- **Repository:** https://github.com/chashmishcoder/SwishFit

## 🙏 Acknowledgments

- **MongoDB Atlas** for free-tier cloud database (M0 Sandbox)
- **Google** for Gemini AI API
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **UptimeRobot** for free monitoring
- All open-source contributors and libraries

## 📞 Support

- **Issues:** Open an issue on [GitHub](https://github.com/chashmishcoder/SwishFit/issues)
- **Documentation:** Check the [docs](docs/) folder
- **Live App:** https://swishfit.vercel.app

---

## 🎯 Development Status

### ✅ Completed Phases

- **Phase 0:** Project Setup & Planning ✅
- **Phase 1:** Foundation & Authentication System ✅
- **Phase 2:** Core Features (Workouts, Progress, Leaderboard) ✅
- **Phase 3:** Advanced Features (AI Integration, Coach Portal) ✅
- **Phase 4:** Polish, Testing & Optimization ✅
- **Phase 5:** Deployment & Launch ✅

### 📈 Current Version

**v1.0.0** - Production Release (November 2025)

### 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video upload and analysis
- [ ] Social features (follow, share)
- [ ] Tournament management
- [ ] Payment integration for premium features
- [ ] Multi-language support

---

**Built with ❤️ for the basketball community 🏀**

**Live at:** https://swishfit.vercel.app
