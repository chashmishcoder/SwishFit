/**
 * Create Admin User Script
 * Run this script to create an admin user in the database
 * 
 * Usage: node createAdminUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Admin user credentials
const adminData = {
  name: 'Admin User',
  email: 'admin@swishfit.com',
  password: 'Admin123!',
  role: 'admin',
  phoneNumber: '9999999999',
  skillLevel: 'advanced',
  isActive: true
};

/**
 * Create admin user
 */
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminData.email);
      console.log('Admin User Details:');
      console.log('- Name:', existingAdmin.name);
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      console.log('- Active:', existingAdmin.isActive);
      
      // Ask if user wants to update password
      console.log('\nIf you want to reset the password, delete the existing admin and run this script again.');
      process.exit(0);
    }

    // Create new admin user
    console.log('\nCreating admin user...');
    const admin = await User.create(adminData);
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    ', adminData.email);
    console.log('Password: ', adminData.password);
    console.log('Role:     ', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    console.log('\nYou can now login at: http://localhost:5173/login\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 11000) {
      console.error('\n⚠️  A user with this email already exists.');
      console.error('Please use a different email or delete the existing user first.');
    }
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the script
createAdminUser();
