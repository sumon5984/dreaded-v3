const mongoose = require('mongoose');
const NewUser = require('./Schemas/Userschema');
const { connectToDB } = require('./loadDb');

connectToDB();

const createUser = async (userId) => {
  if (!userId || userId.trim() === '') {
    console.error('Error creating user: Invalid or empty userId');
    return;
  }

  try {
    const existingUser = await NewUser.findOne({ jid: userId });
    if (existingUser) {
      return existingUser;
    }

    const newUser = new NewUser({
      jid: userId,
      banned: false,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

const getUser = async (userId) => {
  try {
    await connectToDB();
    const user = await NewUser.findOne({ jid: userId });
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
      console.error(`User ${userId} not found in database. Unable to determine banned status.`);
      return null;
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

  try {
    await connectToDB();

    let user = await NewUser.findOne({ jid: userId });

    if (!user) {
      user = new NewUser({
        jid: userId,
        banned: true,
        banReason: 'calling',
      });
    } else if (!user.banned) {
      user.banned = true;
      user.banReason = 'calling';
    }

    await user.save();

    await client.rejectCall(call.content[0].attrs['call-id'], userId);
  } catch (error) {
    console.error(`Error handling call from ${userId}:`, error.message);
  }
};


const getTotalUsers = async () => {
  try {
    const totalUsers = await NewUser.countDocuments();
    return totalUsers;
  } catch (error) {
    console.error('Error fetching total users:', error.message);
    return 0;
  }
};

const getBannedUsers = async () => {
  try {
    const bannedUsers = await NewUser.find({ banned: true }, 'jid banReason');  
    const bannedCount = bannedUsers.length;
    return { bannedCount, bannedUsers };
  } catch (error) {
    console.error('Error fetching banned users:', error.message);
    return { bannedCount: 0, bannedUsers: [] };
  }
};

module.exports = { 
  createUser, 
  getUser, 
  isUserBanned, 
  handleCallAndBan,
  getTotalUsers,  
  getBannedUsers
};