const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Test MongoDB Connection
 * Run this script to verify MongoDB Atlas connection works
 */

const testConnection = async () => {
  console.log('\n🔍 Testing MongoDB Atlas Connection...\n');
  console.log('Connection String:', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test creating a collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Existing collections (${collections.length}):`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Test write operation
    console.log('\n🧪 Testing write operation...');
    const TestModel = mongoose.model('Test', new mongoose.Schema({ message: String, timestamp: Date }));
    const testDoc = await TestModel.create({ 
      message: 'MongoDB Atlas connection test successful!', 
      timestamp: new Date() 
    });
    console.log('✅ Write operation successful!');
    console.log('   Document ID:', testDoc._id);
    
    // Clean up test collection
    await TestModel.collection.drop();
    console.log('🧹 Cleaned up test collection');
    
    console.log('\n🎉 All tests passed! MongoDB Atlas is ready to use.\n');
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Tip: Check your username and password in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Tip: Check your connection string and internet connection');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Tip: Make sure your IP address is whitelisted in MongoDB Atlas');
      console.error('   Go to: Network Access → Add IP Address → Allow Access from Anywhere');
    }
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed\n');
    process.exit(0);
  }
};

// Run the test
testConnection();
