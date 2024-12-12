const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "User Name must be Unique"],
    required: [true, "User Name must be Required"],
  },
  email: {
    type: String,
    unique: [true, "Email must be Unique"],
    required: [true, "Email must be Required"],
  },
  password: {
    type: String,
    required: [true, "Password must be Required"],
  },
  phone: {
    type: String,
    unique: [true, "Phone Number must be Unique"],
    required: [true, "Phone Number must be Required"],
  },
});

const User = mongoose.model("User", userSchema); //  Model
module.exports = User;
