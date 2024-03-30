import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material"; // Import Typography
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import SearchBar from "../../components/searchBar";
import DeviceForm from "../../components/deviceForm"; // Import the Form component

const Devices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [deviceData, setDeviceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeviceData, setFilteredDeviceData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/devices")
      .then((response) => {
        const devices = response.data; // Extract device data from response
        const formattedDevices = devices.map((device, index) => ({
          id: device._id, // Use _id as the unique identifier for each row
          ...device,
        }));
        setDeviceData(formattedDevices);
        setFilteredDeviceData(formattedDevices); // Set filtered data initially to all devices
      })
      .catch((error) => {
        console.error("Error fetching device data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredData = deviceData.filter((device) => {
      for (const field in device) {
        if (
          device[field] &&
          device[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    setFilteredDeviceData(filteredData);
  }, [searchTerm, deviceData]);

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "device_id", headerName: "Device ID", flex: 0.5  },
    { field: "location", headerName: "Location", flex: 1  },
  ];

  return (
    <Box m="20px">
      <Header title="DEVICES" />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >

        {/* "List of registered devices" text */}
      <Typography variant="h4" color={colors.greenAccent[200]} gutterBottom>
        List of registered devices
      </Typography>
      
        <SearchBar
          placeholder="Search"
          handleSearchChange={handleSearchChange}
        />
        <Box m="20px 0" height="75vh" bgcolor="background.default" borderRadius={5}>
          <DataGrid
            rows={filteredDeviceData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Devices;
