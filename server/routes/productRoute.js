// routes/productRoute.js - WITH VALIDATION
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/adminMiddleware");
const { validate, productValidation } = require("./validations/index");

// Public routes
router.get("/", productValidation.query, validate, productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/featured", productController.getFeatured);
router.get("/mood/:mood", productController.getByMood);
router.get("/occasion/:occasion", productController.getByOccasion);
router.get("/customizable", productController.getCustomizable);
router.get("/:id", productValidation.id, validate, productController.getProductById);

// Admin routes
router.post("/", auth, admin, productValidation.create, validate, productController.createProduct);
router.put("/:id", auth, admin, productValidation.id, productValidation.update, validate, productController.updateProduct);
router.delete("/:id", auth, admin, productValidation.id, validate, productController.deleteProduct);

module.exports = router;