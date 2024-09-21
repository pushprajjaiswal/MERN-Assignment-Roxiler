const Transaction = require('../models/transaction.models');

exports.getTransactions = async (req, res) => {
    const month = req.query.month;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const search = req.query.search;

    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
        ];
    }

    if (month) {
        query.dateOfSale = { $regex: new RegExp(`^${month}`, 'i') };
    }
    
    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
    
    res.json(transactions);
    
};