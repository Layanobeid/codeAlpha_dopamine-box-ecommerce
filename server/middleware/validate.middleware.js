// middleware/validate.middleware.js - ENHANCED
const { body, param, query, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules
const validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number").isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("category").notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
];

const validateUser = [
  body("fullName").notEmpty().withMessage("Full name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const validateGiftBox = [
  body("items").isArray({ min: 1 }).withMessage("At least one item required").custom((items) => {
    if (items.length > 5) throw new Error("Maximum 5 items allowed");
    return true;
  }),
];

module.exports = { validate, validateProduct, validateUser, validateGiftBox };