const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controllers');
const statisticsController = require('../controllers/statistics.controllers');
const barChartController = require('../controllers/barChart.controllers');
const pieChartController = require('../controllers/pieChart.controllers');
const combinedController = require('../controllers/combined.controllers');

router.get('/transactions', transactionController.getTransactions);
router.get('/statistics', statisticsController.getStatistics);
router.get('/bar-chart', barChartController.getBarChart);
router.get('/pie-chart', pieChartController.getPieChart);
router.get('/combined', combinedController.getCombinedData);

module.exports = router;