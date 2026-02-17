import express from 'express';
import { body } from 'express-validator';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import SupportConversation from '../models/SupportConversation.js';

const router = express.Router();

/**
 * POST /api/support/messages
 * Customer sends a message to admin.
 * Body: { text }
 */
router.post(
  '/messages',
  requireAuth,
  [body('text').trim().notEmpty().withMessage('Message text is required')],
  validateRequest,
  async (req, res) => {
    try {
      const { text } = req.body;

      let conversation = await SupportConversation.findOne({ user: req.user._id });
      if (!conversation) {
        conversation = new SupportConversation({
          user: req.user._id,
          messages: []
        });
      }

      conversation.messages.push({
        from: 'customer',
        text
      });

      await conversation.save();
      await conversation.populate('user', 'name email');

      res.status(201).json({
        success: true,
        message: 'Message sent to admin',
        conversation
      });
    } catch (error) {
      console.error('❌ Error sending support message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error.message
      });
    }
  }
);

/**
 * GET /api/support/messages/my
 * Get current customer's support conversation.
 */
router.get('/messages/my', requireAuth, async (req, res) => {
  try {
    const conversation = await SupportConversation.findOne({ user: req.user._id }).populate(
      'user',
      'name email'
    );

    if (!conversation) {
      return res.status(200).json({
        success: true,
        conversation: null
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('❌ Error fetching customer support messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

/**
 * GET /api/support/messages
 * Admin: get all customer conversations.
 */
router.get('/messages', requireAuth, requireAdmin, async (req, res) => {
  try {
    const conversations = await SupportConversation.find()
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('❌ Error fetching all support messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support messages',
      error: error.message
    });
  }
});

/**
 * POST /api/support/messages/:id/reply
 * Admin replies to a customer conversation.
 * Body: { text }
 */
router.post(
  '/messages/:id/reply',
  requireAuth,
  requireAdmin,
  [body('text').trim().notEmpty().withMessage('Reply text is required')],
  validateRequest,
  async (req, res) => {
    try {
      const { text } = req.body;
      const { id } = req.params;

      const conversation = await SupportConversation.findById(id).populate('user', 'name email');

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      conversation.messages.push({
        from: 'admin',
        text
      });

      await conversation.save();

      res.status(200).json({
        success: true,
        message: 'Reply sent',
        conversation
      });
    } catch (error) {
      console.error('❌ Error replying to support message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send reply',
        error: error.message
      });
    }
  }
);

export default router;

