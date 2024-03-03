import React, { useState } from 'react';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Users from './scenes/users';
import Transactions from './scenes/transactions';
import LoginPage from './scenes/loginPage';
import Devices from './scenes/devices';
import ProfileForm from "./scenes/form"
import Subscriptions from './scenes/subscriptions';

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
                  <Route path='/transactions' element={<Transactions />} />
                  <Route path='/devices' element={<Devices/>}/>
                  <Route path='/subscriptions' element={<Subscriptions/>} />
                  <Route path='/form' element={<ProfileForm />} />
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
