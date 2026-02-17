import express from 'express';
import { body, param } from 'express-validator';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

// ----- Public routes (no auth needed) -----

/**
 * GET /api/products
 * Get all products. Optional: ?active=true to get only active products.
 */
router.get('/', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const filter = activeOnly ? { isActive: true } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// ----- Admin only routes -----

/**
 * POST /api/products
 * Add a new product. Admin only.
 */
router.post(
  '/',
  requireAuth,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or more')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, description, price, stock, category, imageURL } = req.body;

      const product = new Product({
        name,
        description: description || '',
        price: Number(price),
        stock: Number(stock) || 0,
        category: category || 'general',
        imageURL: imageURL || null,
        isActive: true
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product
      });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add product',
        error: error.message
      });
    }
  }
);

/**
 * PUT /api/products/:id
 * Update product details. Admin only.
 */
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const { name, description, price, stock, category, imageURL, isActive } = req.body;

      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (stock !== undefined) {
        const newStock = Number(stock);
        if (newStock < 0) {
          return res.status(400).json({
            success: false,
            message: 'Stock cannot be negative'
          });
        }
        product.stock = newStock;
      }
      if (category !== undefined) product.category = category;
      if (imageURL !== undefined) product.imageURL = imageURL;
      if (isActive !== undefined) product.isActive = Boolean(isActive);

      await product.save();

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }
);

/**
 * PATCH /api/products/:id/stock
 * Update only product stock. Admin only. Prevents negative stock.
 */
router.patch(
  '/:id/stock',
  requireAuth,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or more')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const newStock = Number(req.body.stock);
      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }

      product.stock = newStock;
      await product.save();

      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        product
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update stock',
        error: error.message
      });
    }
  }
);

/**
 * DELETE /api/products/:id
 * Delete a product. Admin only.
 */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

export default router;
