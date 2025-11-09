const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createTestPlayers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the coach user
    const coach = await User.findOne({ email: 'rajesh.kumar@swishfit.com' });
    
    if (!coach) {
      console.log('❌ Coach user not found! Please run createCoachUser.js first.');
      await mongoose.connection.close();
      return;
    }

    console.log(`✅ Found coach: ${coach.name} (${coach._id})`);

    // Check if test players already exist
    const existingPlayers = await User.find({ 
      email: { $in: ['player1@swishfit.com', 'player2@swishfit.com', 'player3@swishfit.com'] } 
    });

    if (existingPlayers.length > 0) {
      console.log(`\n⚠️  ${existingPlayers.length} test player(s) already exist!`);
      console.log('Existing players:');
      existingPlayers.forEach(p => {
        console.log(`  - ${p.name} (${p.email}) - Coach: ${p.coachId ? 'Assigned' : 'Not assigned'}`);
      });
      
      // Update them to be assigned to the coach
      const updateResult = await User.updateMany(
        { email: { $in: ['player1@swishfit.com', 'player2@swishfit.com', 'player3@swishfit.com'] } },
        { $set: { coachId: coach._id } }
      );
      
      console.log(`\n✅ Updated ${updateResult.modifiedCount} player(s) to be assigned to coach`);
      await mongoose.connection.close();
      return;
    }

    // Create test players
    const testPlayers = [
      {
        name: 'Alex Johnson',
        email: 'player1@swishfit.com',
        password: 'Player123!',
        role: 'player',
        coachId: coach._id,
        phoneNumber: '9876543211',
        skillLevel: 'beginner',
        dateOfBirth: new Date('2005-03-15'),
        height: 175,
        weight: 70,
        position: 'point-guard',
        yearsOfExperience: 2,
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'player2@swishfit.com',
        password: 'Player123!',
        role: 'player',
        coachId: coach._id,
        phoneNumber: '9876543212',
        skillLevel: 'intermediate',
        dateOfBirth: new Date('2004-07-20'),
        height: 168,
        weight: 62,
        position: 'shooting-guard',
        yearsOfExperience: 4,
        isActive: true
      },
      {
        name: 'Rahul Patel',
        email: 'player3@swishfit.com',
        password: 'Player123!',
        role: 'player',
        coachId: coach._id,
        phoneNumber: '9876543213',
        skillLevel: 'advanced',
        dateOfBirth: new Date('2003-11-10'),
        height: 188,
        weight: 82,
        position: 'power-forward',
        yearsOfExperience: 6,
        isActive: true
      }
    ];

    const createdPlayers = await User.insertMany(testPlayers);

    console.log('\n✅ Test players created successfully!');
    console.log(`\n📋 Total players assigned to ${coach.name}: ${createdPlayers.length}`);
    console.log('\n👥 Player Details:');
    createdPlayers.forEach((player, index) => {
      console.log(`\n${index + 1}. ${player.name}`);
      console.log(`   Email: ${player.email}`);
      console.log(`   Password: Player123!`);
      console.log(`   Skill Level: ${player.skillLevel}`);
      console.log(`   Position: ${player.position}`);
      console.log(`   Coach: ${coach.name}`);
    });

    console.log('\n\n🎉 Setup complete! You can now:');
    console.log('   1. Generate AI workouts for specific players');
    console.log('   2. Assign workouts to all players');
    console.log('   3. Track player progress');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating test players:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createTestPlayers();
