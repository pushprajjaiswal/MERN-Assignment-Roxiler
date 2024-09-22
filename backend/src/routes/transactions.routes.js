const express = require('express');
const router = express.Router();

const { transactionController } = require('../controllers/index')
const { initializeDatabase } = require('../controllers/initializeDatabaseController')

router.get('/transactions', transactionController.getTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/bar-chart', transactionController.getBarChart);
router.get('/pie-chart', transactionController.getPieChart);
router.get('/combined', transactionController.getCombinedData);
router.get('/initialize-db', initializeDatabase)

module.exports = router;