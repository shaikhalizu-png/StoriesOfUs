const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/storiesofus';

const users = [
  { name: 'Aliza Shaikh', email: 'aliza@storiesofus.com', password: 'Aliza@123' },
  { name: 'Aira Shaikh', email: 'aira@storiesofus.com', password: 'Aira@123' },
  { name: 'Emaan Shaikh', email: 'emaan@storiesofus.com', password: 'EmaanIsTheBest' },
  { name: 'Nadia Shaikh', email: 'nadia@storiesofus.com', password: 'Nadia@123' }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    // Make all users friends with each other
    for (const user of createdUsers) {
      const otherUsers = createdUsers.filter(u => u._id.toString() !== user._id.toString());
      user.friends = otherUsers.map(u => u._id);
      await user.save();
      console.log(`Added ${otherUsers.length} friends for ${user.name}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    users.forEach(u => {
      console.log(`  ${u.name}: ${u.email} / ${u.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();

