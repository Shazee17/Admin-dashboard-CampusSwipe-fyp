import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChartComponent = () => {
  const [chartImage, setChartImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);

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

        // Count transactions for each device and calculate total transactions
        let total = 0;
        transactionsResponse.data.forEach(transaction => {
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

        // Prepare chart data
        const chartData = {
          width: 500,
          height: 300,
          backgroundColor: 'transparent',
          format: 'png',
          chart: {
            type: 'doughnut',
            data: {
              labels: deviceIds,
              datasets: [{ data: deviceIds.map(id => transactionCounts[id] || 0) }], // Use transaction counts as data
            },
            options: {
              plugins: {
                doughnutlabel: {
                  labels: [{ text: `${total}`, font: { size: 20 } }, { text: 'total' }],
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
  }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

  return (
    <div>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <img src={chartImage} alt="Chart" />
      )}
    </div>
  );
};

export default ChartComponent;