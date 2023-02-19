/** @format */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Grid } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const Auth = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    const { username, password } = values;
    const credentials = btoa(`${username}:${password}`);
    const url = "http://192.168.4.21:8000/secure";

    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        // Display error message on the UI
      });
  };

  return (
    <Box
      width="80%"
      margin="auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="30%">
      {isNonMobile && (
        <Box mb="20px">
          <h2>Welcome to the Pharmacist Portal</h2>
          <p>
            The Pharmacist Portal is a powerful tool for pharmacists and
            pharmacy managers, enabling them to gain a 360-degree view of their
            patients and the performance of their stores. With advanced features
            like real-time inventory tracking and detailed patient profiles, the
            Pharmacist Portal provides the insights necessary to make informed
            decisions and deliver the highest quality of care to patients.
          </p>
        </Box>
      )}
      <Box m="20px" width="100%">
        <Formik initialValues={initialValues} validationSchema={checkoutSchema}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleFormSubmit}>
              <Box display="grid" gap="30px">
                <Box display="grid" gap="30px">
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username" // updated name property
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password" // updated name property
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 1" }}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Auth;
