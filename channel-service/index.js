const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Simulate message delivery lifecycle
const simulateDelivery = async (messageId, campaignId, callbackUrl) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    // Step 1: delivered (2-4 seconds)
    await delay(2000 + Math.random() * 2000);
    
    const failed = Math.random() < 0.1; // 10% failure rate
    
    if (failed) {
      await axios.post(callbackUrl, { messageId, campaignId, event: 'failed' });
      return;
    }

    await axios.post(callbackUrl, { messageId, campaignId, event: 'delivered' });

    // Step 2: opened (3-6 seconds after delivery)
    await delay(3000 + Math.random() * 3000);
    const opened = Math.random() < 0.6; // 60% open rate
    if (!opened) return;
    await axios.post(callbackUrl, { messageId, campaignId, event: 'opened' });

    // Step 3: clicked (2-4 seconds after open)
    await delay(2000 + Math.random() * 2000);
    const clicked = Math.random() < 0.4; // 40% click rate
    if (!clicked) return;
    await axios.post(callbackUrl, { messageId, campaignId, event: 'clicked' });

  } catch (err) {
    console.error('Callback error:', err.message);
  }
};

// Receive send request from CRM
app.post('/send', async (req, res) => {
  const { messageId, campaignId, channel, content, callbackUrl } = req.body;

  console.log(`📨 Received message for channel: ${channel}`);
  console.log(`📝 Content: ${content.substring(0, 50)}...`);

  // Respond immediately, simulate async
  res.json({ success: true, message: 'Message queued for delivery' });

  // Simulate delivery in background
  simulateDelivery(messageId, campaignId, callbackUrl);
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Channel Service is running!' });
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Channel Service running on port ${process.env.PORT}`);
});