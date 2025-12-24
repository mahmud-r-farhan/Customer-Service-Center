const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Prefer cookie (HttpOnly), but accept Authorization header as fallback
    const cookieToken = req.cookies?.token;
    const authHeader = req.header("Authorization");
    const headerToken = authHeader ? authHeader.replace("Bearer ", "").trim() : null;

    const token = cookieToken || headerToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expiredAt: error.expiredAt });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;