// server/services/order.service.js
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (orderData) => {
    const { userId, items, shippingAddress, paymentMethod } = orderData;

    console.log('📦 ===== STARTING ORDER CREATION =====');
    console.log('📦 Items:', JSON.stringify(items, null, 2));

    if (!items || items.length === 0) {
        throw new Error('Order must contain at least one item');
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
        // ✅ تأكدي من اسم الحقل (productId أو product)
        const productId = item.productId || item.product || item._id;
        console.log(`🔍 Looking for product: ${productId}`);

        const product = await Product.findById(productId);
        
        if (!product) {
            console.log(`❌ Product not found: ${productId}`);
            throw new Error(`Product ${productId} not found`);
        }

        console.log(`📦 Product: ${product.name}`);
        console.log(`📊 Current Stock: ${product.stock}`);
        console.log(`📊 Quantity requested: ${item.quantity}`);

        // ✅ التحقق من المخزون
        if (product.stock < item.quantity) {
            console.log(`❌ Insufficient stock! Available: ${product.stock}, Requested: ${item.quantity}`);
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        // ✅ نقص المخزون
        const oldStock = product.stock;
        product.stock -= item.quantity;
        console.log(`📊 Stock: ${oldStock} → ${product.stock}`);

        await product.save();
        console.log(`✅ Stock saved for ${product.name}`);

        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.image || ''
        });

        total += product.price * item.quantity;
    }

    console.log(`💰 Total: ${total}`);
    console.log(`📦 Order items count: ${orderItems.length}`);

    const order = new Order({
        user: userId,
        items: orderItems,
        total,
        shippingAddress: shippingAddress || {},
        paymentMethod: paymentMethod || 'unknown',
        status: 'pending'
    });

    await order.save();
    console.log(`✅ Order saved: ${order._id}`);
    console.log('📦 ===== ORDER CREATION COMPLETE =====');
    
    return await order.populate('user', 'fullName email');
};

const getOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 });
  
  return orders;
};

module.exports = { createOrder, getOrders };