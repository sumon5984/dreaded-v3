const mongoose = require('mongoose');
const NewUser = require('./Schemas/Userschema');
const { mongoURI } = require('../settings');

const connectToDB = async () => {
  if (!mongoURI || mongoURI.trim() === '') {
    console.error('No Mongo URL found, please fill the URL.');
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB. Please check the Mongo URI');
    console.error(error.message);
  }
};

const createUser = async (userId) => {
  if (!userId || userId.trim() === '') {
    console.error('Error creating user: Invalid or empty userId');
    return;
  }

  console.log(`Attempting to create user with userId: ${userId}`);

  try {
    await connectToDB();

    const existingUser = await NewUser.findOne({ jid: userId });
    if (existingUser) {
      console.log(`User already exists: ${userId}`);
      return existingUser;
    }

    const newUser = new NewUser({
      jid: userId,
      banned: false,
    });

    await newUser.save();
    console.log(`Created new user: ${userId}`);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

const getUser = async (userId) => {
  try {
    await connectToDB();
    const user = await NewUser.findOne({ jid: userId });
    if (user) {
      console.log(`User found: ${userId}`);
    } else {
      console.log(`User not found: ${userId}`);
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
};

const isUserBanned = async (userId) => {
  try {
    const user = await getUser(userId);

    if (!user) {
      console.log(`User ${userId} not found in database. Unable to determine banned status.`);
      return null;
    }

    if (user.banned) {
      console.log(`User ${userId} is banned.`);
    } else {
      console.log(`User ${userId} is not banned.`);
    }

    return user.banned;
  } catch (error) {
    console.error('Error checking if user is banned:', error.message);
    throw error;
  }
};

const handleCallAndBan = async (call, client) => {
  const userId = call.content[0]?.attrs['call-creator'];

  if (!userId) {
    console.error('No user ID found in the call object.');
    return;
  }

  console.log(`Received call from: ${userId}`);

  try {
    await connectToDB();

    let user = await NewUser.findOne({ jid: userId });

    if (!user) {
      console.log(`User ${userId} not found. Creating user and banning them.`);
      user = new NewUser({
        jid: userId,
        banned: true,
        banReason: 'calling',
      });
    } else if (!user.banned) {
      console.log(`User ${userId} found. Updating banned status.`);
      user.banned = true;
      user.banReason = 'calling';
    } else {
      console.log(`User ${userId} is already banned. Reason: ${user.banReason || 'No reason provided'}`);
    }

    await user.save();

    await client.rejectCall(call.content[0].attrs['call-id'], userId);
    console.log(`Call rejected and user ${userId} banned for calling.`);
  } catch (error) {
    console.error(`Error handling call from ${userId}:`, error.message);
  }
};

module.exports = { createUser, getUser, isUserBanned, handleCallAndBan }; 