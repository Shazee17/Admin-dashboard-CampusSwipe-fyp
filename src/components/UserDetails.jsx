// UserDetailsPage.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/user/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      <Typography variant="h4">User Details</Typography>
      <Box m="20px">
        <Typography variant="h6">Name: {user.first_name} {user.last_name}</Typography>
        <Typography>CMS ID: {user.cms_id}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Degree Name: {user.degree_name}</Typography>
        <Typography>Semester: {user.semester}</Typography>
        <Typography>Phone Number: {user.phone_no}</Typography>
        <Typography>Address: {user.address}</Typography>
      </Box>
      <Button variant="contained" onClick={() => window.history.back()}>Go Back</Button>
    </Box>
  );
};

export default UserDetailsPage;
