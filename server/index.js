const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', require('./routes/customers'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/send', require('./routes/send'));
app.use('/api/receipts', require('./routes/receipts'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Campaign CRM API is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });