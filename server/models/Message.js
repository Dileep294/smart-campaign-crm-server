const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  channel: { type: String, enum: ['email', 'sms', 'whatsapp'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed', 'opened', 'clicked'], default: 'pending' },
  sentAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);