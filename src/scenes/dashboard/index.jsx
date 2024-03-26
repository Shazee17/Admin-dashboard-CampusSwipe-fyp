import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Box, Button, useTheme, Typography } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PeopleIcon from '@mui/icons-material/People';
import StatBox from '../../components/Statbox';
import AddCardIcon from '@mui/icons-material/AddCard';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactionsData, setTransactionsData] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get('http://localhost:3000/transactions')
      .then(response => {
        setTransactionsData(response.data.slice(0, 3)); // Slice to get only the first three transactions
      })
      .catch(error => {
        console.error('Error fetching transactions data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      </Box>

      {/* <Box>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: '10px' }} />
          Download Reports
        </Button>
      </Box> */}

      {/* GRID & CHARTS */}
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
            title="1,304"
            subtitle="New Users"
            progress="0.10"
            increase="+10%"
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
            title="124,353"
            subtitle="Card Transactions"
            progress="0.54"
            increase="+54%"
            icon={<AddCardIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
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
            title="124,240"
            subtitle="Successful Access Attempts"
            progress="0.63"
            increase="+63%"
            icon={<CheckBoxIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
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
            title="113"
            subtitle="Denied Access Attempts"
            progress="0.05"
            increase="+5"
            icon={<DoDisturbIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 12" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {transactionsData.map((transaction, i) => (
            <Box key={`${transaction.id}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Box>
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  {transaction.studentId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.studentName}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
                {transaction.dateAndTime}
              </Box>
              <Box
                backgroundColor={transaction.transactionStatus === 'Success' ? colors.greenAccent[500] : colors.redAccent[500]}
                p="5px 10px"
                borderRadius="4px"
                color={colors.grey[100]}
              >
                {transaction.transactionStatus}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
