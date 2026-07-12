// server/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, trim: true },
    name: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    providerId: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: {
        type: String,
        enum: ['user', 'admin', 'client', 'member'],
        default: 'user'
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    lastLogin: { type: Date, default: null }
}, { 
    timestamps: true,
    collection: 'users'  // ✅ تحديد اسم الـ Collection بشكل صريح
});

// ✅ Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// ✅ Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ✅ Virtual for display name
UserSchema.virtual('displayName').get(function() {
    return this.fullName || this.name || 'User';
});

// ✅ Safe model loading
let User;
try {
    User = mongoose.model('User');
} catch (error) {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;