import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChartPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from backend
        const response = await axios.get('http://localhost:3000/transactions/day');
        const data = response.data;

        // Process data to format for chart
        const labels = data.map(item => {
          const { day, month, year } = item._id;
          return `${day}-${month}-${year}`;
        });

        const dataset = data.map(item => item.count);

        // Create chart data
        const chartData = {
          labels: labels,
          datasets: [{
            label: 'Daily Transactions',
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
  }, []);

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
                  text: 'Daily Transactions'
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
  }, [chartData]);
  
  const calculateStepSize = (data) => {
    const max = Math.max(...data);
    return Math.ceil(max / 5); // Adjust divisor as needed
  };

  return (
    <div>
      <h1>Chart Page</h1>
      {imageUrl && <img src={imageUrl} alt="Chart" />}
    </div>
  );
};

export default ChartPage;