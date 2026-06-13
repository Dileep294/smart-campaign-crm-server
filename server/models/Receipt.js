const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  event: { type: String, enum: ['sent', 'delivered', 'failed', 'opened', 'clicked'], required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);