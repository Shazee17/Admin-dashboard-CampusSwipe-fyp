import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PeopleIcon from '@mui/icons-material/People';
import StatBox from '../../components/Statbox';
import AddCardIcon from '@mui/icons-material/AddCard';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactionsData, setTransactionsData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);

  useEffect(() => {
    // Fetch data from the API endpoint for transactions
    axios.get('http://localhost:3000/transactions')
      .then(response => {
        setTransactionsData(response.data); 
      })
      .catch(error => {
        console.error('Error fetching transactions data:', error);
      });

    // Fetch data from the API endpoint for users
    axios.get('http://localhost:3000/users')
      .then(response => {
        setTotalUsers(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching users data:', error);
      });

      // Fetch data from the API endpoint for devices
    axios.get('http://localhost:3000/devices')
    .then(response => {
      setTotalDevices(response.data.length);
    })
    .catch(error => {
      console.error('Error fetching devices data:', error);
    });
  }, []); 

  const totalTransactions = transactionsData.length;

  return (
    <Box m="20px">
      <Header title="Dashboard" subtitle="Welcome to your dashboard" />

      {/* GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalUsers}
            subtitle="Total Users"
            icon={<PeopleIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalDevices} 
            subtitle="Total Devices"
            icon={<DocumentScannerIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalTransactions.toString()} // Display the total number of transactions
            subtitle="Total Transactions"
            icon={<AddCardIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 12" gridRow="span 2" overflow="auto">
          <Box display="flex" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            {transactionsData.slice(-3).map((transaction, i) => (
              <Box
                key={`${transaction.id}-${i}`}
                p="15px"
                borderBottom={`4px solid ${colors.primary[500]}`}
                width="calc(33.33% - 10px)"
                margin="0 5px 10px 5px" 
                bgcolor={colors.primary[400]}
                borderRadius="4px"
              >
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  CMS ID: {transaction.cms_id}
                </Typography>
                <Typography color={colors.grey[100]}>
                  Device ID: {transaction.device_id}
                </Typography>
                <Typography color={colors.grey[100]}>
                   {transaction.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
