// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

// Check if Google credentials exist
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log('🔑 Google Client ID exists:', !!googleClientID);
console.log('🔑 Google Client Secret exists:', !!googleClientSecret);

// ============ GOOGLE STRATEGY ============
if (googleClientID && googleClientSecret) {
    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('🔍 Google profile:', profile.emails?.[0]?.value || profile.id);

            const email = profile.emails?.[0]?.value || `${profile.id}@google.com`;

            // Check if user exists
            let user = await User.findOne({ 
                $or: [
                    { email: email },
                    { providerId: profile.id, provider: 'google' }
                ]
            });

            if (user) {
                // Update provider info if needed
                if (user.provider === 'local' && !user.providerId) {
                    user.provider = 'google';
                    user.providerId = profile.id;
                    user.isVerified = true;
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user
            user = new User({
                fullName: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Google User',
                email: email,
                password: Math.random().toString(36).slice(-12),
                provider: 'google',
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value || '',
                isVerified: true,
                lastLogin: new Date()
            });

            await user.save();
            console.log('✅ New Google user created:', user.email);
            return done(null, user);

        } catch (error) {
            console.error('❌ Google auth error:', error);
            return done(error, null);
        }
    }));
    console.log('✅ Google OAuth configured');
} else {
    console.log('⚠️ Google OAuth not configured - missing credentials');
}



// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;