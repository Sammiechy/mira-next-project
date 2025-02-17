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
  Paper as MuiPaper,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery } from "@apollo/client";
import ApolloProviderWrapper from "@/components/guards/apolloAuth";
import { useRouter } from "next/navigation";
import { GET_ORGANIZATIONS } from "hooks/queries/queries";
import { CREATE_DRIVERS } from "@/hooks/mutations/mutation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";
import { DatePicker } from "@mui/x-date-pickers";
import GooglePlacesAutocomplete from "@/components/pages/dashboard/analytics/GooglePlacesAutocomplete";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);
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
  Notes: "",
  gender:"",
  dob:null,
  PrimaryCitizenship:"",
  Primary_Phone:"",
  SecondaryCitizenship:"",
  address:""
};

const validationSchema = Yup.object().shape({
  FirstName: Yup.string().required("First Name is required"),
  LastName: Yup.string().required("Last Name is required"),
  Notes: Yup.string().required("Notes is required"),
  organizationId: Yup.string().required("Organization is required"),
  PaymentMethod: Yup.string().required("Payment Method is required"),
  gender: Yup.string().required("Gender is required"),
  email: Yup.string().email().required("Emai is required"),
  dob: Yup.string().required("DOB is required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
});


function AddShipperForm() {
  const router = useRouter();
  const [organizationList, setOrganizationList] = useState<any>("");
  const [organisation, setOrganisation] = useState<any>("");

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const organisationID = parseFloat(organisation);
    const variablesData = {
      FirstName: values?.FirstName,
      LastName: values?.LastName,
      Email: values?.email,
      Phone: values?.phone,
      organizationId: organisationID,
      Notes: values?.Notes,
      PaymentMethod: values?.PaymentMethod,
      // PrimaryPhone: values?.PrimaryPhone,
      // SecondaryPhone: values?.SecondaryPhone || null, 
      DOB: values?.dob||"1993-05-03",
      Gender: values?.Gender||"female",
      PrimaryCitizenship: values?.PrimaryCitizenship || "",
      SecondaryCitizenship: values?.SecondaryCitizenship || "", 
      address:values?.address,
      Primary_Phone:""
      // Street: values?.Street || "",
      // City: values?.City || "",
      // State: values?.State || "",
      // ZipCode: values?.ZipCode || "",
      // Country: values?.Country || "",
    };
   
    try {
      const response = await createDrivers({ variables: variablesData });
      if (response?.data?.createDrivers) {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/driver/list')
      } else {
        setSubmitting(false);
      }


    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const [createDrivers, { loading, error }] = useMutation(CREATE_DRIVERS);

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
                      <FormControl fullWidth error={Boolean(touched.gender && errors.gender)}>
                      <InputLabel id="demo-simple-select-error-label">Gender</InputLabel>
                     <Select
                        labelId="demo-simple-select-error-label"
                        name="gender"
                        label="Gender"
                        id="demo-simple-select-error"
                        value={values.gender}
                        onChange={handleChange}
                        
                      >
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                      </Select>
                      <FormHelperText>{Boolean(touched && errors.gender)}</FormHelperText>
                      </FormControl>
                     </Grid>
                     <Grid size={{
                      md: 6,
                    }}>
                     
                     <FormControl fullWidth error={Boolean(touched.dob && errors.dob)}>
          <DatePicker
            label="Date of Birth"
            value={values?.dob}
            name="dob"
            onChange={(newValue)=>setFieldValue("dob",newValue)}
          />
        </FormControl>
        <FormHelperText>{Boolean(touched && errors.dob)}</FormHelperText>
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
                      error={errors.organizationId}
                      touched={touched.organizationId}
                      onChange={(e: any) => { handleChange(e), setOrganisation(e.target.value) }}
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
                      name="Primary_Phone"
                      label="Primary Phone Number"
                      value={values.Primary_Phone}
                      error={Boolean(touched.Primary_Phone && errors.Primary_Phone)}
                      fullWidth
                      helperText={touched.Primary_Phone && errors.Primary_Phone}
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
                      name="PrimaryCitizenship"
                      label="Primary Citizenship"
                      value={values.PrimaryCitizenship}
                      error={Boolean(touched.PrimaryCitizenship && errors.PrimaryCitizenship)}
                      fullWidth
                      helperText={touched.PrimaryCitizenship && errors.PrimaryCitizenship}
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
                      name="SecondaryCitizenship"
                      label="Secondary Citizenship"
                      value={values.SecondaryCitizenship}
                      error={Boolean(touched.SecondaryCitizenship && errors.SecondaryCitizenship)}
                      fullWidth
                      helperText={touched.SecondaryCitizenship && errors.SecondaryCitizenship}
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
                    <GooglePlacesAutocomplete
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.address && errors.address)}
                      name="address"
                      values={values?.address}
                      helperText={Boolean(errors.address)}
                      // defaultValue={""}
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
