const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../Model/userModel");
const router = express.Router();
const saltRounds = 10;
const JWT_SCRECT_KEY = process.env.JWT_SCRECT_KEY;

// Handle Error
const handleError = (res, error, status = 400) => {
  return res.status(status).json({ error: error.message || error });
};

// SignUp Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Password Hash
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new User
    const user = new User({
      name,
      email,
      password: passwordHash,
      phone,
    });

    await user.save(); // Save user to Database
    return res
      .status(201)
      .json({ message: "User SignUp Successfully...", user });
  } catch (error) {
    handleError(res, error);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Find User
    const user = await User.findOne({ email });

    // Hash password compare
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return handleError(res, "Password is Invaild!", 404);
    }

    // Genrate jwt token
    const token = jwt.sign({ userId: user._id }, JWT_SCRECT_KEY);

    res.status(200).json({ message: "User Login Successfully...", token });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;