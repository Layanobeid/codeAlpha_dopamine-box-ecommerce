const Message = require('../models/Message.model');
const User = require('../models/user.model');

// ============================================
// GET ALL MESSAGES FOR A USER
// ============================================
const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 50, page = 1, read } = req.query;
        
        const filter = {
            recipient: userId,
            isDeleted: false
        };
        
        if (read !== undefined) {
            filter.read = read === 'true';
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [messages, total] = await Promise.all([
            Message.find(filter)
                .populate('sender', 'fullName name email avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Message.countDocuments(filter)
        ]);
        
        res.json({
            success: true,
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

// ============================================
// GET SINGLE MESSAGE
// ============================================
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const message = await Message.findOne({
            _id: id,
            recipient: userId,
            isDeleted: false
        }).populate('sender', 'fullName name email avatar');
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        // Mark as read if not already
        if (!message.read) {
            message.read = true;
            message.readAt = new Date();
            await message.save();
        }
        
        res.json({
            success: true,
            message
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch message',
            error: error.message
        });
    }
};

// ============================================
// SEND NEW MESSAGE
// ============================================
const sendMessage = async (req, res) => {
    try {
        const { recipient, subject, message, parentMessage } = req.body;
        const sender = req.user._id;
        
        // Validate recipient exists
        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }
        
        // Validate subject and message
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }
        
        const newMessage = await Message.create({
            sender,
            recipient,
            subject,
            message,
            parentMessage: parentMessage || null
        });
        
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'fullName name email avatar')
            .lean();
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: populatedMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// ============================================
// MARK MESSAGE AS READ
// ============================================
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const message = await Message.findOne({
            _id: id,
            recipient: userId
        });
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        message.read = true;
        message.readAt = new Date();
        await message.save();
        
        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read',
            error: error.message
        });
    }
};

// ============================================
// DELETE MESSAGE (Soft Delete)
// ============================================
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const message = await Message.findOne({
            _id: id,
            recipient: userId
        });
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        message.isDeleted = true;
        await message.save();
        
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message
        });
    }
};

// ============================================
// GET UNREAD COUNT
// ============================================
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const count = await Message.countDocuments({
            recipient: userId,
            read: false,
            isDeleted: false
        });
        
        res.json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get unread count',
            error: error.message
        });
    }
};

module.exports = {
    getMessages,
    getMessageById,
    sendMessage,
    markAsRead,
    deleteMessage,
    getUnreadCount
};