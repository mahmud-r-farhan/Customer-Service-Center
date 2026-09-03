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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow connection with credentials enabled
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

const PORT = process.env.PORT || 5000;
let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  initWebSocket(server);
}

module.exports = app;