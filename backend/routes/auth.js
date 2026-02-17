import express from 'express';
import User from '../models/User.js';
import { createToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Saves or updates user login information in MongoDB
 */
router.post('/login', async (req, res) => {
  try {
    const { uid, email, name, photoURL, role = 'customer' } = req.body;

    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'UID and email are required'
      });
    }

    // Get IP address from request
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Find user or create new one
    let user = await User.findOne({ uid });

    if (user) {
      // User exists - update login info
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;

      // Add to login history
      if (!user.loginHistory) {
        user.loginHistory = [];
      }
      user.loginHistory.push({
        loginTime: new Date(),
        ipAddress,
        userAgent
      });

      // Keep only last 50 logins
      if (user.loginHistory.length > 50) {
        user.loginHistory = user.loginHistory.slice(-50);
      }

      await user.save();
    } else {
      // Create new user
      user = new User({
        uid,
        email: email.toLowerCase(),
        name,
        photoURL: photoURL || null,
        role: role.toLowerCase(),
        loginCount: 1,
        firstLogin: new Date(),
        lastLogin: new Date(),
        isActive: true,
        loginHistory: [
          {
            loginTime: new Date(),
            ipAddress,
            userAgent
          }
        ]
      });

      await user.save();
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      message: user._id ? 'Login successful, user updated' : 'New user created',
      token,
      user: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        photoURL: user.photoURL,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save login information',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/user/:uid
 * Get user information
 */
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user information',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/users
 * Get all users (admin only)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

export default router;
