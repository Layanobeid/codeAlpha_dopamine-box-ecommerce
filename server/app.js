// app.js - FINAL VERSION WITH PROPER CORS
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");
const logger = require("./core/logger");
const path = require("path");
const MONGODB_URI = 'mongodb+srv://layanobeid30_db_user:rPHOeybWvlFQZLSG@cluster0.ibzl2tk.mongodb.net/ecommerce'; // Replace <db_password> with your actual password
const app = express();
const messageRoutes = require('./routes/messageRoutes');
// ============================================
// ⭐⭐⭐ CORS - MUST BE FIRST ⭐⭐⭐
// ============================================
const allowedOrigins = [
   'https://dopaminebox11.netlify.app',
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5501",
  "http://localhost:5502",
  "http://127.0.0.1:5502",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// ✅ CUSTOM CORS MIDDLEWARE - Overrides everything
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow specific origins
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log("✅ CORS allowed: ${origin}");
  } else if (origin) {
    console.log("❌ CORS blocked: ${origin}");
  }

  
  // Set all CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development
}));

// ============================================
// Body Parsers
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Rate Limiting
// ============================================
//app.use(rateLimiter);

// ============================================
// Static Files
// ============================================
app.use(express.static(path.join(__dirname, "client")));

// ============================================
// Routes
// ============================================
app.get("/", (req, res) => {
  res.send("🎁 Dopamine Box API is running!");
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🎁 Dopamine Box API v1.0",
    cors: "✅ CORS enabled",
    allowedOrigins: allowedOrigins
  });
});

// API Routes
app.use('/api/messages', messageRoutes);
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/reviews", require("./routes/reviewRoute"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/favorites", require("./routes/favoriteRoute"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/order-histories", require("./routes/orderHistoryRoute"));
app.use("/api/payments", require("./routes/paymentRoute"));
app.use("/api/coupons", require("./routes/couponRoute"));
app.use("/api/shippings", require("./routes/shippingRoute"));
app.use("/api/contact-messages", require("./routes/contactMessageRoute"));
app.use("/api/notifications", require("./routes/notificationRoute"));
app.use("/api/customizations", require("./routes/customizationRoute"));
app.use("/api/giftbox", require("./routes/giftBoxRoute"));
app.use(
  "/images",
  express.static(path.join(__dirname, "../client/assets/images"))
);


app.use('/images', express.static(path.join(__dirname, 'public/images'), {
    maxAge: 0, // لا تخزن في الـ Cache
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}));
// Fallback for any image requests - generates a placeholder if file not found
app.get('/images/products/:filename', (req, res) => {
    const filename = req.params.filename;
    const name = filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
    
    // Check if file exists in client/assets/images/products
    const fs = require('fs');
    const filePath = path.join(__dirname, 'client/assets/images/products', filename);
    
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
  });
// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route ${req.method} ${req.url} not found"
  });
});

// ============================================
// Error Handler (LAST)
// ============================================
app.use(errorHandler);
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));
// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Server running on http://localhost:${PORT}");
      console.log("✅ API Docs: http://localhost:${PORT}/api");
      console.log("✅ CORS enabled for: ${allowedOrigins.join(', ')}");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed: ${err.message}");
    process.exit(1);
  });
