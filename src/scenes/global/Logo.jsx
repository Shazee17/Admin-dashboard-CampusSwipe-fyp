import React from 'react';
import LightModeLogo from '../../assets/LogoLightMode.png'; // Replace with your actual path
import DarkModeLogo from '../../assets/LogoDarkMode.png'; // Replace with your actual path
import { useTheme } from '@mui/system';

const Logo = () => {
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? DarkModeLogo : LightModeLogo;

  return <img src={logoSrc} alt="logo" height="50px" />;
};

export default Logo;
