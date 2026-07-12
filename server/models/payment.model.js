const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
    