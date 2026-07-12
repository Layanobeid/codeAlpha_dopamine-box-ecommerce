// server/routes/orderRoute.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// ============ CREATE ORDER ============
// Change from '/orders' to '/' because the route is already mounted at /api/orders
router.post('/', async (req, res) => {
    try {
        console.log('📦 Received order data:', req.body);
        
        const { 
            orderId, fullName, email, phone, address, city, 
            postalCode, country, notes, items, subtotal, 
            shipping, tax, total 
        } = req.body;
        
        // Validate required fields
        if (!fullName || !email || !phone || !address || !city || !country) {
            return res.status(400).json({
                success: false,
                message: 'Missing required customer information'
            });
        }
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must have at least one item'
            });
        }
        
        // Create order object
        const orderData = {
            orderId: orderId || 'DB-' + Date.now().toString().slice(-8),
            customer: {
                fullName,
                email,
                phone,
                address,
                city,
                postalCode: postalCode || '',
                country
            },
            items: items.map(item => ({
                productId: item.productId,
                name: item.name || 'Unknown Product',
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                image: item.image || ''
            })),
            subtotal: Number(subtotal) || 0,
            shipping: Number(shipping) || 0,
            tax: Number(tax) || 0,
            total: Number(total) || 0,
            notes: notes || '',
            status: 'pending',
            orderDate: new Date()
        };
        
        // Save to database
        const order = new Order(orderData);
        await order.save();
        
        console.log('✅ Order saved successfully:', order.orderId);
        
        res.status(201).json({
            success: true,
            data: order,
            message: 'Order placed successfully!'
        });
        
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// ============ GET ORDER BY ID ============
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: order
        });
        
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// ============ GET ALL ORDERS ============
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// ============ UPDATE ORDER STATUS ============
router.put('/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }
        
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
});

// ============ DELETE ORDER ============
router.delete('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
});

module.exports = router;