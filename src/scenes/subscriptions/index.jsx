import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import SearchBar from "../../components/searchBar";

const Subscriptions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUserData, setFilteredUserData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        const users = response.data; // Extract user data from response
        const formattedUsers = users.map((user, index) => ({
          id: user._id, // Use _id as the unique identifier for each row
          ...user,
        }));
        setUserData(formattedUsers);
        setFilteredUserData(formattedUsers); // Set filtered data initially to all users
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredData = userData.filter((user) => {
      for (const field in user) {
        if (
          user[field] &&
          user[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    setFilteredUserData(filteredData);
  }, [searchTerm, userData]);

  const toggleSubscription = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/updateSubscription/${id}`, {
        is_subscribed: !currentStatus // Toggle subscription status
      });
      // Refresh user data after update
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data.map((user) => ({
        id: user._id,
        ...user,
      }));
      setUserData(users);
      setFilteredUserData(users);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  const columns = [
    { field: "cms_id", headerName: "CMS ID" },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { 
      field: "is_subscribed", 
      headerName: "Subscription", 
      flex: 1,
      renderCell: (params) => {
        const buttonText = params.value ? 'Subscribed' : 'Unsubscribed';
        return (
          <div 
            style={{ 
              backgroundColor: params.value ? 'green' : 'red', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => toggleSubscription(params.id, params.value)}
          >
            {buttonText}
          </div>
        );
      }
    }
  ];

  return (
    <Box m="20px">
      <Header title="SUBSCRIPTIONS" subtitle="List of subscribed/unsubscribed Users" />
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
        <SearchBar
          placeholder="Search"
          handleSearchChange={handleSearchChange}
        />
        <Box m="20px 0" height="75vh" bgcolor="background.default" borderRadius={5}>
          <DataGrid
            rows={filteredUserData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Subscriptions;
