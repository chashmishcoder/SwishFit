/**
 * Phase 3 Backend API Testing Suite
 * Tests all Progress, Leaderboard, Coach, and AI Analysis endpoints
 * 
 * Setup Required:
 * 1. Server must be running on http://localhost:5001
 * 2. Database must have test users (player, coach, admin)
 * 3. Update JWT tokens below with actual tokens
 * 4. Install axios: npm install axios
 * 
 * Run: node test-phase3-endpoints.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// ==================== CONFIGURATION ====================
// Replace these with actual JWT tokens from your database
const TOKENS = {
  player: 'YOUR_PLAYER_JWT_TOKEN',
  coach: 'YOUR_COACH_JWT_TOKEN',
  admin: 'YOUR_ADMIN_JWT_TOKEN'
};

// Replace with actual IDs from your database
const TEST_DATA = {
  playerId: 'PLAYER_ID',
  workoutId: 'WORKOUT_ID',
  progressId: 'PROGRESS_ID',
  coachId: 'COACH_ID'
};

// ==================== TEST RESULTS ====================
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0
};

const testDetails = [];

// ==================== HELPER FUNCTIONS ====================

function logTest(category, name, status, details = '') {
  testResults.total++;
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.skipped++;
  
  console.log(`${icon} [${category}] ${name}`);
  if (details) console.log(`   ${details}`);
  
  testDetails.push({ category, name, status, details });
}

function createHeaders(role) {
  return {
    'Authorization': `Bearer ${TOKENS[role]}`,
    'Content-Type': 'application/json'
  };
}

async function testEndpoint(config) {
  const { method, url, role, data, expectedStatus, testName, category } = config;
  
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      headers: createHeaders(role),
      data,
      validateStatus: () => true // Don't throw on any status
    });
    
    if (response.status === expectedStatus) {
      logTest(category, testName, 'PASS', `Status: ${response.status}`);
      return { success: true, data: response.data };
    } else {
      logTest(category, testName, 'FAIL', 
        `Expected ${expectedStatus}, got ${response.status} - ${response.data.message || ''}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    logTest(category, testName, 'FAIL', error.message);
    return { success: false, error: error.message };
  }
}

// ==================== PROGRESS API TESTS ====================

async function testProgressAPI() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         🏃 PROGRESS TRACKING API TESTS (8)              ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Log Progress (Player)
  await testEndpoint({
    method: 'POST',
    url: '/progress',
    role: 'player',
    data: {
      workoutId: TEST_DATA.workoutId,
      exerciseResults: [
        {
          exerciseName: 'Free Throw Shooting',
          shotsMade: 8,
          shotsAttempted: 10,
          repsCompleted: 10
        }
      ],
      playerNotes: 'Great workout session',
      rating: 5,
      completed: true
    },
    expectedStatus: 201,
    testName: 'POST /progress - Log workout progress',
    category: 'Progress'
  });

  // Test 2: Get My Progress (Player)
  await testEndpoint({
    method: 'GET',
    url: '/progress/my-progress',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /progress/my-progress - Get own progress',
    category: 'Progress'
  });

  // Test 3: Get Player Progress (Coach viewing assigned player)
  await testEndpoint({
    method: 'GET',
    url: `/progress/player/${TEST_DATA.playerId}`,
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /progress/player/:id - Coach view assigned player',
    category: 'Progress'
  });

  // Test 4: Get Progress By ID
  await testEndpoint({
    method: 'GET',
    url: `/progress/${TEST_DATA.progressId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /progress/:id - Get single progress entry',
    category: 'Progress'
  });

  // Test 5: Get Analytics
  await testEndpoint({
    method: 'GET',
    url: `/progress/analytics/${TEST_DATA.playerId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /progress/analytics/:id - Performance analytics',
    category: 'Progress'
  });

  // Test 6: Get Workout Stats
  await testEndpoint({
    method: 'GET',
    url: `/progress/stats/${TEST_DATA.playerId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /progress/stats/:id - Workout statistics',
    category: 'Progress'
  });

  // Test 7: Update Progress
  await testEndpoint({
    method: 'PUT',
    url: `/progress/${TEST_DATA.progressId}`,
    role: 'player',
    data: {
      playerNotes: 'Updated notes after review',
      rating: 4
    },
    expectedStatus: 200,
    testName: 'PUT /progress/:id - Update progress entry',
    category: 'Progress'
  });

  // Test 8: Delete Progress
  await testEndpoint({
    method: 'DELETE',
    url: `/progress/${TEST_DATA.progressId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'DELETE /progress/:id - Soft delete progress',
    category: 'Progress'
  });
}

// ==================== LEADERBOARD API TESTS ====================

async function testLeaderboardAPI() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         🏆 LEADERBOARD API TESTS (13)                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Get Global Leaderboard
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard?limit=10&sortBy=totalPoints',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard - Global rankings',
    category: 'Leaderboard'
  });

  // Test 2: Get Team Leaderboard
  await testEndpoint({
    method: 'GET',
    url: `/leaderboard/team/${TEST_DATA.playerId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/team/:playerId - Team rankings',
    category: 'Leaderboard'
  });

  // Test 3: Get Player Rank
  await testEndpoint({
    method: 'GET',
    url: `/leaderboard/rank/${TEST_DATA.playerId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/rank/:playerId - Player rank with context',
    category: 'Leaderboard'
  });

  // Test 4: Get My Rank
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard/my-rank',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/my-rank - Own rank',
    category: 'Leaderboard'
  });

  // Test 5: Get Top Performers
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard/top-performers?metric=averageAccuracy&limit=5',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/top-performers - Top by metric',
    category: 'Leaderboard'
  });

  // Test 6: Get Leaderboard Stats
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard/stats',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/stats - Overall statistics',
    category: 'Leaderboard'
  });

  // Test 7: Get Skill Level Leaderboard
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard/skill-level/intermediate',
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/skill-level/:level - Skill-based rankings',
    category: 'Leaderboard'
  });

  // Test 8: Get Leaderboard History
  await testEndpoint({
    method: 'GET',
    url: `/leaderboard/history/${TEST_DATA.playerId}?period=weekly`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/history/:playerId - Historical data',
    category: 'Leaderboard'
  });

  // Test 9: Compare Players
  await testEndpoint({
    method: 'GET',
    url: `/leaderboard/compare/${TEST_DATA.playerId}/${TEST_DATA.coachId}`,
    role: 'player',
    expectedStatus: 200,
    testName: 'GET /leaderboard/compare/:id1/:id2 - Player comparison',
    category: 'Leaderboard'
  });

  // Test 10: Update All Rankings (Admin)
  await testEndpoint({
    method: 'POST',
    url: '/leaderboard/update-rankings',
    role: 'admin',
    expectedStatus: 200,
    testName: 'POST /leaderboard/update-rankings - Bulk rank update (Admin)',
    category: 'Leaderboard'
  });

  // Test 11: Award Achievement (Admin)
  await testEndpoint({
    method: 'POST',
    url: `/leaderboard/achievement/${TEST_DATA.playerId}`,
    role: 'admin',
    data: {
      title: 'Test Achievement',
      description: 'Test achievement for testing',
      icon: '🏆'
    },
    expectedStatus: 200,
    testName: 'POST /leaderboard/achievement/:playerId - Award achievement (Admin)',
    category: 'Leaderboard'
  });

  // Test 12: Reset Weekly Points (Admin)
  await testEndpoint({
    method: 'POST',
    url: '/leaderboard/reset-weekly',
    role: 'admin',
    expectedStatus: 200,
    testName: 'POST /leaderboard/reset-weekly - Reset weekly points (Admin)',
    category: 'Leaderboard'
  });

  // Test 13: Reset Monthly Points (Admin)
  await testEndpoint({
    method: 'POST',
    url: '/leaderboard/reset-monthly',
    role: 'admin',
    expectedStatus: 200,
    testName: 'POST /leaderboard/reset-monthly - Reset monthly points (Admin)',
    category: 'Leaderboard'
  });
}

// ==================== COACH API TESTS ====================

async function testCoachAPI() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         👨‍🏫 COACH MANAGEMENT API TESTS (9)              ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Get My Players
  await testEndpoint({
    method: 'GET',
    url: '/coach/players',
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /coach/players - Get assigned players',
    category: 'Coach'
  });

  // Test 2: Get Player Overview
  await testEndpoint({
    method: 'GET',
    url: `/coach/players/${TEST_DATA.playerId}/overview`,
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /coach/players/:id/overview - Detailed player overview',
    category: 'Coach'
  });

  // Test 3: Get Player Progress
  await testEndpoint({
    method: 'GET',
    url: `/coach/players/${TEST_DATA.playerId}/progress`,
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /coach/players/:id/progress - Player progress history',
    category: 'Coach'
  });

  // Test 4: Add Feedback to Progress
  await testEndpoint({
    method: 'PUT',
    url: `/coach/feedback/${TEST_DATA.progressId}`,
    role: 'coach',
    data: {
      coachFeedback: 'Great work on your shooting form! Keep it up.'
    },
    expectedStatus: 200,
    testName: 'PUT /coach/feedback/:id - Add coach feedback',
    category: 'Coach'
  });

  // Test 5: Assign Workout to Player
  await testEndpoint({
    method: 'POST',
    url: '/coach/assign-workout',
    role: 'coach',
    data: {
      workoutId: TEST_DATA.workoutId,
      playerIds: [TEST_DATA.playerId]
    },
    expectedStatus: 200,
    testName: 'POST /coach/assign-workout - Assign to specific players',
    category: 'Coach'
  });

  // Test 6: Unassign Workout
  await testEndpoint({
    method: 'POST',
    url: '/coach/unassign-workout',
    role: 'coach',
    data: {
      workoutId: TEST_DATA.workoutId,
      playerIds: [TEST_DATA.playerId]
    },
    expectedStatus: 200,
    testName: 'POST /coach/unassign-workout - Remove assignment',
    category: 'Coach'
  });

  // Test 7: Assign Workout to All Players
  await testEndpoint({
    method: 'POST',
    url: '/coach/assign-workout-all',
    role: 'coach',
    data: {
      workoutId: TEST_DATA.workoutId,
      skillLevel: 'intermediate'
    },
    expectedStatus: 200,
    testName: 'POST /coach/assign-workout-all - Bulk assignment',
    category: 'Coach'
  });

  // Test 8: Get Dashboard Stats
  await testEndpoint({
    method: 'GET',
    url: '/coach/dashboard',
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /coach/dashboard - Coach dashboard analytics',
    category: 'Coach'
  });

  // Test 9: Compare My Players
  await testEndpoint({
    method: 'GET',
    url: `/coach/compare?playerIds=${TEST_DATA.playerId},${TEST_DATA.coachId}`,
    role: 'coach',
    expectedStatus: 200,
    testName: 'GET /coach/compare - Compare multiple players',
    category: 'Coach'
  });
}

// ==================== AI ANALYSIS API TESTS ====================

async function testAIAnalysisAPI() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         🤖 AI PERFORMANCE ANALYSIS TESTS (4)            ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Player Self Analysis
  await testEndpoint({
    method: 'POST',
    url: '/progress/analyze',
    role: 'player',
    data: { days: 30 },
    expectedStatus: 200,
    testName: 'POST /progress/analyze - Player self-analysis',
    category: 'AI Analysis'
  });

  // Test 2: Coach Analyzing Player
  await testEndpoint({
    method: 'POST',
    url: '/progress/analyze',
    role: 'coach',
    data: {
      playerId: TEST_DATA.playerId,
      days: 14
    },
    expectedStatus: 200,
    testName: 'POST /progress/analyze - Coach analyzing player',
    category: 'AI Analysis'
  });

  // Test 3: Admin Analyzing Any Player
  await testEndpoint({
    method: 'POST',
    url: '/progress/analyze',
    role: 'admin',
    data: {
      playerId: TEST_DATA.playerId,
      days: 7
    },
    expectedStatus: 200,
    testName: 'POST /progress/analyze - Admin analyzing player',
    category: 'AI Analysis'
  });

  // Test 4: Analysis with No Workout History
  await testEndpoint({
    method: 'POST',
    url: '/progress/analyze',
    role: 'player',
    data: { days: 1 },
    expectedStatus: 200,
    testName: 'POST /progress/analyze - Handle no workout history',
    category: 'AI Analysis'
  });
}

// ==================== AUTHORIZATION TESTS ====================

async function testAuthorization() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         🔒 AUTHORIZATION & SECURITY TESTS (5)           ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Player trying to access admin endpoint
  await testEndpoint({
    method: 'POST',
    url: '/leaderboard/update-rankings',
    role: 'player',
    expectedStatus: 403,
    testName: 'Player accessing admin endpoint (should fail)',
    category: 'Authorization'
  });

  // Test 2: Coach accessing own players only
  await testEndpoint({
    method: 'GET',
    url: '/coach/players',
    role: 'coach',
    expectedStatus: 200,
    testName: 'Coach accessing assigned players (should pass)',
    category: 'Authorization'
  });

  // Test 3: Unauthorized access (no token)
  try {
    const response = await axios.get(`${BASE_URL}/progress/my-progress`, {
      validateStatus: () => true
    });
    
    if (response.status === 401) {
      logTest('Authorization', 'Access without token (should fail)', 'PASS', 'Status: 401');
    } else {
      logTest('Authorization', 'Access without token (should fail)', 'FAIL', `Expected 401, got ${response.status}`);
    }
  } catch (error) {
    logTest('Authorization', 'Access without token (should fail)', 'FAIL', error.message);
  }

  // Test 4: Player updating own progress
  await testEndpoint({
    method: 'PUT',
    url: `/progress/${TEST_DATA.progressId}`,
    role: 'player',
    data: { playerNotes: 'My notes' },
    expectedStatus: 200,
    testName: 'Player updating own progress (should pass)',
    category: 'Authorization'
  });

  // Test 5: Coach adding feedback to assigned player
  await testEndpoint({
    method: 'PUT',
    url: `/coach/feedback/${TEST_DATA.progressId}`,
    role: 'coach',
    data: { coachFeedback: 'Coach feedback' },
    expectedStatus: 200,
    testName: 'Coach adding feedback (should pass)',
    category: 'Authorization'
  });
}

// ==================== VALIDATION TESTS ====================

async function testValidation() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         ✅ INPUT VALIDATION TESTS (5)                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Invalid workout ID
  await testEndpoint({
    method: 'POST',
    url: '/progress',
    role: 'player',
    data: {
      workoutId: 'invalid-id',
      completed: true
    },
    expectedStatus: 400,
    testName: 'Invalid workout ID (should fail)',
    category: 'Validation'
  });

  // Test 2: Missing required fields
  await testEndpoint({
    method: 'POST',
    url: '/progress',
    role: 'player',
    data: {},
    expectedStatus: 400,
    testName: 'Missing required fields (should fail)',
    category: 'Validation'
  });

  // Test 3: Invalid rating value
  await testEndpoint({
    method: 'POST',
    url: '/progress',
    role: 'player',
    data: {
      workoutId: TEST_DATA.workoutId,
      rating: 10, // Should be 1-5
      completed: true
    },
    expectedStatus: 400,
    testName: 'Invalid rating value (should fail)',
    category: 'Validation'
  });

  // Test 4: Valid progress with all fields
  await testEndpoint({
    method: 'POST',
    url: '/progress',
    role: 'player',
    data: {
      workoutId: TEST_DATA.workoutId,
      exerciseResults: [{
        exerciseName: 'Test',
        shotsMade: 5,
        shotsAttempted: 10
      }],
      playerNotes: 'Valid notes',
      rating: 4,
      enjoymentLevel: 'enjoyed',
      completed: true
    },
    expectedStatus: 201,
    testName: 'Valid progress data (should pass)',
    category: 'Validation'
  });

  // Test 5: Pagination parameters
  await testEndpoint({
    method: 'GET',
    url: '/leaderboard?page=1&limit=20',
    role: 'player',
    expectedStatus: 200,
    testName: 'Valid pagination parameters (should pass)',
    category: 'Validation'
  });
}

// ==================== MAIN TEST RUNNER ====================

async function runAllTests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║   🧪 PHASE 3 BACKEND API TEST SUITE                     ║');
  console.log('║   Testing 31 Endpoints Across 4 APIs                    ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  SETUP CHECKLIST:');
  console.log('   ☐ Server running on http://localhost:5001');
  console.log('   ☐ MongoDB connected with test data');
  console.log('   ☐ JWT tokens updated in TOKENS object');
  console.log('   ☐ Test IDs updated in TEST_DATA object');
  console.log('   ☐ Gemini API key configured in .env\n');

  const startTime = Date.now();

  try {
    // Run all test suites
    await testProgressAPI();
    await testLeaderboardAPI();
    await testCoachAPI();
    await testAIAnalysisAPI();
    await testAuthorization();
    await testValidation();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                   TEST SUMMARY                           ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⚠️  Skipped: ${testResults.skipped}`);
    console.log(`⏱️  Duration: ${duration}s\n`);

    const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`📈 Pass Rate: ${passRate}%\n`);

    // Category breakdown
    const categories = {};
    testDetails.forEach(test => {
      if (!categories[test.category]) {
        categories[test.category] = { passed: 0, failed: 0, total: 0 };
      }
      categories[test.category].total++;
      if (test.status === 'PASS') categories[test.category].passed++;
      else if (test.status === 'FAIL') categories[test.category].failed++;
    });

    console.log('📋 Category Breakdown:');
    console.log('─────────────────────────────────────────────────────────────');
    Object.entries(categories).forEach(([category, stats]) => {
      const rate = ((stats.passed / stats.total) * 100).toFixed(0);
      console.log(`   ${category}: ${stats.passed}/${stats.total} (${rate}%)`);
    });

    console.log('\n───────────────────────────────────────────────────────────────\n');

    // Overall result
    if (testResults.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Phase 3 backend is production-ready! 🚀\n');
    } else {
      console.log(`⚠️  ${testResults.failed} test(s) failed. Review details above.\n`);
    }

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
    console.log('\nℹ️  Common issues:');
    console.log('   - Server not running');
    console.log('   - Invalid JWT tokens');
    console.log('   - Database connection issues');
    console.log('   - Missing test data in database\n');
  }
}

// Check if tokens are configured
function checkConfiguration() {
  if (TOKENS.player === 'YOUR_PLAYER_JWT_TOKEN') {
    console.log('\n⚠️  WARNING: Test tokens not configured!\n');
    console.log('Please update the following in test-phase3-endpoints.js:');
    console.log('   1. TOKENS.player');
    console.log('   2. TOKENS.coach');
    console.log('   3. TOKENS.admin');
    console.log('   4. TEST_DATA.playerId');
    console.log('   5. TEST_DATA.workoutId');
    console.log('   6. TEST_DATA.progressId');
    console.log('   7. TEST_DATA.coachId\n');
    console.log('To get tokens, login via POST /api/auth/login\n');
    return false;
  }
  return true;
}

// Run tests
if (require.main === module) {
  if (checkConfiguration()) {
    runAllTests();
  }
}

module.exports = { runAllTests, testProgressAPI, testLeaderboardAPI, testCoachAPI };
