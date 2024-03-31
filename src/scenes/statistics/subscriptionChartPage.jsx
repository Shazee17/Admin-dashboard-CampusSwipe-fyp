import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import Header from "../../components/Header";

const ChartComponent = () => {
  const [imageBlob, setImageBlob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from http://localhost:3000/users/subscribed
        const response = await axios.get('http://localhost:3000/users/subscribed');

        // Extract necessary data
        const subscribedPercentage = Math.round(response.data.subscribedPercentage);
        const unsubscribedPercentage = Math.round(response.data.unsubscribedPercentage);
        const totalUsers = response.data.totalStudents;

        // Create chart data
        const chartData = {
          backgroundColor: '#fff',
          width: 500,
          height: 300,
          devicePixelRatio: 1.0,
          chart: {
            type: 'doughnut',
            data: {
              datasets: [
                {
                  data: [subscribedPercentage, unsubscribedPercentage],
                  backgroundColor: ['green', '#eee'],
                  label: 'Dataset 1',
                  borderWidth: 0,
                },
              ],
              labels: ['Subscribed Percentage', 'Unsubscribed Percentage'],
            },
            options: {
              circumference: 3.141592653589793,
              rotation: 3.141592653589793,
              cutoutPercentage: 75,
              layout: {
                padding: 40,
              },
              legend: {
                display: false,
              },
              plugins: {
                datalabels: {
                  color: '#404040',
                  anchor: 'end',
                  align: 'end',
                  formatter: '%',
                  font: {
                    size: 25,
                    weight: 'bold',
                  },
                },
                doughnutlabel: {
                  labels: [
                    {
                      text: '\nTotal Users',
                      font: {
                        size: 20,
                      },
                    },
                    {
                      text: '\n' + totalUsers,
                      color: '#000',
                      font: {
                        size: 25,
                        weight: 'bold',
                      },
                    },
                  ],
                },
              },
            },
          },
        };

        // Make POST request to generate the chart image
        const chartResponse = await axios.post(
          'https://quickchart.io/chart',
          chartData,
          {
            responseType: 'arraybuffer',
          }
        );

        // Convert ArrayBuffer to Blob
        const blob = new Blob([chartResponse.data], { type: 'image/png' });
        setImageBlob(blob);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call fetchData function on component mount
    fetchData();
  }, []);

  return (
    <Box m={4}>
      <Header title="User Subscription Chart" />
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Subscription Overview
        </Typography>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Box
              width={20}
              height={20}
              borderRadius="50%"
              bgcolor="green"
              mr={1}
            />
            <Typography>Subscribed Percentage</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              width={20}
              height={20}
              borderRadius="50%"
              bgcolor="white"
              mr={1}
              border="1px solid #000" // Add border to distinguish white circle
            />
            <Typography>Unsubscribed Percentage</Typography>
          </Box>
        </Box>
        {imageBlob && (
          <img src={URL.createObjectURL(imageBlob)} alt="Chart" />
        )}
      </Box>
    </Box>
  );
};

export default ChartComponent;
