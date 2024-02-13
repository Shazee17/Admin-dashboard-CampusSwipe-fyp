import React from "react";
import { Box, IconButton, useTheme, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ placeholder, handleSearchChange, handleSearch }) => {
  const theme = useTheme();
  const colors = theme.palette;

  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={colors.primary.main}
      borderRadius="3px"
      p={1}
    >
      <TextField
        fullWidth
        variant="standard"
        size="small"
        placeholder={placeholder}
        sx={{ "& .MuiInputBase-root": { color: colors.common.white } }}
        onChange={handleSearchChange}
      />
      <IconButton type="button" onClick={handleSearch}>
        <SearchIcon sx={{ color: colors.common.white }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
