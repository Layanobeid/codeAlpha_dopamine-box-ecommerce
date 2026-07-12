const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later",
});

module.exports = rateLimiter;