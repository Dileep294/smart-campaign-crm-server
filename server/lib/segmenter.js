const Customer = require('../models/Customer');

const segmentCustomers = async (filter) => {
  try {
    const query = {};

    if (filter.minTotalSpent) query.totalSpent = { $gte: filter.minTotalSpent };
    if (filter.maxTotalSpent) query.totalSpent = { ...query.totalSpent, $lte: filter.maxTotalSpent };

    if (filter.minTotalOrders) query.totalOrders = { $gte: filter.minTotalOrders };
    if (filter.maxTotalOrders) query.totalOrders = { ...query.totalOrders, $lte: filter.maxTotalOrders };

    if (filter.inactiveDays) {
      const cutoff = new Date(Date.now() - filter.inactiveDays * 24 * 60 * 60 * 1000);
      query.lastOrderAt = { $lte: cutoff };
    }

    if (filter.activeDays) {
      const cutoff = new Date(Date.now() - filter.activeDays * 24 * 60 * 60 * 1000);
      query.lastOrderAt = { $gte: cutoff };
    }

    if (filter.channelPreference) query.channelPreference = filter.channelPreference;

    if (filter.tags && filter.tags.length > 0) query.tags = { $in: filter.tags };

    const customers = await Customer.find(query);
    return customers;
  } catch (err) {
    throw new Error('Segmentation failed: ' + err.message);
  }
};

module.exports = { segmentCustomers };