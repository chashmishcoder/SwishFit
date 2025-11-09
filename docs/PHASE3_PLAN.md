# Phase 3 Implementation Plan - SwishFit India

**Start Date:** November 9, 2025  
**Duration:** Week 5-6 (10-12 days)  
**Focus:** Advanced Features - Progress Tracking, Coach Portal, Leaderboard  
**Status:** 🟡 STARTING

---

## 📌 Phase 3 Objectives

- Build progress tracking system (log workouts, metrics, completion)
- Create leaderboard with rankings and points system
- Build Coach Portal for player management
- Implement progress visualization with Chart.js
- Add AI-powered performance analysis
- Create coach feedback system
- Implement role-specific features

---

## ✅ Task Breakdown

### Backend Tasks (Days 1-5)

#### Task 3.1: Progress Tracking API ⏳
- [ ] Create progressController.js (logProgress, getPlayerProgress, updateProgress, deleteProgress)
- [ ] Create progressRoutes.js
- [ ] Add validation for progress metrics
- [ ] Test CRUD operations for progress

**Files to Create:**
- `backend/src/controllers/progressController.js`
- `backend/src/routes/progressRoutes.js`
- Add routes to `server.js`

#### Task 3.2: Leaderboard API ⏳
- [ ] Create leaderboardController.js (getGlobalLeaderboard, getTeamLeaderboard, getPlayerRank, updateLeaderboard)
- [ ] Create leaderboardRoutes.js
- [ ] Implement points calculation logic
- [ ] Add MongoDB aggregation for rankings

**Files to Create:**
- `backend/src/controllers/leaderboardController.js`
- `backend/src/routes/leaderboardRoutes.js`
- `backend/src/services/pointsService.js`

#### Task 3.3: Coach Management API ⏳
- [ ] Create coachController.js (getAssignedPlayers, getPlayerProgress, assignWorkoutToPlayer, provideFeedback)
- [ ] Create coachRoutes.js
- [ ] Add authorization (coach-only endpoints)

**Files to Create:**
- `backend/src/controllers/coachController.js`
- `backend/src/routes/coachRoutes.js`

#### Task 3.4: AI Performance Analysis ⏳
- [ ] Add analyzePerformance method to geminiService.js
- [ ] Create endpoint: POST /api/progress/analyze
- [ ] Integrate with progress data

**Files to Update:**
- `backend/src/services/geminiService.js`

#### Task 3.5: Backend Testing ⏳
- [ ] Test progress logging workflow
- [ ] Test leaderboard calculations
- [ ] Test coach portal endpoints
- [ ] Test AI analysis generation

---

### Frontend Tasks (Days 6-10)

#### Task 3.6: Progress Charts Page ⏳
- [ ] Install Chart.js: `npm install chart.js react-chartjs-2`
- [ ] Create ProgressCharts.jsx page
- [ ] Create WorkoutProgressChart component (line chart)
- [ ] Create AccuracyChart component (bar chart)
- [ ] Create WeeklyActivityChart component
- [ ] Add date range picker for filtering

**Files to Create:**
- `frontend/src/pages/ProgressCharts.jsx`
- `frontend/src/components/charts/WorkoutProgressChart.jsx`
- `frontend/src/components/charts/AccuracyChart.jsx`
- `frontend/src/components/charts/WeeklyActivityChart.jsx`

#### Task 3.7: Coach Portal Page ⏳
- [ ] Create CoachPortal.jsx page
- [ ] Display assigned players list
- [ ] Show player progress overview
- [ ] Add "Generate AI Workout" button for each player
- [ ] Add feedback form for players
- [ ] Add player search and filtering

**Files to Create:**
- `frontend/src/pages/CoachPortal.jsx`
- `frontend/src/components/PlayerCard.jsx`
- `frontend/src/components/FeedbackForm.jsx`

#### Task 3.8: Leaderboard Page ⏳
- [ ] Create Leaderboard.jsx page
- [ ] Display ranked players in table format
- [ ] Show stats (points, workouts, streak, accuracy)
- [ ] Add filters (team, time range)
- [ ] Highlight current user's rank
- [ ] Add achievement badges

**Files to Create:**
- `frontend/src/pages/Leaderboard.jsx`
- `frontend/src/components/LeaderboardTable.jsx`

#### Task 3.9: Services Layer ⏳
- [ ] Create progressService.js
- [ ] Create leaderboardService.js
- [ ] Create coachService.js
- [ ] Add API methods for all endpoints

**Files to Create:**
- `frontend/src/services/progressService.js`
- `frontend/src/services/leaderboardService.js`
- `frontend/src/services/coachService.js`

#### Task 3.10: Integration & Testing ⏳
- [ ] Add routes to App.jsx
- [ ] Test progress logging flow
- [ ] Test charts with real data
- [ ] Test coach portal functionality
- [ ] Test leaderboard updates
- [ ] Test role-based access

---

## 🛠️ Technical Stack (Phase 3)

**New Dependencies:**
- `chart.js` - Chart visualization
- `react-chartjs-2` - React wrapper for Chart.js
- `date-fns` - Date manipulation (optional)
- `node-cache` - Backend caching (optional)

**Backend:**
- MongoDB aggregation pipelines
- Complex queries with population
- Scheduled tasks for leaderboard updates

**Frontend:**
- Chart.js for data visualization
- Advanced filtering and search
- Real-time data updates

---

## 📦 Expected Deliverables

### Backend APIs:
✅ Progress CRUD endpoints (4 endpoints)
✅ Leaderboard endpoints (4 endpoints)
✅ Coach management endpoints (4 endpoints)
✅ AI performance analysis endpoint (1 endpoint)

### Frontend Pages:
✅ Progress Charts page with 3+ charts
✅ Coach Portal page with player management
✅ Leaderboard page with rankings table

### Features:
✅ Log workout progress with metrics
✅ View progress over time with charts
✅ Global leaderboard with rankings
✅ Coach can manage assigned players
✅ AI-generated performance insights
✅ Coach feedback system

---

## 🧪 Testing Checklist

### Backend Tests:
- [ ] Can log progress for a workout
- [ ] Can retrieve player's progress history
- [ ] Leaderboard calculates ranks correctly
- [ ] Points are awarded correctly
- [ ] Coach can view assigned players
- [ ] Coach can only access their players
- [ ] AI analysis generates valid insights

### Frontend Tests:
- [ ] Progress charts display correct data
- [ ] Can log workout completion
- [ ] Leaderboard loads and displays
- [ ] Coach portal shows assigned players
- [ ] Can generate AI workout from coach portal
- [ ] Role-based features work correctly

---

## 🔗 Dependencies

**Prerequisites:**
- ✅ Phase 0: Project Setup - COMPLETED
- ✅ Phase 1: Authentication System - COMPLETED
- ✅ Phase 2: Core Features (Workouts, Dashboard) - COMPLETED

**Required:**
- Backend server running
- Frontend dev server running
- MongoDB Atlas connected
- Gemini API key configured

---

## 📅 Implementation Timeline

**Day 1-2:** Progress Tracking API + Testing  
**Day 3-4:** Leaderboard API + Points System  
**Day 5:** Coach Management API + Testing  
**Day 6-7:** Progress Charts Frontend  
**Day 8-9:** Coach Portal Frontend  
**Day 10:** Leaderboard Frontend + Integration Testing  

---

## 🎯 Success Criteria

- ✅ All 13 new API endpoints working
- ✅ Progress logging and retrieval functional
- ✅ Leaderboard updates automatically after workouts
- ✅ Charts display accurate player data
- ✅ Coach portal shows player management features
- ✅ AI analysis provides meaningful insights
- ✅ Role-based access enforced (coach vs player)
- ✅ All pages responsive and styled with Tailwind

---

## 💡 Implementation Notes

### Points System Logic:
- Workout completion: 10 points
- Daily streak bonus: 5 points
- High accuracy (>80%): 3 points
- Week completion: 20 points bonus

### Chart Types:
1. **Line Chart:** Progress over time (accuracy, workouts)
2. **Bar Chart:** Weekly activity
3. **Doughnut Chart:** Category breakdown (optional)

### Coach Features:
- View all assigned players
- Generate AI workouts for specific players
- Provide feedback on completed workouts
- View player progress trends

---

## 🚀 Let's Get Started!

**First Task:** Task 3.1 - Progress Tracking API  
**Command:** Ready to create `progressController.js`

**Next Steps:**
1. Create progress controller with CRUD operations
2. Set up progress routes
3. Test with Postman/curl
4. Move to leaderboard implementation

---

**Status:** Ready to begin implementation! 🏀
