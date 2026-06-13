const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  segmentFilter: { type: Object },
  segmentDescription: { type: String },
  status: { type: String, enum: ['draft', 'running', 'completed', 'failed'], default: 'draft' },
  totalTargeted: { type: Number, default: 0 },
  totalSent: { type: Number, default: 0 },
  totalDelivered: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  totalOpened: { type: Number, default: 0 },
  totalClicked: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);