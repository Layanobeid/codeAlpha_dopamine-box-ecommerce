// services/auth.service.js
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateToken = require("../utils/jwt");

// REGISTER
const register = async ({ fullName, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  const hashed = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashed,
  });

  return {
    user,
    token: generateToken(user),
  };
};

// LOGIN
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return {
    user,
    token: generateToken(user),
  };
};

module.exports = { register, login };