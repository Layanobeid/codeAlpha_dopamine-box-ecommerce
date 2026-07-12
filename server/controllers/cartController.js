// controllers/cartController.js
const cartService = require("../services/cartService");
const catchAsync = require("../core/catchAsync");

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.json(cart);
});

const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity);
  res.json(cart);
});

const removeFromCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.removeFromCart(req.user.id, productId);
  res.json(cart);
});

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  res.json(cart);
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };