const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
require('dotenv').config();

const categories = ['Fashion', 'Electronics', 'Beauty', 'Food', 'Sports', 'Home'];
const channels = ['email', 'sms', 'whatsapp'];

const customers = [
  { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', channelPreference: 'whatsapp' },
  { name: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543211', channelPreference: 'email' },
  { name: 'Anita Singh', email: 'anita@example.com', phone: '9876543212', channelPreference: 'sms' },
  { name: 'Vikram Patel', email: 'vikram@example.com', phone: '9876543213', channelPreference: 'whatsapp' },
  { name: 'Neha Gupta', email: 'neha@example.com', phone: '9876543214', channelPreference: 'email' },
  { name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543215', channelPreference: 'sms' },
  { name: 'Sunita Rao', email: 'sunita@example.com', phone: '9876543216', channelPreference: 'email' },
  { name: 'Ravi Mehta', email: 'ravi@example.com', phone: '9876543217', channelPreference: 'whatsapp' },
  { name: 'Pooja Nair', email: 'pooja@example.com', phone: '9876543218', channelPreference: 'email' },
  { name: 'Suresh Iyer', email: 'suresh@example.com', phone: '9876543219', channelPreference: 'sms' },
  { name: 'Kavita Joshi', email: 'kavita@example.com', phone: '9876543220', channelPreference: 'whatsapp' },
  { name: 'Deepak Malhotra', email: 'deepak@example.com', phone: '9876543221', channelPreference: 'email' },
  { name: 'Meera Pillai', email: 'meera@example.com', phone: '9876543222', channelPreference: 'sms' },
  { name: 'Arjun Kapoor', email: 'arjun@example.com', phone: '9876543223', channelPreference: 'whatsapp' },
  { name: 'Divya Menon', email: 'divya@example.com', phone: '9876543224', channelPreference: 'email' },
  { name: 'Rajesh Tiwari', email: 'rajesh@example.com', phone: '9876543225', channelPreference: 'sms' },
  { name: 'Sneha Bhatt', email: 'sneha@example.com', phone: '9876543226', channelPreference: 'whatsapp' },
  { name: 'Manoj Dubey', email: 'manoj@example.com', phone: '9876543227', channelPreference: 'email' },
  { name: 'Lakshmi Reddy', email: 'lakshmi@example.com', phone: '9876543228', channelPreference: 'sms' },
  { name: 'Kiran Desai', email: 'kiran@example.com', phone: '9876543229', channelPreference: 'whatsapp' },
];

const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create customers with orders
    for (const customerData of customers) {
      const numOrders = Math.floor(Math.random() * 8) + 1;
      let totalSpent = 0;
      let lastOrderAt = null;

      const customer = await Customer.create({
        ...customerData,
        totalOrders: numOrders,
      });

      for (let i = 0; i < numOrders; i++) {
        const amount = Math.floor(Math.random() * 5000) + 500;
        const orderedAt = randomDate(120);
        totalSpent += amount;

        if (!lastOrderAt || orderedAt > lastOrderAt) {
          lastOrderAt = orderedAt;
        }

        await Order.create({
          customerId: customer._id,
          amount,
          category: categories[Math.floor(Math.random() * categories.length)],
          items: [{ name: 'Product', price: amount, quantity: 1 }],
          orderedAt,
        });
      }

      await Customer.findByIdAndUpdate(customer._id, { totalSpent, lastOrderAt });
    }

    console.log(`✅ Seeded ${customers.length} customers with orders`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();