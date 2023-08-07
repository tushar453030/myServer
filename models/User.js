const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  loginType: {
    type: String,
    default: "", // Set the default value to an empty string
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
