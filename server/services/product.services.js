// services/product.services.js - COMPLETE
const Product = require("../models/product.model");
const AppError = require("../core/AppError");

// ============================================
// PUBLIC METHODS
// ============================================

const getProducts = async (filter = {}, page = 1, limit = 20, sort = '-createdAt') => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort(sort).lean(),
    Product.countDocuments(filter)
  ]);
  return { data, total };
};

const getProductById = async (id) => {
  const product = await Product.findById(id).lean();
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

const getProductByName = async (name) => {
  return await Product.findOne({ name }).lean();
};

const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).lean();
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).lean();
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

const searchProducts = async (query) => {
  return await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).limit(20).lean();
};

// ============================================
// SPECIALTY QUERIES
// ============================================

const getFeatured = async (limit = 6) => {
  return await Product.find({ isFeatured: true })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};

const getByMood = async (mood, limit = 10) => {
  return await Product.find({ mood })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};

const getByOccasion = async (occasion, limit = 10) => {
  return await Product.find({ occasion })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};

const getCustomizable = async (limit = 10) => {
  return await Product.find({ isCustomizable: true })
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};

// ✅ دالة المنتجات المشابهة (المعدلة)
const getRelatedProducts = async (productId, category, limit = 4) => {
  try {
    const safeLimit = Math.min(Number(limit) || 4, 20);
    
    const related = await Product.find({
      category: category,
      _id: { $ne: productId }
    })
    .limit(safeLimit)
    .lean();
    
    return related;
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
};

// ============================================
// ADMIN METHODS
// ============================================

const getCategoriesWithCounts = async () => {
  return await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

const getProductStats = async () => {
  const [total, featured, lowStock, categoryStats] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isFeatured: true }),
    Product.countDocuments({ stock: { $lt: 10 } }),
    Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);
  
  return { total, featured, lowStock, categories: categoryStats };
};

const bulkUpdateProducts = async (productIds, updateData) => {
  return await Product.updateMany(
    { _id: { $in: productIds } },
    { $set: updateData }
  );
};

const updateStock = async (id, stock) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { stock },
    { new: true, runValidators: true }
  ).lean();
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

const getLowStockProducts = async (threshold = 10) => {
  return await Product.find({ stock: { $lt: threshold } })
    .sort({ stock: 1 })
    .lean();
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Public
  getProducts,
  getProductById,
  getProductByName,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  
  // Specialty
  getFeatured,
  getByMood,
  getByOccasion,
  getCustomizable,
  getRelatedProducts,
  
  // Admin
  getCategoriesWithCounts,
  getProductStats,
  bulkUpdateProducts,
  updateStock,
  getLowStockProducts
};
