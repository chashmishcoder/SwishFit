const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createCoachUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if coach already exists
    const existingCoach = await User.findOne({ email: 'coach@swishfit.com' });
    
    if (existingCoach) {
      console.log('Coach user already exists!');
      console.log('Email: coach@swishfit.com');
      console.log('Password: Coach123!');
      await mongoose.connection.close();
      return;
    }

    // Create coach user
    const coach = await User.create({
      name: 'Coach Mike',
      email: 'coach@swishfit.com',
      password: 'Coach123!',
      role: 'coach',
      phoneNumber: '+91-9876543210',
      skillLevel: 'advanced',
      dateOfBirth: new Date('1985-05-15'),
      height: 185,
      weight: 80,
      position: 'Shooting Guard',
      yearsOfExperience: 15,
      bio: 'Experienced basketball coach specializing in shooting and offensive strategies.',
      isActive: true
    });

    console.log('✅ Coach user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Email: coach@swishfit.com');
    console.log('Password: Coach123!');
    console.log('\n👤 Coach Details:');
    console.log('Name:', coach.name);
    console.log('Role:', coach.role);
    console.log('ID:', coach._id);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating coach user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createCoachUser();
