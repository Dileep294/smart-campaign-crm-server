const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Message = require('../models/Message');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single campaign with messages
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    const messages = await Message.find({ campaignId: req.params.id })
      .populate('customerId', 'name email phone');
    res.json({ success: true, data: { campaign, messages } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get campaign stats
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Campaign.countDocuments();
    const running = await Campaign.countDocuments({ status: 'running' });
    const completed = await Campaign.countDocuments({ status: 'completed' });
    res.json({ success: true, data: { total, running, completed } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;