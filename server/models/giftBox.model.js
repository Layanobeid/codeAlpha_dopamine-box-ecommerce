const mongoose = require('mongoose');

const giftBoxSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: 'My Dopamine Box',
      trim: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    occasion: {
      type: String,
      enum: ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday', 'Other'],
      default: 'Just Because',
    },
    message: {
      type: String,
      maxlength: 500,
      default: '',
    },
    customization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customization',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'ordered', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
giftBoxSchema.index({ user: 1, status: 1 });
giftBoxSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GiftBox', giftBoxSchema);