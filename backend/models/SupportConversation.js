import mongoose from 'mongoose';

const SupportMessageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const SupportConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    messages: [SupportMessageSchema],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
);

SupportConversationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const SupportConversation = mongoose.model('SupportConversation', SupportConversationSchema);

export default SupportConversation;

