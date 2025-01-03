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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";
import { GET_ORGANIZATIONS } from "@/hooks/queries/queries";
import { EDIT_USER_MUTATION } from "@/hooks/mutations/mutation";
import { GET_USER_BY_ID } from "@/hooks/queries/queries";

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
  organizationId: Yup.string().required("organization is required")
});


function EditUserForm() {
  const [editUser, { loading, error }] = useMutation(EDIT_USER_MUTATION);
  const { id } = useParams();
   const userId= parseFloat(id[0])
  const router = useRouter();
  const [userData, setUserData] = useState<any>("");
  const [userstatus, setStatus] = useState("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const [role, setRole] = useState("");

  const { data, } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  useEffect(() => {
    if (data?.getUserById) {
      setUserData(data.getUserById)
      setRole(data.getUserById.role || "user");
    setStatus(data.getUserById.status || "1");
    }
  }, [data]);

console.log(userData,"userData---")
  const initialValues: any = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    password: "Welcome@123",
    confirmPassword: "Welcome@123",
    role: role || "user",
    status: userstatus || "1",
    organizationId: "1",
  };


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
      organizationId: parseFloat(values?.organizationId),
      // password: values?.password,
      // password: values?.password,
      status: userstatus,
      id: parseFloat(id?.[0]),
      type: "1",
    };

    try {
      const response = await editUser({ variables: { ...variablesData } });
      if (response?.data?.editUser) {
        router.push('/users/list');
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }

    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

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
    <>
    {userData?  <Formik
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
                      helperText={Boolean(touched.firstName && errors.firstName)}
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
                      helperText={Boolean(touched.lastName && errors.lastName)}
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
                      helperText={Boolean(touched.email && errors.email)}
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
                      helperText={Boolean(touched.phone && errors.phone)}
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
                      disabled
                      helperText={Boolean(touched.password && errors.password)}
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
                      disabled
                      defaultValue={values.confirmPassword}
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      fullWidth
                      // defaultValue={"123456789"}
                      helperText={Boolean(touched.confirmPassword && errors.confirmPassword)}
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
                        defaultValue={values?.role||""}
                        value={role}
                        onChange={(e: any) => { handleChange(e), setRole(e.target.value) }}
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
                        onChange={(e: any) => { handleChange(e), setStatus(e.target.value) }}
                      >
                        <MenuItem value={"1"}>Approved</MenuItem>
                        <MenuItem value={"0"}>Disapproved</MenuItem>
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
                      value={values?.organizationId || ""}
                      options={organizationList}
                      error={null}
                      touched={false}
                      onChange={handleChange}
                    />
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
    </Formik>: null }
    </>
   
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
