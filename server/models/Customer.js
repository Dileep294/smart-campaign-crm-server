const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  channelPreference: { type: String, enum: ['email', 'sms', 'whatsapp'], default: 'email' },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderAt: { type: Date },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);