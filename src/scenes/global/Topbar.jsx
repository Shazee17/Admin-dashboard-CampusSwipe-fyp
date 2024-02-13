import React from 'react'
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2} >

        {/* Search Bar */}
        <Box>
        </Box>


        {/* Icons */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? (
                <LightModeOutlinedIcon/>
            ) : (
                <DarkModeOutlinedIcon />
            )}
              
          </IconButton>
          {/* <IconButton>
              <NotificationsOutlinedIcon/>
          </IconButton>
          <IconButton>
              <SettingsOutlinedIcon/>
          </IconButton> */}
          <IconButton>
              <PersonOutlinedIcon/>
          </IconButton>

        </Box>
    </Box>
  )
}

export default Topbar