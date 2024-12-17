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
});

module.exports = mongoose.model('NewUser', newUserSchema);