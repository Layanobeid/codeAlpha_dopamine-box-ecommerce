// server/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dopamine_box_secret_key_2024');
    
    // Find user by userId or id
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User no longer exists" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }
    console.error('Auth error:', error);
    return res.status(401).json({ 
      success: false,
      message: "Authentication failed" 
    });
  }
};

module.exports = auth;
