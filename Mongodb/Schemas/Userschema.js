const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  banReason: {
    type: String,
    default: null,
  },
  messages: [
    {
      sender: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  logs: [
    {
      author: {
        type: String,
        enum: ['client', 'system'],
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
      loggedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  geminiErrorNotified: {  
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('NewUser', newUserSchema);