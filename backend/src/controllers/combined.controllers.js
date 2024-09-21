const transactionController = require('./transaction.controllers');
const statisticsController = require('./statistics.controllers');
const barChartController = require('./barChart.controllers');
const pieChartController = require('./pieChart.controllers');

exports.getCombinedData = async (req, res) => {
  const month = req.query.month;

  const transactions = await transactionController.getTransactions(req, res);
  const statistics = await statisticsController.getStatistics(req, res);
  const barChart = await barChartController.getBarChart(req, res);
  const pieChart = await pieChartController.getPieChart(req, res);

  res.json({
    transactions,
    statistics,
    barChart,
    pieChart,
  });
};