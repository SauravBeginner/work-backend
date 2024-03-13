const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  isFirst: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  // googleId: {
  //   type: String,
  //   unique: true,
  //   lowercase: true,
  //   required: true,
  // },
});

module.exports = mongoose.model("User", userSchema);
