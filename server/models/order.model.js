// server/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        country: { type: String, required: true }
    },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String }
    }],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);