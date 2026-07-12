// routes/giftBoxRoute.js - COMPLETE & UPDATED
const express = require("express");
const router = express.Router();
const giftBoxController = require("../controllers/giftBoxController");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/adminMiddleware");
const { validate, giftBoxValidation } = require("./validations/index");

// ============================================
// USER ROUTES - Authentication required
// ============================================

// Create gift box
router.post(
  "/create",
  auth,
  giftBoxValidation.create,
  validate,
  giftBoxController.createGiftBox
);

// Get user's gift boxes
router.get(
  "/my-boxes",
  auth,
  giftBoxController.getMyGiftBoxes
);

// Get gift box templates (public or user)
router.get(
  "/templates",
  auth,
  giftBoxController.getTemplates
);

// Add gift box to favorites
router.post(
  "/:id/favorite",
  auth,
  giftBoxValidation.id,
  validate,
  giftBoxController.addToFavorites
);

// Remove gift box from favorites
router.delete(
  "/:id/favorite",
  auth,
  giftBoxValidation.id,
  validate,
  giftBoxController.removeFromFavorites
);

// Get single gift box by ID
router.get(
  "/:id",
  auth,
  giftBoxValidation.id,
  validate,
  giftBoxController.getGiftBoxById
);

// Update gift box
router.put(
  "/:id",
  auth,
  giftBoxValidation.id,
  giftBoxValidation.update,
  validate,
  giftBoxController.updateGiftBox
);

// Delete gift box
router.delete(
  "/:id",
  auth,
  giftBoxValidation.id,
  validate,
  giftBoxController.deleteGiftBox
);

// Order gift box
router.post(
  "/:id/order",
  auth,
  giftBoxValidation.id,
  validate,
  giftBoxController.orderGiftBox
);

// ============================================
// ADMIN ROUTES - Authentication + Admin required
// ============================================

// Get all gift boxes (admin)
router.get(
  "/admin/all",
  auth,
  admin,
  giftBoxController.getAllGiftBoxes
);

// Update gift box status (admin)
router.patch(
  "/admin/:id/status",
  auth,
  admin,
  giftBoxValidation.id,
  giftBoxValidation.status,
  validate,
  giftBoxController.updateGiftBoxStatus
);

// Get gift box statistics (admin)
router.get(
  "/admin/stats",
  auth,
  admin,
  giftBoxController.getGiftBoxStats
);

module.exports = router;