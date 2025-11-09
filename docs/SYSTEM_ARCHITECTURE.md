# SwishFit India - System Architecture Document

## 📐 Architecture Overview

SwishFit India follows a **modern 3-tier MERN stack architecture** with external AI integration and cloud-based deployment. The system is designed for scalability, maintainability, and optimal performance using free-tier cloud services.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              User (Player / Coach / Admin)                   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                   Dynamic UI Updates (Real-time)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    FRONTEND LAYER                            │
│           React.js + Material UI (SPA)                       │
│         Deployed on Vercel / Netlify                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
              HTTP Requests / JSON Responses
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    BACKEND LAYER                             │
│              Node.js + Express.js (REST API)                 │
│          Deployed on Render / Railway / AWS                  │
└──┬────────┬────────┬────────┬────────┬─────────────────────┘
   │        │        │        │        │
   │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼
┌──────┐ ┌────────┐ ┌────────┐ ┌─────────┐
│ Auth │ │MongoDB │ │ Gemini │ │Cloudinary│
│(JWT) │ │ Atlas  │ │  API   │ │(Storage)│
└──────┘ └────────┘ └────────┘ └─────────┘
```

---

## 🔷 Architecture Layers

### 1. Presentation Layer (User Interface)
**Component:** User (Player / Coach / Admin)

**Description:**
- End users interact with the application through web browsers
- Three primary user roles with different access levels and interfaces
- Responsive design ensures compatibility across devices (desktop, tablet, mobile)

**User Types:**
- **🏀 Player:** Access training plans, log workouts, view progress
- **👨‍🏫 Coach:** Manage players, assign training plans, monitor team performance
- **⚙️ Admin:** System administration, user management (optional in MVP)

**Interactions:**
- Sends user actions (clicks, form submissions, navigation)
- Receives dynamic UI updates in real-time
- Displays data visualizations (charts, graphs, leaderboards)

---

### 2. Frontend Layer (Client Application)

**Component:** React.js + TailwindCSS

**Technology Stack:**
- **Framework:** React.js (v18+)
- **UI Library:** TailwindCSS (Utility-first CSS framework)
- **Component Library:** Headless UI / Shadcn/ui (optional for pre-built components)
- **State Management:** Redux Toolkit / Context API
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Charts:** Chart.js / Recharts
- **Form Handling:** React Hook Form + Yup validation
- **Icons:** React Icons / Heroicons

**Deployment:**
- **Hosting:** Vercel / Netlify (Free Tier)
- **CDN:** Automatic edge caching
- **Build:** Optimized production builds with code splitting

**Key Features:**
- Single Page Application (SPA) for smooth navigation
- Component-based architecture for reusability
- Responsive design using TailwindCSS utility classes
- Real-time UI updates without page refresh
- Progressive Web App (PWA) capabilities
- Mobile-first responsive design approach
- Custom styling with Tailwind's JIT (Just-In-Time) compiler

**Communication:**
- **Outbound:** HTTP/HTTPS requests to Backend API (JSON format)
- **Inbound:** JSON responses from Backend API
- **Protocol:** RESTful API calls over HTTPS

**Frontend Modules:**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Login, Register, ForgotPassword
│   │   ├── Dashboard/      # Player & Coach dashboards
│   │   ├── TrainingPlan/   # Training plan views
│   │   ├── Progress/       # Charts and progress tracking
│   │   ├── Leaderboard/    # Rankings and competition
│   │   └── Shared/         # Common components (Navbar, Footer)
│   ├── pages/              # Page-level components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Dashboard.jsx   # Main dashboard (role-based)
│   │   ├── WorkoutLibrary.jsx  # Browse and select workouts
│   │   ├── ProgressCharts.jsx  # Detailed progress visualization
│   │   ├── CoachPortal.jsx     # Coach management interface
│   │   └── Profile.jsx     # User profile settings
│   ├── services/           # API service layer (Axios)
│   ├── store/              # Redux store configuration
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── styles/             # Global CSS and Tailwind config
│   └── App.js              # Main application component
```

**Key Pages/Features:**
1. **Home**: Landing page with features, pricing, testimonials
2. **Dashboard**: Personalized dashboard (Player/Coach views)
3. **Workout Library**: Browse, filter, and select training programs
4. **Progress Charts**: Interactive data visualization of performance
5. **Coach Portal**: Team management, plan assignments, analytics

---

### 3. Backend Layer (Application Server)

**Component:** Node.js + Express.js (REST API)

**Technology Stack:**
- **Runtime:** Node.js (v18+ LTS)
- **Framework:** Express.js (v4.18+)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi / Express-validator
- **Security:** Helmet.js, CORS, express-rate-limit
- **File Upload:** Multer (for PDFs, images)
- **Logging:** Winston / Morgan

**Deployment:**
- **Hosting:** Render / Railway / AWS EC2 (Free Tier)
- **Environment:** Docker containers (optional)
- **Process Manager:** PM2 for production
- **Load Balancing:** Built-in with cloud providers

**Core Responsibilities:**
1. **Business Logic Processing**
2. **Request/Response Handling**
3. **Authentication & Authorization**
4. **Data Validation**
5. **External API Integration**
6. **Error Handling**

**Backend Modules:**
```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── trainingPlanController.js
│   │   ├── progressController.js
│   │   └── coachController.js
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── TrainingPlan.js
│   │   ├── Progress.js
│   │   └── Assignment.js
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT verification
│   │   ├── roleCheck.js    # Role-based access
│   │   └── errorHandler.js
│   ├── services/           # Business logic
│   │   ├── geminiService.js    # AI integration
│   │   ├── emailService.js
│   │   └── uploadService.js
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Entry point
```

---

## 🔌 Backend API Connections

### Connection 1: JWT Authentication / Middleware

**Purpose:** Secure user authentication and session management

**Flow:**
1. User logs in with credentials
2. Backend validates credentials against database
3. If valid, generates JWT token with user payload
4. Token sent to frontend and stored (localStorage/cookies)
5. Subsequent requests include token in Authorization header
6. Middleware verifies token before processing requests

**Components:**
- **JWT Library:** jsonwebtoken
- **Encryption:** bcrypt for password hashing
- **Token Storage:** HTTP-only cookies (recommended) or localStorage

**Security Features:**
- Token expiration (15min - 1hr for access tokens)
- Refresh token mechanism (7-30 days)
- Role-based access control (RBAC)
- Password complexity requirements
- Rate limiting on auth endpoints

---

### Connection 2: REST API Calls to MongoDB Atlas

**Purpose:** Data persistence and retrieval

**Database:** MongoDB Atlas (Cloud-hosted NoSQL Database)

**Connection Details:**
- **Driver:** Mongoose ODM (Object Data Modeling)
- **Connection String:** MongoDB URI with credentials
- **Connection Pooling:** Built-in connection pool management
- **Retry Logic:** Automatic reconnection on failure

**Data Operations:**
```javascript
// Example connection configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

**Collections Used:**
- **users** - User profiles and authentication data
- **workouts** - Training plans, workout routines, and exercises library
- **progress** - Player workout logs, metrics, and performance tracking
- **leaderboard** - Ranking, competition data, and player statistics (can be derived/cached)

**Database Features:**
- **Free Tier:** 512MB storage (sufficient for MVP)
- **Automatic Backups:** Daily snapshots
- **SSL Encryption:** Data in transit
- **Geographic Distribution:** Low-latency access
- **Monitoring:** Built-in performance metrics

---

### Connection 3: Workout & Progress Data Storage

**Purpose:** Store and retrieve training-related information

**Data Flow:**
```
Player logs workout → Backend validates data → 
Store in MongoDB → Update progress metrics → 
Trigger leaderboard recalculation → Return success response
```

**Data Types Stored:**
- **Workout Logs:** Exercise completion, timestamps, duration
- **Performance Metrics:** Shots made/attempted, accuracy percentages
- **Progress Tracking:** Historical data, trends, improvements
- **Training Plans:** Exercise details, sets, reps, instructions
- **Media References:** URLs to videos/images (stored in Cloudinary)

**Optimization Strategies:**
- **Indexing:** On frequently queried fields (userId, date, planId)
- **Aggregation Pipelines:** For complex analytics queries
- **Caching:** Redis for frequently accessed data (optional)
- **Data Archiving:** Old records moved to archive collection

---

### Connection 4: AI API Calls to Gemini

**Purpose:** Generate personalized workout recommendations using AI

**Service:** Google Gemini API (External API)

**Integration Details:**
- **API Key:** Stored securely in environment variables
- **Model:** Gemini Pro (text generation)
- **Rate Limit:** 60 requests per minute (Free Tier)
- **Request Method:** HTTPS POST requests

**Use Cases:**

#### 1. Generate Personalized Training Plans

**Input Parameters:**
- **Player's Age:** For age-appropriate training intensity
- **Skill Level:** Beginner, Intermediate, or Advanced
- **Training Goals:** (e.g., improve shooting, conditioning, ball handling)
- **Past Performance Data:** Historical workout logs, accuracy rates, completion rates
- **Available Days:** Training frequency per week
- **Session Duration:** Time available per session
- **Available Equipment:** Basketball, gym access, weights, etc.
- **Focus Areas:** Specific skills to improve

**Input Prompt Structure:**
```javascript
const prompt = `
Generate a personalized basketball training plan with the following details:

Player Information:
- Age: ${playerAge} years
- Skill Level: ${skillLevel}
- Training Goals: ${goals.join(', ')}
- Available Days per Week: ${daysPerWeek}
- Session Duration: ${duration} minutes
- Available Equipment: ${equipment.join(', ')}
- Focus Areas: ${focusAreas.join(', ')}

Past Performance Data:
- Average Accuracy: ${pastPerformance.averageAccuracy}%
- Workouts Completed: ${pastPerformance.totalWorkouts}
- Current Streak: ${pastPerformance.streak} days
- Strengths: ${pastPerformance.strengths.join(', ')}
- Areas for Improvement: ${pastPerformance.weaknesses.join(', ')}

Provide a structured weekly training routine with daily exercises, sets, reps, and progression.
Ensure the plan is adaptive to the player's current fitness level and goals.
Format the response as JSON.
`;
```

**Expected Output (Customized Weekly Training Routines & Performance Insights):**
```json
{
  "planTitle": "Intermediate Shooting Development Plan - Age 18",
  "duration": "4 weeks",
  "customizedFor": {
    "age": 18,
    "skillLevel": "Intermediate",
    "goals": ["Improve shooting accuracy", "Build conditioning"]
  },
  "weeks": [
    {
      "week": 1,
      "focus": "Form Foundation & Baseline Building",
      "weeklyGoal": "Establish proper shooting form and baseline metrics",
      "workouts": [
        {
          "day": 1,
          "dayTitle": "Shooting Fundamentals",
          "totalDuration": 60,
          "exercises": [
            {
              "name": "Form Shooting",
              "sets": 3,
              "reps": 20,
              "duration": 15,
              "description": "Close-range shooting focusing on form and follow-through",
              "targetMetric": "Aim for 80%+ accuracy"
            },
            {
              "name": "Free Throw Practice",
              "sets": 5,
              "reps": 10,
              "duration": 20,
              "description": "Consistent free throw routine",
              "targetMetric": "Track improvement over time"
            }
          ]
        },
        {
          "day": 2,
          "dayTitle": "Conditioning & Footwork",
          "exercises": [...]
        }
      ]
    },
    {
      "week": 2,
      "focus": "Progressive Intensity",
      "workouts": [...]
    }
  ],
  "performanceInsights": {
    "expectedImprovements": [
      "15-20% increase in shooting accuracy by week 4",
      "Improved stamina and reduced fatigue during games",
      "Enhanced muscle memory for shooting form"
    ],
    "keyFocusAreas": [
      "Maintain consistent form even when fatigued",
      "Track daily accuracy percentages",
      "Gradually increase shooting distance"
    ],
    "adaptiveTips": [
      "If accuracy drops below 70%, reduce distance and focus on form",
      "Rest days are crucial - don't skip them",
      "Film your shots weekly to check form consistency"
    ],
    "progressionStrategy": "Each week increases volume by 10-15% while maintaining form quality"
  },
  "coachingTips": [
    "Focus on consistency over volume in week 1",
    "Track your accuracy daily to see progress",
    "Don't rush through exercises - quality over quantity"
  ]
}
```

#### 2. Analyze Player Progress & Generate Performance Insights

**Input Parameters:**
- **Player's Age:** For age-appropriate analysis
- **Historical Workout Data:** Completed workouts, timestamps
- **Performance Trends:** Accuracy over time, shot metrics, completion patterns
- **Completion Rates:** Workout adherence percentage
- **Current Skill Level:** Latest assessment results
- **Past Performance Data:** Comparative analysis from previous weeks/months

**Output (Performance Insights):**
- **Performance Analysis:** Detailed breakdown of progress
- **Strengths Identification:** What the player is doing well
- **Weaknesses Identification:** Areas needing improvement
- **Improvement Recommendations:** Specific actionable steps
- **Motivational Feedback:** Personalized encouragement
- **Adaptive Adjustments:** Suggested modifications to training plan

#### 3. AI Coaching Assistant
**Input:**
- Player questions about techniques
- Specific training concerns
- Form improvement requests

**Output:**
- Personalized advice
- Technique tips and corrections
- Troubleshooting guidance
- Video/resource recommendations

**Implementation (Backend Service):**
```javascript
// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTrainingPlan(userProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = constructPrompt(userProfile);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return parseAIResponse(response.text());
}
```

**Error Handling:**
- Fallback to pre-defined templates if API fails
- Retry mechanism with exponential backoff
- Cache successful responses to reduce API calls
- User-friendly error messages

---

### AI Recommendation Module Advantages

#### 1. Adaptive to Individual Player Needs
- **Personalization:** Plans are customized based on age, skill level, and goals
- **Dynamic Adjustments:** AI adapts recommendations based on past performance data
- **Progressive Training:** Automatically adjusts difficulty as player improves
- **Age-Appropriate:** Considers player's age for safe and effective training
- **Goal-Oriented:** Focuses on specific player objectives (shooting, conditioning, etc.)
- **Performance-Based:** Uses historical data to identify strengths and weaknesses
- **Flexible Scheduling:** Accommodates player's available time and frequency
- **Equipment Aware:** Tailors exercises to available resources

**Example Adaptive Behavior:**
```javascript
// AI adjusts based on performance
if (player.averageAccuracy > 85 && player.completionRate > 90) {
  // Progress to advanced drills
  aiRecommendation = generateAdvancedPlan();
} else if (player.completionRate < 50) {
  // Reduce intensity, focus on consistency
  aiRecommendation = generateModifiedPlan({ reduceIntensity: true });
}
```

#### 2. Reduces Manual Effort for Coaches
- **Automated Plan Generation:** AI creates initial training plans instantly
- **Time Savings:** Coaches can review and tweak instead of creating from scratch
- **Scalability:** Handle multiple players efficiently
- **Consistent Quality:** Every player gets a well-structured plan
- **Data-Driven Insights:** AI analyzes player data automatically
- **Bulk Assignments:** Generate plans for entire team based on individual profiles
- **Progress Monitoring:** AI highlights players needing attention
- **Performance Reports:** Automated insights reduce manual analysis

**Coach Benefits:**
```
Traditional Approach:
- 2-3 hours per player to create custom plan
- Manual tracking of each player's progress
- Time-consuming performance analysis

AI-Powered Approach:
- 5-10 minutes per player (review AI plan + adjustments)
- Automated progress tracking with insights
- Instant performance analysis and recommendations

Time Saved: ~80-90% per player
```

#### 3. Additional AI Module Advantages
- **24/7 Availability:** Players can get recommendations anytime
- **Consistency:** Standardized approach based on best practices
- **Learning System:** AI improves recommendations over time
- **Objective Analysis:** Data-driven, unbiased performance evaluation
- **Motivation:** Personalized encouragement keeps players engaged
- **Injury Prevention:** Can suggest rest days based on training load
- **Cost-Effective:** Reduces need for frequent one-on-one coaching sessions
- **Scalable:** Can serve unlimited players simultaneously

---

### Connection 5: Personalized Plans Delivery

**Purpose:** Deliver AI-generated or coach-created training plans to players

**Flow Process:**
```
1. Player requests personalized plan OR Coach assigns custom plan
   ↓
2. Backend receives request with user profile data
   ↓
3. If AI-generated:
   - Call Gemini API with structured prompt
   - Parse AI response
   - Validate and structure data
   - Save to MongoDB with isAIGenerated: true
   ↓
4. If Coach-created:
   - Validate plan structure
   - Save to MongoDB with createdBy: coachId
   ↓
5. Create Assignment record (link player to plan)
   ↓
6. Return plan details to frontend
   ↓
7. Frontend displays plan in user-friendly format
```

**Data Structure:**
```javascript
// Assignment document linking player to plan
{
  _id: ObjectId,
  playerId: ObjectId,
  trainingPlanId: ObjectId,
  assignedBy: ObjectId (coach or "system"),
  startDate: Date,
  endDate: Date,
  status: "active",
  customizations: {
    notesFromCoach: String,
    modifiedExercises: []
  },
  createdAt: Date
}
```

---

## 🗄️ Data Layer (Persistence)

### MongoDB Atlas (Cloud Database)

**Configuration:**
- **Cluster:** M0 Sandbox (Free Tier - 512MB)
- **Region:** Closest to target users (e.g., Mumbai for India)
- **Version:** MongoDB 6.0+
- **Connection:** Mongoose ODM with connection pooling

**Database Structure:**
```
swishfit_database/
├── users                  # User accounts and profiles
├── workouts               # Training plans and workout routines library
├── progress               # Player workout logs and performance metrics
├── leaderboard            # Rankings, statistics, and competition data
├── notifications          # System notifications (optional - future)
└── media                  # Metadata for uploaded files (optional - future)
```

**Simplified Collection Structure (MVP):**
- **users**: Authentication, profiles, roles (player/coach/admin)
- **workouts**: Training plans, exercises, AI-generated routines
- **progress**: Workout completion logs, performance metrics, history
- **leaderboard**: Player rankings, team statistics, achievements

**Performance Optimizations:**
- **Indexes:** 
  - users.email (unique)
  - progress.playerId + progress.date (compound)
  - workouts.skillLevel
  - workouts.isPublic (for library filtering)
  - workouts.assignedTo (array index)
  - leaderboard.rank
  - leaderboard.teamId
- **TTL Indexes:** Auto-delete old notifications/logs (future)
- **Aggregation:** Pre-calculated leaderboard data from progress collection
- **Projection:** Return only necessary fields to minimize data transfer

**Backup Strategy:**
- **Automated:** Daily snapshots by MongoDB Atlas
- **Retention:** 7-day rolling backup
- **Manual Exports:** Weekly JSON exports (optional)

---

## 🔐 Authentication System

**Component:** JWT-based Authentication

**Architecture:**
```
User Credentials → Backend Validation → JWT Generation → 
Secure Token Storage → Protected Route Access
```

**Token Structure:**
```javascript
// JWT Payload
{
  userId: ObjectId,
  email: String,
  role: String (player/coach/admin),
  iat: Timestamp (issued at),
  exp: Timestamp (expiration)
}
```

**Authentication Flow:**

1. **Registration:**
   - User submits registration form
   - Backend validates input
   - Password hashed with bcrypt (10 salt rounds)
   - User document created in MongoDB
   - Confirmation email sent (optional)

2. **Login:**
   - User submits credentials
   - Backend verifies email and password
   - JWT access token generated (15min - 1hr expiry)
   - JWT refresh token generated (7-30 days expiry)
   - Tokens sent to client

3. **Protected Requests:**
   - Client includes access token in Authorization header
   - Backend middleware verifies token signature
   - Extracts user info from token payload
   - Checks role-based permissions
   - Processes request if authorized

4. **Token Refresh:**
   - Access token expires
   - Client sends refresh token
   - Backend validates refresh token
   - Issues new access token
   - Continues session without re-login

**Security Measures:**
- HTTPS only in production
- HTTP-only cookies for token storage (prevents XSS)
- CSRF protection tokens
- Rate limiting on auth endpoints (5 attempts per 15min)
- Password strength requirements
- Account lockout after failed attempts

---

## 🌐 External Services Integration

### 1. Google Gemini API (AI Recommendation Module)

**Service Type:** External AI API  
**Provider:** Google AI

**Primary Function:** Generate personalized workout plans and performance insights

**Integration Points:**
1. **Training Plan Generation:** Create customized weekly training routines
2. **Progress Analysis:** Generate performance insights from historical data
3. **Coaching Recommendations:** AI-powered coaching tips and advice
4. **Natural Language Processing:** Respond to player queries

**Input Parameters:**
- Player's age (for age-appropriate training)
- Skill level (Beginner, Intermediate, Advanced)
- Training goals (shooting, conditioning, dribbling, etc.)
- Past performance data (accuracy, completion rates, workout history)
- Available time and equipment
- Focus areas and weaknesses

**Output Delivered:**
- **Customized Weekly Training Routines:** Structured workout plans with daily exercises
- **Performance Insights:** Analysis of progress, strengths, weaknesses
- **Adaptive Recommendations:** Dynamic adjustments based on performance
- **Coaching Tips:** Personalized guidance and motivation

**Key Advantages:**
- ✅ **Adaptive to Individual Player Needs:** Personalized based on comprehensive player profile
- ✅ **Reduces Manual Effort for Coaches:** Automated plan generation saves 80-90% time
- ✅ **Data-Driven:** Uses past performance for intelligent recommendations
- ✅ **Scalable:** Handles unlimited players simultaneously
- ✅ **24/7 Availability:** Instant recommendations anytime

**Configuration:**
```javascript
// .env file
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7  // Balance creativity and consistency
```

**Rate Limiting Strategy:**
- Track API calls per user
- Implement request queue for high-traffic periods
- Cache common AI responses (e.g., beginner plans)
- Fallback to pre-defined templates if quota exceeded
- Store AI-generated plans in database to avoid regeneration

**Usage Flow:**
```
Player Profile + Goals → Gemini API Request → 
AI Processing → Customized Plan Generated → 
Stored in MongoDB → Delivered to Player
```

---

### 2. MongoDB Atlas Cloud

**Service Type:** Database-as-a-Service (DBaaS)  
**Provider:** MongoDB Inc.

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/swishfit?retryWrites=true&w=majority
```

**Monitoring:**
- Real-time performance metrics
- Slow query detection
- Connection pool monitoring
- Disk usage alerts

---

### 3. Cloudinary (Optional for MVP)

**Service Type:** Media Storage and CDN  
**Provider:** Cloudinary

**Use Cases:**
- User profile images
- Training video uploads
- Exercise demonstration images
- Coach-uploaded PDF documents

**Free Tier Limits:**
- 25 GB storage
- 25 GB monthly bandwidth
- Image and video transformations

---

## 🚀 Deployment Architecture

### Frontend Deployment

**Platform:** Vercel / Netlify

**Build Configuration:**
```javascript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "react",
  "environmentVariables": {
    "REACT_APP_API_URL": "https://api.swishfit.com"
  }
}

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'basketball-orange': '#FF6600',
        'court-blue': '#1E3A8A',
        'success-green': '#10B981'
      }
    }
  },
  plugins: []
}
```

**Features:**
- Automatic deployments from Git
- Preview deployments for PRs
- Edge caching for static assets
- Custom domain support
- SSL certificates (auto-provisioned)
- Global CDN distribution

**Environment Variables:**
- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_GEMINI_PUBLIC_KEY` - If any client-side AI features

---

### Backend Deployment

**Platform:** Render / Railway / AWS EC2

**Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: swishfit-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false  # Set in dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: GEMINI_API_KEY
        sync: false
```

**Features:**
- Auto-scaling based on traffic
- Health check endpoints
- Zero-downtime deployments
- Automatic SSL
- Environment variable management
- Log aggregation

**Process Management:**
```javascript
// ecosystem.config.js (PM2)
module.exports = {
  apps: [{
    name: 'swishfit-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

## 🔄 Data Flow Examples

### Example 1: Player Logs a Workout

```
1. Player completes workout and clicks "Log Workout"
   ↓
2. Frontend sends POST request to /api/progress/log-workout
   {
     "workoutId": "abc123",
     "date": "2025-11-09",
     "metrics": {
       "shotsMade": 85,
       "shotsAttempted": 100,
       "duration": 45
     }
   }
   ↓
3. Backend JWT middleware verifies user token
   ↓
4. Controller validates request data
   ↓
5. Calculate accuracy: 85/100 = 85%
   ↓
6. Store workout log in MongoDB (progress collection)
   ↓
7. Update player's overall progress statistics
   ↓
8. Check if workout completion affects leaderboard
   ↓
9. If yes, update leaderboard rankings
   ↓
10. Return success response with updated stats
    ↓
11. Frontend updates UI (progress charts, streak counter)
```

---

### Example 2: AI Generates Training Plan

```
1. Player clicks "Get AI Training Plan" button
   ↓
2. Frontend shows skill assessment questionnaire
   ↓
3. Player completes questionnaire (skill level, goals, availability)
   ↓
4. Frontend sends POST to /api/training-plans/ai-generate
   {
     "skillLevel": "intermediate",
     "goals": ["improve shooting", "conditioning"],
     "daysPerWeek": 4,
     "duration": 60,
     "equipment": ["basketball", "gym access"]
   }
   ↓
5. Backend receives request and validates data
   ↓
6. Backend constructs structured prompt for Gemini API
   ↓
7. Send request to Gemini API with prompt
   ↓
8. Gemini processes request and generates training plan
   ↓
9. Backend receives AI response (JSON format)
   ↓
10. Parse and validate AI-generated content
    ↓
11. Structure data according to TrainingPlan schema
    ↓
12. Save training plan to MongoDB
    {
      "title": "AI-Generated Intermediate Shooting Plan",
      "isAIGenerated": true,
      "aiPrompt": "original prompt...",
      "createdBy": "system",
      "workouts": [...]
    }
    ↓
13. Create Assignment linking player to new plan
    ↓
14. Return complete training plan to frontend
    ↓
15. Frontend displays plan in interactive format
    ↓
16. Player can start following the plan
```

---

### Example 3: Coach Assigns Training Plan

```
1. Coach logs into dashboard
   ↓
2. Navigates to "My Players" section
   ↓
3. Selects player from roster
   ↓
4. Clicks "Assign Training Plan"
   ↓
5. Coach either:
   a) Selects existing plan from library
   b) Creates new custom plan
   ↓
6. Frontend sends POST to /api/coach/assign-plan
   {
     "playerId": "player123",
     "trainingPlanId": "plan456",
     "startDate": "2025-11-11",
     "duration": 4,
     "notes": "Focus on form consistency"
   }
   ↓
7. Backend verifies coach has permission for this player
   ↓
8. Create Assignment document in MongoDB
   ↓
9. Send notification to player (optional)
   ↓
10. Return success response
    ↓
11. Frontend shows confirmation
    ↓
12. Player sees new plan in their dashboard
```

---

## 🔒 Security Architecture

### Multi-Layer Security Approach

#### 1. Frontend Security
- Input sanitization before sending to backend
- XSS protection (React's built-in escaping)
- HTTPS-only in production
- Secure token storage (HTTP-only cookies)
- CSRF tokens for state-changing operations
- Content Security Policy (CSP) headers

#### 2. Backend Security
- **Authentication:** JWT with secure signing
- **Authorization:** Role-based access control (RBAC)
- **Input Validation:** Joi schemas for all endpoints
- **SQL Injection Prevention:** Mongoose parameterized queries
- **Rate Limiting:** Express-rate-limit middleware
- **CORS:** Configured for specific origins only
- **Helmet.js:** Security headers
- **Express-mongo-sanitize:** Prevent NoSQL injection

#### 3. Database Security
- **Encryption at Rest:** MongoDB Atlas default
- **Encryption in Transit:** SSL/TLS required
- **IP Whitelist:** Restrict database access
- **Strong Passwords:** Enforced complexity
- **Principle of Least Privilege:** Limited user permissions
- **Regular Backups:** Automated daily snapshots

#### 4. API Security
- **API Keys:** Stored in environment variables
- **Secret Management:** Never committed to Git
- **Rate Limiting:** Prevent API abuse
- **Request Signing:** Verify request authenticity
- **Timeout Protection:** Prevent long-running requests

---

## 📊 Performance Optimization Strategies

### Frontend Optimization
- **Code Splitting:** Load components on-demand
- **Lazy Loading:** Defer non-critical resources
- **Image Optimization:** WebP format, responsive images
- **Bundle Size Reduction:** Tree shaking, minification
- **Caching:** Service worker for offline capability
- **Memoization:** React.memo for expensive components
- **Virtual Scrolling:** For large lists (leaderboards)

### Backend Optimization
- **Database Indexing:** Fast query execution
- **Connection Pooling:** Reuse database connections
- **Caching Layer:** Redis for frequent queries (optional)
- **Compression:** Gzip/Brotli for responses
- **Async Processing:** Background jobs for heavy tasks
- **Query Optimization:** Limit fields, use projection
- **API Response Pagination:** Limit data per request

### Network Optimization
- **CDN:** Static asset delivery via edge servers
- **HTTP/2:** Multiplexing and header compression
- **Asset Compression:** Minified JS/CSS
- **Lazy Loading:** Load images as needed
- **Preloading:** Critical resources

---

## 🧪 Testing Strategy

### Testing Pyramid

```
                    ▲
                   / \
                  /   \
                 /  E2E \        (10%) - End-to-End Tests
                /-------\
               /         \
              / Integration\     (30%) - Integration Tests
             /-------------\
            /               \
           /   Unit Tests    \   (60%) - Unit Tests
          /___________________\
```

### Backend Testing
- **Unit Tests:** Jest for individual functions
- **Integration Tests:** Supertest for API endpoints
- **Database Tests:** In-memory MongoDB for isolation
- **Mock External APIs:** Stub Gemini API responses

### Frontend Testing
- **Unit Tests:** React Testing Library for components
- **Integration Tests:** Test user interactions
- **E2E Tests:** Cypress for critical user flows (optional)

---

## 📈 Monitoring & Logging

### Application Monitoring
- **Error Tracking:** Sentry (free tier)
- **Performance:** Built-in cloud provider metrics
- **Uptime Monitoring:** UptimeRobot (free)
- **Logging:** Winston for structured logs

### Key Metrics to Track
- API response times
- Database query performance
- Error rates and types
- User authentication success/failure
- AI API usage and costs
- Active user counts
- Training plan generation success rate

---

## 🔄 Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Load balancing across multiple instances
- Database read replicas (future)
- Microservices architecture (future evolution)

### Vertical Scaling
- Increase server resources as needed
- Database tier upgrades
- Optimized queries and caching

### Caching Strategy
```
Level 1: Browser cache (static assets)
Level 2: CDN cache (global distribution)
Level 3: Application cache (Redis - optional)
Level 4: Database query cache
```

---

## 🚨 Error Handling & Resilience

### Error Handling Strategy

```javascript
// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

### Resilience Patterns
- **Retry Logic:** Exponential backoff for external APIs
- **Circuit Breaker:** Prevent cascading failures
- **Fallback Mechanisms:** Default responses when services fail
- **Graceful Degradation:** Core features work even if AI is down
- **Health Checks:** Endpoint for monitoring service status

---

## 📝 API Documentation

### Documentation Tools
- **Swagger/OpenAPI:** Auto-generated API documentation
- **Postman Collections:** Shareable API examples
- **README.md:** Quick start guide

### Sample API Documentation Structure
```yaml
/api/auth/login:
  POST:
    summary: User login
    requestBody:
      email: string
      password: string
    responses:
      200: { accessToken, refreshToken, user }
      401: { error: "Invalid credentials" }
```

---

## 🔮 Future Architecture Enhancements

### Phase 2 Improvements
- **WebSocket Integration:** Real-time notifications
- **GraphQL API:** More flexible data queries
- **Microservices:** Separate services for specific features
- **Message Queue:** RabbitMQ/Bull for background jobs
- **Advanced Caching:** Redis for session management
- **Mobile Apps:** React Native for iOS/Android
- **Video Processing:** FFmpeg for workout video analysis
- **Machine Learning:** Custom ML models for form analysis

### Infrastructure Evolution
- **Kubernetes:** Container orchestration
- **CI/CD Pipeline:** GitHub Actions for automated deployment
- **Infrastructure as Code:** Terraform for cloud resources
- **Monitoring Stack:** Prometheus + Grafana
- **Centralized Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 📊 System Capacity & Limits

### Free Tier Limitations

| Service | Limit | Workaround |
|---------|-------|------------|
| MongoDB Atlas | 512MB storage | Data archiving, optimize schemas |
| Gemini API | 60 req/min | Caching, rate limiting, fallbacks |
| Vercel | 100GB bandwidth/month | Image optimization, CDN |
| Render | 750 hours/month | Optimize backend efficiency |
| Cloudinary | 25GB storage | Compress images, cleanup old files |

### Expected MVP Capacity
- **Users:** 500-1000 concurrent users
- **Data:** ~1000 users, 10,000 workout logs
- **API Calls:** ~50,000 requests/day
- **Storage:** ~200MB database size

---

## ✅ Architecture Validation Checklist

- [x] **Scalability:** Horizontal scaling capability
- [x] **Security:** Multi-layer security implementation
- [x] **Performance:** Optimized for fast response times
- [x] **Reliability:** Error handling and failover mechanisms
- [x] **Maintainability:** Clear separation of concerns
- [x] **Cost-Effective:** Free tier services utilized
- [x] **User Experience:** Fast, responsive, intuitive
- [x] **Data Integrity:** Validation and consistency checks
- [x] **Monitoring:** Logging and error tracking
- [x] **Documentation:** Comprehensive technical docs

---

## 🎯 Architecture Success Metrics

### Performance Targets
- **Page Load Time:** < 3 seconds
- **API Response Time:** < 200ms (average)
- **Database Query Time:** < 50ms (90th percentile)
- **AI Response Time:** < 5 seconds
- **Uptime:** 99.5% availability

### User Experience Goals
- **Intuitive Navigation:** < 3 clicks to any feature
- **Mobile Responsive:** All features work on mobile
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 📚 Architecture Documentation References

### Internal Documentation
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete project details
- API_DOCUMENTATION.md (to be created)
- DEPLOYMENT_GUIDE.md (to be created)
- DEVELOPER_SETUP.md (to be created)

### External Resources
- [MERN Stack Guide](https://www.mongodb.com/mern-stack)
- [Gemini API Docs](https://ai.google.dev/docs)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 🤝 Architecture Review & Feedback

This architecture is designed for the **MVP phase** of SwishFit India. As the application grows, the architecture will evolve to support:
- Higher user loads
- More complex features
- Enhanced performance requirements
- Advanced AI capabilities
- Mobile applications
- Third-party integrations

**Next Steps:**
1. Review this architecture document
2. Validate against project requirements
3. Begin implementation following the roadmap
4. Iterate based on testing and feedback

---

## ✅ System Design Details Alignment

### Verified Architecture Components

#### ✓ Frontend Design
- **Technology:** React.js + TailwindCSS ✅
- **Responsive UI:** Mobile-first approach with Tailwind utility classes ✅
- **Key Features Implemented:**
  - ✅ Home (Landing page)
  - ✅ Dashboard (Role-based: Player/Coach)
  - ✅ Workout Library (Browse, filter, search workouts)
  - ✅ Progress Charts (Data visualization with Chart.js/Recharts)
  - ✅ Coach Portal (Team management, analytics, assignments)

#### ✓ Backend Design
- **Technology:** Node.js + Express.js ✅
- **REST API Implementation:**
  - ✅ Authentication (JWT-based secure auth)
  - ✅ Workout Management (CRUD operations)
  - ✅ Progress Tracking (Log workouts, metrics, analytics)
  - ✅ AI Recommendations (Gemini API integration)

#### ✓ Database Design
- **Platform:** MongoDB Atlas Cloud Database ✅
- **Collections Structure:**
  - ✅ **Users** - User profiles, authentication, roles
  - ✅ **Workouts** - Training plans, exercises, library
  - ✅ **Progress** - Workout logs, performance metrics, history
  - ✅ **Leaderboard** - Rankings, statistics, achievements
- **Data Format:** JSON documents (NoSQL structure) ✅

#### ✓ AI Recommendation Module
- **Integration:** Google Gemini API ✅
- **Input Parameters:**
  - ✅ Player's age (age-appropriate training)
  - ✅ Skill level (Beginner/Intermediate/Advanced)
  - ✅ Training goals (shooting, conditioning, dribbling, etc.)
  - ✅ Past performance data (accuracy, completion rates, workout history)
  - ✅ Available time and equipment
- **Output Delivered:**
  - ✅ Customized weekly training routines
  - ✅ Performance insights (strengths, weaknesses, recommendations)
  - ✅ Adaptive training plans based on progress
- **Key Advantages:**
  - ✅ **Adaptive to individual player needs** - Personalized based on comprehensive profile
  - ✅ **Reduces manual effort for coaches** - Automated plan generation (80-90% time savings)
  - ✅ Data-driven recommendations using past performance
  - ✅ Scalable to unlimited players
  - ✅ 24/7 availability

### Architecture Enhancements Added
- Detailed page structures for all 5 key features
- TailwindCSS configuration with custom colors
- Comprehensive API endpoint documentation
- Database schema optimizations for performance
- Security and scalability considerations
- **AI Module specifications with input/output parameters**
- **Detailed advantages and benefits documentation**
- **Example adaptive behavior and coach time savings analysis**

---

## 📊 AI Module Summary

### Input → Processing → Output Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT PARAMETERS                          │
├─────────────────────────────────────────────────────────────┤
│ • Player's Age (e.g., 18 years)                             │
│ • Skill Level (Beginner/Intermediate/Advanced)              │
│ • Training Goals (Shooting, Conditioning, Ball Handling)    │
│ • Past Performance Data (Accuracy, Completion Rates)        │
│ • Available Days per Week (3-6 days)                        │
│ • Session Duration (30-90 minutes)                          │
│ • Available Equipment (Basketball, Gym, Weights)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE GEMINI API PROCESSING                    │
├─────────────────────────────────────────────────────────────┤
│ • Analyze player profile comprehensively                    │
│ • Consider age-appropriate training intensity               │
│ • Review past performance trends                            │
│ • Generate personalized exercise combinations               │
│ • Create progressive difficulty structure                   │
│ • Add performance insights and coaching tips                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    OUTPUT DELIVERED                          │
├─────────────────────────────────────────────────────────────┤
│ ✅ Customized Weekly Training Routines                      │
│    - Structured workout plans with daily exercises          │
│    - Sets, reps, duration for each exercise                 │
│    - Progressive difficulty across weeks                    │
│                                                              │
│ ✅ Performance Insights                                     │
│    - Strengths and weaknesses analysis                      │
│    - Expected improvements timeline                         │
│    - Adaptive tips for progress                             │
│    - Key focus areas and recommendations                    │
└─────────────────────────────────────────────────────────────┘

                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    ADVANTAGES                                │
├─────────────────────────────────────────────────────────────┤
│ 1. Adaptive to Individual Player Needs                      │
│    • Personalized for each unique player profile            │
│    • Dynamic adjustments based on performance               │
│    • Age-appropriate and goal-oriented                      │
│                                                              │
│ 2. Reduces Manual Effort for Coaches                        │
│    • 80-90% time savings per player                         │
│    • Automated plan generation and analysis                 │
│    • Scalable to unlimited players                          │
│    • Consistent quality across all plans                    │
└─────────────────────────────────────────────────────────────┘
```

---

*Document Version: 1.2*  
*Last Updated: November 9, 2025*  
*Architecture Type: MERN Stack + AI Integration (React + TailwindCSS + Gemini)*  
*Status: Fully Aligned with System Design & AI Module Details - Ready for Implementation*

