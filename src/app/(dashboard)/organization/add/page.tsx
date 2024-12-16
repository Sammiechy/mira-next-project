"use client";

import React, { useState } from "react";
import type { ReactElement } from "react";
import * as Yup from "yup";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  TextField as MuiTextField,
  Typography,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { spacing } from "@mui/system";
import { gql, useMutation } from "@apollo/client";
import ApolloProviderWrapper from "@/components/guards/apolloAuth";
import { useRouter } from "next/navigation";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;


const timeOut = (time: number) => new Promise((res) => setTimeout(res, time));

const initialValues = {
  name: "",
  email: "",
  phone: "",
  Website: "",
  locationID: ""
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  locationID: Yup.string().required("locationID is required"),
  Website: Yup.string().required("Webside is required"),
  email: Yup.string().email().required("Emai is required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
});

const ADD_ORGANIZATION = gql`
  mutation AddOrganization($data: OrganizationInput!) {
    addOrganization(data: $data) {
      message
      organization {
        id
        Name
        LocationID
        Website
        Phone
        Email
        isDeleted
      }
    }
  }
`;


function AddOrganizationForm() {
  const router= useRouter();
  const [userStatus,setUserStatus]= useState("");
  const [location,setLocation]= useState("");

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const variablesData = {
      Name: values?.name,
      Email: values?.email,
      Phone: values?.phone,
      Website:values?.Website,
      LocationID:parseFloat(location) ,
    };

    try {
      // await timeOut(1500);

  
      
      const response = await addOrganization({ variables: { data: variablesData } });
      console.log(response?.data, "response-----")
      if(response?.data?.addUser){
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/users/list')
      }else{
        setSubmitting(false);
      }
    

    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };





  const [addOrganization, { data, loading, error }] = useMutation(ADD_ORGANIZATION);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldError,
        touched,
        values,
        status,
      }) => (
        <Card mb={6}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Organisation
            </Typography>

            {status && status.sent && (
              <Alert severity="success" my={3}>
                Your data has been submitted successfully!
              </Alert>
            )}

            {isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <TextField
                      name="name"
                      label="Name"
                      value={values.name}
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      my={2}
                    />
                  </Grid>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                      <TextField
                      name="email"
                      label="Email"
                      value={values.email}
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      variant="outlined"
                      my={2}
                    />
                   
                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth  error={Boolean(touched.locationID && errors.locationID)}>
                      <InputLabel id="demo-simple-select-error-label">Location</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="locationID"
                        label="Location"
                        id="demo-simple-select-error"
                        value={location}                      
                        onChange={(e:any)=>{handleChange(e),setLocation(e.target.value),setFieldError("locationID","")}}
                      >
                        <MenuItem value={"1"}>Chandigarh</MenuItem>
                        <MenuItem value={"2"}>Mohali</MenuItem>
                        <MenuItem value={"3"}>Delhi</MenuItem>
                        <MenuItem value={"4"}>Pune</MenuItem>
                        <MenuItem value={"5"}>Hyderabad</MenuItem>
                      </Select>
                      <FormHelperText>{touched && errors.locationID}</FormHelperText>
                    </FormControl>
                  </Grid>
                 
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >

                    <TextField
                      name="phone"
                      label="Phone Number"
                      value={values.phone}
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      variant="outlined"
                      my={2}
                    />
                  </Grid>
                </Grid>


                <Grid container spacing={6}>
                <Grid
                    size={{
                      md: 6,
                    }}
                  >

                      <TextField 
                      name="Website"
                      label="Website"
                      value={values.Website}
                      error={Boolean(touched.Website && errors.Website)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      variant="outlined"
                      my={2}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Save Organization
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}

function FormikPage() {
  return (
    <ApolloProviderWrapper>
      <React.Fragment>
        <AddOrganizationForm />
      </React.Fragment>
    </ApolloProviderWrapper>
  );
}

export default FormikPage;
