const mongoose = require('mongoose');
const { mongoURI } = require('../config');

const connectToDB = async () => {
  if (!mongoURI || mongoURI.trim() === '') {
    console.log('No Mongo URL found, please fill the URL.');
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB. . .');
    }
  } catch (error) {
    console.log('Failed to connect to MongoDB. Please check the Mongo URI');
    console.error(error.message);
  }
};

module.exports = { connectToDB };