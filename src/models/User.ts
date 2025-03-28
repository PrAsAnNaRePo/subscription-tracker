import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settings: {
    currency: {
      type: String,
      default: 'USD',
    },
    notificationPreferences: {
      type: Object,
      default: {
        emailNotifications: true,
        reminderDays: 3,
      },
    },
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);