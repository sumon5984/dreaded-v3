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
});


module.exports = mongoose.model('NewUser', newUserSchema); 