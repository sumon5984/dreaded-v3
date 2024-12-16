const mongoose = require('mongoose');
const { mongoURI } = require('../config');

const connectToDB = async () => {
  if (!mongoURI || mongoURI.trim() === '') {
    throw new Error('No Mongo URL found, Please fill in the MONGO_URI var with a valid database connection string.');
  }

  if (mongoose.connection.readyState !== 0) {
    return; 
  }

  await mongoose.connect(mongoURI);
  
};

module.exports = { connectToDB };