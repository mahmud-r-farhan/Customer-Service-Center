const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: "Too many requests, please try again later." },
});

// Helper to send HttpOnly cookie
function sendTokenCookie(res, user) {
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
  };

  res.cookie("token", token, cookieOptions);
  return token;
}

// Register user
router.post(
  "/register",
  authLimiter,
  [body("name").isLength({ min: 1 }), body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input", errors: errors.array() });
      }

      const { name, password } = req.body;
      const email = req.body.email.trim().toLowerCase();
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      user = new User({ name: name.trim(), email, password });
      await user.save();

      sendTokenCookie(res, user);

      res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed. Please try again." });
    }
  }
);

// Login user
router.post(
  "/login",
  authLimiter,
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input", errors: errors.array() });
      }

      const { password } = req.body;
      const email = req.body.email.trim().toLowerCase();
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      sendTokenCookie(res, user);

      res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Logout - clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out" });
});

// Get current user from token
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("Fetch me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user settings (requires auth)
router.put(
  "/settings",
  auth,
  [body("name").optional().isLength({ min: 1 }), body("newEmail").optional().isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input", errors: errors.array() });
      }

      const { name, newEmail } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (name) user.name = name.trim();
      if (newEmail) {
        const normalizedEmail = newEmail.trim().toLowerCase();
        if (normalizedEmail !== user.email) {
          const existing = await User.findOne({ email: normalizedEmail });
          if (existing) {
            return res.status(400).json({ message: "Email is already in use" });
          }
          user.email = normalizedEmail;
        }
      }

      await user.save();

      // Refresh the auth cookie so the token payload reflects any changes
      sendTokenCookie(res, user);

      res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      console.error("Settings update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;