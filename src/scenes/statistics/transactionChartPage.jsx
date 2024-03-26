import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
          // Assuming data is an array of objects with "week" and "count" properties
          labels = data.map(item => `Week ${item.week}`);
          dataset = data.map(item => item.count);
        } else if (chartType === 'monthly') {
          // Assuming data is an array of objects with "month" and "count" properties
          labels = data.map(item => item.month);
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
                      stepSize: calculateStepSize(chartData.datasets[0].data) // Calculate step size dynamically
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
            responseType: 'arraybuffer' // Ensure response is received as binary data
          });

          // Convert binary data to Blob and create URL
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

  // Function to calculate step size based on max value
  const calculateStepSize = (data) => {
    const max = Math.max(...data);
    return Math.ceil(max / 5); // Adjust divisor as needed
  };

  // Function to get backend URL based on chartType
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

  // Function to capitalize first letter of string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h1>Chart Page</h1>
      <button onClick={() => setChartType('daily')}>Daily</button>
      <button onClick={() => setChartType('weekly')}>Weekly</button>
      <button onClick={() => setChartType('monthly')}>Monthly</button>
      {imageUrl && <img src={imageUrl} alt="Chart" />}
    </div>
  );
};

export default ChartPage;