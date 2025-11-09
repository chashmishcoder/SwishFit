# Services Layer Documentation

## Overview

The Services Layer provides a centralized, organized way to interact with the SwishFit backend API. All API calls are abstracted into service modules, making the codebase more maintainable and testable.

## Architecture

```
src/services/
├── api.js                  # Base Axios instance with interceptors
├── apiUtils.js            # Utility functions for API operations
├── authService.js         # Authentication & authorization
├── userService.js         # User profile management
├── workoutService.js      # Workout CRUD operations
├── progressService.js     # Progress tracking & analytics
├── leaderboardService.js  # Rankings & comparisons
├── coachService.js        # Coach-specific operations
├── healthService.js       # Server health checks
└── index.js              # Central export point
```

## Usage

### Import Individual Services

```javascript
import { authService, workoutService } from '@/services';

// Login
const response = await authService.login({ email, password });

// Get workouts
const workouts = await workoutService.getAllWorkouts({ difficulty: 'intermediate' });
```

### Import Unified Services Object

```javascript
import services from '@/services';

// Login
await services.auth.login({ email, password });

// Get workouts
await services.workout.getAllWorkouts();

// Get progress
await services.progress.getMyProgress();
```

## Service Modules

### 1. Authentication Service (`authService.js`)

Handles user authentication and profile management.

#### Methods

- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout and clear storage
- `getProfile()` - Get current user profile
- `updateProfile(userData)` - Update user profile
- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get stored user data
- `getToken()` - Get stored JWT token

#### Example

```javascript
import { authService } from '@/services';

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'player'
});

// Login
const loginResponse = await authService.login({
  email: 'john@example.com',
  password: 'password123'
});

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log('Logged in as:', user.name);
}
```

---

### 2. Workout Service (`workoutService.js`)

Manages workout operations and AI generation.

#### Methods

- `getAllWorkouts(params)` - Get all workouts with filters
- `getWorkoutById(workoutId)` - Get specific workout
- `createWorkout(workoutData)` - Create new workout
- `updateWorkout(workoutId, workoutData)` - Update workout
- `deleteWorkout(workoutId)` - Delete workout
- `generateWorkout(params)` - AI workout generation
- `getWorkoutsByCategory(category, params)` - Filter by category
- `getWorkoutsByDifficulty(difficulty, params)` - Filter by difficulty
- `searchWorkouts(searchTerm, params)` - Search workouts

#### Example

```javascript
import { workoutService } from '@/services';

// Get all workouts
const workouts = await workoutService.getAllWorkouts({
  difficulty: 'intermediate',
  category: 'shooting',
  limit: 20
});

// Generate AI workout
const aiWorkout = await workoutService.generateWorkout({
  focusArea: 'shooting',
  difficulty: 'advanced',
  duration: 45
});

// Search workouts
const searchResults = await workoutService.searchWorkouts('dribbling', {
  limit: 10
});
```

---

### 3. Progress Service (`progressService.js`)

Tracks player progress and provides analytics.

#### Methods

- `logProgress(progressData)` - Log workout completion
- `getPlayerProgress(playerId, params)` - Get player progress
- `getMyProgress(params)` - Get current user's progress
- `getAnalytics(playerId, params)` - Get analytics data
- `getWorkoutStats(playerId, params)` - Get workout statistics
- `updateProgress(progressId, progressData)` - Update progress entry
- `deleteProgress(progressId)` - Delete progress entry
- `analyzePerformance(playerId, params)` - AI performance analysis
- `getProgressByDateRange(startDate, endDate, params)` - Filter by date
- `getProgressSummary()` - Get summary statistics

#### Example

```javascript
import { progressService } from '@/services';

// Log workout progress
const progress = await progressService.logProgress({
  workout: 'workout_id',
  duration: 45,
  exerciseResults: [
    { exercise: 'Free Throws', sets: 3, reps: 10, accuracy: 85 }
  ]
});

// Get analytics
const analytics = await progressService.getAnalytics('player_id', {
  period: 30 // Last 30 days
});

// AI performance analysis
const analysis = await progressService.analyzePerformance('player_id', {
  days: 14
});
```

---

### 4. Leaderboard Service (`leaderboardService.js`)

Manages rankings and player comparisons.

#### Methods

- `getGlobalLeaderboard(params)` - Get global rankings
- `getTeamLeaderboard(params)` - Get team rankings
- `getPlayerRank(playerId)` - Get player rank
- `getMyRank()` - Get current user's rank
- `getTopPerformers(params)` - Get top performers
- `getLeaderboardStats()` - Get overall statistics
- `comparePlayers(playerId)` - Compare with another player
- `getSkillLevelLeaderboard(params)` - Skill-based rankings
- `getLeaderboardHistory(params)` - Historical rankings
- `updateAllRankings()` - Update all rankings (Admin)
- `awardAchievement(playerId, achievementData)` - Award achievement (Admin)
- `resetWeeklyPoints()` - Reset weekly points (Admin)
- `resetMonthlyPoints()` - Reset monthly points (Admin)

#### Example

```javascript
import { leaderboardService } from '@/services';

// Get global leaderboard
const leaderboard = await leaderboardService.getGlobalLeaderboard({
  period: 'weekly',
  limit: 50
});

// Get my rank
const myRank = await leaderboardService.getMyRank();

// Compare players
const comparison = await leaderboardService.comparePlayers('other_player_id');
```

---

### 5. Coach Service (`coachService.js`)

Coach-specific operations for player management.

#### Methods

- `getMyPlayers(params)` - Get assigned players
- `getPlayerOverview(playerId)` - Get player overview
- `getPlayerProgress(playerId, params)` - Get player progress
- `addFeedback(progressId, feedbackData)` - Add feedback
- `assignWorkout(assignmentData)` - Assign workout to player
- `unassignWorkout(unassignmentData)` - Unassign workout
- `assignWorkoutToAll(assignmentData)` - Assign to all players
- `getDashboardStats()` - Get dashboard statistics
- `compareMyPlayers(playerIds)` - Compare players
- `getPlayerStats(playerId, params)` - Get player statistics
- `getPlayerFeedback(playerId, params)` - Get feedback history
- `getPlayerWorkouts(playerId)` - Get assigned workouts
- `bulkFeedback(feedbackList)` - Bulk feedback submission

#### Example

```javascript
import { coachService } from '@/services';

// Get my players
const players = await coachService.getMyPlayers({
  skillLevel: 'intermediate'
});

// Add feedback
await coachService.addFeedback('progress_id', {
  coachFeedback: 'Great job! Focus on your follow-through.'
});

// Assign workout
await coachService.assignWorkout({
  playerId: 'player_id',
  workoutId: 'workout_id'
});

// Get dashboard stats
const stats = await coachService.getDashboardStats();
```

---

### 6. Health Service (`healthService.js`)

Server health monitoring.

#### Methods

- `checkHealth()` - Check server health
- `getVersion()` - Get API version
- `ping()` - Ping server

#### Example

```javascript
import { healthService } from '@/services';

// Check health
const health = await healthService.checkHealth();
console.log('Server status:', health.status);
console.log('Database:', health.database);

// Ping server
const isAlive = await healthService.ping();
```

---

### 7. API Utilities (`apiUtils.js`)

Helper functions for API operations.

#### Functions

- `buildQueryString(params)` - Build query string
- `formatErrorMessage(error)` - Format error messages
- `isAuthError(error)` - Check if auth error
- `isValidationError(error)` - Check if validation error
- `getValidationErrors(error)` - Extract validation errors
- `retryRequest(requestFn, maxRetries, baseDelay)` - Retry with backoff
- `formatDateForAPI(date)` - Format date for API
- `parsePagination(response)` - Parse pagination info
- `createCancelToken()` - Create cancelable request
- `debounce(func, delay)` - Debounce function
- `formatFileSize(bytes)` - Format file size
- `downloadFile(blob, filename)` - Download file

#### Example

```javascript
import { apiUtils } from '@/services';

// Format error
try {
  await someApiCall();
} catch (error) {
  const message = apiUtils.formatErrorMessage(error);
  console.error(message);
}

// Retry request
const data = await apiUtils.retryRequest(
  () => workoutService.getAllWorkouts(),
  3, // max retries
  1000 // base delay
);

// Debounce search
const debouncedSearch = apiUtils.debounce(
  (term) => workoutService.searchWorkouts(term),
  300
);
```

---

## Error Handling

All services use consistent error handling:

```javascript
try {
  const response = await authService.login(credentials);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
    
    if (error.response.status === 401) {
      // Handle unauthorized
    } else if (error.response.status === 400) {
      // Handle validation errors
    }
  } else if (error.request) {
    // No response received
    console.error('Network error');
  } else {
    // Request setup error
    console.error('Error:', error.message);
  }
}
```

---

## Axios Interceptors

The base `api.js` includes interceptors for:

### Request Interceptor
- Automatically adds JWT token to `Authorization` header
- Logs outgoing requests (in development)

### Response Interceptor
- Handles 401 errors by clearing auth and redirecting to login
- Handles 403 errors (forbidden access)
- Handles 404 errors (not found)
- Handles 500+ errors (server errors)
- Logs responses (in development)

---

## Best Practices

### 1. Always Use Services

❌ **Don't:**
```javascript
const response = await fetch('/api/workouts', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

✅ **Do:**
```javascript
import { workoutService } from '@/services';
const response = await workoutService.getAllWorkouts();
```

### 2. Handle Errors Properly

❌ **Don't:**
```javascript
const data = await workoutService.getAllWorkouts();
// No error handling
```

✅ **Do:**
```javascript
try {
  const data = await workoutService.getAllWorkouts();
  setWorkouts(data.data);
} catch (error) {
  const message = apiUtils.formatErrorMessage(error);
  setError(message);
}
```

### 3. Use Loading States

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await workoutService.getAllWorkouts();
    setWorkouts(response.data);
  } catch (err) {
    setError(apiUtils.formatErrorMessage(err));
  } finally {
    setLoading(false);
  }
};
```

### 4. Use Debouncing for Search

```javascript
import { apiUtils, workoutService } from '@/services';

const debouncedSearch = apiUtils.debounce(async (term) => {
  const results = await workoutService.searchWorkouts(term);
  setSearchResults(results.data);
}, 300);

// In component
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### 5. Cancel Requests on Unmount

```javascript
useEffect(() => {
  const { signal, cancel } = apiUtils.createCancelToken();
  
  const fetchData = async () => {
    try {
      const response = await workoutService.getAllWorkouts();
      setData(response.data);
    } catch (error) {
      if (!signal.aborted) {
        setError(apiUtils.formatErrorMessage(error));
      }
    }
  };
  
  fetchData();
  
  return () => cancel('Component unmounted');
}, []);
```

---

## Testing

Services can be easily mocked for testing:

```javascript
import { workoutService } from '@/services';

jest.mock('@/services', () => ({
  workoutService: {
    getAllWorkouts: jest.fn(),
  },
}));

// In test
workoutService.getAllWorkouts.mockResolvedValue({
  data: [{ id: 1, name: 'Test Workout' }],
});
```

---

## Environment Configuration

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

For production:

```env
VITE_API_URL=https://api.swishfit.com/api
```

---

## API Response Format

All services expect responses in this format:

```javascript
{
  success: true,
  message: "Success message",
  data: {
    // Response data
  },
  // Optional pagination
  pagination: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
  }
}
```

Error format:

```javascript
{
  success: false,
  message: "Error message",
  error: "Detailed error"
}
```

---

## Summary

The Services Layer provides:

✅ **Centralized API calls** - All in one place  
✅ **Consistent error handling** - Uniform across app  
✅ **Automatic authentication** - JWT tokens handled automatically  
✅ **Type safety** - Clear function signatures  
✅ **Easy testing** - Simple to mock  
✅ **Reusability** - DRY principle  
✅ **Maintainability** - Easy to update endpoints  

Use services instead of direct API calls for a cleaner, more maintainable codebase!
