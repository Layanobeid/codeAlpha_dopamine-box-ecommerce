// services/giftBoxServices.js - COMPLETE
const GiftBox = require("../models/giftBox.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Customization = require("../models/customization.model");
const User =require("../models/User.model");
const AppError = require("../core/appError");
const logger = require("../core/logger");

/**
 * Create a new gift box
 */
const createGiftBox = async ({
  userId,
  items,
  customization,
  name,
  occasion,
  message
}) => {
  // Validate and calculate total price
  let totalPrice = 0;
  const boxItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${product.name}`, 400);
    }

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    boxItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      name: product.name,
    });
  }

  // Create customization if provided
  let customizationData = null;
  if (customization && Object.keys(customization).length > 0) {
    customizationData = await Customization.create({
      product: boxItems[0].product,
      text: customization.text || '',
      color: customization.color || '#FF6B6B',
      image: customization.image || '',
      font: customization.font || 'Arial',
      size: customization.size || 'medium',
    });
  }

  // Create Gift Box
  const giftBox = await GiftBox.create({
    user: userId,
    name: name || 'My Dopamine Box',
    items: boxItems,
    totalPrice,
    occasion: occasion || 'Just Because',
    message: message || '',
    customization: customizationData?._id || null,
    status: 'pending',
  });

  // Populate the response
  const populatedGiftBox = await GiftBox.findById(giftBox._id)
    .populate('user', 'fullName email phone')
    .populate('items.product')
    .populate('customization')
    .lean();

  logger.info(`🎁 Gift box created: ${giftBox._id} by user ${userId}`);
  
  return populatedGiftBox;
};

/**
 * Get user's gift boxes
 */
const getUserGiftBoxes = async (userId, page = 1, limit = 10, status = null) => {
  const skip = (page - 1) * limit;
  
  const filter = { user: userId };
  if (status) filter.status = status;

  const [giftBoxes, total] = await Promise.all([
    GiftBox.find(filter)
      .populate('user', 'fullName email phone')
      .populate('items.product')
      .populate('customization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    GiftBox.countDocuments(filter)
  ]);

  return {
    giftBoxes,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Get gift box by ID
 */
const getGiftBoxById = async (id, userId = null, userRole = 'client') => {
  const giftBox = await GiftBox.findById(id)
    .populate('user', 'fullName email phone address')
    .populate('items.product')
    .populate('customization')
    .lean();

  if (!giftBox) {
    return null;
  }

  // Check permissions
  if (userId && userRole !== 'admin') {
    if (giftBox.user._id.toString() !== userId) {
      throw new AppError('You do not have permission to view this gift box', 403);
    }
  }

  return giftBox;
};

/**
 * Update gift box
 */
const updateGiftBox = async (id, updateData) => {
  const { name, occasion, message, items } = updateData;

  const giftBox = await GiftBox.findById(id);
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Update basic fields
  if (name) giftBox.name = name;
  if (occasion) giftBox.occasion = occasion;
  if (message !== undefined) giftBox.message = message;

  // Update items if provided
  if (items && items.length > 0) {
    let totalPrice = 0;
    const boxItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Not enough stock for ${product.name}`, 400);
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      boxItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    giftBox.items = boxItems;
    giftBox.totalPrice = totalPrice;
  }

  await giftBox.save();

  // Populate and return
  const populatedGiftBox = await GiftBox.findById(giftBox._id)
    .populate('user', 'fullName email phone')
    .populate('items.product')
    .populate('customization')
    .lean();

  logger.info(`🔄 Gift box updated: ${id}`);
  
  return populatedGiftBox;
};

/**
 * Delete gift box
 */
const deleteGiftBox = async (id) => {
  const giftBox = await GiftBox.findByIdAndDelete(id);
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Delete associated customization if exists
  if (giftBox.customization) {
    await Customization.findByIdAndDelete(giftBox.customization);
  }

  logger.info(`🗑️ Gift box deleted: ${id}`);
  
  return giftBox;
};

/**
 * Validate stock for gift box items
 */
const validateStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      throw new AppError(`Product ${item.name} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Not enough stock for ${product.name}. Available: ${product.stock}`,
        400
      );
    }
  }
  
  return true;
};

/**
 * Order gift box (convert to order)
 */
const orderGiftBox = async (id, userId, shippingAddress, paymentMethod) => {
  const giftBox = await GiftBox.findById(id);
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Validate stock
  await validateStock(giftBox.items);

  // Update product stock
  for (const item of giftBox.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Create order
  const order = await Order.create({
    user: userId,
    items: giftBox.items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    })),
    totalPrice: giftBox.totalPrice,
    status: 'pending',
    isGiftBox: true,
    giftBoxId: giftBox._id,
    shippingAddress,
    paymentMethod,
    orderDate: new Date()
  });

  // Update gift box status
  giftBox.status = 'ordered';
  giftBox.orderedAt = new Date();
  await giftBox.save();

  // Populate order
  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'fullName email phone')
    .populate('items.product')
    .populate('giftBoxId')
    .lean();

  logger.info(`📦 Gift box ordered: ${id} -> Order: ${order._id}`);
  
  return populatedOrder;
};

/**
 * Get all gift boxes (admin)
 */
const getAllGiftBoxes = async (filter = {}, page = 1, limit = 20, sort = '-createdAt') => {
  const skip = (page - 1) * limit;

  const [giftBoxes, total] = await Promise.all([
    GiftBox.find(filter)
      .populate('user', 'fullName email phone')
      .populate('items.product')
      .populate('customization')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    GiftBox.countDocuments(filter)
  ]);

  return {
    giftBoxes,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Update gift box status (admin)
 */
const updateStatus = async (id, status) => {
  const giftBox = await GiftBox.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true
    }
  )
  .populate('user', 'fullName email')
  .populate('items.product')
  .populate('customization')
  .lean();

  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  logger.info(`📌 Gift box ${id} status updated to: ${status}`);
  
  return giftBox;
};

/**
 * Get gift box statistics (admin)
 */
const getGiftBoxStats = async () => {
  const [
    total,
    byStatus,
    totalRevenue,
    avgPrice,
    byOccasion,
    recent,
    userStats
  ] = await Promise.all([
    GiftBox.countDocuments(),
    GiftBox.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    GiftBox.aggregate([
      { $match: { status: { $in: ['ordered', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    GiftBox.aggregate([
      { $group: { _id: null, avg: { $avg: '$totalPrice' } } }
    ]),
    GiftBox.aggregate([
      { $group: { _id: '$occasion', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    GiftBox.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullName email')
      .lean(),
    GiftBox.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.fullName',
          email: '$user.email',
          giftBoxCount: '$count'
        }
      }
    ])
  ]);

  return {
    total,
    byStatus,
    byOccasion,
    revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    averagePrice: avgPrice.length > 0 ? Math.round(avgPrice[0].avg * 100) / 100 : 0,
    recentGiftBoxes: recent,
    topUsers: userStats
  };
};

/**
 * Get gift box templates
 */
const getTemplates = async () => {
  // Pre-made gift box templates
  const templates = [
    {
      name: 'Birthday Celebration Box',
      description: 'Perfect for birthdays! Includes cake, candles, and party supplies.',
      occasion: 'Birthday',
      image: '/images/templates/birthday-box.jpg',
      items: [
        { productId: 'product1', quantity: 1 },
        { productId: 'product2', quantity: 1 }
      ]
    },
    {
      name: 'Romantic Love Box',
      description: 'Show your love with this romantic gift box.',
      occasion: 'Anniversary',
      image: '/images/templates/love-box.jpg',
      items: [
        { productId: 'product3', quantity: 1 },
        { productId: 'product4', quantity: 1 }
      ]
    },
    {
      name: 'Self-Care Box',
      description: 'Treat yourself with this self-care box.',
      occasion: 'Just Because',
      image: '/images/templates/selfcare-box.jpg',
      items: [
        { productId: 'product5', quantity: 1 },
        { productId: 'product6', quantity: 1 }
      ]
    }
  ];

  return templates;
};

/**
 * Add gift box to favorites
 */
const addToFavorites = async (giftBoxId, userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if already in favorites
  if (user.wishlist.includes(giftBoxId)) {
    throw new AppError('Gift box already in favorites', 400);
  }

  user.wishlist.push(giftBoxId);
  await user.save();

  return user;
};

/**
 * Remove gift box from favorites
 */
const removeFromFavorites = async (giftBoxId, userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.wishlist = user.wishlist.filter(
    id => id.toString() !== giftBoxId
  );
  await user.save();

  return user;
};

module.exports = {
  createGiftBox,
  getUserGiftBoxes,
  getGiftBoxById,
  updateGiftBox,
  deleteGiftBox,
  validateStock,
  orderGiftBox,
  getAllGiftBoxes,
  updateStatus,
  getGiftBoxStats,
  getTemplates,
  addToFavorites,
  removeFromFavorites
};