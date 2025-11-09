const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const Progress = require('../src/models/Progress');
const Leaderboard = require('../src/models/Leaderboard');

const cleanupTestData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    
    // Delete all progress entries
    console.log('\n🗑️  Deleting all progress entries...');
    const progressResult = await Progress.deleteMany({});
    console.log(`✅ Deleted ${progressResult.deletedCount} progress entries`);
    
    // Reset leaderboard stats (but don't delete the leaderboard entries)
    console.log('\n🔄 Resetting leaderboard statistics...');
    const leaderboardResult = await Leaderboard.updateMany(
      {},
      {
        $set: {
          points: 0,
          rank: null,
          currentStreak: 0,
          longestStreak: 0,
          totalWorkoutsCompleted: 0,
          averageAccuracy: 0,
          'personalBests.highestAccuracy': 0,
          'personalBests.mostCaloriesBurned': 0,
          'personalBests.longestWorkoutMinutes': 0,
          'weeklyActivity.monday': 0,
          'weeklyActivity.tuesday': 0,
          'weeklyActivity.wednesday': 0,
          'weeklyActivity.thursday': 0,
          'weeklyActivity.friday': 0,
          'weeklyActivity.saturday': 0,
          'weeklyActivity.sunday': 0,
          recentAchievements: []
        }
      }
    );
    console.log(`✅ Reset ${leaderboardResult.modifiedCount} leaderboard entries`);
    
    console.log('\n✨ Test data cleanup completed successfully!');
    console.log('📊 You can now start fresh with new workout logging.\n');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the cleanup
cleanupTestData();
