import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    console.log(values);
    axios
      .post("http://localhost:3000/register", {...values, password: '123', semester: 6, degree_name: 'BSCS'})
      .then((response) => {
        console.log(response.data);
        // Optionally, you can handle success response here
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        // Optionally, you can handle error here
      });
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="CMS ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cms_id}
                name="cms_id"
                error={!!touched.cms_id && !!errors.cms_id}
                helperText={touched.cms_id && errors.cms_id}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="tel"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_no}
                name="phone_no"
                error={!!touched.phone_no && !!errors.phone_no}
                helperText={touched.phone_no && errors.phone_no}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="checkbox"
                label="Is Subscribed"
                onBlur={handleBlur}
                onChange={handleChange}
                checked={values.is_subscribed}
                name="is_subscribed"
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation schema
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  cms_id: yup
    .string()
    .matches(/^(\d{3}-\d{2}-\d{4})?$/, "Invalid CMS ID format")
    .required("CMS ID is required"),
  phone_no: yup
    .string()
    .matches(/^03[0-9]{9}$/, "Invalid phone number format")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  is_subscribed: yup.boolean().required("Subscription status is required"),
});

// Initial values
const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  cms_id: "",
  phone_no: "",
  address: "",
  is_subscribed: false,
};

export default Form;
