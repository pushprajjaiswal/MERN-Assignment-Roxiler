const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios');
const ProductTransaction = require('./models/transaction.models');

const { PORT } = require('./config/server.config');
const connectToDB = require('./config/db.config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get('/ping', (req, res) => {
    return res.json({message: 'Server is alive'});
});

// API to initialize the data
app.get('/initialize-db', async (req, res) => {
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
});




app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDB();
    console.log("Succefully connected to db");
})