const Transaction = require('../models/transaction.models')

exports.getStatistics = async (req, res) => {
    const month = req.query.month;
  
    const query = {};
    if (month) {
      query.dateOfSale = { $regex: new RegExp(`^${month}`, 'i') };
    }
  
    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalSaleAmount: { $sum: '$price' } } },
    ]);
  
    const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });
  
    res.json({
      totalSaleAmount: totalSaleAmount[0].totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  };