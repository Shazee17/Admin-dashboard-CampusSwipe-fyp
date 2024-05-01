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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, subscriptionsResponse] = await Promise.all([
        axios.get("http://localhost:3000/users"),
        axios.get("http://localhost:3000/subscriptions")
      ]);
  
      const users = usersResponse.data.map(user => ({ ...user, id: user._id })); // Add id property
      const subscriptions = subscriptionsResponse.data;
  
      const formattedUsers = users.map(user => {
        const subscription = subscriptions.find(sub => sub.cms_id === user.cms_id);
        const duration = subscription ? subscription.duration : "";
        return { ...user, duration };
      });
  
      setUserData(formattedUsers);
      setFilteredUserData(formattedUsers);
      const initialSelectedDuration = formattedUsers.reduce((acc, user) => {
        acc[user.cms_id] = "";
        return acc;
      }, {});
      setSelectedDuration(initialSelectedDuration);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredData = userData.filter(user =>
      Object.values(user).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUserData(filteredData);
  }, [searchTerm, userData]);

  const toggleSubscription = async (id, currentStatus) => {
    try {
        const updatedStatus = !currentStatus;

        // Update subscription status
        await axios.put(`http://localhost:3000/updateSubscription/${id}`, {
            is_subscribed: updatedStatus
        });

        // Get user's email
        const user = userData.find(user => user._id === id);
        const email = user ? user.email : null;

        // If email exists, send notification
        if (email) {
            let message = '';
            if (updatedStatus) {
                message = `Dear ${user.first_name}, 

                You have successfully subscribed to the CampusSwipe Package. 

                With this subscription, you can now enjoy seamless access to our bus services. 

                Thank you for choosing CampusSwipe.

                Best regards,
                Team CampusSwipe`;
            } else {
                message = `Dear ${user.first_name}, 

                You have been unsubscribed from the CampusSwipe Package. 

                We hope you've enjoyed our services and consider reactivating your subscription in the future. 

                Thank you for being part of CampusSwipe.

                Best regards,
                Team CampusSwipe`;
            }

            await axios.post("http://localhost:3000/sendEmailFromWeb", {
                email,
                subject: "Subscription Status Update",
                message
            });
        }

        // Update local state
        const updatedUserData = userData.map(user =>
            user._id === id ? { ...user, is_subscribed: updatedStatus } : user
        );
        setUserData(updatedUserData);
        setFilteredUserData(updatedUserData);
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
    await updateDuration(cms_id, value);
  };

  const updateDuration = async (cmsId, duration) => {
    try {
      const existingDurationResponse = await axios.get(`http://localhost:3000/subscriptions/${cmsId}`);
      const existingDuration = existingDurationResponse.data.length > 0 ? existingDurationResponse.data[0].duration : null;

      if (existingDuration) {
        await axios.put(`http://localhost:3000/subscriptions/${cmsId}`, {
          duration: duration
        });
      } else {
        await axios.post(`http://localhost:3000/subscriptions`, {
          cms_id: cmsId,
          duration: duration
        });
      }

      const updatedUserData = userData.map(user =>
        user.cms_id === cmsId ? { ...user, duration } : user
      );
      setUserData(updatedUserData);
      setFilteredUserData(updatedUserData);
      setSelectedDuration(prevState => ({
        ...prevState,
        [cmsId]: ""
      }));
    } catch (error) {
      console.error("Error updating subscription duration:", error);
    }
  };

  const getDisplayDuration = (user) => {
    if (!user.is_subscribed) {
      return "0 Days";
    }
  
    switch (user.duration) {
      case "7d":
        return "7 Days";
      case "15d":
        return "15 Days";
      case "30d":
        return "30 Days";
      default:
        return user.duration;
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
            onClick={() => toggleSubscription(params.row._id, params.value)}
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
      valueGetter: (params) => getDisplayDuration(params.row),
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
            <MenuItem value="15d">15 Days</MenuItem>
            <MenuItem value="30d">30 Days</MenuItem>
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
