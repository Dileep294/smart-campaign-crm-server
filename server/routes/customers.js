const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single customer with orders
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const orders = await Order.find({ customerId: req.params.id }).sort({ orderedAt: -1 });
    res.json({ success: true, data: { customer, orders } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get customer stats
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const active = await Customer.countDocuments({ lastOrderAt: { $gte: thirtyDaysAgo } });
    const inactive = await Customer.countDocuments({ lastOrderAt: { $lt: thirtyDaysAgo } });
    res.json({ success: true, data: { total, active, inactive } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;