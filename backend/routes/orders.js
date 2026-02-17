import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Max number of order cancellations allowed per user in the last 30 days (fraud prevention)
const MAX_CANCELLATIONS_IN_30_DAYS = 3;

/**
 * POST /api/orders
 * Place order from cart. Total is calculated on backend. Stock is deducted only after order is created.
 * Optional body: { paymentSimulation: 'success' } to set paymentStatus to 'paid'.
 */
router.post('/', requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id }).session(session);
    if (!cart || !cart.items || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add items before placing order.'
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product)
        .session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Product not found: ${cartItem.product}`
        });
      }
      if (!product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is no longer available`
        });
      }
      if (product.stock < cartItem.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${product.name}". Available: ${product.stock}, requested: ${cartItem.quantity}`
        });
      }

      const priceAtOrder = product.price;
      const subtotal = priceAtOrder * cartItem.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        priceAtOrder,
        subtotal
      });
    }

    const paymentSimulation = req.body.paymentSimulation === 'success';
    const paymentStatus = paymentSimulation ? 'paid' : 'pending';

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus
    });
    await order.save({ session });

    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(
        orderItem.product,
        { $inc: { stock: -orderItem.quantity } },
        { session }
      );
    }

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

/**
 * POST /api/orders/direct
 * Place order directly with inline items (for external product sources like web scrapers).
 * Body: { items: [{name, price, quantity, image}], shippingAddress: {...}, totalAmount, email, paymentMethod }
 */
router.post('/direct', requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, email, paymentMethod = 'wallet' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Check wallet balance if using wallet payment
    if (paymentMethod === 'wallet') {
      const user = await User.findById(req.user._id);
      if (!user || user.balance < totalAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }
    }

    // Create order items with inline data (no product reference)
    const orderItems = items.map((item, idx) => ({
      productName: item.name,
      quantity: item.quantity || 1,
      priceAtOrder: item.price,
      subtotal: (item.price * (item.quantity || 1)),
      imageUrl: item.image
    }));

    const calculatedTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Initialize timeline with first status
    const timeline = [
      {
        status: 'pending',
        description: 'Your order has been placed successfully',
        timestamp: new Date(),
        location: 'Shop'
      }
    ];

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      status: 'pending',
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
      paymentMethod,
      timeline,
      notes: `Order from external source (e-commerce). Email: ${email}`
    });

    await order.save();

    // Deduct balance from user if using wallet
    if (paymentMethod === 'wallet') {
      const user = await User.findById(req.user._id);
      user.balance -= calculatedTotal;
      
      // Add transaction record
      user.transactions.push({
        orderId: order._id,
        amount: calculatedTotal,
        type: 'debit',
        status: 'completed',
        transactionDate: new Date()
      });
      
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Error placing direct order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

/**
 * GET /api/orders
 * Get current user's orders. Admin can get all orders with ?all=true.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin' || req.query.all !== 'true') {
      query = { user: req.user._id };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

/**
 * GET /api/orders/:id
 * Get single order. User can get own order, admin can get any.
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isOwnOrder = order.user._id.toString() === req.user._id.toString();
    if (!isOwnOrder && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status. Admin only. Status: pending, confirmed, shipped, delivered, cancelled.
 */
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const newStatus = req.body.status;
    if (!newStatus || !allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid status required: ${allowed.join(', ')}`
      });
    }

    order.status = newStatus;
    if (newStatus === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancelledBy = 'admin';
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

/**
 * POST /api/orders/:id/cancel
 * Customer cancels own order. Only pending/confirmed can be cancelled.
 * Stock is restored. Fraud prevention: max 3 cancellations in last 30 days.
 */
router.post('/:id/cancel', requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own order'
      });
    }

    if (['cancelled', 'shipped', 'delivered'].includes(order.status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cancelCount = await Order.countDocuments({
      user: req.user._id,
      status: 'cancelled',
      cancelledBy: 'customer',
      cancelledAt: { $gte: thirtyDaysAgo }
    }).session(session);

    if (cancelCount >= MAX_CANCELLATIONS_IN_30_DAYS) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: `You have reached the limit of ${MAX_CANCELLATIONS_IN_30_DAYS} order cancellations in the last 30 days. Contact support if needed.`
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = 'customer';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus;
    await order.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Order cancelled. Stock has been restored.'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

/**
 * POST /api/orders/:id/pay
 * Simulate payment for an order. Sets paymentStatus to 'paid'.
 */
router.post('/:id/pay', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment successful (simulated)',
      order
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

export default router;
