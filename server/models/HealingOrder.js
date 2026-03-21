// models/HealingOrder.js
import mongoose from 'mongoose';

const healingOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Changed to false for guest orders
    default: null
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpaySignature: {
    type: String
  },
  planDetails: {
    planName: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    originalAmount: {
      type: Number,
      required: true
    },
    savings: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    features: [{
      type: String
    }]
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  userDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    }
  },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pinCode: String,
    country: String,
    phone: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isGuest: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Pre-save middleware to update updatedAt
healingOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if order is completed
healingOrderSchema.methods.isCompleted = function() {
  return this.isPaid && this.paymentStatus === 'success';
};

const HealingOrder = mongoose.model('HealingOrder', healingOrderSchema);

export default HealingOrder;