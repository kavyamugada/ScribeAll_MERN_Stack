const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scribeall');
    console.log('🍃 Connected to MongoDB Ledger successfully.');
  } catch (err) {
    console.error('❌ MongoDB Connection Failure:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;