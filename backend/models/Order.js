import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null // Optional for direct orders from external sources
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtOrder: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: null
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
      country: {
        type: String,
        default: 'Bangladesh'
      }
    },
    notes: {
      type: String,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', null],
      default: null
    },
    paymentMethod: {
      type: String,
      enum: ['wallet', 'card'],
      default: 'wallet'
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'processing', 'shop-to-delivery', 'in-transit', 'out-for-delivery', 'delivered'],
          required: true
        },
        description: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        location: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
