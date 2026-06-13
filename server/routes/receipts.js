const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Message = require('../models/Message');
const Campaign = require('../models/Campaign');

// Callback from channel service
router.post('/callback', async (req, res) => {
  try {
    const { messageId, campaignId, event } = req.body;

    // Save receipt
    await Receipt.create({ messageId, campaignId, event });

    // Update message status
    await Message.findByIdAndUpdate(messageId, { status: event });

    // Update campaign stats
    const statField = {
      delivered: 'totalDelivered',
      failed: 'totalFailed',
      opened: 'totalOpened',
      clicked: 'totalClicked',
    }[event];

    if (statField) {
      await Campaign.findByIdAndUpdate(campaignId, { $inc: { [statField]: 1 } });
    }

    // Check if campaign is completed
    const campaign = await Campaign.findById(campaignId);
    if (campaign && campaign.totalDelivered + campaign.totalFailed >= campaign.totalSent) {
      await Campaign.findByIdAndUpdate(campaignId, { status: 'completed' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;