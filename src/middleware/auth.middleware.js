const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/*
  protect middleware
  - Reads JWT token from cookie
  - Verifies it
  - Attaches user to req.user
  - Calls next() if valid, else returns 401
*/
const protect = async (req, res, next) => {
  try {
    // ✅ Read token from HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. No token found."
      });
    }

    // ✅ Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user from DB (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found. Token invalid."
      });
    }

    // ✅ Attach user to request object
    req.user = user;

    next(); // Continue to the actual route handler

  } catch (error) {

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    return res.status(500).json({ message: "Server error in auth middleware." });
  }
};

module.exports = protect;