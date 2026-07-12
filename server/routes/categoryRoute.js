const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/adminMiddleware");

// ✅ Public - Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Public - Get category by id
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Admin only - Create category
router.post("/", auth, admin, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Admin only - Update category
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Admin only - Delete category
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;