import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const DeviceForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation schema
  const deviceSchema = yup.object().shape({
    device_id: yup
      .string()
      .matches(/^[a-zA-Z]+-\d+$/, "Invalid Device ID format")
      .required("Device ID is required"),
    location: yup.string().required("Location is required"),
  });

  // Initial values
  const initialValues = {
    device_id: "",
    location: "",
  };

  // Handle form submission
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("http://localhost:3000/devices", values);
      console.log(response.data);
      setSuccessMessage('Device registered successfully!');
      setErrorMessage(''); // Clear any previous error message
      resetForm();
    } catch (error) {
      console.error("Error creating device:", error);
      setErrorMessage('Error creating device'); // Set error message
      setSuccessMessage(''); // Clear any previous success message
    }
  };

  return (
    <Box m="20px">
      <Header title="Register Device" subtitle="Register a New Device" />

      {successMessage && <Typography variant="body1" color="success.main">{successMessage}</Typography>}
      {errorMessage && <Typography variant="body1" color="error.main">{errorMessage}</Typography>}

      <Formik
        initialValues={initialValues}
        validationSchema={deviceSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Device ID"
                name="device_id"
                value={values.device_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.device_id && touched.device_id}
                helperText={touched.device_id && errors.device_id}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Location"
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.location && touched.location}
                helperText={touched.location && errors.location}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Register Device
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default DeviceForm;
