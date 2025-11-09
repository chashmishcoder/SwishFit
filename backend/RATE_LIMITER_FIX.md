# Rate Limiter Fix - 429 Error Resolution

## Problem Identified

**Error**: `429 Too Many Requests` on Coach Dashboard and other pages

**Root Cause**: Rate limiter was too restrictive for normal application usage
- Original limit: 100 requests per 15 minutes
- Coach Dashboard makes 10-15 simultaneous API calls on load
- Multiple page navigations quickly exhausted the limit

## Solution Applied

### Updated Rate Limits:

#### 1. General API Limiter
**Before**: 100 requests / 15 minutes  
**After**: 1000 requests / 15 minutes  
**Reasoning**: Allows ~1 request/second average, suitable for dashboard with multiple API calls

#### 2. Authentication Limiter
**Before**: 5 attempts / 15 minutes  
**After**: 10 attempts / 15 minutes  
**Reasoning**: Still prevents brute force but allows for user typos/mistakes

#### 3. AI Generation Limiter
**Before**: 10 requests / hour  
**After**: 20 requests / hour  
**Reasoning**: Allows normal workout generation usage while still preventing abuse

## Files Modified

- `backend/src/middleware/rateLimiter.js`
  - Updated `apiLimiter` max from 100 to 1000
  - Updated `authLimiter` max from 5 to 10
  - Updated `aiLimiter` max from 10 to 20

## Testing Instructions

1. **Restart Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Clear Browser Cache** (to reset rate limit counters):
   - Chrome: Cmd+Shift+Delete → Clear browsing data
   - Or use Incognito/Private window

3. **Test Coach Dashboard**:
   - Login as coach
   - Navigate to Coach Portal
   - Verify all data loads without 429 errors
   - Refresh page multiple times
   - Navigate between pages

4. **Verify Rate Limits Still Work**:
   - Try making 1001 requests in 15 minutes (should get 429)
   - Try 11 failed login attempts (should get 429)

## Expected Behavior After Fix

✅ **Normal Usage**: No 429 errors during regular app usage  
✅ **Dashboard Loading**: All API calls succeed simultaneously  
✅ **Page Navigation**: Multiple page changes work smoothly  
✅ **Abuse Prevention**: Still blocks excessive requests from malicious users

## Production Recommendations

### For Development:
- Current limits are suitable for development and testing
- Can be increased further if needed

### For Production:
Consider these adjustments based on traffic:

```javascript
// Recommended production limits
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 2000 : 1000,
  // Higher limit in production with more users
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 15 : 10,
  skipSuccessfulRequests: true,
});
```

## Rate Limit Analysis

### Dashboard API Calls (Coach Portal):
1. GET /api/coach/dashboard - Dashboard stats
2. GET /api/coach/players - Player list
3. GET /api/workouts/my-created - Created workouts
4. GET /api/leaderboard?limit=50 - Leaderboard data
5. GET /api/progress/recent - Recent progress
6. GET /api/auth/me - User profile
7-10. Various other data fetches

**Total**: ~10-15 requests per dashboard load  
**With new limit**: Can load dashboard ~66 times in 15 minutes (more than sufficient)

### Normal User Session (15 minutes):
- Login: 1 request
- Dashboard load: 10-15 requests
- 5 page navigations: 50-75 requests
- Data refreshes: 20-30 requests
- Profile updates: 5-10 requests

**Total**: ~100-150 requests per session  
**With new limit**: Comfortably within 1000 request limit

## Monitoring

Monitor these metrics in production:

1. **Rate Limit Hit Rate**: Should be < 0.1% of total requests
2. **429 Error Rate**: Should be < 0.01%
3. **Average Requests per User**: Should be 50-200 per 15 minutes

If seeing high 429 rates, increase limits further.

## Rollback Plan

If issues persist, can temporarily disable rate limiting:

```javascript
// In server.js - Comment out rate limiters
// app.use('/api/', apiLimiter);
// app.use('/api/auth/login', authLimiter);
```

Then investigate and adjust limits appropriately.

---

## Summary

✅ **Issue**: Rate limiter too restrictive (100 req/15min)  
✅ **Fix**: Increased to 1000 req/15min  
✅ **Impact**: Allows normal dashboard usage without 429 errors  
✅ **Security**: Still prevents abuse and brute force attacks

**Status**: Fixed - Restart backend server to apply changes
