import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/messages/send
 * Send a message
 */
router.post('/send', async (req, res) => {
  try {
    const { conversationId, senderId, senderRole, senderName, senderEmail, message } = req.body;

    if (!conversationId || !senderId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create message
    const newMessage = new Message({
      conversationId,
      senderId,
      senderRole,
      senderName,
      senderEmail,
      message
    });

    await newMessage.save();

    // Update conversation
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: message,
        lastMessageTime: new Date(),
        unreadCount: senderRole === 'customer' ? 1 : 0
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: newMessage
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

/**
 * GET /api/messages/conversation/:conversationId
 * Get all messages in a conversation
 */
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversationId },
      { isRead: true, readAt: new Date() }
    );

    // Update conversation unread count
    await Conversation.findByIdAndUpdate(
      conversationId,
      { unreadCount: 0 }
    );

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

/**
 * GET /api/messages/admin/conversations
 * Get all conversations (for admin)
 */
router.get('/admin/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
});

/**
 * GET /api/messages/customer/:customerId
 * Get or create conversation with customer
 */
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    // Get or create conversation
    let conversation = await Conversation.findOne({ customerId });

    if (!conversation) {
      const user = await User.findById(customerId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      conversation = new Conversation({
        customerId,
        customerEmail: user.email,
        customerName: user.name
      });

      await conversation.save();
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message
    });
  }
});

export default router;
