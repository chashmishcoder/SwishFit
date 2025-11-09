# Phase 3 Backend API Testing Guide

## Overview
This document provides comprehensive testing procedures for all Phase 3 backend endpoints (31 total endpoints across 4 APIs).

**Test Environment:**
- Base URL: `http://localhost:5001/api`
- Database: MongoDB Atlas
- Authentication: JWT Bearer Token

---

## 🚀 Pre-Testing Setup

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Server should start on port 5001.

### 2. Get Authentication Tokens

#### Login as Player:
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "player@example.com",
  "password": "password123"
}
```
Save the `token` from response.

#### Login as Coach:
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "coach@example.com",
  "password": "password123"
}
```

#### Login as Admin:
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 3. Note Important IDs
After logging in, note these IDs for testing:
- `playerId` - Player's user ID from token or profile
- `workoutId` - Any workout ID from database
- `progressId` - Any progress entry ID
- `coachId` - Coach's user ID

---

## 📋 API Test Cases

## 1. Progress Tracking API (8 Endpoints)

### ✅ TEST 1.1: Log Workout Progress
```bash
POST /api/progress
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{
  "workoutId": "<WORKOUT_ID>",
  "exerciseResults": [
    {
      "exerciseName": "Free Throw Shooting",
      "shotsMade": 8,
      "shotsAttempted": 10,
      "repsCompleted": 10,
      "accuracy": 80
    }
  ],
  "playerNotes": "Felt strong today, good shooting form",
  "rating": 5,
  "enjoymentLevel": "enjoyed",
  "difficultyFeedback": "just-right",
  "completed": true
}
```
**Expected:** Status 201, returns created progress entry with auto-calculated metrics.

---

### ✅ TEST 1.2: Get My Progress
```bash
GET /api/progress/my-progress?page=1&limit=10
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns player's progress list with pagination.

---

### ✅ TEST 1.3: Get Player Progress (Coach/Admin)
```bash
GET /api/progress/player/<PLAYER_ID>?completed=true
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns specified player's progress (coach can only view assigned players).

---

### ✅ TEST 1.4: Get Single Progress Entry
```bash
GET /api/progress/<PROGRESS_ID>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns single progress entry details.

---

### ✅ TEST 1.5: Get Performance Analytics
```bash
GET /api/progress/analytics/<PLAYER_ID>?period=monthly
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns analytics with current vs previous period comparison.

---

### ✅ TEST 1.6: Get Workout Statistics
```bash
GET /api/progress/stats/<PLAYER_ID>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns workout stats with category breakdown.

---

### ✅ TEST 1.7: Update Progress Entry
```bash
PUT /api/progress/<PROGRESS_ID>
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{
  "playerNotes": "Updated after coach review",
  "rating": 4
}
```
**Expected:** Status 200, returns updated progress entry.

---

### ✅ TEST 1.8: Delete Progress Entry
```bash
DELETE /api/progress/<PROGRESS_ID>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, soft deletes progress entry.

---

## 2. Leaderboard API (13 Endpoints)

### ✅ TEST 2.1: Get Global Leaderboard
```bash
GET /api/leaderboard?page=1&limit=20&sortBy=totalPoints
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns ranked players with pagination.

---

### ✅ TEST 2.2: Get Team Leaderboard
```bash
GET /api/leaderboard/team/<PLAYER_ID>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns team members' rankings.

---

### ✅ TEST 2.3: Get Player Rank
```bash
GET /api/leaderboard/rank/<PLAYER_ID>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns player's rank with nearby players (±5).

---

### ✅ TEST 2.4: Get My Rank
```bash
GET /api/leaderboard/my-rank
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns logged-in player's rank and stats.

---

### ✅ TEST 2.5: Get Top Performers
```bash
GET /api/leaderboard/top-performers?metric=averageAccuracy&limit=10
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns top players by specified metric.

---

### ✅ TEST 2.6: Get Leaderboard Statistics
```bash
GET /api/leaderboard/stats
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns overall leaderboard statistics.

---

### ✅ TEST 2.7: Get Skill Level Leaderboard
```bash
GET /api/leaderboard/skill-level/intermediate?limit=20
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns rankings filtered by skill level.

---

### ✅ TEST 2.8: Get Leaderboard History
```bash
GET /api/leaderboard/history/<PLAYER_ID>?period=weekly
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns historical leaderboard data.

---

### ✅ TEST 2.9: Compare Players
```bash
GET /api/leaderboard/compare/<PLAYER_ID_1>/<PLAYER_ID_2>
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 200, returns head-to-head comparison.

---

### ✅ TEST 2.10: Update All Rankings (Admin)
```bash
POST /api/leaderboard/update-rankings
Authorization: Bearer <ADMIN_TOKEN>
```
**Expected:** Status 200, recalculates all player rankings.

---

### ✅ TEST 2.11: Award Achievement (Admin)
```bash
POST /api/leaderboard/achievement/<PLAYER_ID>
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Sharpshooter",
  "description": "Achieved 90% accuracy in shooting drills",
  "icon": "🎯",
  "category": "accuracy"
}
```
**Expected:** Status 200, awards achievement to player.

---

### ✅ TEST 2.12: Reset Weekly Points (Admin)
```bash
POST /api/leaderboard/reset-weekly
Authorization: Bearer <ADMIN_TOKEN>
```
**Expected:** Status 200, resets all weekly points to 0.

---

### ✅ TEST 2.13: Reset Monthly Points (Admin)
```bash
POST /api/leaderboard/reset-monthly
Authorization: Bearer <ADMIN_TOKEN>
```
**Expected:** Status 200, resets all monthly points to 0.

---

## 3. Coach Management API (9 Endpoints)

### ✅ TEST 3.1: Get My Players
```bash
GET /api/coach/players
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns all assigned players with enriched stats.

---

### ✅ TEST 3.2: Get Player Overview
```bash
GET /api/coach/players/<PLAYER_ID>/overview
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns detailed 30-day player overview.

---

### ✅ TEST 3.3: Get Player Progress
```bash
GET /api/coach/players/<PLAYER_ID>/progress?limit=20
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns player's progress history.

---

### ✅ TEST 3.4: Add Coach Feedback
```bash
PUT /api/coach/feedback/<PROGRESS_ID>
Authorization: Bearer <COACH_TOKEN>
Content-Type: application/json

{
  "coachFeedback": "Excellent shooting technique! Focus on follow-through for even better results."
}
```
**Expected:** Status 200, adds feedback to progress entry.

---

### ✅ TEST 3.5: Assign Workout to Players
```bash
POST /api/coach/assign-workout
Authorization: Bearer <COACH_TOKEN>
Content-Type: application/json

{
  "workoutId": "<WORKOUT_ID>",
  "playerIds": ["<PLAYER_ID_1>", "<PLAYER_ID_2>"]
}
```
**Expected:** Status 200, assigns workout to specified players.

---

### ✅ TEST 3.6: Unassign Workout
```bash
POST /api/coach/unassign-workout
Authorization: Bearer <COACH_TOKEN>
Content-Type: application/json

{
  "workoutId": "<WORKOUT_ID>",
  "playerIds": ["<PLAYER_ID>"]
}
```
**Expected:** Status 200, removes workout assignment.

---

### ✅ TEST 3.7: Assign Workout to All Players
```bash
POST /api/coach/assign-workout-all
Authorization: Bearer <COACH_TOKEN>
Content-Type: application/json

{
  "workoutId": "<WORKOUT_ID>",
  "skillLevel": "intermediate"
}
```
**Expected:** Status 200, bulk assigns workout to all players (optionally filtered by skill).

---

### ✅ TEST 3.8: Get Dashboard Statistics
```bash
GET /api/coach/dashboard
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns coach dashboard analytics.

---

### ✅ TEST 3.9: Compare Players
```bash
GET /api/coach/compare?playerIds=<ID1>,<ID2>,<ID3>&metric=averageAccuracy
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 200, returns comparison of multiple players.

---

## 4. AI Performance Analysis API (1 Endpoint)

### ✅ TEST 4.1: Analyze Performance (Player)
```bash
POST /api/progress/analyze
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{
  "days": 30
}
```
**Expected:** Status 200, returns AI-generated insights (strengths, weaknesses, trends, recommendations).

---

### ✅ TEST 4.2: Analyze Player Performance (Coach)
```bash
POST /api/progress/analyze
Authorization: Bearer <COACH_TOKEN>
Content-Type: application/json

{
  "playerId": "<PLAYER_ID>",
  "days": 14
}
```
**Expected:** Status 200, returns AI analysis of assigned player.

---

### ✅ TEST 4.3: Analyze Any Player (Admin)
```bash
POST /api/progress/analyze
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "playerId": "<PLAYER_ID>",
  "days": 7
}
```
**Expected:** Status 200, returns AI analysis (admin can analyze anyone).

---

## 5. Authorization Tests

### ✅ TEST 5.1: Player Accessing Admin Endpoint (Should Fail)
```bash
POST /api/leaderboard/update-rankings
Authorization: Bearer <PLAYER_TOKEN>
```
**Expected:** Status 403 (Forbidden)

---

### ✅ TEST 5.2: Unauthorized Access (Should Fail)
```bash
GET /api/progress/my-progress
```
**Expected:** Status 401 (Unauthorized - No token provided)

---

### ✅ TEST 5.3: Coach Accessing Unassigned Player (Should Fail)
```bash
GET /api/coach/players/<UNASSIGNED_PLAYER_ID>/overview
Authorization: Bearer <COACH_TOKEN>
```
**Expected:** Status 403 (Forbidden)

---

## 6. Validation Tests

### ✅ TEST 6.1: Invalid Workout ID (Should Fail)
```bash
POST /api/progress
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{
  "workoutId": "invalid-id-format",
  "completed": true
}
```
**Expected:** Status 400 (Bad Request)

---

### ✅ TEST 6.2: Missing Required Fields (Should Fail)
```bash
POST /api/progress
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{}
```
**Expected:** Status 400 (Bad Request - workoutId required)

---

### ✅ TEST 6.3: Invalid Rating Value (Should Fail)
```bash
POST /api/progress
Authorization: Bearer <PLAYER_TOKEN>
Content-Type: application/json

{
  "workoutId": "<WORKOUT_ID>",
  "rating": 10,
  "completed": true
}
```
**Expected:** Status 400 (Bad Request - rating must be 1-5)

---

## 📊 Test Results Template

| # | Category | Endpoint | Method | Status | Result | Notes |
|---|----------|----------|--------|--------|--------|-------|
| 1 | Progress | /progress | POST | | ☐ | |
| 2 | Progress | /progress/my-progress | GET | | ☐ | |
| 3 | Progress | /progress/player/:id | GET | | ☐ | |
| 4 | Progress | /progress/:id | GET | | ☐ | |
| 5 | Progress | /progress/analytics/:id | GET | | ☐ | |
| 6 | Progress | /progress/stats/:id | GET | | ☐ | |
| 7 | Progress | /progress/:id | PUT | | ☐ | |
| 8 | Progress | /progress/:id | DELETE | | ☐ | |
| 9 | Leaderboard | /leaderboard | GET | | ☐ | |
| 10 | Leaderboard | /leaderboard/team/:id | GET | | ☐ | |
| 11 | Leaderboard | /leaderboard/rank/:id | GET | | ☐ | |
| 12 | Leaderboard | /leaderboard/my-rank | GET | | ☐ | |
| 13 | Leaderboard | /leaderboard/top-performers | GET | | ☐ | |
| 14 | Leaderboard | /leaderboard/stats | GET | | ☐ | |
| 15 | Leaderboard | /leaderboard/skill-level/:level | GET | | ☐ | |
| 16 | Leaderboard | /leaderboard/history/:id | GET | | ☐ | |
| 17 | Leaderboard | /leaderboard/compare/:id1/:id2 | GET | | ☐ | |
| 18 | Leaderboard | /leaderboard/update-rankings | POST | | ☐ | Admin only |
| 19 | Leaderboard | /leaderboard/achievement/:id | POST | | ☐ | Admin only |
| 20 | Leaderboard | /leaderboard/reset-weekly | POST | | ☐ | Admin only |
| 21 | Leaderboard | /leaderboard/reset-monthly | POST | | ☐ | Admin only |
| 22 | Coach | /coach/players | GET | | ☐ | |
| 23 | Coach | /coach/players/:id/overview | GET | | ☐ | |
| 24 | Coach | /coach/players/:id/progress | GET | | ☐ | |
| 25 | Coach | /coach/feedback/:id | PUT | | ☐ | |
| 26 | Coach | /coach/assign-workout | POST | | ☐ | |
| 27 | Coach | /coach/unassign-workout | POST | | ☐ | |
| 28 | Coach | /coach/assign-workout-all | POST | | ☐ | |
| 29 | Coach | /coach/dashboard | GET | | ☐ | |
| 30 | Coach | /coach/compare | GET | | ☐ | |
| 31 | AI | /progress/analyze | POST | | ☐ | |

---

## 🎯 Testing Checklist

- [ ] All Progress API endpoints tested (8/8)
- [ ] All Leaderboard API endpoints tested (13/13)
- [ ] All Coach API endpoints tested (9/9)
- [ ] AI Analysis endpoint tested (1/1)
- [ ] Authorization tests passed (3/3)
- [ ] Validation tests passed (3/3)
- [ ] All endpoints return correct status codes
- [ ] All responses match expected schema
- [ ] Error messages are clear and helpful
- [ ] Pagination works correctly
- [ ] Role-based access control verified
- [ ] Data integrity maintained across operations

---

## 📝 Test Summary

**Total Endpoints:** 31  
**Endpoints Tested:** ___/31  
**Tests Passed:** ___  
**Tests Failed:** ___  
**Pass Rate:** ___%  

**Issues Found:**
1. 
2. 
3. 

**Notes:**


---

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if token is valid and not expired
   - Ensure Bearer token format: `Bearer <token>`

2. **403 Forbidden**
   - Verify user role has permission for endpoint
   - Check if coach is accessing assigned players only

3. **404 Not Found**
   - Verify IDs are correct and exist in database
   - Check if resources have been soft-deleted

4. **500 Internal Server Error**
   - Check server logs for detailed error
   - Verify MongoDB connection
   - Ensure all required environment variables are set

---

## ✅ Testing Complete

Once all tests pass, Phase 3 backend is production-ready! 🚀

Next steps:
- Move to Task 3.6: Progress Charts Page (Frontend)
- Implement services layer for API communication
- Create comprehensive frontend testing suite
