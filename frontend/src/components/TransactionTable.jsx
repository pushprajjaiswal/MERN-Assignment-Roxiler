import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import DataTable from './tableData';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('march');
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [currentChart, setCurrentChart] = useState();
  const [currentPieChart, setCurrentPieChart] = useState();
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/transactions?page=${page}&per_page=${perPage}&search=${search}&month=${selectedMonth}`);
        setTransactions(response.data.transactions);
        setTotalCount(response.data.total_count);
        const pieChartData = response.data.transactions.reduce((acc, item) => { return { ...acc, [item.category]: (acc[item.category] || 0) + 1 } }, {})
        renderPieChart(pieChartData)
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/bar-chart?month=${selectedMonth}`);
        // const dataArray = Object.values(response.data);
        // setBarChartData(dataArray);
        // renderBarChart(dataArray);
        console.log(response.data);
        setBarChartData(response.data);
        renderBarChart(response.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    

    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/statistics?month=${selectedMonth}`);
        setStatistics(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
    fetchBarChartData();
    fetchTransactions();
    fetchStatistics();
  }, [page, perPage, search, selectedMonth]);

  // useEffect(() => {
  //   fetchBarChartData().then(() => {
  //     fetchTransactions();
  //     fetchStatistics();
  //   });
  // }, [page, perPage, search, selectedMonth]);

  const handleMonthChange = useCallback((event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    fetchTransactions();
  }, []);

  const handleSearch = useCallback(async () => {
    if (search.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:3000/api/transactions?page=${page}&per_page=${perPage}&search=${search}&month=${selectedMonth}`);
        setTransactions(response.data.transactions);
        setTotalCount(response.data.total_count);
      } catch (error) {
        console.error(error);
      }
    }
  }, [search, page, perPage, selectedMonth]);

  const handleClearSearch = useCallback(async () => {
    setSearch('');
    try {
      const response = await axios.get(`http://localhost:3000/api/transactions?page=${page}&per_page=${perPage}&search=&month=${selectedMonth}`);
      setTransactions(response.data.transactions);
      setTotalCount(response.data.total_count);
    } catch (error) {
      console.error(error);
    }
  }, [page, perPage, selectedMonth]);

  
  const renderBarChart = useCallback((barChartData) => {
    if (currentChart) {
      currentChart.destroy();
    }
    const convertedData = Object.entries(barChartData).map(([priceRange, itemCount]) => ({
      priceRange,
      itemCount
    }));
    const ctx = document.getElementById('barChart').getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: convertedData.map((data) => data.priceRange),
        datasets: [
          {
            label: 'Number of Items',
            data: convertedData.map((data) => data.itemCount),
            backgroundColor: 'rgba(85, 189, 237, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
    });
  
    setCurrentChart(myChart);
  }, [currentChart]);
  


  const renderPieChart = useCallback((pieChartData) => {
    if (currentPieChart && currentPieChart.destroy) {
      currentPieChart.destroy();
    }
    
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(pieChartData),
        datasets: [
          {
            label: 'Number of Items',
            data: Object.values(pieChartData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  
    setCurrentPieChart(myChart);
  }, [currentPieChart, setCurrentPieChart]);

  return (
    <div className='flex flex-col items-center justify-items-center bg-slate-180'>
      <h1 className=" text-center select-none font-[700] text-[20px] bg-white  w-[150px] h-[150px] border-[1px] border-[#e2e2e2]  shadow-[0px_0px_10px_#e2e2e2] rounded-full flex justify-center items-center">
                Transctions <br />
                Dashboard
              </h1>
      <div className='flex justify-center m-4 p-4 text-2xl'>
        <label className='font-semibold text-cyan-500'>Select Month - </label>
        <select className='border-2 mx-2 bg-orange-100 rounded' value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className='px-2 mx-2 font-semibold'>Search Transactions - </label>
        <input className="border-black border-dotted" type="text" placeholder='Search transactions' value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1  rounded shadow-md' onClick={handleSearch}>Search</button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-2 rounded shadow-md' onClick={handleClearSearch}>Clear Search</button>
      </div>
      <div className='flex flex-col items-center m-4 rounded-md p-2 shadow-lg justify-center md-relative'>
        <div className="table-responsive">
          <DataTable data={transactions} />
        </div>
        <div className='flex flex-col shadow-md m-4 p-4 rounded-md bg-orange-100'>
          <h2 className='text-xl font-semibold'>Transactions Statistics - {selectedMonth}</h2>
          <p>Total Sale Amount: {statistics.totalSale}</p>
          <p>Total Sold Items: {statistics.soldCount}</p>
          <p>Total Not Sold Items: {statistics.unsoldCount}</p>
          </div>
      
    </div>

    <div className='flex flex-col shadow rounded-md mx-2 my-8 p-8'>
      <h2 className='text-xl font-semibold'>Transactions Bar Chart : {selectedMonth}</h2>
      <canvas id="barChart" width="400" height="200"></canvas>
    </div>

    <div className='flex flex-col shadow rounded-md m-8 p-8'>
      <h2 className='text-xl font-semibold'>Transactions Pie Chart : {selectedMonth}</h2>
      <canvas id="pieChart" width="400" height="200"></canvas>
    </div>

  </div>
);
};

export default TransactionsTable;