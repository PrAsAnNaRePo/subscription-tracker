import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Other',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  billingCycle: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'biannually', 'yearly', 'custom'],
    default: 'monthly',
  },
  startDate: {
    type: Date,
    required: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'paused'],
    default: 'active',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);