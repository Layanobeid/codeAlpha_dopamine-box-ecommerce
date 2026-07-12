// validations/index.js - NEW FILE
const { body, param, query, validationResult } = require("express-validator");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ==================== USER VALIDATIONS ====================
const userValidation = {
  register: [
    body("fullName")
      .notEmpty().withMessage("Full name is required")
      .isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters")
      .trim(),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage("Password must contain at least one letter and one number")
  ],
  login: [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("Password is required")
  ],
  update: [
    body("fullName")
      .optional()
      .isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters")
      .trim(),
    body("email")
      .optional()
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    body("phone")
      .optional()
      .matches(/^[0-9+\-\s()]*$/).withMessage("Invalid phone number format")
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid ID format")
  ]
};

// ==================== PRODUCT VALIDATIONS ====================
const productValidation = {
  create: [
    body("name")
      .notEmpty().withMessage("Product name is required")
      .isLength({ min: 3, max: 200 }).withMessage("Name must be between 3 and 200 characters")
      .trim(),
    body("description")
      .notEmpty().withMessage("Description is required")
      .isLength({ min: 10 }).withMessage("Description must be at least 10 characters")
      .trim(),
    body("price")
      .notEmpty().withMessage("Price is required")
      .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category")
      .notEmpty().withMessage("Category is required")
      .isIn(['MUGS', 'PERFUMES', 'GIFTBOXES', 'SOUVENIRS', 'TREND BOX', 'TREND MUGS', 'BOXES'])
      .withMessage("Invalid category"),
    body("stock")
      .notEmpty().withMessage("Stock is required")
      .isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
    body("mood")
      .optional()
      .isIn(['Happy', 'Excited', 'Loved', 'Grateful', 'Peaceful'])
      .withMessage("Invalid mood"),
    body("occasion")
      .optional()
      .isIn(['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday'])
      .withMessage("Invalid occasion")
  ],
  update: [
    body("name")
      .optional()
      .isLength({ min: 3, max: 200 }).withMessage("Name must be between 3 and 200 characters")
      .trim(),
    body("price")
      .optional()
      .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock")
      .optional()
      .isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
    body("mood")
      .optional()
      .isIn(['Happy', 'Excited', 'Loved', 'Grateful', 'Peaceful'])
      .withMessage("Invalid mood"),
    body("occasion")
      .optional()
      .isIn(['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday'])
      .withMessage("Invalid occasion")
  ],
  query: [
    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("Page must be a positive integer")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
      .toInt(),
    query("category")
      .optional()
      .isIn(['MUGS', 'PERFUMES', 'GIFTBOXES', 'SOUVENIRS', 'TREND BOX', 'TREND MUGS', 'BOXES'])
      .withMessage("Invalid category"),
    query("mood")
      .optional()
      .isIn(['Happy', 'Excited', 'Loved', 'Grateful', 'Peaceful'])
      .withMessage("Invalid mood"),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 }).withMessage("Minimum price must be a positive number")
      .toFloat(),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 }).withMessage("Maximum price must be a positive number")
      .toFloat()
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid product ID format")
  ]
};

// ==================== CART VALIDATIONS ====================
const cartValidation = {
  add: [
    body("productId")
      .notEmpty().withMessage("Product ID is required")
      .isMongoId().withMessage("Invalid product ID format"),
    body("quantity")
      .optional()
      .isInt({ min: 1, max: 99 }).withMessage("Quantity must be between 1 and 99")
      .toInt()
  ],
  remove: [
    body("productId")
      .notEmpty().withMessage("Product ID is required")
      .isMongoId().withMessage("Invalid product ID format")
  ]
};

// ==================== GIFT BOX VALIDATIONS ====================
const giftBoxValidation = {
  create: [
    body("items")
      .isArray({ min: 1, max: 5 }).withMessage("Must have between 1 and 5 items")
      .custom(items => {
        for (const item of items) {
          if (!item.productId) throw new Error("Each item must have a productId");
          if (!mongoose.Types.ObjectId.isValid(item.productId)) {
            throw new Error("Invalid product ID format");
          }
          if (!item.quantity || item.quantity < 1) {
            throw new Error("Each item must have a positive quantity");
          }
        }
        return true;
      }),
    body("customization")
      .optional()
      .isObject().withMessage("Customization must be an object"),
    body("name")
      .optional()
      .isLength({ max: 100 }).withMessage("Name must be less than 100 characters")
      .trim(),
    body("occasion")
      .optional()
      .isIn(['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday', 'Other'])
      .withMessage("Invalid occasion"),
    body("message")
      .optional()
      .isLength({ max: 500 }).withMessage("Message must be less than 500 characters")
  ],
  update: [
    body("name")
      .optional()
      .isLength({ max: 100 }).withMessage("Name must be less than 100 characters")
      .trim(),
    body("occasion")
      .optional()
      .isIn(['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Just Because', 'Holiday', 'Other'])
      .withMessage("Invalid occasion"),
    body("message")
      .optional()
      .isLength({ max: 500 }).withMessage("Message must be less than 500 characters"),
    body("items")
      .optional()
      .isArray({ min: 1, max: 5 }).withMessage("Must have between 1 and 5 items")
  ],
  status: [
    body("status")
      .notEmpty().withMessage("Status is required")
      .isIn(['pending', 'processing', 'ready', 'ordered', 'delivered', 'cancelled'])
      .withMessage("Invalid status")
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid gift box ID format")
  ]
};

// ==================== ORDER VALIDATIONS ====================
const orderValidation = {
  status: [
    body("status")
      .notEmpty().withMessage("Status is required")
      .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
      .withMessage("Invalid status")
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid order ID format")
  ],
  query: [
    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("Page must be a positive integer")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50")
      .toInt(),
    query("status")
      .optional()
      .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
      .withMessage("Invalid status")
  ]
};

// ==================== REVIEW VALIDATIONS ====================
const reviewValidation = {
  create: [
    body("product")
      .notEmpty().withMessage("Product ID is required")
      .isMongoId().withMessage("Invalid product ID format"),
    body("rating")
      .notEmpty().withMessage("Rating is required")
      .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
      .toInt(),
    body("comment")
      .notEmpty().withMessage("Comment is required")
      .isLength({ min: 3, max: 500 }).withMessage("Comment must be between 3 and 500 characters")
      .trim()
  ],
  update: [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
      .toInt(),
    body("comment")
      .optional()
      .isLength({ min: 3, max: 500 }).withMessage("Comment must be between 3 and 500 characters")
      .trim()
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid review ID format")
  ]
};

// ==================== CATEGORY VALIDATIONS ====================
const categoryValidation = {
  create: [
    body("name")
      .notEmpty().withMessage("Category name is required")
      .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
      .trim(),
    body("description")
      .optional()
      .isLength({ max: 500 }).withMessage("Description must be less than 500 characters")
      .trim()
  ],
  update: [
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
      .trim(),
    body("description")
      .optional()
      .isLength({ max: 500 }).withMessage("Description must be less than 500 characters")
      .trim()
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid category ID format")
  ]
};

// ==================== COUPON VALIDATIONS ====================
const couponValidation = {
  create: [
    body("code")
      .notEmpty().withMessage("Coupon code is required")
      .isLength({ min: 3, max: 20 }).withMessage("Code must be between 3 and 20 characters")
      .matches(/^[A-Z0-9]+$/).withMessage("Code must contain only uppercase letters and numbers")
      .trim(),
    body("discount")
      .notEmpty().withMessage("Discount is required")
      .isFloat({ min: 0.01, max: 100 }).withMessage("Discount must be between 0.01 and 100"),
    body("expiryDate")
      .notEmpty().withMessage("Expiry date is required")
      .isISO8601().withMessage("Invalid date format")
      .custom(value => {
        if (new Date(value) < new Date()) {
          throw new Error("Expiry date must be in the future");
        }
        return true;
      })
  ],
  update: [
    body("code")
      .optional()
      .isLength({ min: 3, max: 20 }).withMessage("Code must be between 3 and 20 characters")
      .matches(/^[A-Z0-9]+$/).withMessage("Code must contain only uppercase letters and numbers")
      .trim(),
    body("discount")
      .optional()
      .isFloat({ min: 0.01, max: 100 }).withMessage("Discount must be between 0.01 and 100"),
    body("expiryDate")
      .optional()
      .isISO8601().withMessage("Invalid date format")
      .custom(value => {
        if (new Date(value) < new Date()) {
          throw new Error("Expiry date must be in the future");
        }
        return true;
      }),
    body("isActive")
      .optional()
      .isBoolean().withMessage("isActive must be a boolean")
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid coupon ID format")
  ]
};

// ==================== CONTACT VALIDATIONS ====================
const contactValidation = {
  create: [
    body("name")
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
      .trim(),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    body("subject")
      .optional()
      .isLength({ max: 200 }).withMessage("Subject must be less than 200 characters")
      .trim(),
    body("message")
      .notEmpty().withMessage("Message is required")
      .isLength({ min: 10, max: 2000 }).withMessage("Message must be between 10 and 2000 characters")
      .trim()
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid contact message ID format")
  ]
};

// ==================== SHIPPING VALIDATIONS ====================
const shippingValidation = {
  create: [
    body("fullName")
      .notEmpty().withMessage("Full name is required")
      .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
      .trim(),
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .matches(/^[0-9+\-\s()]*$/).withMessage("Invalid phone number format"),
    body("address")
      .notEmpty().withMessage("Address is required")
      .isLength({ min: 5, max: 500 }).withMessage("Address must be between 5 and 500 characters")
      .trim(),
    body("city")
      .notEmpty().withMessage("City is required")
      .isLength({ min: 2, max: 50 }).withMessage("City must be between 2 and 50 characters")
      .trim(),
    body("country")
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage("Country must be between 2 and 50 characters")
      .trim(),
    body("postalCode")
      .optional()
      .matches(/^[0-9]{4,10}$/).withMessage("Invalid postal code format")
  ],
  update: [
    body("fullName")
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
      .trim(),
    body("phone")
      .optional()
      .matches(/^[0-9+\-\s()]*$/).withMessage("Invalid phone number format"),
    body("address")
      .optional()
      .isLength({ min: 5, max: 500 }).withMessage("Address must be between 5 and 500 characters")
      .trim(),
    body("city")
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage("City must be between 2 and 50 characters")
      .trim()
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid shipping ID format")
  ]
};

// ==================== NOTIFICATION VALIDATIONS ====================
const notificationValidation = {
  create: [
    body("message")
      .notEmpty().withMessage("Message is required")
      .isLength({ min: 1, max: 500 }).withMessage("Message must be between 1 and 500 characters")
      .trim(),
    body("user")
      .notEmpty().withMessage("User ID is required")
      .isMongoId().withMessage("Invalid user ID format")
  ],
  update: [
    body("isRead")
      .optional()
      .isBoolean().withMessage("isRead must be a boolean")
  ],
  id: [
    param("id")
      .isMongoId().withMessage("Invalid notification ID format")
  ]
};

// ==================== FAVORITE VALIDATIONS ====================
const favoriteValidation = {
  create: [
    body("productId")
      .notEmpty().withMessage("Product ID is required")
      .isMongoId().withMessage("Invalid product ID format")
  ],
  id: [
    param("productId")
      .isMongoId().withMessage("Invalid product ID format")
  ]
};

module.exports = {
  validate,
  userValidation,
  productValidation,
  cartValidation,
  giftBoxValidation,
  orderValidation,
  reviewValidation,
  categoryValidation,
  couponValidation,
  contactValidation,
  shippingValidation,
  notificationValidation,
  favoriteValidation
};