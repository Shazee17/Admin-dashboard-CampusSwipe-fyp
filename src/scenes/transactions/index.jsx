import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import SearchBar from "../../components/searchBar";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactionsData, setTransactionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/transactions")
      .then((response) => {
        if (response) {
          setTransactionsData(response.data);
          setFilteredTransactions(response.data);
        } else {
          console.error("Invalid response data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions data:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = transactionsData.filter((transaction) => {
      for (const key in transaction) {
        if (transaction[key] && transaction[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, transactionsData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    { field: "cms_id", headerName: "CMS ID", flex: 1, }, 
    { field: "device_id", headerName: "Device ID", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Transactions" subtitle="List of Transactions" />
      <SearchBar
        placeholder="Search"
        handleSearchChange={handleSearchChange}
        handleSearch={() => {}}
      />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <Box m="20px 0" height="75vh" bgcolor="background.default" borderRadius={5}>
          <DataGrid
            rows={filteredTransactions}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            getRowId={(row) => row._id}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Transactions;
