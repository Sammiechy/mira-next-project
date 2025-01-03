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
import ApolloProviderWrapper from "@/components/guards/apolloAuth";
import { useRouter } from "next/navigation";
import { GET_ORGANIZATIONS } from "hooks/queries/queries";
import { CREATE_LOCATION, CREATE_SHIPPER } from "@/hooks/mutations/mutation";
import LocationComp from "@/components/locationField/LocationComp";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);
const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;


const initialValues = {
  FirstName: "",
  LastName: "",
  email: "",
  phone: "",
  organizationId: "",
  PaymentMethod: "",
  Notes: ""
};

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


function AddShipperForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const [organisation, setOrganisation] = useState<any>("");

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const organisationID = parseFloat(organisation);
    const locationID = parseFloat(location);
    const variablesData = {
      Name: values?.name,
      Email: values?.email,
      Phone: values?.phone,
      organizationId: organisationID,
      LocationID: values?.locationID?.target?.value,
      address: values?.locationID?.target?.name
    };
    const [City, State_Province, Country] = values?.locationID?.target?.name.split(", ").map((item: any) => item.trim());
    const LocationData = {
      Address1: values?.locationID?.target?.name,
      places_id: values?.locationID?.target?.value,
      City: City || "",
      Country: Country || "",
      State_Province: State_Province || "",
      PostalCode_Zip: "",
      Address2: ""
    }

    try {
      const response = await createShipper({ variables: variablesData });
      const res = await createLocation({ variables: LocationData })
      if (response?.data?.createShipper) {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/shippers/list')
      } else {
        setSubmitting(false);
      }


    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const [createShipper, { loading, error }] = useMutation(CREATE_SHIPPER);
  const [createLocation] = useMutation(CREATE_LOCATION);

  const { data, refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 1000 },
  });

  useEffect(() => {
    if (data) {
      setOrganizationList(data.getOrganizations?.organizations);
    }
    refetch();
  }, [data]);
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
        setFieldValue,
        values,
        status,
      }) => (
        <Card mb={6}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Driver
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
                      helperText={touched.FirstName && errors.FirstName}
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
                      helperText={touched.LastName && errors.LastName}
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
                      helperText={touched.phone && errors.phone}
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
                    <FormControl fullWidth error={Boolean(touched.PaymentMethod && errors.PaymentMethod)}>
                      <InputLabel id="demo-simple-select-error-label">Payment Method</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="PaymentMethod"
                        label="Payment Method"
                        id="demo-simple-select-error"
                        value={''}
                      // onChange={(e:any)=>{handleChange(e),setOrganisation(e.target.value),setFieldError("locationID","")}}
                      >
                        <MenuItem value={'per hour'}>Per Hour</MenuItem>
                        <MenuItem value={'per miles'}>Per Miles</MenuItem>
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
                      error={errors.organizationId}
                      touched={touched.organizationId}
                      onChange={(e: any) => { handleChange(e), setOrganisation(e.target.value) }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={12}>
                  <Grid
                    size={{
                      md: 12,
                    }}
                  >
  </Grid></Grid>

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
    </Formik>
  );
}

function FormikPage() {
  return (
    <ApolloProviderWrapper>
      <React.Fragment>
        <AddShipperForm />
      </React.Fragment>
    </ApolloProviderWrapper>
  );
}

export default FormikPage;
