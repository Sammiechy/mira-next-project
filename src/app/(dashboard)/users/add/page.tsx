"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import styled from "@emotion/styled";
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
  TextField as MuiTextField,
  Typography,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { spacing } from "@mui/system";
import { gql, useMutation, useQuery } from "@apollo/client";
import ApolloProviderWrapper from "@/components/guards/apolloAuth";
import { useRouter } from "next/navigation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";
import { GET_ORGANIZATIONS } from "@/hooks/queries/queries";
import { ADD_USER } from "@/hooks/mutations/mutation";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);
const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "",
  status: 1,
  organizationId: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email().required("Emai is required"),
  organizationId: Yup.string().required("Organization is required"),
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

function AddUserForm() {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState("");
  const [role, setRole] = useState("user");
  const [organisation, setOrganisation] = useState<any>("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const organisationID = parseFloat(organisation);
    const variablesData = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      phone: values?.phone,
      role: `${role}`,
      organizationId: organisationID,
      password: values?.password,
      status: `${userStatus}`,
      type: "1",
    };

    try {
      const response = await addUser({ variables: { ...variablesData } });
      if (response?.data?.addUser) {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/users/list')
      } else {
        setSubmitting(false);
      }


    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };


  const [addUser, { data, loading, error }] = useMutation(ADD_USER);
  const getOrganizationList = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 1000 },
  });

  useEffect(() => {
    if (getOrganizationList?.data) {
      setOrganizationList(getOrganizationList?.data?.getOrganizations?.organizations);
    }
    getOrganizationList?.refetch();
  }, [getOrganizationList?.data]);

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
        setFieldError,
        isSubmitting,
        touched,
        values,
        status,
      }) => (
        <Card mb={6}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New User
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
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      fullWidth
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
                        value={role}
                        onChange={(e: any) => { handleChange(e), setRole(e.target.value) }}
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
                        value={userStatus}
                        onChange={(e: any) => { handleChange(e), setUserStatus(e.target.value) }}
                      >
                        <MenuItem value={1}>Approved</MenuItem>
                        <MenuItem value={0}>Disapproved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <OrganizationInput
                      name="organizationId"
                      label="Organization"
                      value={values?.organizationId}
                      options={organizationList}
                      error={errors.organizationId}
                      touched={touched.organizationId}
                      onChange={(e: any) => { handleChange(e), setOrganisation(e.target.value), setFieldError("locationID", "") }}

                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Save User
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
        <AddUserForm />
      </React.Fragment>
    </ApolloProviderWrapper>
  );
}

export default FormikPage;
