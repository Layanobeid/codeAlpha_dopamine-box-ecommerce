// middleware/error.middleware.js - FIXED
const logger = require("../core/logger");

module.exports = (err, req, res, next) => {
  // Log error with details
  logger.error(`🔥 ERROR: ${err.message}`);
  logger.error(`📌 Stack: ${err.stack}`);
  logger.error(`📍 Path: ${req.method} ${req.url}`);
  
  if (req.user) {
    logger.error(`👤 User: ${req.user._id}`);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};