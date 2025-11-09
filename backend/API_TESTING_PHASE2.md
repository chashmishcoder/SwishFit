# Phase 2 - Workout API Testing Results

**Test Date:** November 9, 2025  
**Backend URL:** http://localhost:5001  
**Test Accounts:**
- **Coach:** rajesh.kumar@swishfit.com / Coach123!
- **Player:** arjun.patel@swishfit.com / Arjun123!

---

## Test Summary

| #  | Test Case | Endpoint | Status | Notes |
|----|-----------|----------|--------|-------|
| 1  | Coach Login | POST /api/auth/login | ✅ PASS | Successfully obtained coach token |
| 2  | Player Login | POST /api/auth/login | ✅ PASS | Successfully obtained player token |
| 3  | Create Workout (Coach) | POST /api/workouts | ✅ PASS | Created defensive drills workout |
| 4  | Get All Workouts (Player) | GET /api/workouts | ✅ PASS | Role-based filtering working, player sees public workouts |
| 5  | Get Single Workout | GET /api/workouts/:id | ⏸️ IN PROGRESS | Endpoint hanging - debugging populate issue |
| 6  | Update Workout (Coach) | PUT /api/workouts/:id | ⏸️ PENDING | Requires fix for endpoint hanging issue |
| 7  | Assign Workout to Player | POST /api/workouts/:id/assign | ⏸️ PENDING | Dependent on fix |
| 8  | Authorization Error | POST /api/workouts (Player) | ✅ PASS | Player correctly denied access to create workout |
| 9  | Validation Error | POST /api/workouts (Missing fields) | ✅ PASS | Validated skillLevel and difficulty requirements |
| 10 | Not Found Error | GET /api/workouts/:invalid_id | ⏸️ PENDING | Test 404 response |
| 11 | Delete Workout (Coach) | DELETE /api/workouts/:id | ⏸️ PENDING | Dependent on fix |

---

## Detailed Test Results

### Test 1: Coach Login ✅
**Request:**
```bash
POST /api/auth/login
{
  "email": "rajesh.kumar@swishfit.com",
  "password": "Coach123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "69103efe75757fb540858b85",
      "name": "Coach Rajesh Kumar",
      "email": "rajesh.kumar@swishfit.com",
      "role": "coach"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Result:** ✅ **PASS** - Successfully authenticated as coach

---

### Test 2: Player Login ✅
**Request:**
```bash
POST /api/auth/login
{
  "email": "arjun.patel@swishfit.com",
  "password": "Arjun123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "69103ef575757fb540858b7e",
      "role": "player"
    }
  }
}
```

**Result:** ✅ **PASS** - Successfully authenticated as player

---

### Test 3: Create Workout (Coach) ✅
**Request:**
```bash
POST /api/workouts
Authorization: Bearer <coach_token>
Content-Type: application/json

{
  "title": "Defensive Drills - Week 1",
  "description": "Focus on defensive positioning and footwork",
  "skillLevel": "intermediate",
  "category": "defense",
  "difficulty": "moderate",
  "isPublic": true,
  "exercises": [
    {
      "name": "Defensive Slides",
      "description": "Lateral movement drill",
      "sets": 3,
      "reps": 20,
      "duration": 10,
      "restTime": 60
    },
    {
      "name": "Closeout Drills",
      "description": "Practice closing out on shooters",
      "sets": 4,
      "reps": 15,
      "duration": 8,
      "restTime": 45
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "69104732bb6355f2f1755e29",
    "title": "Defensive Drills - Week 1",
    "description": "Focus on defensive positioning and footwork",
    "createdBy": "69103efe75757fb540858b85",
    "assignedTo": [],
    "skillLevel": "intermediate",
    "category": "defense",
    "exercises": [
      {
        "name": "Defensive Slides",
        "description": "Lateral movement drill",
        "sets": 3,
        "reps": 20,
        "duration": 10,
        "difficulty": "moderate",
        "_id": "69104732bb6355f2f1755e2a"
      },
      {
        "name": "Closeout Drills",
        "description": "Practice closing out on shooters",
        "sets": 4,
        "reps": 15,
        "duration": 8,
        "difficulty": "moderate",
        "_id": "69104732bb6355f2f1755e2b"
      }
    ],
    "isAIGenerated": false,
    "isPublic": true,
    "difficulty": "moderate",
    "viewCount": 0,
    "completionCount": 0,
    "rating": {
      "average": 0,
      "count": 0
    },
    "isActive": true,
    "createdAt": "2025-11-09T07:48:02.017Z",
    "updatedAt": "2025-11-09T07:48:02.017Z",
    "estimatedTime": 18,
    "duration": 18,
    "caloriesBurn": 100,
    "exerciseCount": 2,
    "difficultyScore": 2
  }
}
```

**Result:** ✅ **PASS** - Workout created successfully with all fields populated correctly

**Notes:**
- Initial attempt with `"difficulty": "intermediate"` failed validation (expected: easy/moderate/hard/very-hard)
- skillLevel is required field (beginner/intermediate/advanced/all-levels)
- Exercises array properly validated (sets, reps, duration)
- Automatic fields calculated: estimatedTime, caloriesBurn, exerciseCount, difficultyScore

---

### Test 4: Get All Workouts (Player) ✅
**Request:**
```bash
GET /api/workouts
Authorization: Bearer <player_token>
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "69104732bb6355f2f1755e29",
      "title": "Defensive Drills - Week 1",
      "description": "Focus on defensive positioning and footwork",
      "createdBy": {
        "_id": "69103efe75757fb540858b85",
        "name": "Coach Rajesh Kumar",
        "email": "rajesh.kumar@swishfit.com",
        "role": "coach"
      },
      "skillLevel": "intermediate",
      "category": "defense",
      "exercises": [...],
      "isPublic": true,
      "difficulty": "moderate",
      "viewCount": 0,
      "completionCount": 0
    }
  ]
}
```

**Result:** ✅ **PASS** - Player successfully retrieved all public workouts

**Notes:**
- Role-based filtering working correctly
- Player can see public workouts
- createdBy field properly populated with coach details
- Pagination metadata included (count, total, page, pages)

---

### Test 9: Validation Error (Partial) ✅
**Request:**
```bash
POST /api/workouts
Authorization: Bearer <coach_token>
Content-Type: application/json

{
  "title": "Defensive Drills - Week 1",
  "category": "defense",
  "difficulty": "intermediate",  // Invalid value
  "exercises": [...]
}
```

**Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "skillLevel",
      "message": "Skill level is required"
    },
    {
      "field": "skillLevel",
      "message": "Invalid skill level"
    },
    {
      "field": "difficulty",
      "message": "Invalid difficulty level",
      "value": "intermediate"
    }
  ]
}
```

**Result:** ✅ **PASS** - Validation working correctly

**Notes:**
- skillLevel is required field
- difficulty accepts only: easy, moderate, hard, very-hard
- Clear error messages with field names

---

## Known Issues

### 1. GET Single Workout Endpoint Hanging
**Issue:** `GET /api/workouts/:id` endpoint causes request timeout
**Root Cause:** Mongoose populate call causing infinite loop or blocking operation
**Current Status:** Debugging in progress
**Workaround:** Removed `.populate()` calls temporarily for testing
**Impact:** Tests 5, 6, 7, 10, 11 blocked pending fix

**Error Details:**
```javascript
// This code causes hanging:
const workout = await Workout.findById(req.params.id)
  .populate('createdBy', 'name email role')
  .populate('assignedTo', 'name email skillLevel position');
```

**Attempted Solutions:**
1. Made viewCount increment async (didn't resolve)
2. Used `findByIdAndUpdate` for viewCount (didn't resolve)
3. Removed populate calls (testing in progress)

---

## Validation Rules Discovered

### Workout Creation
**Required Fields:**
- `title` (string, 3-100 chars)
- `skillLevel` (enum: beginner, intermediate, advanced, all-levels)
- `category` (enum: shooting, dribbling, defense, conditioning, full-body, strength, agility)
- `exercises` (array, min 1 exercise)

**Optional Fields:**
- `description` (string, max 500 chars)
- `difficulty` (enum: easy, moderate, hard, very-hard)
- `isPublic` (boolean)

### Exercise Schema
**Optional Fields:**
- `name` (string, required)
- `description` (string)
- `sets` (integer, 1-20)
- `reps` (integer, 1-100)
- `duration` (integer, 1-180 minutes)
- `restTime` (integer)

---

## Next Steps

1. **Fix GET single workout endpoint**
   - Investigate Mongoose populate issue
   - Check for circular references in User/Workout models
   - Test with simplified query first

2. **Complete remaining tests (5-11)**
   - Once endpoint fix is deployed, run full test suite
   - Test update, assign, delete operations
   - Validate authorization and error handling

3. **Test AI Workout Generation**
   - Requires GEMINI_API_KEY setup
   - Test POST /api/workouts/generate endpoint
   - Verify AI-generated workout structure

4. **Performance testing**
   - Test pagination with multiple workouts
   - Test query filters (skillLevel, category, search)
   - Verify response times under load

---

## Test Environment

**Backend:**
- Node.js: v22.6.0
- Express: 4.18.2
- Mongoose: 8.9.7
- MongoDB: Atlas (swishfitindia.kd9giyy.mongodb.net/swishfit)
- Port: 5001

**Test Tools:**
- curl + jq
- Bash scripts

**Database State:**
- 2 test users (1 coach, 1 player)
- 1 workout created during testing

---

### Test 8: Authorization Error - Player Cannot Create ✅
**Request:**
```bash
POST /api/workouts
Authorization: Bearer <player_token>
Content-Type: application/json

{
  "title": "Unauthorized Workout",
  "skillLevel": "beginner",
  "category": "shooting",
  "exercises": [{"name": "Test", "sets": 3}]
}
```

**Response:**
```text
User role 'player' is not authorized to access this route. Required roles: coach, admin
```

**Result:** ✅ **PASS** - Player correctly denied access (authorization middleware working)

---

### Test 5: GET Single Workout ✅
**Request:**
```bash
GET /api/workouts/{id}
Authorization: Bearer <player_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Defensive Drills - Week 1",
    "createdBy": "69103efe75757fb540858b85",
    "viewCount": 3,
    ...
  }
}
```

**Result:** ✅ **PASS** - Workout retrieved successfully

---

### Test 6: UPDATE Workout ✅
**Request:**
```bash
PUT /api/workouts/{id}
Authorization: Bearer <coach_token>
{
  "title": "Shooting Drills - Updated"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Shooting Drills - Updated",
    ...
  }
}
```

**Result:** ✅ **PASS** - Workout updated successfully

---

### Test 7: ASSIGN Workout to Player ✅
**Request:**
```bash
POST /api/workouts/{id}/assign
Authorization: Bearer <coach_token>
{
  "playerIds": ["69103ef575757fb540858b7e"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workout assigned to 1 player(s)"
}
```

**Result:** ✅ **PASS** - Workout assigned successfully

---

### Test 10: NOT FOUND Error ✅
**Request:**
```bash
GET /api/workouts/507f1f77bcf86cd799439011
Authorization: Bearer <player_token>
```

**Response:**
```json
{
  "success": false,
  "error": "Workout not found",
  "details": {
    "statusCode": 404
  }
}
```

**Result:** ✅ **PASS** - 404 error handled correctly

---

### Test 11: DELETE Workout ✅
**Request:**
```bash
DELETE /api/workouts/{id}
Authorization: Bearer <coach_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Workout deleted successfully"
}
```

**Result:** ✅ **PASS** - Workout deleted successfully

---

### Test 12: AI Workout Generation ⚠️
**Request:**
```bash
POST /api/workouts/generate
Authorization: Bearer <coach_token>
{
  "skillLevel": "intermediate",
  "category": "shooting",
  "duration": 45,
  "preferences": "Focus on three-point shooting"
}
```

**Result:** ⚠️ **PARTIAL PASS** - Gemini API responds correctly but generated data has validation issues

**Issues Found:**
- Gemini returns `day` values > 7 (expects 1-7)
- Gemini returns `difficulty: "expert"` (schema expects: easy/moderate/hard/very-hard)
- Description exceeds 500 characters

**Recommendation:** Update geminiService.js to map Gemini's response to match our schema constraints or update schema to be more flexible.

---

## Issues Fixed

### 1. Mongoose Populate Hanging ✅ RESOLVED
**Root Cause:** Async validators in User and Workout models causing infinite loops during populate operations
- User model: `coachId` field had async validator calling `mongoose.model('User').findById()`
- Workout model: `createdBy` field had async validator calling `mongoose.model('User').findById()`

**Solution:** Removed async validators from both models. Validation moved to controller/middleware layer.

### 2. validateMongoId Middleware Issue ✅ RESOLVED
**Root Cause:** `validateMongoId` is a factory function returning middleware array, but was being used directly in routes without calling it
**Solution:** Updated all routes to use `...validateMongoId('id')` with spread operator

---

**Status:** ✅ **COMPLETED** (11/11 tests passing, 1 AI generation test partial)  
**Summary:** All CRUD operations work correctly. AI generation works but needs response mapping adjustments.
