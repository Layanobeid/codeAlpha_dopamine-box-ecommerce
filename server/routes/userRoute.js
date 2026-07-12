// server/routes/userRoute.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.model"); // ← FIXED: lowercase u

// 🔹 Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Create user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const userData = savedUser.toObject();
    delete userData.password;
    
    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔹 Update user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔹 Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;