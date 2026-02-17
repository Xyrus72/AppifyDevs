import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    photoURL: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    loginCount: {
      type: Number,
      default: 1
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    firstLogin: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    loginHistory: [
      {
        loginTime: {
          type: Date,
          default: Date.now
        },
        ipAddress: String,
        userAgent: String
      }
    ],
    balance: {
      type: Number,
      default: 1000
    },
    transactions: [
      {
        orderId: {
          type: String,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        type: {
          type: String,
          enum: ['debit', 'credit'],
          default: 'debit'
        },
        status: {
          type: String,
          enum: ['pending', 'completed', 'cancelled'],
          default: 'pending'
        },
        transactionDate: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
