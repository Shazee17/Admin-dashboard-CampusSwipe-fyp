import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const Subscriptions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState({}); // State to track selected duration for each user

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        const users = response.data; // Extract user data from response
        // Fetch subscription data for each user
        const promises = users.map(user =>
          axios.get(`http://localhost:3000/subscriptions/${user.cms_id}`)
        );
        Promise.all(promises)
          .then(subscriptionResponses => {
            const formattedUsers = users.map((user, index) => {
              const subscriptions = subscriptionResponses[index].data;
              const duration = subscriptions.length > 0 ? subscriptions[0].duration : ''; // Assuming only one subscription per user
              return {
                id: user._id,
                cms_id: user.cms_id,
                first_name: user.first_name,
                last_name: user.last_name,
                is_subscribed: user.is_subscribed,
                duration: duration,
              };
            });
            setUserData(formattedUsers);
            setFilteredUserData(formattedUsers);
            // Initialize selectedDuration state with empty objects for each user
            const initialSelectedDuration = formattedUsers.reduce((acc, user) => {
              acc[user.cms_id] = ""; // Using cms_id as key
              return acc;
            }, {});
            setSelectedDuration(initialSelectedDuration);
          })
          .catch(error => {
            console.error("Error fetching subscription data:", error);
          });
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

  const handleDurationChange = async (event, cms_id) => {
    const { value } = event.target;
    setSelectedDuration(prevState => ({
      ...prevState,
      [cms_id]: value
    }));
    await updateDuration(cms_id, value); // Pass the selected duration value to updateDuration
  };

  const updateDuration = async (cmsId, duration) => {
    try {
      // Check if the duration exists
      const existingDurationResponse = await axios.get(`http://localhost:3000/subscriptions/${cmsId}`);
      const existingDuration = existingDurationResponse.data.length > 0 ? existingDurationResponse.data[0].duration : null;
  
      if (existingDuration) {
        // Duration exists, send PUT request to update
        await axios.put(`http://localhost:3000/subscriptions/${cmsId}`, {
          duration: duration
        });
      } else {
        // Duration does not exist, send POST request to add new duration
        await postDuration(cmsId, duration);
      }
  
      // Refresh user data after update
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data.map((user) => ({
        id: user._id,
        ...user,
      }));
      setUserData(users);
      setFilteredUserData(users);
      // Reset selected duration after update
      setSelectedDuration(prevState => ({
        ...prevState,
        [cmsId]: ""
      }));
    } catch (error) {
      console.error("Error updating subscription duration:", error);
    }
  };
  
  
  const postDuration = async (cmsId, duration) => {
    try {
      await axios.post(`http://localhost:3000/subscriptions`, {
        cms_id: cmsId,
        duration: duration
      });
    } catch (error) {
      console.error("Error posting new subscription duration:", error);
    }
  };
  

  // Function to map duration values to display strings
const getDisplayDuration = (duration) => {
  switch (duration) {
    case "7d":
      return "7 Days";
    case "30d":
      return "30 Days";
    case "90d":
      return "90 Days";
    default:
      return duration; // Return the original duration if not matched
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
  },
  { 
    field: "duration", 
    headerName: "Duration", 
    flex: 1,
    valueGetter: (params) => getDisplayDuration(params.value), // Use valueGetter to transform duration values
  },
  { 
    field: "Update Package", 
    headerName: "Update Package", 
    flex: 1,
    renderCell: (params) => {
      return (
        <Select
          value={selectedDuration[params.row.cms_id] || ""}
          onChange={(event) => handleDurationChange(event, params.row.cms_id)}
          disabled={!params.row.is_subscribed}
        >
          <MenuItem value="">Select Duration</MenuItem>
          <MenuItem value="7d">7 Days</MenuItem>
          <MenuItem value="30d">30 Days</MenuItem>
          <MenuItem value="90d">90 Days</MenuItem>
        </Select>
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