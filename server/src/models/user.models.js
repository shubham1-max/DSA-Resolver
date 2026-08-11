const { model, Schema } = require("mongoose");

const user = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: false,  // Optional — Google-only users won't have a password
  },

  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },

  picture: {
    type: String,  // Google profile photo URL
  },

  streak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },

  totalSolved: {
    type: Number,
    default: 0,
  },

  lastSolvedDate: {
    type: Date,
  },
  
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
},{timestamps:true});

const User = model("user", user);

module.exports = User;
