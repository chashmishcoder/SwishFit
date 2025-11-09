/**
 * Test Script for AI Performance Analysis Endpoint
 * Tests POST /api/progress/analyze
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Replace with actual JWT token from your database
// You can get this by logging in or from a user in your database
const PLAYER_TOKEN = 'YOUR_PLAYER_JWT_TOKEN_HERE';
const COACH_TOKEN = 'YOUR_COACH_JWT_TOKEN_HERE';

// Test 1: Analyze own performance (Player)
async function testPlayerSelfAnalysis() {
  console.log('\n🧪 Test 1: Player analyzing own performance');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const response = await axios.post(
      `${BASE_URL}/progress/analyze`,
      {
        days: 30 // Analyze last 30 days
      },
      {
        headers: {
          'Authorization': `Bearer ${PLAYER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Status:', response.status);
    console.log('✅ Success:', response.data.success);
    
    if (response.data.success) {
      console.log('\n📊 AI Analysis Results:');
      console.log('───────────────────────────────────────────────────────────────');
      
      const { analysis, metrics, playerInfo, analyzedPeriod } = response.data.data;
      
      // Player Info
      console.log('\n👤 Player Information:');
      console.log(`   Name: ${playerInfo.name}`);
      console.log(`   Skill Level: ${playerInfo.skillLevel}`);
      console.log(`   Rank: ${playerInfo.rank}`);
      
      // Metrics
      console.log('\n📈 Performance Metrics:');
      console.log(`   Total Workouts: ${metrics.totalWorkouts}`);
      console.log(`   Completed: ${metrics.completedWorkouts}`);
      console.log(`   Completion Rate: ${metrics.completionRate.toFixed(1)}%`);
      console.log(`   Average Accuracy: ${metrics.averageAccuracy.toFixed(1)}%`);
      console.log(`   Total Calories Burned: ${metrics.totalCaloriesBurned}`);
      console.log(`   Average Duration: ${metrics.averageDuration.toFixed(1)} min`);
      console.log(`   Average Rating: ${metrics.averageRating.toFixed(1)}/5`);
      
      // AI Analysis
      console.log('\n🤖 AI-Generated Insights:');
      console.log('───────────────────────────────────────────────────────────────');
      
      console.log('\n💪 STRENGTHS:');
      analysis.strengths.forEach((strength, i) => {
        console.log(`   ${i + 1}. ${strength}`);
      });
      
      console.log('\n📉 AREAS FOR IMPROVEMENT:');
      analysis.weaknesses.forEach((weakness, i) => {
        console.log(`   ${i + 1}. ${weakness}`);
      });
      
      console.log('\n📊 PERFORMANCE TRENDS:');
      console.log(`   ${analysis.trends}`);
      
      console.log('\n💡 RECOMMENDATIONS:');
      analysis.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
      
      console.log('\n🎯 NEXT MILESTONE:');
      console.log(`   ${analysis.nextMilestone}`);
      
      console.log('\n🔥 MOTIVATIONAL MESSAGE:');
      console.log(`   ${analysis.motivationalMessage}`);
      
      console.log('\n📊 OVERALL SCORE:');
      console.log(`   ${analysis.overallScore}/100`);
      
      console.log('\n📅 Analysis Period:');
      console.log(`   Days: ${analyzedPeriod.days}`);
      console.log(`   Workouts Analyzed: ${analyzedPeriod.totalWorkoutsAnalyzed}`);
      console.log(`   From: ${new Date(analyzedPeriod.startDate).toLocaleDateString()}`);
      console.log(`   To: ${new Date(analyzedPeriod.endDate).toLocaleDateString()}`);
    } else {
      console.log('⚠️  Analysis Failed:', response.data.error);
      if (response.data.fallbackAnalysis) {
        console.log('\n📊 Basic Metrics (Fallback):');
        console.log(JSON.stringify(response.data.fallbackAnalysis, null, 2));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test 2: Coach analyzing player performance
async function testCoachAnalysisOfPlayer() {
  console.log('\n🧪 Test 2: Coach analyzing assigned player');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const response = await axios.post(
      `${BASE_URL}/progress/analyze`,
      {
        playerId: 'PLAYER_ID_HERE', // Replace with actual player ID
        days: 14 // Analyze last 2 weeks
      },
      {
        headers: {
          'Authorization': `Bearer ${COACH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Status:', response.status);
    console.log('✅ Coach successfully analyzed player performance');
    
    if (response.data.success) {
      const { playerInfo, metrics } = response.data.data;
      console.log(`\n📊 Analyzed Player: ${playerInfo.name}`);
      console.log(`   Total Workouts: ${metrics.totalWorkouts}`);
      console.log(`   Completion Rate: ${metrics.completionRate.toFixed(1)}%`);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test 3: Test with no workout history
async function testNoWorkoutHistory() {
  console.log('\n🧪 Test 3: Player with no workout history');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const response = await axios.post(
      `${BASE_URL}/progress/analyze`,
      {
        days: 30
      },
      {
        headers: {
          'Authorization': `Bearer ${PLAYER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Status:', response.status);
    console.log('ℹ️  Should handle empty workout history gracefully');
    
    const metrics = response.data.data?.metrics;
    if (metrics && metrics.totalWorkouts === 0) {
      console.log('✅ Correctly handled no workout history');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test 4: Test API configuration check
async function testApiConfiguration() {
  console.log('\n🧪 Test 4: API Configuration Status');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const response = await axios.post(
      `${BASE_URL}/progress/analyze`,
      { days: 7 },
      {
        headers: {
          'Authorization': `Bearer ${PLAYER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('✅ Gemini AI is properly configured');
    } else if (response.data.error?.includes('not configured')) {
      console.log('⚠️  Gemini AI not configured - fallback analysis provided');
      console.log('💡 Add GEMINI_API_KEY to your .env file');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║   🤖 AI Performance Analysis - Test Suite               ║');
  console.log('║   Testing POST /api/progress/analyze                    ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  SETUP REQUIRED:');
  console.log('   1. Replace PLAYER_TOKEN with actual JWT token');
  console.log('   2. Replace COACH_TOKEN with actual coach JWT token');
  console.log('   3. Replace PLAYER_ID_HERE with actual player ID');
  console.log('   4. Ensure you have workout progress data in database');
  console.log('   5. Add GEMINI_API_KEY to .env for AI analysis\n');

  // Uncomment tests as needed after adding tokens
  
  // await testPlayerSelfAnalysis();
  // await testCoachAnalysisOfPlayer();
  // await testNoWorkoutHistory();
  // await testApiConfiguration();

  console.log('\n✅ Test suite completed!');
  console.log('\n📝 ENDPOINT DOCUMENTATION:');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('POST /api/progress/analyze');
  console.log('');
  console.log('Request Body:');
  console.log('{');
  console.log('  "playerId": "optional - defaults to logged in user",');
  console.log('  "days": 30 // number of days to analyze (default: 30)');
  console.log('}');
  console.log('');
  console.log('Authorization:');
  console.log('  - Player: Can only analyze own performance');
  console.log('  - Coach: Can analyze assigned players');
  console.log('  - Admin: Can analyze any player');
  console.log('');
  console.log('Response:');
  console.log('  - AI-generated strengths, weaknesses, trends');
  console.log('  - Personalized recommendations');
  console.log('  - Performance metrics and statistics');
  console.log('  - Motivational message and next milestone');
}

// Run the test suite
runTests();
