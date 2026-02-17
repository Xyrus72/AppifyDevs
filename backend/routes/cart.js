import express from 'express';
import { body, param } from 'express-validator';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

/**
 * GET /api/cart
 * Get current user's cart. Creates empty cart if none exists.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

/**
 * POST /api/cart/items
 * Add a product to cart. Body: { productId, quantity }
 */
router.post(
  '/items',
  requireAuth,
  [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Product is not available'
        });
      }
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingIndex >= 0) {
        const newQty = cart.items[existingIndex].quantity + quantity;
        if (product.stock < newQty) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items available. You already have ${cart.items[existingIndex].quantity} in cart.`
          });
        }
        cart.items[existingIndex].quantity = newQty;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      await cart.populate('items.product');

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        cart
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add to cart',
        error: error.message
      });
    }
  }
);

/**
 * DELETE /api/cart/items/:productId
 * Remove a product from cart.
 */
router.delete(
  '/items/:productId',
  requireAuth,
  [param('productId').isMongoId().withMessage('Valid product ID is required')],
  validateRequest,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const initialLength = cart.items.length;
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );

      if (cart.items.length === initialLength) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in cart'
        });
      }

      await cart.save();
      await cart.populate('items.product');

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        cart
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove from cart',
        error: error.message
      });
    }
  }
);

/**
 * PUT /api/cart/items/:productId
 * Update quantity of a product in cart. Body: { quantity }
 */
router.put(
  '/items/:productId',
  requireAuth,
  [
    param('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { quantity } = req.body;
      const cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const item = cart.items.find(
        (i) => i.product.toString() === req.params.productId
      );
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in cart'
        });
      }

      if (quantity === 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== req.params.productId
        );
      } else {
        const product = await Product.findById(req.params.productId);
        if (!product || product.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product ? product.stock : 0} items available in stock`
          });
        }
        item.quantity = quantity;
      }

      await cart.save();
      await cart.populate('items.product');

      res.status(200).json({
        success: true,
        message: 'Cart updated',
        cart
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cart',
        error: error.message
      });
    }
  }
);

export default router;
