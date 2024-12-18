const mongoose = require('mongoose');
const { mongoURI } = require('../config');

const connectToDB = async () => {
  if (!mongoURI || mongoURI.trim() === '') {
    throw new Error('No Mongo URL found. Please fill in the MONGO_URI var with a valid database connection string.');
  }

  if (mongoose.connection.readyState !== 0) {
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = { connectToDB };