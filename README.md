# 🏀 SwishFit India - AI-Powered Basketball Training Platform

SwishFit India is an AI-powered basketball training web application designed to help players improve their skills through personalized workout plans, progress tracking, and performance analytics powered by Google Gemini AI.

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

### Deployment
- **Frontend Hosting:** Vercel / Netlify (Free Tier)
- **Backend Hosting:** Render / Railway (Free Tier)
- **Database:** MongoDB Atlas M0 (512MB Free Tier)
- **AI Service:** Google Gemini API (60 requests/min Free Tier)

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

### Required Accounts (Free Tier)

1. **MongoDB Atlas** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
2. **Google Cloud** (for Gemini API) - [Sign up](https://cloud.google.com/)
3. **GitHub** - [Sign up](https://github.com/join)
4. **Vercel** or **Netlify** (Frontend) - [Vercel](https://vercel.com/signup) / [Netlify](https://app.netlify.com/signup)
5. **Render** or **Railway** (Backend) - [Render](https://dashboard.render.com/register) / [Railway](https://railway.app/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/swishfit-india.git
cd swishfit-india
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
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
GEMINI_API_KEY=your_gemini_api_key
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
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/swishfit` |
| `JWT_SECRET` | Secret key for JWT tokens | `random_32_character_string` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `your_api_key` |
| `GEMINI_MODEL` | Gemini model name | `gemini-pro` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

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

Backend will run on: `http://localhost:5000`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

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

For detailed deployment instructions, see [docs/IMPLEMENTATION_GUIDE.md - Phase 5](docs/IMPLEMENTATION_GUIDE.md#phase-5-deployment--launch)

### Quick Deployment Steps

1. **MongoDB Atlas**: Create production cluster and get connection string
2. **Backend**: Deploy to Render or Railway
3. **Frontend**: Deploy to Vercel or Netlify
4. **Environment Variables**: Configure production variables on hosting platforms

## 📚 Documentation

- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Comprehensive project planning and features
- **[SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)** - Technical architecture and system design
- **[IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md)** - Phase-wise implementation guide (9 weeks)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout (Coach only)
- `PUT /api/workouts/:id` - Update workout (Coach only)
- `DELETE /api/workouts/:id` - Delete workout (Coach only)
- `POST /api/workouts/generate` - Generate AI workout (Coach only)
- `POST /api/workouts/:id/assign` - Assign workout to players

### Progress
- `POST /api/progress` - Log workout progress (Player only)
- `GET /api/progress/:playerId` - Get player progress
- `GET /api/progress/analytics/:playerId` - Get AI analytics

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/:playerId` - Get player rank

### Coach
- `GET /api/coach/players` - Get assigned players (Coach only)
- `GET /api/coach/players/:playerId` - Get player overview
- `PUT /api/coach/feedback/:progressId` - Add feedback

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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Development Team** - SwishFit India
- **AI Integration** - Powered by Google Gemini API
- **Documentation** - Comprehensive guides included

## 🙏 Acknowledgments

- MongoDB Atlas for free-tier cloud database
- Google for Gemini AI API
- Vercel/Netlify for frontend hosting
- Render/Railway for backend hosting
- All open-source contributors

## 📞 Support

For support, email support@swishfitindia.com or open an issue on GitHub.

---

**Built with ❤️ for the basketball community in India 🏀**

---

### 🎯 Current Status

**Phase 0: Project Setup** - ✅ Complete

Ready to proceed with Phase 1: Foundation & Authentication System!
