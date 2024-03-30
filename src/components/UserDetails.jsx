import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { tokens } from "../theme";
import { useTheme } from "@mui/material/styles";

const UserDetailsPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bgcolor="rgba(0, 0, 0, 0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex={999}
    >
      <Box
        p={3}
        borderRadius={8}
        boxShadow={4}
        bgcolor={colors.primary[100]}
        maxWidth={600}
        width="90%"
      >
        <Typography variant="h3" sx={{ color: colors.primary[800], mb: 3 }}>
          User Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Name:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.first_name} {user.last_name}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>CMS ID:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.cms_id}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Father's Name:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.father_name}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Email:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.email}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Degree Name:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.degree_name}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Semester:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.semester}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Phone Number:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.phone_no}
              </span>
            </Typography>
            <Typography variant="subtitle1" sx={{ color: colors.grey[800], mb: 1 }}>
              <strong>Address:</strong>{" "}
              <span style={{ color: colors.greenAccent[800], fontSize: "1.4em" }}>
                {user.address}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            sx={{ backgroundColor: colors.primary[500], color: "#fff" }}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailsPage;
