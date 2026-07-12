// debug-auth.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const debugAuth = async () => {
  await connectDB();
  
  const email = 'admin2@dopaminebox.com';
  const testPassword = 'Admin123!'; // The password you're trying
  
  try {
    // 1. Find the user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('========================================');
    console.log('👤 USER FOUND:', user.email);
    console.log('🆔 User ID:', user._id);
    console.log('🔐 Stored password hash:', user.password);
    console.log('📊 Hash length:', user.password.length);
    console.log('📊 Hash starts with:', user.password.substring(0, 10));
    console.log('========================================');
    
    // 2. Test bcrypt.compare directly
    console.log('\n🔍 TESTING PASSWORD COMPARISON:');
    console.log('📝 Password to test:', testPassword);
    console.log('📝 Password length:', testPassword.length);
    
    const directCompare = await bcrypt.compare(testPassword, user.password);
    console.log('✅ Direct bcrypt.compare result:', directCompare);
    
    // 3. Test with trimmed password
    const trimmedPassword = testPassword.trim();
    const trimmedCompare = await bcrypt.compare(trimmedPassword, user.password);
    console.log('✅ Trimmed password compare:', trimmedCompare);
    
    // 4. Test with the model method if it exists
    if (typeof user.comparePassword === 'function') {
      const modelCompare = await user.comparePassword(testPassword);
      console.log('✅ Model comparePassword result:', modelCompare);
    } else {
      console.log('⚠️ No comparePassword method found on user model');
    }
    
    // 5. Generate a fresh hash of the test password
    console.log('\n🔐 GENERATING FRESH HASH:');
    const salt = await bcrypt.genSalt(10);
    const freshHash = await bcrypt.hash(testPassword, salt);
    console.log('📝 Fresh hash:', freshHash);
    console.log('📝 Fresh hash length:', freshHash.length);
    
    // 6. Compare the hash formats
    console.log('\n📊 HASH FORMAT COMPARISON:');
    console.log('Stored hash version:', user.password.substring(0, 4));
    console.log('Fresh hash version:', freshHash.substring(0, 4));
    console.log('Stored hash rounds:', user.password.split('$')[2]);
    console.log('Fresh hash rounds:', freshHash.split('$')[2]);
    
    // 7. Try to hash the stored hash (in case of double hashing)
    console.log('\n🔍 CHECKING FOR DOUBLE HASHING:');
    const doubleHashCheck = await bcrypt.compare(testPassword, user.password);
    console.log('Normal compare:', doubleHashCheck);
    
    // If normal compare fails, maybe the password was double hashed
    if (!doubleHashCheck) {
      console.log('⚠️ Trying to see if password was double hashed...');
      const hashOfHash = await bcrypt.hash(user.password, salt);
      console.log('Hash of stored hash:', hashOfHash);
      
      // Try comparing the test password to the hash of the stored hash
      const doubleHashCompare = await bcrypt.compare(testPassword, hashOfHash);
      console.log('Double hash compare:', doubleHashCompare);
    }
    
    // 8. Check for encoding issues
    console.log('\n🔍 CHECKING ENCODING:');
    console.log('Stored hash char codes:', Array.from(user.password).slice(0, 10).map(c => c.charCodeAt(0)));
    console.log('Test password char codes:', Array.from(testPassword).slice(0, 10).map(c => c.charCodeAt(0)));
    
    // 9. Try to update the password with a new one
    console.log('\n🔄 UPDATING PASSWORD:');
    const newSalt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(testPassword, newSalt);
    
    // Test the new hash
    const newHashCompare = await bcrypt.compare(testPassword, newHashedPassword);
    console.log('New hash compare test:', newHashCompare);
    
    if (newHashCompare) {
      console.log('✅ New hash works! Updating user...');
      
      // Update the user's password
      user.password = newHashedPassword;
      await user.save();
      
      console.log('✅ Password updated successfully!');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', testPassword);
      
      // Verify the update
      const updatedUser = await User.findOne({ email }).select('+password');
      const verify = await bcrypt.compare(testPassword, updatedUser.password);
      console.log('✅ Verification after update:', verify);
    }
    
    console.log('\n========================================');
    console.log('🎯 TRY LOGGING IN NOW WITH:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${testPassword}`);
    console.log('========================================');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit();
};

debugAuth();