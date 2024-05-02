import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/Header";
import { Box, Button } from "@mui/material";

// Define month names for easy reference
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ChartPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from backend based on chartType
        const response = await axios.get(getBackendUrl(chartType));
        const data = response.data;

        // Process data to format for chart
        let labels = [];
        let dataset = [];
        
        if (chartType === 'daily') {
          labels = data.map(item => {
            const { day, month, year } = item._id;
            return `${day}-${month}-${year}`;
          });
          dataset = data.map(item => item.count);
        } else if (chartType === 'weekly') {
          // Correctly formatting the labels for weekly data
          labels = data.map(item => `Week ${item._id.week} of ${item._id.year}`);
          dataset = data.map(item => item.count);
        } else if (chartType === 'monthly') {
          // Assuming data includes month and year info, format correctly
          labels = data.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`);
          dataset = data.map(item => item.count);
        }

        // Create chart data
        const chartData = {
          labels: labels,
          datasets: [{
            label: `${capitalizeFirstLetter(chartType)} Transactions`,
            data: dataset,
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
          }]
        };

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [chartType]);

  useEffect(() => {
    const generateChart = async () => {
      if (chartData) {
        try {
          const response = await axios.post('https://quickchart.io/chart', {
            width: 500,
            height: 300,
            devicePixelRatio: 1.0,
            chart: {
              type: 'bar',
              data: chartData,
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      stepSize: calculateStepSize(chartData.datasets[0].data)
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Total Number of Transactions'
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Date'
                    }
                  }]
                },
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    fontColor: '#333',
                    fontSize: 14
                  }
                },
                title: {
                  display: true,
                  text: `${capitalizeFirstLetter(chartType)} Transactions`
                }
              }
            }
          }, {
            responseType: 'arraybuffer'
          });

          const blob = new Blob([response.data], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } catch (error) {
          console.error('Error generating chart:', error);
        }
      }
    };

    generateChart();
  }, [chartData, chartType]);

  const calculateStepSize = (data) => {
    const max = Math.max(...data);
    return Math.ceil(max / 5);
  };

  const getBackendUrl = (type) => {
    switch (type) {
      case 'daily':
        return 'http://localhost:3000/transactions/day';
      case 'weekly':
        return 'http://localhost:3000/transactions/week';
      case 'monthly':
        return 'http://localhost:3000/transactions/month';
      default:
        return '';
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box m="20px">
      <Header title="Transaction Graphs" subtitle="Daily, Weekly and Monthly transactions" />
      <Box display="flex" justifyContent="space-around" alignItems="center" mb="20px">
        <Button variant="contained" color="secondary" onClick={() => setChartType('daily')}>Daily</Button>
        <Button variant="contained" color="secondary" onClick={() => setChartType('weekly')}>Weekly</Button>
        <Button variant="contained" color="secondary" onClick={() => setChartType('monthly')}>Monthly</Button>
      </Box>
      <Box bgcolor="white" p="10px" borderRadius="5px" width="700px">
        {imageUrl && <img style={{width: "100%"}} src={imageUrl} alt="Chart" />}
      </Box>
    </Box>
  );
};

export default ChartPage;
