const Transaction = require('../models/transaction.models');

exports.getBarChart = async (req, res) => {
  const month = req.query.month;

  const query = {};
  if (month) {
    query.dateOfSale = { $regex: new RegExp(`^${month}`, 'i') };
  }

  const priceRanges = [
    { label: '0-100', min: 0, max: 100 },
    { label: '101-200', min: 101, max: 200 },
    { label: '201-300', min: 201, max: 300 },
    { label: '301-400', min: 301, max: 400 },
    { label: '401-500', min: 401, max: 500 },
    { label: '501-600', min: 501, max: 600 },
    { label: '601-700', min: 601, max: 700 },
    { label: '701-800', min: 701, max: 800 },
    { label: '801-900', min: 801, max: 900 },
    { label: '901-above', min: 901, max: Infinity },
  ];

  const barChart = await Transaction.aggregate([
    { $match: query },
    {
      $bucket: {
        groupBy: '$price',
        boundaries: priceRanges.map(range => range.min),
        default: 'Unknown',
        output: {
          count: { $sum: 1 },
          label: { $addToSet: '$$CURRENT.group' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        label: { $arrayElemAt: ['$label', 0] },
        count: 1,
      },
    },
    { $sort: { label: 1 } },
  ]);

  res.json(barChart);
};