const express = require("express");
const router = express.Router();

const OrderHistory = require("../models/orderHistory.model");

// Get all order history
router.get("/", async (req, res) => {
  try {
    const orders = await OrderHistory.find().populate("user").populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;