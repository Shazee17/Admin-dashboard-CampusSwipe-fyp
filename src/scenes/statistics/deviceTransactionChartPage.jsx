import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ChartComponent = () => {
  const [chartImage, setChartImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [filterDate, setFilterDate] = useState(null);
  const [filterType, setFilterType] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch device data from backend
        const deviceResponse = await axios.get('http://localhost:3000/devices');

        // Extract device IDs from device data
        const deviceIds = deviceResponse.data.map(device => device.device_id);

        // Fetch transactions data from backend
        const transactionsResponse = await axios.get('http://localhost:3000/transactions');

        // Initialize an object to store transaction counts for each device
        const transactionCounts = {};

        // Filter transactions based on the selected filter date and type
        const filteredTransactions = transactionsResponse.data.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          if (filterType === 'month') {
            return filterDate
              ? transactionDate.getMonth() === filterDate.getMonth() &&
                transactionDate.getFullYear() === filterDate.getFullYear()
              : true;
          } else {
            return filterDate
              ? transactionDate.toDateString() === filterDate.toDateString()
              : true;
          }
        });

        // Count transactions for each device and calculate total transactions
        let total = 0;
        filteredTransactions.forEach(transaction => {
          const deviceId = transaction.device_id;
          if (transactionCounts[deviceId]) {
            transactionCounts[deviceId]++;
          } else {
            transactionCounts[deviceId] = 1;
          }
          total++;
        });

        // Update total transactions state
        setTotalTransactions(total);

        // Generate random colors based on the number of devices
        const colors = deviceIds
          .filter(id => transactionCounts[id] > 0)
          .map(() => getRandomColor());

        // Prepare chart data
        const chartData = {
          width: 500,
          height: 300,
          backgroundColor: 'transparent',
          format: 'png',
          chart: {
            type: 'outlabeledPie',
            data: {
              labels: deviceIds.filter(id => transactionCounts[id] > 0),
              datasets: [
                {
                  backgroundColor: colors,
                  data: deviceIds
                    .filter(id => transactionCounts[id] > 0)
                    .map(id => transactionCounts[id]),
                },
              ],
            },
            options: {
              plugins: {
                legend: false,
                outlabels: {
                  text: '%l %p',
                  color: 'white',
                  stretch: 35,
                  font: {
                    resizable: true,
                    minSize: 12,
                    maxSize: 18,
                  },
                },
              },
            },
          },
        };

        // Send post request to QuickChart API
        const response = await axios.post('https://quickchart.io/chart', chartData, {
          responseType: 'blob',
        });

        const imageUrl = URL.createObjectURL(response.data);

        setChartImage(imageUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();

    // Cleanup function to revoke the object URL when component unmounts
    return () => {
      if (chartImage) {
        URL.revokeObjectURL(chartImage);
      }
    };
  }, [filterDate, filterType]);

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilterType(value);
  };

  const handleDateChange = (date) => {
    setFilterDate(date);
  };

  return (
    <div>
      <label htmlFor="filterType">Filter by:</label>
      <select id="filterType" value={filterType} onChange={handleFilterChange}>
        <option value="month">Month</option>
        <option value="day">Day</option>
      </select>
      {filterType === 'month' ? (
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          showMonthYearPicker
          dateFormat="MM/yyyy"
        />
      ) : (
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
        />
      )}
      {loading ? <p>Loading chart...</p> : <img src={chartImage} alt="Chart" />}
    </div>
  );
};

export default ChartComponent;