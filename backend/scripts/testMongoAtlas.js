/**
 * MongoDB Atlas Connection Test Script
 * 
 * This script tests the connection to MongoDB Atlas and verifies:
 * - Connection is successful
 * - Authentication works
 * - Database is accessible
 * - Can write and read data
 * 
 * Usage:
 *   node scripts/testMongoAtlas.js
 * 
 * Prerequisites:
 *   1. MongoDB Atlas cluster created
 *   2. Database user created
 *   3. Network access configured (0.0.0.0/0)
 *   4. Connection string added to .env as MONGODB_URI
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
};

// Test schema
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: Date,
});

const TestModel = mongoose.model('Test', TestSchema);

async function testMongoAtlasConnection() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║        MongoDB Atlas Connection Test                    ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    log.error('MONGODB_URI not found in environment variables');
    log.info('Please add your MongoDB Atlas connection string to .env file:');
    log.info('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swishfit?retryWrites=true&w=majority');
    process.exit(1);
  }

  const connectionString = process.env.MONGODB_URI;
  
  // Mask password in display
  const maskedConnection = connectionString.replace(
    /\/\/([^:]+):([^@]+)@/,
    '//$1:****@'
  );
  log.info(`Connecting to: ${maskedConnection}\n`);

  try {
    // Test 1: Connect to MongoDB Atlas
    log.info('Test 1: Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    log.success('Connected to MongoDB Atlas successfully!\n');

    // Test 2: Check connection state
    log.info('Test 2: Checking connection state...');
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    if (state === 1) {
      log.success(`Connection state: ${states[state]}\n`);
    } else {
      log.error(`Unexpected connection state: ${states[state]}\n`);
      throw new Error('Connection state is not "connected"');
    }

    // Test 3: Get database info
    log.info('Test 3: Retrieving database information...');
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    const host = mongoose.connection.host;
    
    log.success(`Database name: ${dbName}`);
    log.success(`Host: ${host}\n`);

    // Test 4: Check authentication
    log.info('Test 4: Verifying authentication...');
    const admin = db.admin();
    const serverInfo = await admin.serverInfo();
    log.success(`MongoDB version: ${serverInfo.version}`);
    log.success('Authentication successful!\n');

    // Test 5: Test write operation
    log.info('Test 5: Testing write operation...');
    const testDoc = new TestModel({
      name: 'Atlas Connection Test',
      timestamp: new Date(),
    });
    await testDoc.save();
    log.success(`Test document created with ID: ${testDoc._id}\n`);

    // Test 6: Test read operation
    log.info('Test 6: Testing read operation...');
    const foundDoc = await TestModel.findById(testDoc._id);
    if (foundDoc && foundDoc.name === 'Atlas Connection Test') {
      log.success('Test document retrieved successfully!\n');
    } else {
      throw new Error('Failed to retrieve test document');
    }

    // Test 7: Test update operation
    log.info('Test 7: Testing update operation...');
    foundDoc.name = 'Atlas Connection Test - Updated';
    await foundDoc.save();
    log.success('Test document updated successfully!\n');

    // Test 8: Test delete operation
    log.info('Test 8: Testing delete operation...');
    await TestModel.deleteOne({ _id: testDoc._id });
    log.success('Test document deleted successfully!\n');

    // Test 9: Check collections
    log.info('Test 9: Listing existing collections...');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      log.info('No collections found (this is normal for a new database)');
    } else {
      log.success(`Found ${collections.length} collection(s):`);
      collections.forEach((coll) => {
        log.info(`  - ${coll.name}`);
      });
    }
    console.log('');

    // Test 10: Clean up test collection
    log.info('Test 10: Cleaning up test data...');
    await db.collection('tests').drop().catch(() => {
      // Ignore error if collection doesn't exist
    });
    log.success('Test data cleaned up!\n');

    // Summary
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║                  🎉 ALL TESTS PASSED! 🎉                ║');
    console.log('║                                                          ║');
    console.log('║  Your MongoDB Atlas connection is ready for production  ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    log.success('Connection Details:');
    log.info(`  Database: ${dbName}`);
    log.info(`  Host: ${host}`);
    log.info(`  MongoDB Version: ${serverInfo.version}`);
    log.info(`  Collections: ${collections.length}`);
    console.log('');

    log.info('Next Steps:');
    log.info('  1. Save your connection string securely');
    log.info('  2. Add it to Render environment variables as MONGODB_URI');
    log.info('  3. Proceed with backend deployment (Task 3)');
    console.log('');

  } catch (error) {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║                   ❌ TESTS FAILED ❌                     ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    log.error('Error Details:');
    console.error(`  ${error.message}\n`);

    if (error.name === 'MongoServerError' && error.code === 8000) {
      log.error('Authentication Failed!');
      log.info('Possible causes:');
      log.info('  1. Incorrect username or password');
      log.info('  2. User doesn\'t have proper permissions');
      log.info('  3. Password contains special characters (try URL encoding)');
    } else if (error.name === 'MongooseServerSelectionError') {
      log.error('Could not connect to MongoDB Atlas!');
      log.info('Possible causes:');
      log.info('  1. Network access not configured (add 0.0.0.0/0 to whitelist)');
      log.info('  2. Incorrect connection string');
      log.info('  3. Cluster is still being created (wait 2-3 minutes)');
      log.info('  4. Firewall blocking connection');
    } else if (error.message.includes('ENOTFOUND')) {
      log.error('DNS resolution failed!');
      log.info('Possible causes:');
      log.info('  1. Incorrect cluster URL in connection string');
      log.info('  2. Internet connection issue');
      log.info('  3. DNS server problem');
    }

    console.log('\n💡 Troubleshooting Tips:');
    log.info('  1. Check MongoDB Atlas dashboard for cluster status');
    log.info('  2. Verify network access settings (Database Access → Network Access)');
    log.info('  3. Ensure connection string includes database name: .../swishfit?...');
    log.info('  4. Check username and password are correct');
    log.info('  5. Wait 2-3 minutes after cluster/user creation');
    console.log('\n📚 Documentation: docs/MONGODB_ATLAS_SETUP.md');
    console.log('');

    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    log.info('Connection closed');
  }
}

// Run the test
testMongoAtlasConnection();
