import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users for admin management
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, {
      _id: 1,
      email: 1,
      name: 1,
      role: 1,
      isActive: 1,
      createdAt: 1,
      lastLogin: 1
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/user/:userId/block
 * Block or unblock a user
 */
router.put('/user/:userId/block', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: isActive !== false }, // Toggle isActive
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: isActive === false ? 'User blocked' : 'User unblocked',
      data: user
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to block user',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/user/:userId
 * Delete a user
 */
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/orders/pending
 * Get all pending orders requiring approval
 */
router.get('/orders/pending', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Fetch pending orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending orders',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/order/:orderId/approve
 * Approve an order
 */
router.put('/order/:orderId/approve', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'confirmed',
        timeline: {
          status: 'confirmed',
          description: 'Order approved by admin',
          timestamp: new Date()
        }
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order approved',
      data: order
    });
  } catch (error) {
    console.error('Approve order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve order',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/order/:orderId/cancel
 * Cancel an order and process refund
 */
router.put('/order/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Process refund if payment was made
    if (order.paymentStatus === 'paid') {
      const user = await User.findById(order.user);
      if (user) {
        user.balance += order.totalAmount;
        user.totalSpent -= order.totalAmount;
        user.transactions.push({
          orderId: orderId,
          amount: order.totalAmount,
          type: 'credit',
          status: 'completed',
          transactionDate: new Date()
        });
        await user.save();
      }
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'cancelled',
        paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: 'admin',
        timeline: {
          status: 'cancelled',
          description: 'Order cancelled by admin - refund processed',
          timestamp: new Date()
        }
      },
      { new: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Order cancelled and refund processed',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/orders/all
 * Get all orders
 */
router.get('/orders/all', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

export default router;
