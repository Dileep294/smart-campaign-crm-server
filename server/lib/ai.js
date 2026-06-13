const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parseIntent = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant for a marketing CRM. Parse the marketer's campaign intent and return ONLY a JSON object with this structure:
{
  "campaignName": "string",
  "segmentFilter": {
    "inactiveDays": number or null,
    "activeDays": number or null,
    "minTotalSpent": number or null,
    "maxTotalSpent": number or null,
    "minTotalOrders": number or null,
    "channelPreference": "email" or "sms" or "whatsapp" or null,
    "tags": [] or null
  },
  "segmentDescription": "string describing who will be targeted",
  "messageTemplate": "string - personalized message template. Use {{name}}, {{lastCategory}}, {{totalOrders}} as placeholders",
  "channel": "email" or "sms" or "whatsapp",
  "tone": "string"
}
Return ONLY the JSON, no explanation.`
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const personalizeMessage = async (template, customer, order) => {
  let message = template;
  message = message.replace(/{{name}}/g, customer.name);
  message = message.replace(/{{lastCategory}}/g, order ? order.category : 'our store');
  message = message.replace(/{{totalOrders}}/g, customer.totalOrders);
  return message;
};

module.exports = { parseIntent, personalizeMessage };