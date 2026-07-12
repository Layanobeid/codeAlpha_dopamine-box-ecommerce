// services/user.service.js - NEW FILE
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const getUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    User.find().skip(skip).limit(limit).select("-password"),
    User.countDocuments()
  ]);
  return { data, total };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const updateUser = async (id, data) => {
  // Remove sensitive fields that shouldn't be updated here
  delete data.password;
  delete data.role; // Role should be updated via admin only
  
  const user = await User.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).select("-password");
  
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const createUser = async (data) => {
  const { email, password } = data;
  
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already exists", 400);
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    ...data,
    password: hashedPassword
  });
  
  return user.toObject();
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
};