const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'completed' },
  orderedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);