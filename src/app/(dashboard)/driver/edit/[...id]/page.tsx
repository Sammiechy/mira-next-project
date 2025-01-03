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
  FormHelperText,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { GET_DRIVER_BY_ID, GET_ORGANIZATIONS } from "@/hooks/queries/queries";
import { EDIT_DRIVER } from "@/hooks/mutations/mutation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);
const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;

const validationSchema = Yup.object().shape({
  FirstName: Yup.string().required("First Name is required"),
  LastName: Yup.string().required("Last Name is required"),
  Notes: Yup.string().required("Notes is required"),
  organizationId: Yup.string().required("Organization is required"),
  PaymentMethod: Yup.string().required("Payment Method is required"),
  email: Yup.string().email().required("Emai is required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
});


function EditShipperForm() {
  const { id } = useParams();
  const shipperId = parseFloat(id[0]);
  const [fieldError, setFieldError] = useState("");
  const { data, } = useQuery(GET_DRIVER_BY_ID, {
    variables: { id: shipperId },
  });
  const [editDrivers, { loading, error }] = useMutation(EDIT_DRIVER);
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [driverData, setDriverData] = useState<any>("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const initialValues: any = {
    FirstName: driverData?.FirstName || "",
    LastName: driverData?.LastName || "",
    email: driverData?.Email || location,
    phone: driverData?.Phone || "",
    PaymentMethod: driverData?.PaymentMethod || "",
    Notes: driverData?.Notes || "",
    organizationId: driverData?.organization?.id || "",
  };

  useEffect(() => {
    if (data?.getDriversById) {
      setDriverData(data.getDriversById)

    }
  }, [data]);


  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, errors, setSubmitting }: any
  ) => {

    const variablesData = {
      FirstName: values?.FirstName,
      LastName: values?.LastName,
      Email: values?.email,
      Phone: values?.phone,
      organizationId: parseFloat(values?.organizationId),
      PaymentMethod: values?.PaymentMethod,
      Notes: values?.Notes,
    };

    try {
      const response = await editDrivers({
        variables: {
          id: shipperId,
          data: variablesData,
        },
      });
      if (response.data.editDrivers.success) {
        router.push('/driver/list');
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

  const organizationQuery = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 1000 },
  });

  useEffect(() => {
    if (organizationQuery?.data) {
      setOrganizationList(organizationQuery?.data.getOrganizations?.organizations);
    }
    organizationQuery?.refetch();
  }, [organizationQuery?.data]);

  return (
    <>
      {driverData ? <Formik
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
          setFieldValue,
          touched,
          values,
          status,
        }) => (
          <Card mb={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit Shipper
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
                        name="FirstName"
                        label="First Name"
                        value={values.FirstName}
                        error={Boolean(touched.FirstName && errors.FirstName)}
                        fullWidth
                        helperText={Boolean(touched.FirstName && errors.FirstName)}
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
                        name="LastName"
                        label="Last Name"
                        value={values.LastName}
                        error={Boolean(touched.LastName && errors.LastName)}
                        fullWidth
                        helperText={Boolean(touched.LastName && errors.LastName)}
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
                  </Grid>


                  <Grid container spacing={6}>
                    <Grid
                      size={{
                        md: 6,
                      }}
                    >
                      <FormControl fullWidth error={Boolean(touched.PaymentMethod && errors.PaymentMethod)}>
                        <InputLabel id="demo-simple-select-error-label">Payment Method</InputLabel>
                        <Select
                          labelId="demo-simple-select-error-label"
                          name="PaymentMethod"
                          label="Payment Method"
                          id="demo-simple-select-error"
                          value={values.PaymentMethod}
                          onChange={handleChange}
                        >
                          <MenuItem value={'PER_HOUR'}>Per Hour</MenuItem>
                          <MenuItem value={'PER_MILES'}>Per Miles</MenuItem>
                        </Select>
                        <FormHelperText>{Boolean(touched && errors.PaymentMethod)}</FormHelperText>
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
                        error={null}
                        touched={false}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={12}>
                    <Grid
                      size={{
                        md: 12,
                      }}
                    >
                      <TextField
                        name="Notes"
                        label="Notes"
                        value={values.Notes}
                        error={Boolean(touched.Notes && errors.Notes)}
                        fullWidth
                        helperText={Boolean(touched.Notes && errors.Notes)}
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
                    Save
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </Formik> : "...loading"}
    </>

  );
}

function FormikPage() {
  return (
    <React.Fragment>
      <EditShipperForm />
    </React.Fragment>
  );
}

export default FormikPage;
