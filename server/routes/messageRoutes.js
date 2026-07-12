const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware  = require('../middleware/auth.middleware');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// ============================================
// MESSAGE ROUTES
// ============================================

// Get all messages for current user
router.get('/', messageController.getMessages);

// Get unread count
router.get('/unread/count', messageController.getUnreadCount);

// Get single message
router.get('/:id', messageController.getMessageById);

// Send new message
router.post('/', messageController.sendMessage);

// Mark message as read
router.patch('/:id/read', messageController.markAsRead);

// Delete message (soft delete)
router.delete('/:id', messageController.deleteMessage);

module.exports = router;