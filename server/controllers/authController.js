// server/controllers/authController.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔑 Login request for:', email);
        console.log('📝 Password length:', password?.length || 0);

        // ✅ البحث عن المستخدم
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        console.log('✅ User found:', user.email);
        console.log('👤 User data:', {
            email: user.email,
            fullName: user.fullName || user.name,
            role: user.role,
            hasPassword: !!user.password,
            passwordLength: user.password ? user.password.length : 0
        });

        // ✅ مقارنة كلمة المرور
        const isMatch = await user.comparePassword(password);
        console.log('🔐 Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // ✅ إنشاء Token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email 
            },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );

        // ✅ تحديث آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Login successful 🎉',
            token,
            user: {
                id: user._id,
                fullName: user.fullName || user.name || 'User',
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

module.exports = { login };