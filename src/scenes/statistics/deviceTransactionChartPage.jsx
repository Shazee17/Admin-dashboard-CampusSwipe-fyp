import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from "../../components/Header";

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
    <Box m="20px">
      <Header title="Device Transaction Pie Chart" />
      <Box display="flex" alignItems="center" mt={2}>
        <Typography variant="body1" mr={2}>Filter by:</Typography>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="filterType-label">Type</InputLabel>
          <Select
            labelId="filterType-label"
            id="filterType"
            value={filterType}
            onChange={handleFilterChange}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          dateFormat={filterType === 'month' ? 'MM/yyyy' : 'dd/MM/yyyy'}
          showMonthYearPicker={filterType === 'month'}
          placeholderText="Select date"
        />
      </Box>
      {loading ? <CircularProgress /> : <img src={chartImage} alt="Chart" />}
    </Box>
  );
};

export default ChartComponent;
