// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['MUGS', 'PERFUMES', 'GIFTBOXES', 'SOUVENIRS', 'TREND BOX', 'TREND MUGS', 'BOXES']
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  },
  // ✅ إضافات جديدة للتصميم
  image: {
    type: String,
    default: ""
  },
  images: [{
    type: String
  }],
  occasion: {
    type: String,
    enum: ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // ✅ خاصية Dopamine Box
  mood: {
    type: String,
    enum: ['Happy', 'Excited', 'Loved', 'Grateful', 'Peaceful']
  },
  // ✅ للهدايا المخصصة
  isCustomizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    text: { type: Boolean, default: false },
    color: { type: Boolean, default: false },
    image: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);