const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;
        
        console.log('📦 ===== ORDER CONTROLLER =====');
        console.log('📦 Items received:', JSON.stringify(items, null, 2));
        console.log('👤 User ID:', req.user.id);
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        const orderData = {
            userId: req.user.id,
            items: items,
            shippingAddress: shippingAddress || {},
            paymentMethod: paymentMethod || 'unknown'
        };

        const order = await orderService.createOrder(orderData);
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
        
    } catch (err) {
        console.error('❌ Error creating order:', err.message);
        console.error('❌ Stack:', err.stack);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user.id);
    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error('❌ Error fetching orders:', err.message);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = { createOrder, getOrders };