const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully! 🎉');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Check:');
    console.log('   1. Your IP is whitelisted in Atlas');
    console.log('   2. Password is correct');
    console.log('   3. Internet connection is working');
    process.exit(1);
  }
};

module.exports = connectDB;