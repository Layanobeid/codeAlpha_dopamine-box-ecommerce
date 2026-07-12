// server/routes/authRoute.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ استيراد الموديل الصحيح
const User = require('../models/User'); // أو '../models/user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dopamine_box_secret_key_2024';

// ============ REGISTER ============
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration request:', req.body.email);

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            lastLogin: new Date()
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role || 'user',
            provider: user.provider || 'local',
            createdAt: user.createdAt
        };

        console.log('✅ User registered:', user.email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        });
    }
});

// ============ LOGIN ============
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔑 Login request for:', email);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('✅ User found:', user ? user.email : 'No user');

        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('👤 User data:', {
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            hasPassword: !!user.password,
            passwordLength: user.password ? user.password.length : 0
        });

        if (!user.password) {
            console.log('❌ No password set for user:', email);
            return res.status(401).json({
                success: false,
                message: 'This account uses social login. Please login with ' + user.provider
            });
        }

        let isMatch = false;
        try {
            console.log('🔐 Comparing passwords...');
            console.log("RAW PASSWORD FROM REQUEST:", password);
            console.log("HASH FROM DB:", user.password);
            isMatch = await bcrypt.compare(password, user.password);
            console.log('🔐 Password match result:', isMatch);
        } catch (bcryptError) {
            console.error('❌ Bcrypt compare error:', bcryptError);
            return res.status(500).json({
                success: false,
                message: 'Error verifying password',
                error: bcryptError.message
            });
        }

        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Password matched for:', email);

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role || 'user',
            provider: user.provider || 'local',
            isVerified: user.isVerified || false,
            avatar: user.avatar || '',
            createdAt: user.createdAt
        };

        console.log('✅ Login successful:', user.email);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
});

// ============ SOCIAL TOKEN ============
router.post('/social-token', async (req, res) => {
    try {
        const { token, user } = req.body;

        if (!token || !user) {
            return res.status(400).json({
                success: false,
                message: 'Missing token or user data'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const existingUser = await User.findById(decoded.userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Social login successful',
            token,
            user: existingUser
        });

    } catch (error) {
        console.error('❌ Social token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
});

// ============ GOOGLE AUTH ============
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login.html',
        session: false 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user._id, email: req.user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const userData = {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                role: req.user.role || 'user',
                provider: req.user.provider || 'google',
                avatar: req.user.avatar || '',
                isVerified: req.user.isVerified || true
            };

            const redirectUrl = `http://localhost:5500/social-callback.html?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
            res.redirect(redirectUrl);

        } catch (error) {
            console.error('❌ Google callback error:', error);
            res.redirect('http://localhost:5500/login.html?error=google_auth_failed');
        }
    }
);

// ============ FACEBOOK AUTH ============
router.get('/facebook',
    passport.authenticate('facebook', { 
        scope: ['email', 'public_profile'],
        session: false 
    })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: '/login.html',
        session: false 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user._id, email: req.user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const userData = {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                role: req.user.role || 'user',
                provider: req.user.provider || 'facebook',
                avatar: req.user.avatar || '',
                isVerified: req.user.isVerified || true
            };

            const redirectUrl = `http://localhost:5500/social-callback.html?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
            res.redirect(redirectUrl);

        } catch (error) {
            console.error('❌ Facebook callback error:', error);
            res.redirect('http://localhost:5500/login.html?error=facebook_auth_failed');
        }
    }
);

module.exports = router;
