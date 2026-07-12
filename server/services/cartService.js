const Cart = require("../models/cart.model");

// GET CART
const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

// ADD TO CART
const addToCart = async (userId, productId, quantity = 1) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
    return cart;
  }

  const itemIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return cart;
};

// REMOVE ITEM
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) return null;

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  return cart;
};

// CLEAR CART
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = [];
  await cart.save();
  return cart;
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};