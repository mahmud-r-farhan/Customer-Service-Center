const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const { initWebSocket } = require("./websocket");

dotenv.config();

const app = express();

const rawOrigins = process.env.frontendURL || process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:3000";
const allowedOrigins = rawOrigins.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
const allowAllOrigins = allowedOrigins.includes("*");

app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header (e.g. curl, server-to-server, same-origin) are allowed.
    if (!origin) return callback(null, true);
    if (allowAllOrigins) return callback(null, true);

    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Trust the first proxy hop (needed behind reverse proxies/load balancers for
// correct client IPs in rate limiting and secure cookies).
app.set("trust proxy", 1);

if (process.env.NODE_ENV !== "test" && process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Centralized error handler (also catches CORS rejection errors)
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  initWebSocket(server);

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });
}

module.exports = app;