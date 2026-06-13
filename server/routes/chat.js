const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `You are an AI assistant for Smart Campaign CRM — a marketing tool that helps brands reach their shoppers. 
You help marketers create campaigns, segment customers, and send personalised messages.
When a user describes a campaign they want to run, confirm their intent clearly and tell them what you're going to do.
Keep responses concise, friendly and actionable.
If the user wants to launch a campaign, tell them you're processing it.`;

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      message: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;