import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useTheme } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import UserDetails from "../../components/UserDetails";
import { Link } from "react-router-dom";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate(); // Access the navigation function

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        const users = response.data;
        const formattedUsers = users.map((user, index) => ({
          id: user._id,
          ...user,
        }));
        setUserData(formattedUsers);
        setFilteredUserData(formattedUsers);
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

  const handleRowClick = (params) => {
    const userEmail = params.row.email;
    navigate(`/user/${userEmail}`); // Use navigate to redirect
  };

  const columns = [
    { field: "cms_id", headerName: "CMS ID" },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1
    },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "phone_no", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="List of registered Users" />
      <Typography>
        Click on a user's name to view their information
      </Typography>
      <SearchBar placeholder="Search" handleSearchChange={handleSearchChange} />
      {selectedUser ? (
        <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      ) : (
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
          <Box m="20px 0" height="75vh" bgcolor="background.default" borderRadius={5}>
            <DataGrid
              rows={filteredUserData}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              onRowClick={handleRowClick}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Users;
