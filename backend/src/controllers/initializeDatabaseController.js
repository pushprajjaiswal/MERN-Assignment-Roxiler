const axios = require('axios');
const ProductTransaction = require('../models/transaction.models');

exports.initializeDatabase = async(req, res) => {
    try {
      // Fetch seed data from third-party API
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const seedData = response.data;
  
      // Delete any existing data in the collection
      await ProductTransaction.deleteMany({});
  
      // Insert seed data into the collection
      await ProductTransaction.insertMany(seedData);
  
      res.send('Database initialized successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error initializing database');
    }
}
