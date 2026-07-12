// routes/cartRoute.js - WITH VALIDATION
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth.middleware");
const { validate, cartValidation } = require("./validations/index");

router.use(auth);

router.get("/", cartController.getCart);
router.post("/add", cartValidation.add, validate, cartController.addToCart);
router.delete("/remove", cartValidation.remove, validate, cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;