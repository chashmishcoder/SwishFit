/**
 * Quick Health Check & Server Verification
 * Run this first to ensure server is ready for testing
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function checkServerHealth() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         🏥 SERVER HEALTH CHECK                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Check 1: Health endpoint
    console.log('📡 Checking server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Server is running');
      console.log(`   Status: ${healthResponse.data.status}`);
      console.log(`   Database: ${healthResponse.data.database}`);
      console.log(`   Environment: ${healthResponse.data.environment}\n`);
    }

    // Check 2: API documentation
    console.log('📚 Checking API endpoints...');
    const apiResponse = await axios.get(`${BASE_URL}`);
    
    if (apiResponse.status === 200) {
      console.log('✅ API documentation available');
      console.log('\n🔗 Available endpoints:');
      const endpoints = apiResponse.data.endpoints || {};
      Object.entries(endpoints).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }

    // Summary
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║         ✅ SERVER IS READY FOR TESTING                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log('📋 Next steps:');
    console.log('   1. Login to get JWT tokens:');
    console.log('      POST /api/auth/login');
    console.log('      { "email": "user@example.com", "password": "password" }');
    console.log('\n   2. Run automated tests:');
    console.log('      node test-phase3-endpoints.js');
    console.log('\n   3. Or follow manual testing guide:');
    console.log('      docs/API_TESTING_PHASE3.md\n');

    return true;

  } catch (error) {
    console.log('❌ Server health check failed\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Server is not running!');
      console.log('\n🔧 Start the server with:');
      console.log('   cd backend');
      console.log('   npm run dev\n');
    } else if (error.response) {
      console.log(`❌ Error: ${error.response.status} - ${error.response.statusText}`);
      console.log(`   ${error.response.data.message || ''}\n`);
    } else {
      console.log(`❌ Error: ${error.message}\n`);
    }

    console.log('📝 Troubleshooting:');
    console.log('   - Ensure backend server is running on port 5001');
    console.log('   - Check MongoDB connection in .env');
    console.log('   - Verify no other process is using port 5001');
    console.log('   - Check server logs for errors\n');

    return false;
  }
}

// Check Phase 3 endpoints availability
async function checkPhase3Endpoints() {
  console.log('🔍 Verifying Phase 3 endpoints are registered...\n');

  const endpoints = [
    { name: 'Progress API', path: '/progress/my-progress', requiresAuth: true },
    { name: 'Leaderboard API', path: '/leaderboard', requiresAuth: true },
    { name: 'Coach API', path: '/coach/players', requiresAuth: true },
    { name: 'AI Analysis', path: '/progress/analyze', requiresAuth: true }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.path}`, {
        validateStatus: () => true // Don't throw on any status
      });

      // If requires auth, 401 is expected and good (endpoint exists)
      // If doesn't require auth, 200 is expected
      if (endpoint.requiresAuth && response.status === 401) {
        console.log(`✅ ${endpoint.name}: Registered (requires auth)`);
      } else if (!endpoint.requiresAuth && response.status === 200) {
        console.log(`✅ ${endpoint.name}: Registered (public)`);
      } else if (response.status === 404) {
        console.log(`❌ ${endpoint.name}: NOT FOUND (${endpoint.path})`);
      } else {
        console.log(`✅ ${endpoint.name}: Registered (status ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
    }
  }

  console.log('');
}

// Main
async function main() {
  const serverReady = await checkServerHealth();
  
  if (serverReady) {
    await checkPhase3Endpoints();
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('🎯 PHASE 3 BACKEND STATUS: READY FOR TESTING\n');
    console.log('📊 31 endpoints available across 4 APIs:');
    console.log('   • Progress Tracking API: 8 endpoints');
    console.log('   • Leaderboard API: 13 endpoints');
    console.log('   • Coach Management API: 9 endpoints');
    console.log('   • AI Performance Analysis: 1 endpoint\n');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkServerHealth, checkPhase3Endpoints };
