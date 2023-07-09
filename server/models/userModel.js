const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    webId: { type: Number, required: true },
    numOfActions: { type: Number, default: 0 },
    actionCount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const User = mongoose.model('user', userSchema, 'users');

module.exports = User;



