/**
 * Database Index Verification Script
 * 
 * This script connects to MongoDB and verifies that all required indexes
 * exist on the collections. Run this script to ensure optimal query performance.
 * 
 * Usage:
 *   node scripts/verifyIndexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models (this will create indexes)
const User = require('../src/models/User');
const Workout = require('../src/models/Workout');
const Progress = require('../src/models/Progress');
const Leaderboard = require('../src/models/Leaderboard');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swishfit');
    console.log('✅ MongoDB Connected Successfully\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const verifyIndexes = async () => {
  console.log('🔍 Verifying Database Indexes...\n');

  try {
    // User Model Indexes
    console.log('📊 USER Collection Indexes:');
    const userIndexes = await User.collection.getIndexes();
    console.log(JSON.stringify(userIndexes, null, 2));
    console.log('');

    // Workout Model Indexes
    console.log('📊 WORKOUT Collection Indexes:');
    const workoutIndexes = await Workout.collection.getIndexes();
    console.log(JSON.stringify(workoutIndexes, null, 2));
    console.log('');

    // Progress Model Indexes
    console.log('📊 PROGRESS Collection Indexes:');
    const progressIndexes = await Progress.collection.getIndexes();
    console.log(JSON.stringify(progressIndexes, null, 2));
    console.log('');

    // Leaderboard Model Indexes
    console.log('📊 LEADERBOARD Collection Indexes:');
    const leaderboardIndexes = await Leaderboard.collection.getIndexes();
    console.log(JSON.stringify(leaderboardIndexes, null, 2));
    console.log('');

    // Verify critical indexes exist
    console.log('✅ Critical Index Verification:\n');

    // User indexes
    const hasEmailIndex = userIndexes.email_1 !== undefined;
    const hasRoleIndex = userIndexes.role_1 !== undefined;
    const hasCoachIndex = userIndexes.coachId_1 !== undefined;
    
    console.log(`  User.email (unique): ${hasEmailIndex ? '✅' : '❌'}`);
    console.log(`  User.role: ${hasRoleIndex ? '✅' : '❌'}`);
    console.log(`  User.coachId: ${hasCoachIndex ? '✅' : '❌'}`);
    console.log('');

    // Workout indexes
    const hasWorkoutCompound = userIndexes['skillLevel_1_category_1'] !== undefined;
    const hasWorkoutPublic = workoutIndexes['isPublic_1_isActive_1'] !== undefined;
    
    console.log(`  Workout.skillLevel+category (compound): ${hasWorkoutCompound ? '✅' : '❌'}`);
    console.log(`  Workout.isPublic+isActive: ${hasWorkoutPublic ? '✅' : '❌'}`);
    console.log('');

    // Progress indexes
    const hasProgressCompound = progressIndexes['playerId_1_date_-1'] !== undefined;
    const hasProgressWorkout = progressIndexes.workoutId_1 !== undefined;
    
    console.log(`  Progress.playerId+date (compound): ${hasProgressCompound ? '✅' : '❌'}`);
    console.log(`  Progress.workoutId: ${hasProgressWorkout ? '✅' : '❌'}`);
    console.log('');

    // Leaderboard indexes
    const hasRankIndex = leaderboardIndexes.rank_1 !== undefined;
    const hasPointsIndex = leaderboardIndexes['points_-1'] !== undefined;
    
    console.log(`  Leaderboard.rank: ${hasRankIndex ? '✅' : '❌'}`);
    console.log(`  Leaderboard.points (descending): ${hasPointsIndex ? '✅' : '❌'}`);
    console.log('');

    console.log('✅ Index verification complete!\n');

  } catch (error) {
    console.error('❌ Error verifying indexes:', error.message);
  }
};

const syncIndexes = async () => {
  console.log('🔄 Synchronizing indexes with models...\n');

  try {
    await User.syncIndexes();
    console.log('✅ User indexes synchronized');

    await Workout.syncIndexes();
    console.log('✅ Workout indexes synchronized');

    await Progress.syncIndexes();
    console.log('✅ Progress indexes synchronized');

    await Leaderboard.syncIndexes();
    console.log('✅ Leaderboard indexes synchronized');

    console.log('\n✅ All indexes synchronized!\n');
  } catch (error) {
    console.error('❌ Error synchronizing indexes:', error.message);
  }
};

const getIndexStats = async () => {
  console.log('📈 Index Statistics:\n');

  try {
    const db = mongoose.connection.db;

    // Get stats for each collection
    const collections = ['users', 'workouts', 'progresses', 'leaderboards'];

    for (const collectionName of collections) {
      const stats = await db.collection(collectionName).stats();
      console.log(`${collectionName.toUpperCase()}:`);
      console.log(`  Total documents: ${stats.count}`);
      console.log(`  Total indexes: ${stats.nindexes}`);
      console.log(`  Index size: ${(stats.totalIndexSize / 1024).toFixed(2)} KB`);
      console.log(`  Storage size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error getting index stats:', error.message);
  }
};

const main = async () => {
  await connectDB();
  
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║        Database Index Verification Tool                 ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // Synchronize indexes first (creates missing indexes)
  await syncIndexes();

  // Verify all indexes exist
  await verifyIndexes();

  // Show index statistics
  await getIndexStats();

  // Close connection
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error('❌ Script error:', error);
  process.exit(1);
});
