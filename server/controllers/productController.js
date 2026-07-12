// controllers/productController.js - COMPLETE & FIXED
const productService = require("../services/product.services");
const catchAsync = require("../core/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../core/AppError");

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * Get all products with filtering, sorting, and pagination
 * GET /api/products
 * Query params: page, limit, category, mood, minPrice, maxPrice, sort, search
 */
const getProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 100,
    category,
    mood,
    occasion,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    search,
    isFeatured,
    isCustomizable
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (category) filter.category = category;
  if (mood) filter.mood = mood;
  if (occasion) filter.occasion = occasion;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (isCustomizable !== undefined) filter.isCustomizable = isCustomizable === 'true';
  
  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  
  // Search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const result = await productService.getProducts(
    filter,
    parseInt(page),
    parseInt(limit),
    sort
  );

return ApiResponse.paginated(
  res,
  result.data,
  page,
  limit,
  result.total,
  "Products fetched successfully"
)
});

/**
 * Search products by keyword
 * GET /api/products/search?q=keyword
 */
const searchProducts = catchAsync(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    throw new AppError('Search term must be at least 2 characters', 400);
  }

  const products = await productService.searchProducts(q);
  
  ApiResponse.success(
    res,
    { products, count: products.length },
    `${products.length} products found`
  );
});

/**
 * Get featured products
 * GET /api/products/featured
 */
const getFeatured = catchAsync(async (req, res) => {
  const { limit = 6 } = req.query;
  
  const products = await productService.getFeatured(parseInt(limit));
  
  ApiResponse.success(
    res,
    { products, count: products.length },
    "Featured products fetched successfully"
  );
});

/**
 * Get products by mood
 * GET /api/products/mood/:mood
 */
const getByMood = catchAsync(async (req, res) => {
  const { mood } = req.params;
  const { limit = 10 } = req.query;
  
  const validMoods = ['Happy', 'Excited', 'Loved', 'Grateful', 'Peaceful'];
  if (!validMoods.includes(mood)) {
    throw new AppError(`Invalid mood. Must be one of: ${validMoods.join(', ')}`, 400);
  }

  const products = await productService.getByMood(mood, parseInt(limit));
  
  ApiResponse.success(
    res,
    { products, count: products.length, mood },
    `Products with mood: ${mood}`
  );
});

/**
 * Get products by occasion
 * GET /api/products/occasion/:occasion
 */
const getByOccasion = catchAsync(async (req, res) => {
  const { occasion } = req.params;
  const { limit = 10 } = req.query;
  
  const validOccasions = ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday'];
  if (!validOccasions.includes(occasion)) {
    throw new AppError(`Invalid occasion. Must be one of: ${validOccasions.join(', ')}`, 400);
  }

  const products = await productService.getByOccasion(occasion, parseInt(limit));
  
  ApiResponse.success(
    res,
    { products, count: products.length, occasion },
    `Products for: ${occasion}`
  );
});

/**
 * Get customizable products
 * GET /api/products/customizable
 */
const getCustomizable = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const products = await productService.getCustomizable(parseInt(limit));
  
  ApiResponse.success(
    res,
    { products, count: products.length },
    "Customizable products fetched successfully"
  );
});

/**
 * Get product by ID
 * GET /api/products/:id
 */
const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const product = await productService.getProductById(id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Get related products (same category or mood)
  const relatedProducts = await productService.getRelatedProducts(
  product._id, product.category, 4);

  ApiResponse.success(
    res,
    {
      product,
      related: relatedProducts
    },
    "Product fetched successfully"
  );
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  
  // Validate required fields
  const requiredFields = ['name', 'description', 'price', 'category', 'stock'];
  for (const field of requiredFields) {
    if (!productData[field]) {
      throw new AppError(`Field '${field}' is required`, 400);
    }
  }

  // Check if product with same name exists
  const existingProduct = await productService.getProductByName(productData.name);
  if (existingProduct) {
    throw new AppError('Product with this name already exists', 400);
  }

  const product = await productService.createProduct(productData);
  
  ApiResponse.success(
    res,
    product,
    "Product created successfully",
    201
  );
});

/**
 * Update a product
 * PUT /api/products/:id
 */
const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Check if product exists
  const existingProduct = await productService.getProductById(id);
  if (!existingProduct) {
    throw new AppError('Product not found', 404);
  }

  // Check if name is being changed and if it already exists
  if (updateData.name && updateData.name !== existingProduct.name) {
    const nameExists = await productService.getProductByName(updateData.name);
    if (nameExists) {
      throw new AppError('Product with this name already exists', 400);
    }
  }

  const updatedProduct = await productService.updateProduct(id, updateData);
  
  ApiResponse.success(
    res,
    updatedProduct,
    "Product updated successfully"
  );
});

/**
 * Delete a product
 * DELETE /api/products/:id
 */
const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check if product exists
  const existingProduct = await productService.getProductById(id);
  if (!existingProduct) {
    throw new AppError('Product not found', 404);
  }

  await productService.deleteProduct(id);
  
  ApiResponse.success(
    res,
    null,
    "Product deleted successfully"
  );
});

// ============================================
// ADDITIONAL USEFUL METHODS
// ============================================

/**
 * Get product by slug
 * GET /api/products/slug/:slug
 */
const getProductBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  
  const product = await productService.getProductBySlug(slug);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Get related products
  const relatedProducts = await productService.getRelatedProducts(
    product._id,
    product.category,
    product.mood,
    4
  );

  ApiResponse.success(
    res,
    {
      product,
      related: relatedProducts
    },
    "Product fetched successfully"
  );
});

/**
 * Get product categories with counts
 * GET /api/products/categories/all
 */
const getProductCategories = catchAsync(async (req, res) => {
  const categories = await productService.getCategoriesWithCounts();
  
  ApiResponse.success(
    res,
    categories,
    "Categories fetched successfully"
  );
});

/**
 * Get product stats for admin dashboard
 * GET /api/products/admin/stats
 */
const getProductStats = catchAsync(async (req, res) => {
  const stats = await productService.getProductStats();
  
  ApiResponse.success(
    res,
    stats,
    "Product stats fetched successfully"
  );
});

/**
 * Bulk update products (admin only)
 * PATCH /api/products/bulk
 */
const bulkUpdateProducts = catchAsync(async (req, res) => {
  const { productIds, updateData } = req.body;
  
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    throw new AppError('Product IDs array is required', 400);
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new AppError('Update data is required', 400);
  }

  const result = await productService.bulkUpdateProducts(productIds, updateData);
  
  ApiResponse.success(
    res,
    result,
    `${result.modifiedCount} products updated successfully`
  );
});

/**
 * Update product stock (admin only)
 * PATCH /api/products/:id/stock
 */
const updateStock = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  
  if (stock === undefined || stock === null) {
    throw new AppError('Stock value is required', 400);
  }

  if (stock < 0) {
    throw new AppError('Stock cannot be negative', 400);
  }

  const product = await productService.updateStock(id, stock);
  
  ApiResponse.success(
    res,
    product,
    "Stock updated successfully"
  );
});

/**
 * Get low stock products (admin only)
 * GET /api/products/admin/low-stock
 */
const getLowStockProducts = catchAsync(async (req, res) => {
  const { threshold = 10 } = req.query;
  
  const products = await productService.getLowStockProducts(parseInt(threshold));
  
  ApiResponse.success(
    res,
    {
      products,
      count: products.length,
      threshold: parseInt(threshold)
    },
    "Low stock products fetched successfully"
  );
});

module.exports = {
  // Public methods
  getProducts,
  searchProducts,
  getFeatured,
  getByMood,
  getByOccasion,
  getCustomizable,
  getProductById,
  getProductBySlug,
  getProductCategories,
  
  // Admin methods
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  bulkUpdateProducts,
  updateStock,
  getLowStockProducts
};
