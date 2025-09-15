const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify credentials
router.post("/verify", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user settings
router.put("/settings", async (req, res) => {
  try {
    const { email, name, newEmail } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name || user.name;
    user.email = newEmail || user.email;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;