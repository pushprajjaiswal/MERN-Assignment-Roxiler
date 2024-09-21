const Transaction = require('../models/transaction.models');

exports.getPieChart = async (req, res) => {
  const month = req.query.month;

  const query = {};
  if (month) {
    query.dateOfSale = { $regex: new RegExp(`^${month}`, 'i') };
  }

  const categories = await Transaction.aggregate([
    { $match: query },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json(categories);
};