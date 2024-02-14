import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const DeviceForm = () => {
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
      // Optionally, you can handle success response here
      resetForm();
    } catch (error) {
      console.error("Error creating device:", error);
      // Optionally, you can handle error here
    }
  };

  return (
    <Box m="20px">
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
              display="flex"
              gap="10px"
              alignItems="center"
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
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default DeviceForm;
