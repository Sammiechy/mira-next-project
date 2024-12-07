"use client";

import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams,useRouter } from "next/navigation";

const Card = styled(MuiCard)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email().required("Emai is required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password cannot exceed 255 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /^(?=.*\d)/,
      "Password must contain at least one number"
    )
    .matches(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Edit_USER = gql`
mutation editUser(
  $id:String!
  $firstName: String!
  $lastName: String!
  $email: String!
  $phone: String!
  $role: String!
  $type: String!
  $status: String!
  $organizationId:  Float!
  $password: String!
) {
  editUser(
    id:$id
    firstName: $firstName
    lastName: $lastName
    email: $email
    phone: $phone
    role: $role
    type: $type
    status: $status
    organizationId: $organizationId
    password: $password
  ) {
    id
    firstName
    lastName
    email
  }
}
`;

const EDIT_USER_MUTATION = gql`
mutation EditUser(
  $id: Float!
  $firstName: String
  $lastName: String
  $email: String
  $phone: String
  $role: String
  $type: String
  $status: String
  $organizationId: Float
  $password: String
) {
  editUser(
    id: $id
    firstName: $firstName
    lastName: $lastName
    email: $email
    phone: $phone
    role: $role
    type: $type
    status: $status
    organizationId: $organizationId
    password: $password
  ) {
    id
    firstName
    lastName
    email
    phone
    role
    type
    status
    organizationId
  }
}
`;

function EditUserForm() {
const [editUser, { data, loading, error }] = useMutation(EDIT_USER_MUTATION);
 const {id}= useParams();
 const router= useRouter();

  const userData = useSelector((state: RootState) => state.userData);
  const [userstatus,setStatus] =useState("");
  const [role,setRole] =useState("");

  const initialValues :any= {
    firstName: userData?.editUser?.firstName||"",
    lastName: userData?.editUser?.lastName||"",
    email: userData?.editUser?.email||"",
    phone: userData?.editUser?.phone||"",
    password:"Welcome@123",
    confirmPassword: "Welcome@123",
    role: role||"user",
    status: userstatus||"1"
  };

useEffect(()=>{
  setStatus(userData?.editUser?.status);
  setRole(userData?.editUser?.role);
},[userData])

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {

    const variablesData = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      phone: values?.phone,
      role: role,
      organizationId: parseFloat("1"),
      password: values?.password,
      status: userstatus,
      id: parseFloat(id?.[0]),
      type: "1",
    };
 
    try {
      const response = await editUser({ variables: { ...variablesData } });
      if(response?.data?.editUser){
        router.push('/users/list');
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
      }else{
        setSubmitting(false);
      }
   
    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };



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
        touched,
        values,
        status,
      }) => (
        <Card mb={6}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit User
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
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
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
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      error={Boolean(touched.lastName && errors.lastName)}
                      fullWidth
                      helperText={touched.lastName && errors.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      name="password"
                      label="Password"
                      value={values.password}
                      defaultValue={values.password}
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
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
                      name="confirmPassword"
                      label="Confirm password"
                      value={values.confirmPassword}
                      defaultValue={values.confirmPassword}
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      fullWidth
                      // defaultValue={"123456789"}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
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
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-error-label">Role</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        label="Age"
                        id="demo-simple-select-error"
                        defaultValue={values?.role}
                        value={role}
                        onChange={ (e:any)=>{handleChange(e),setRole(e.target.value)}}
                        // onChange={handleChange}
                      >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-error-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        label="Age"
                        id="demo-simple-select-error"
                        defaultValue={values.status}
                        value={userstatus}
                        onChange={ (e:any)=>{handleChange(e),setStatus(e.target.value)}}
                      >
                        <MenuItem value={"1"}>Approved</MenuItem>
                        <MenuItem value={"0"}>Disapproved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Update User
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
    <React.Fragment>
      <EditUserForm />
    </React.Fragment>
  );
}

export default FormikPage;
