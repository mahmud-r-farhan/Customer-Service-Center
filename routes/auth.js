const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide all required fields" 
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(201).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Registration failed. Please try again." 
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/settings", auth, async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(req.user.userId, { name, email }, { new: true })
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

