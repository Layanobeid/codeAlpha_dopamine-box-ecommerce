const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ============================================
// 📦 MODELS - تأكدي من المسارات الصحيحة
// ============================================
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const Coupon = require("../models/Coupon.model");

// ============================================
// 📝 LOGGER (بديل بسيط)
// ============================================
const logger = {
  info: (msg) => console.log(msg),
  error: (msg) => console.error(msg),
};

// ============================================
// 🌱 SEED FUNCTION
// ============================================
const seedDatabase = async () => {
  try {
    // 📡 الاتصال بقاعدة البيانات
    const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env");
      console.log("💡 Add MONGO_URI to your .env file");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    logger.info("📦 Connected to MongoDB");

    // ============================================
    // 1. CLEAR EXISTING DATA
    // ============================================
    logger.info("🗑️ Clearing existing data...");
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      Coupon.deleteMany(),
    ]);
    logger.info("✅ Existing data cleared");

    // ============================================
    // 2. CREATE ADMIN USER
    // ============================================
    logger.info("👤 Creating admin user...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@dopaminebox.com",
      password: adminPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
      phone: "+961 70 000 000"
    });
    logger.info(`✅ Admin created: ${admin.email}`);

    // ============================================
    // 3. CREATE REGULAR USER
    // ============================================
    logger.info("👤 Creating regular user...");
    const userPassword = await bcrypt.hash("User@123456", 10);
    const user = await User.create({
      fullName: "Test User",
      email: "user@dopaminebox.com",
      password: userPassword,
      role: "user",
      isVerified: true,
      isActive: true,
      phone: "+961 70 000 001"
    });
    logger.info(`✅ User created: ${user.email}`);

    // ============================================
    // 4. CREATE CATEGORIES
    // ============================================
    logger.info("📂 Creating categories...");
    const categories = await Category.insertMany([
      {
        name: "MUGS",
        description: "Beautiful mugs to brighten your day",
        image: "/images/categories/mugs.jpg"
      },
      {
        name: "PERFUMES",
        description: "Luxurious fragrances for every mood",
        image: "/images/categories/perfumes.jpg"
      },
      {
        name: "GIFTBOXES",
        description: "Curated gift boxes for special moments",
        image: "/images/categories/giftboxes.jpg"
      },
      {
        name: "SOUVENIRS",
        description: "Memorable keepsakes and collectibles",
        image: "/images/categories/souvenirs.jpg"
      },
      {
        name: "TREND BOX",
        description: "Trending items in one box",
        image: "/images/categories/trend-box.jpg"
      },
      {
        name: "TREND MUGS",
        description: "Trendy mugs for modern lifestyles",
        image: "/images/categories/trend-mugs.jpg"
      },
      {
        name: "BOXES",
        description: "Elegant boxes for all occasions",
        image: "/images/categories/boxes.jpg"
      }
    ]);
    logger.info(`✅ ${categories.length} categories created`);

    // ============================================
    // 5. CREATE PRODUCTS
    // ============================================
    logger.info("📦 Creating products...");
    const products = await Product.insertMany([
      // --- MUGS ---
      {
        name: "Good Vibes Only Ceramic Mug",
        description: "White ceramic mug with pink handle and retro rainbow flower design.",
        price: 12.99,
        category: "MUGS",
        stock: 50,
        image: "/images/products/good-vibes-mug.jpg",
        images: ["/images/products/good-vibes-mug.jpg"],
        mood: "Happy",
        isFeatured: true,
      },
      {
        name: "Hugging Couple Mugs",
        description: "Set of two ceramic mugs designed to hug each other, perfect for couples.",
        price: 24.50,
        category: "MUGS",
        stock: 30,
        image: "/images/products/hug-mugs.jpg",
        images: ["/images/products/hug-mugs.jpg"],
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false },
        occasion: "Anniversary",
        mood: "Loved"
      },
      {
        name: "Smiley Face Mug Set (5 Pcs)",
        description: "Set of 5 pastel mugs with cute expressions.",
        price: 35.00,
        category: "MUGS",
        stock: 20,
        image: "/images/products/smiley-mugs.jpg",
        images: ["/images/products/smiley-mugs.jpg"],
        mood: "Happy",
        isFeatured: true
      },
      {
        name: "Strawberry Ceramic Mug",
        description: "Red strawberry-shaped ceramic mug with green leaf details.",
        price: 15.00,
        category: "MUGS",
        stock: 45,
        image: "/images/products/strawberry-mug.jpg",
        images: ["/images/products/strawberry-mug.jpg"],
      },
      {
        name: "Pumpkin Soup Mug with Lid",
        description: "Orange ceramic mug shaped like a pumpkin with a green stem lid.",
        price: 16.50,
        category: "MUGS",
        stock: 25,
        image: "/images/products/pumpkin-mug.jpg",
        images: ["/images/products/pumpkin-mug.jpg"],
      },
      {
        name: "Lemon Ceramic Mug",
        description: "Bright yellow lemon-shaped ceramic mug with a green leaf handle.",
        price: 14.00,
        category: "MUGS",
        stock: 30,
        image: "/images/products/lemon-mug.jpg",
        images: ["/images/products/lemon-mug.jpg"],
      },
      {
        name: "Teddy Bear Glass Mug",
        description: "Adorable clear glass mug shaped like a teddy bear.",
        price: 13.50,
        category: "MUGS",
        stock: 40,
        image: "/images/products/bear-mug.jpg",
        images: ["/images/products/bear-mug.jpg"],
        mood: "Excited"
      },
      {
        name: "Cloud Pattern Pink Cup & Saucer",
        description: "Cute pink ceramic cup with white cloud patterns and matching saucer.",
        price: 18.00,
        category: "MUGS",
        stock: 25,
        image: "/images/products/cloud-cup.jpg",
        images: ["/images/products/cloud-cup.jpg"],
      },
      {
        name: "Lemon Ceramic Set",
        description: "Refreshing yellow ceramic bowl, plates, and creamer featuring 3D lemon designs.",
        price: 32.00,
        category: "MUGS",
        stock: 15,
        image: "/images/products/lemon-ceramic-set.jpg",
        images: ["/images/products/lemon-ceramic-set.jpg"],
      },
      // --- TREND MUGS ---
      {
        name: "Bubble Boba Glass Mug",
        description: "Trendy clear glass mug shaped like a bubble cluster, perfect for iced coffee.",
        price: 11.00,
        category: "TREND MUGS",
        stock: 60,
        image: "/images/products/bubble-mug.jpg",
        images: ["/images/products/bubble-mug.jpg"],
        mood: "Excited"
      },
      {
        name: "Pink Bow Glass Tumblers (Set of 2)",
        description: "Clear glass tumblers with elegant 3D pink bow details.",
        price: 18.00,
        category: "TREND MUGS",
        stock: 40,
        image: "/images/products/bow-glasses.jpg",
        images: ["/images/products/bow-glasses.jpg"],
        mood: "Loved"
      },
      {
        name: "Butterfly Ceramic Teacup",
        description: "Elegant white ceramic cup with a 3D blue butterfly on the side.",
        price: 20.00,
        category: "TREND MUGS",
        stock: 35,
        image: "/images/products/butterfly-cup.jpg",
        images: ["/images/products/butterfly-cup.jpg"],
      },
      {
        name: "Coquette Bow & Heart Mug Set",
        description: "Charming white and pink ceramic mugs with painted bows and hearts.",
        price: 28.00,
        category: "TREND MUGS",
        stock: 20,
        image: "/images/products/bow-mugs.jpg",
        images: ["/images/products/bow-mugs.jpg"],
      },
      // --- PERFUMES ---
      {
        name: "Mini Luxury Perfume Set (4 Pcs)",
        description: "A luxury gift set featuring mini versions of Miss Dior, Daisy, My Way, and YSL.",
        price: 85.00,
        category: "PERFUMES",
        stock: 10,
        image: "/images/products/perfume-box.jpg",
        images: ["/images/products/perfume-box.jpg"],
        isFeatured: true,
        occasion: "Birthday"
      },
      {
        name: "Butterfly Perfume Spray",
        description: "A small 10ml perfume spray attached to a beautiful pink butterfly card.",
        price: 8.00,
        category: "PERFUMES",
        stock: 100,
        image: "/images/products/butterfly-perfume.jpg",
        images: ["/images/products/butterfly-perfume.jpg"],
        occasion: "Just Because"
      },
      // --- GIFTBOXES ---
      {
        name: "Bride to Be Gift Box",
        description: "The perfect bridal shower gift: sleep mask, tumbler, journal, scrunchie, and skincare.",
        price: 55.00,
        category: "GIFTBOXES",
        stock: 15,
        image: "/images/products/bride-box.jpg",
        images: ["/images/products/bride-box.jpg"],
        isFeatured: true,
        occasion: "Wedding",
        mood: "Loved",
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false }
      },
      {
        name: "Pink Stationery Gift Box",
        description: "Aesthetic pink workspace set: journal, pencil case, cute stickers, bookmark, and hair clip.",
        price: 25.00,
        category: "GIFTBOXES",
        stock: 30,
        image: "/images/products/stationery-box.jpg",
        images: ["/images/products/stationery-box.jpg"],
        mood: "Happy"
      },
      {
        name: "Maid of Honor Lavender Box",
        description: "A luxurious lilac box: silk robe, candle, tea, jewelry set, and sleep mask.",
        price: 70.00,
        category: "GIFTBOXES",
        stock: 10,
        image: "/images/products/maid-box.jpg",
        images: ["/images/products/maid-box.jpg"],
        occasion: "Wedding",
        mood: "Grateful",
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false }
      },
      {
        name: "Happy Birthday Celebration Box",
        description: "Birthday cake candle, bath bomb, gold sparkler candles, and a greeting card.",
        price: 32.00,
        category: "GIFTBOXES",
        stock: 20,
        image: "/images/products/birthday-box.jpg",
        images: ["/images/products/birthday-box.jpg"],
        occasion: "Birthday",
        mood: "Happy",
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false }
      },
      {
        name: "Best Dad Luxury Set",
        description: "Premium brown leather gift set: glasses case, wallet, keychain, and pen.",
        price: 45.00,
        category: "GIFTBOXES",
        stock: 12,
        image: "/images/products/dad-box.jpg",
        images: ["/images/products/dad-box.jpg"],
        occasion: "Holiday",
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false }
      },
      {
        name: "Mom Lavender Spa Box",
        description: "Pampering box for mom: lavender candle, bath salts, nail polish, and face masks.",
        price: 38.00,
        category: "GIFTBOXES",
        stock: 18,
        image: "/images/products/mom-box.jpg",
        images: ["/images/products/mom-box.jpg"],
        occasion: "Holiday",
        mood: "Peaceful"
      },
      {
        name: "Self Care Pink Box",
        description: "Hydration tumbler, gratitude journal, heart necklace, candle, and scrunchie.",
        price: 40.00,
        category: "GIFTBOXES",
        stock: 22,
        image: "/images/products/selfcare-box.jpg",
        images: ["/images/products/selfcare-box.jpg"],
        mood: "Peaceful",
        isFeatured: true
      },
      {
        name: "Stars & Saffron Luxury Box",
        description: "Elegant pink and gold box: rose gold tumbler, candle, rose bath salts, and dried flowers.",
        price: 65.00,
        category: "GIFTBOXES",
        stock: 8,
        image: "/images/products/stars-box.jpg",
        images: ["/images/products/stars-box.jpg"],
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false }
      },
      {
        name: "Pink Striped Pajama Set Box",
        description: "Cozy striped pajamas, gratitude journal, Rhode lip balm, and cute accessories in one gift box.",
        price: 48.00,
        category: "GIFTBOXES",
        stock: 15,
        image: "/images/products/pajama-box.jpg",
        images: ["/images/products/pajama-box.jpg"],
        mood: "Peaceful"
      },
      // --- SOUVENIRS ---
      {
        name: "Ceramic Chicken Basket for Eggs",
        description: "White ceramic chicken lid top over a black wire basket, perfect for storing fresh eggs.",
        price: 22.00,
        category: "SOUVENIRS",
        stock: 25,
        image: "/images/products/basketforegg.jpg",
        images: ["/images/products/basketforegg.jpg"],
        mood: "Happy",
        occasion: "Just Because"
      },
      {
        name: "Beauty and the Beast Teapot & Cup",
        description: "Charming Mrs. Potts and Chip teapot and cup set featuring cartoon expressions.",
        price: 30.00,
        category: "SOUVENIRS",
        stock: 10,
        image: "/images/products/beauty-teapot.jpg",
        images: ["/images/products/beauty-teapot.jpg"],
        mood: "Loved"
      },
      {
        name: "Lemon Tea Set Collection",
        description: "Beautiful teapot, creamer, and sugar bowl shaped like yellow lemons with green leaves.",
        price: 42.00,
        category: "SOUVENIRS",
        stock: 10,
        image: "/images/products/lemon-set.jpg",
        images: ["/images/products/lemon-set.jpg"],
        occasion: "Just Because"
      },
      {
        name: "Strawberry Ceramic Set",
        description: "Full set of red strawberry ceramic plates, bowls, and cups.",
        price: 55.00,
        category: "SOUVENIRS",
        stock: 8,
        image: "/images/products/strawberry-set.jpg",
        images: ["/images/products/strawberry-set.jpg"],
        mood: "Happy"
      },
      {
        name: "Pink Heart Kitchen Canisters",
        description: "Set of elegant cream and pink ceramic canisters with embossed hearts.",
        price: 48.00,
        category: "SOUVENIRS",
        stock: 12,
        image: "/images/products/heart-canisters.jpg",
        images: ["/images/products/heart-canisters.jpg"],
      },
      {
        name: "Teddy Bear Kitchen Tool Holder",
        description: "Brown ceramic bear holding a strawberry, holding a whisk and spatula.",
        price: 18.00,
        category: "SOUVENIRS",
        stock: 25,
        image: "/images/products/teddy-holder.jpg",
        images: ["/images/products/teddy-holder.jpg"],
        mood: "Happy"
      },
      {
        name: "Tulip Flower Soap Dish",
        description: "Pink ceramic tulip-shaped soap dish holding a bar of soap.",
        price: 12.00,
        category: "SOUVENIRS",
        stock: 40,
        image: "/images/products/tulip-soap.jpg",
        images: ["/images/products/tulip-soap.jpg"],
      },
      {
        name: "Pink Bow Keychain",
        description: "Gold enamel keychain with a large pink bow and heart tag.",
        price: 6.00,
        category: "SOUVENIRS",
        stock: 75,
        image: "/images/products/bow-keychain.jpg",
        images: ["/images/products/bow-keychain.jpg"],
      },
      {
        name: "Resin Letter L Keychain",
        description: "Pink resin keychain with gold foil letter L and a heart, perfect for Valentine's.",
        price: 7.00,
        category: "SOUVENIRS",
        stock: 50,
        image: "/images/products/l-keychain.jpg",
        images: ["/images/products/l-keychain.jpg"],
        occasion: "Anniversary",
        mood: "Loved"
      },
      {
        name: "SpongeBob Sponge Holder",
        description: "Fun 3D SpongeBob character holder designed to hold your kitchen sponges.",
        price: 8.50,
        category: "SOUVENIRS",
        stock: 100,
        image: "/images/products/spongebob-holder.jpg",
        images: ["/images/products/spongebob-holder.jpg"],
        mood: "Excited"
      },
      {
        name: "Islamic Resin Coaster Set",
        description: "Beautiful resin coasters with floral accents, Arabic calligraphy, and inspirational quotes.",
        price: 15.00,
        category: "SOUVENIRS",
        stock: 30,
        image: "/images/products/islamic-coaster.jpg",
        images: ["/images/products/islamic-coaster.jpg"],
        mood: "Peaceful"
      },
      {
        name: "Pink Tea & Coffee Canister Set",
        description: "Elegant pink and gold ceramic canisters labeled Tea, Sugar, and Coffee.",
        price: 35.00,
        category: "SOUVENIRS",
        stock: 10,
        image: "/images/products/tea-canisters.jpg",
        images: ["/images/products/tea-canisters.jpg"],
      },
      // --- BOXES ---
      {
        name: "Clear Acrylic Wedding Money Box",
        description: "Elegant transparent acrylic box with ring holders and decorated with artificial flowers.",
        price: 60.00,
        category: "BOXES",
        stock: 5,
        image: "/images/products/wedding-box.jpg",
        images: ["/images/products/wedding-box.jpg"],
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false },
        occasion: "Wedding"
      },
      {
        name: "Tuxedo Paper Gift Bag",
        description: "Fancy black and white gift bag designed to look like a tuxedo, complete with personalized initial patches.",
        price: 15.00,
        category: "BOXES",
        stock: 20,
        image: "/images/products/tuxedo-bag.jpg",
        images: ["/images/products/tuxedo-bag.jpg"],
        occasion: "Wedding"
      },
      {
        name: "Pearl Mirror Ring Tray",
        description: "Round mirror tray surrounded by pearls, used for displaying wedding rings.",
        price: 25.00,
        category: "BOXES",
        stock: 15,
        image: "/images/products/mirror-tray.jpg",
        images: ["/images/products/mirror-tray.jpg"],
        occasion: "Wedding"
      },
      {
        name: "Pearl & Gold Ring Box Display",
        description: "Luxurious gold hexagonal ring boxes displayed on a pearl-adorned mirror base with Arabic script.",
        price: 28.00,
        category: "BOXES",
        stock: 12,
        image: "/images/products/arabic-ring-box.jpg",
        images: ["/images/products/arabic-ring-box.jpg"],
        occasion: "Wedding"
      },
      {
        name: "Bespoke Men's Gift Set (Mr)",
        description: "Black leather wallet, keychain, and pen set with custom gold 'Mr' and name tag.",
        price: 35.00,
        category: "BOXES",
        stock: 20,
        image: "/images/products/mr-set.jpg",
        images: ["/images/products/mr-set.jpg"],
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false },
        occasion: "Anniversary"
      },
      {
        name: "Bespoke Men's Gift Set (Best Dad)",
        description: "Brown leather wallet, keychain, glasses case, and pen set with 'Best Dad' tags.",
        price: 45.00,
        category: "BOXES",
        stock: 20,
        image: "/images/products/dad-set.jpg",
        images: ["/images/products/dad-set.jpg"],
        isCustomizable: true,
        customizationOptions: { text: true, color: false, image: false },
        occasion: "Holiday"
      },
      {
        name: "Tuxedo Style Gift Box",
        description: "Tall black and white gift box designed to resemble a tuxedo, with a sleek bow tie.",
        price: 18.00,
        category: "BOXES",
        stock: 25,
        image: "/images/products/tuxedo-box.jpg",
        images: ["/images/products/tuxedo-box.jpg"],
        occasion: "Anniversary"
      },
      {
        name: "Cherry Pattern Pajama Set",
        description: "White satin pajama set with cherry prints, matching headband, sleep mask, and slippers.",
        price: 40.00,
        category: "BOXES",
        stock: 15,
        image: "/images/products/cherry-pajama.jpg",
        images: ["/images/products/cherry-pajama.jpg"],
        mood: "Loved"
      },
      {
        name: "Pink Heart Pajama Family Set",
        description: "Pink satin matching family pajamas with black heart print for mom, dad, and baby.",
        price: 55.00,
        category: "BOXES",
        stock: 10,
        image: "/images/products/family-pajama.jpg",
        images: ["/images/products/family-pajama.jpg"],
        mood: "Loved"
      }
    ]);
    logger.info(`✅ ${products.length} products created`);

    // ============================================
    // 6. CREATE COUPONS
    // ============================================
    logger.info("🎫 Creating coupons...");
    const coupons = await Coupon.insertMany([
      {
        code: "WELCOME10",
        discount: 10,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: "SUMMER20",
        discount: 20,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: "HAPPY15",
        discount: 15,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: "VIP25",
        discount: 25,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: "FLASH30",
        discount: 30,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]);
    logger.info(`✅ ${coupons.length} coupons created`);

    // ============================================
    // 7. SUMMARY
    // ============================================
    logger.info("\n" + "=".repeat(50));
    logger.info("🎉 SEED COMPLETED SUCCESSFULLY!");
    logger.info("=".repeat(50));
    logger.info(`📊 Summary:`);
    logger.info(`   👤 Admin: admin@dopaminebox.com | Password: Admin@123456`);
    logger.info(`   👤 User: user@dopaminebox.com | Password: User@123456`);
    logger.info(`   📂 Categories: ${categories.length}`);
    logger.info(`   📦 Products: ${products.length}`);
    logger.info(`   🎫 Coupons: ${coupons.length}`);
    logger.info("=".repeat(50) + "\n");

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seed failed: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();