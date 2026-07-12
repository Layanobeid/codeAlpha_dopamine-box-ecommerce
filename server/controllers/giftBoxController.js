 //controllers/giftBoxController.js - COMPLETE
const giftBoxService =require("../services/giftBoxServices");
const catchAsync = require("../core/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../core/AppError");

// ============================================
// USER ROUTES
// ============================================

/**
 * Create a custom gift box
 * POST /api/giftboxes/create
 */
const createGiftBox = catchAsync(async (req, res) => {
  const { items, customization, name, occasion, message } = req.body;
  const userId = req.user.id;

  // Validate items
  if (!items || items.length === 0) {
    throw new AppError('Please select at least one item for your gift box', 400);
  }

  if (items.length > 5) {
    throw new AppError('Maximum 5 items per gift box', 400);
  }

  const giftBox = await giftBoxService.createGiftBox({
    userId,
    items,
    customization,
    name,
    occasion,
    message
  });

  ApiResponse.success(
    res,
    giftBox,
    '🎁 Gift box created successfully!',
    201
  );
});

/**
 * Get user's gift boxes
 * GET /api/giftboxes/my-boxes
 */
const getMyGiftBoxes = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user.id;

  const result = await giftBoxService.getUserGiftBoxes(
    userId,
    parseInt(page),
    parseInt(limit),
    status
  );

  ApiResponse.paginated(
    res,
    result.giftBoxes,
    parseInt(page),
    parseInt(limit),
    result.total,
    'Your gift boxes fetched successfully'
  );
});

/**
 * Get gift box by ID
 * GET /api/giftboxes/:id
 */
const getGiftBoxById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const giftBox = await giftBoxService.getGiftBoxById(id, userId, userRole);

  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Check if user owns this gift box or is admin
  if (giftBox.user._id.toString() !== userId && userRole !== 'admin') {
    throw new AppError('You do not have permission to view this gift box', 403);
  }

  ApiResponse.success(
    res,
    giftBox,
    'Gift box fetched successfully'
  );
});

/**
 * Update gift box
 * PUT /api/giftboxes/:id
 */
const updateGiftBox = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, occasion, message, items } = req.body;

  // Check if gift box exists and user owns it
  const existingGiftBox = await giftBoxService.getGiftBoxById(id, userId, 'client');
  
  if (!existingGiftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Check if gift box can be edited (not ordered yet)
  if (existingGiftBox.status === 'ordered' || existingGiftBox.status === 'delivered') {
    throw new AppError('Cannot edit gift box after it has been ordered or delivered', 400);
  }

  const updatedGiftBox = await giftBoxService.updateGiftBox(id, {
    name,
    occasion,
    message,
    items
  });

  ApiResponse.success(
    res,
    updatedGiftBox,
    '✅ Gift box updated successfully!'
  );
});

/**
 * Delete gift box
 * DELETE /api/giftboxes/:id
 */
const deleteGiftBox = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if gift box exists and user owns it
  const giftBox = await giftBoxService.getGiftBoxById(id, userId, 'client');
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Check if gift box can be deleted
  if (giftBox.status === 'ordered' || giftBox.status === 'delivered') {
    throw new AppError('Cannot delete gift box after it has been ordered', 400);
  }

  await giftBoxService.deleteGiftBox(id);

  ApiResponse.success(
    res,
    null,
    '🗑️ Gift box deleted successfully'
  );
});

/**
 * Order gift box (convert to order)
 * POST /api/giftboxes/:id/order
 */
const orderGiftBox = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  // Check if gift box exists and user owns it
  const giftBox = await giftBoxService.getGiftBoxById(id, userId, 'client');
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  // Check if gift box is already ordered
  if (giftBox.status === 'ordered' || giftBox.status === 'delivered') {
    throw new AppError('This gift box has already been ordered', 400);
  }

  // Validate items are still in stock
  await giftBoxService.validateStock(giftBox.items);

  const order = await giftBoxService.orderGiftBox(
    id,
    userId,
    shippingAddress,
    paymentMethod
  );

  ApiResponse.success(
    res,
    order,
    '🎁 Gift box ordered successfully!',
    201
  );
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Get all gift boxes (admin only)
 * GET /api/giftboxes/
 */
const getAllGiftBoxes = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status,
    userId,
    fromDate,
    toDate,
    sort = '-createdAt'
  } = req.query;

  const filter = {};
  
  if (status) filter.status = status;
  if (userId) filter.user = userId;
  
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const result = await giftBoxService.getAllGiftBoxes(
    filter,
    parseInt(page),
    parseInt(limit),
    sort
  );

  ApiResponse.paginated(
    res,
    result.giftBoxes,
    parseInt(page),
    parseInt(limit),
    result.total,
    'All gift boxes fetched successfully'
  );
});

/**
 * Update gift box status (admin only)
 * PATCH /api/giftboxes/:id/status
 */
const updateGiftBoxStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'ready', 'ordered', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    throw new AppError(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      400
    );
  }

  const giftBox = await giftBoxService.updateStatus(id, status);

  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  ApiResponse.success(
    res,
    giftBox,
    `✅ Gift box status updated to: ${status}`
  );
});

/**
 * Get gift box statistics (admin only)
 * GET /api/giftboxes/stats/admin
 */
const getGiftBoxStats = catchAsync(async (req, res) => {
  const stats = await giftBoxService.getGiftBoxStats();

  ApiResponse.success(
    res,
    stats,
    'Gift box statistics fetched successfully'
  );
});

// ============================================
// ADDITIONAL USEFUL METHODS
// ============================================

/**
 * Get gift box templates (pre-made gift boxes)
 * GET /api/giftboxes/templates
 */
const getTemplates = catchAsync(async (req, res) => {
  const templates = await giftBoxService.getTemplates();
  
  ApiResponse.success(
    res,
    templates,
    'Gift box templates fetched successfully'
  );
});

/**
 * Add gift box to favorites
 * POST /api/giftboxes/:id/favorite
 */
const addToFavorites = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if gift box exists
  const giftBox = await giftBoxService.getGiftBoxById(id, userId, 'client');
  
  if (!giftBox) {
    throw new AppError('Gift box not found', 404);
  }

  await giftBoxService.addToFavorites(id, userId);

  ApiResponse.success(
    res,
    null,
    '✅ Gift box added to favorites'
  );
});

/**
 * Remove gift box from favorites
 * DELETE /api/giftboxes/:id/favorite
 */
const removeFromFavorites = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await giftBoxService.removeFromFavorites(id, userId);

  ApiResponse.success(
    res,
    null,
    '🗑️ Gift box removed from favorites'
  );
});

module.exports = {
  // User routes
  createGiftBox,
  getMyGiftBoxes,
  getGiftBoxById,
  updateGiftBox,
  deleteGiftBox,
  orderGiftBox,
  
  // Admin routes
  getAllGiftBoxes,
  updateGiftBoxStatus,
  getGiftBoxStats,
  
  // Additional methods
  getTemplates,
  addToFavorites,
  removeFromFavorites
};