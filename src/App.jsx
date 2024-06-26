import React, { useState } from 'react';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route, not BrowserRouter
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Users from './scenes/users';
import Transactions from './scenes/transactions';
import LoginPage from './scenes/loginPage';
import Devices from './scenes/devices';
import ProfileForm from "./scenes/form";
import DeviceForm from './scenes/deviceForm';
import Subscriptions from './scenes/subscriptions';
import SubscriptionsChartPage from './scenes/statistics/subscriptionChartPage';
import TransactionsChartPage from './scenes/statistics/transactionChartPage';
import DeviceTransactionChartPage from './scenes/statistics/deviceTransactionChartPage';
import UserDetailsPage from './components/UserDetails'; // Import UserDetailsPage component


const App = () => {
  const [theme, colorMode] = useMode();
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = (credentials) => {
    // Simulate user authentication
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setLoggedIn(true);
    }
  };

  return (
    isLoggedIn ? (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className='app'>
            <>
              <Sidebar />
              <main className='content'>
                <Topbar />
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/team' element={<Team />} />
                  <Route path='/users' element={<Users />} />
                  <Route path='/user/:id' element={<UserDetailsPage />} />
                  <Route path='/transactions' element={<Transactions />} />
                  <Route path='/devices' element={<Devices/>}/>
                  <Route path='/subscriptions' element={<Subscriptions/>} />
                  <Route path='/form' element={<ProfileForm />} />
                  <Route path='/device_form' element={<DeviceForm />} />
                  <Route path='/subscription_stats' element={<SubscriptionsChartPage />} />
                  <Route path='/transaction_stats' element={<TransactionsChartPage />} />
                  <Route path='/device_stats' element={<DeviceTransactionChartPage />} />
                </Routes>
              </main>
            </>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    ) : (
      <LoginPage onLogin={handleLogin} />
    )
  );
}

export default App;
