const express = require('express');
const router = express.Router();
const axios = require('axios');
const Campaign = require('../models/Campaign');
const Message = require('../models/Message');
const Order = require('../models/Order');
const { parseIntent } = require('../lib/ai');
const { personalizeMessage } = require('../lib/ai');
const { segmentCustomers } = require('../lib/segmenter');

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Step 1: AI parses intent
    const intent = await parseIntent(prompt);

    // Step 2: Segment customers
    const customers = await segmentCustomers(intent.segmentFilter || {});

    if (customers.length === 0) {
      return res.json({ success: false, message: 'No customers matched the segment.' });
    }

    // Step 3: Create campaign
    const campaign = await Campaign.create({
      name: intent.campaignName,
      prompt,
      segmentFilter: intent.segmentFilter,
      segmentDescription: intent.segmentDescription,
      status: 'running',
      totalTargeted: customers.length,
      totalSent: customers.length,
    });

    // Step 4: Create messages and send to channel service
    const messages = [];

    for (const customer of customers) {
      const lastOrder = await Order.findOne({ customerId: customer._id }).sort({ orderedAt: -1 });
      const content = await personalizeMessage(intent.messageTemplate, customer, lastOrder);

      const message = await Message.create({
        campaignId: campaign._id,
        customerId: customer._id,
        channel: intent.channel || customer.channelPreference,
        content,
        status: 'sent',
        sentAt: new Date(),
      });

      messages.push(message);

      // Send to channel service
      axios.post(`${process.env.CHANNEL_SERVICE_URL}/send`, {
        messageId: message._id,
        campaignId: campaign._id,
        customerId: customer._id,
        channel: message.channel,
        content,
        callbackUrl: `${process.env.CRM_CALLBACK_URL}/api/receipts/callback`,
      }).catch(err => console.error('Channel service error:', err.message));
    }

    res.json({
      success: true,
      data: {
        campaign,
        totalTargeted: customers.length,
        segmentDescription: intent.segmentDescription,
        message: `Campaign "${intent.campaignName}" launched successfully!`,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;