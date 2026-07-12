const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorite.model");
const auth = require("../middleware/auth.middleware");

// ✅ Get user's favorites
router.get("/", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("product");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add to favorites
router.post("/", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if already exists
    const existing = await Favorite.findOne({ user: req.user.id, product: productId });
    if (existing) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    const newFavorite = new Favorite({
      user: req.user.id,
      product: productId,
    });
    const savedFavorite = await newFavorite.save();
    res.status(201).json(savedFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Remove from favorites
router.delete("/:productId", auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId,
    });
    if (!favorite) return res.status(404).json({ message: "Favorite not found" });
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;