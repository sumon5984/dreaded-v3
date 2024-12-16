 const mongoose = require('mongoose');


const groupSettingsSchema = new mongoose.Schema({
  jid: {
    type: String,
    required: true,
    unique: true 
  },
  antilink: {
    type: Boolean,
    default: false
  },
antispam: {
    type: Boolean,
    default: false
  },
  antidelete: {
    type: Boolean,
    default: true
  },
  events: {
    type: Boolean,
    default: true
  },
  antitag: {
    type: Boolean,
    default: true
  },
  gcpresence: {
    type: Boolean,
    default: true
  },
antiforeign: {
    type: Boolean,
    default: true
  },
  antidemote: {
    type: Boolean,
    default: false 
  },
  antipromote: {
    type: Boolean,
    default: false 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


groupSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('GroupSettings', groupSettingsSchema);