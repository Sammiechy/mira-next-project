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
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery } from "@apollo/client";
import ApolloProviderWrapper from "@/components/guards/apolloAuth";
import { useRouter } from "next/navigation";
import { GET_ORGANIZATIONS } from "hooks/queries/queries";
import { CREATE_LOCATION, CREATE_SHIPPER } from "@/hooks/mutations/mutation";
import LocationComp from "@/components/locationField/LocationComp";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";
import GooglePlacesAutocomplete from "@/components/pages/dashboard/analytics/GooglePlacesAutocomplete";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  email: "",
  phone: "",
  organizationId: "",
  locationID: ""
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  locationID: Yup.string()
    .transform((value) => {
      if (typeof value === "object" && value?.target?.value) {
        return value.target.value;
      }
      return value;
    })
    .required("Location is required"),
  organizationId: Yup.string().required("Organization is required"),
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
      address: values?.locationID?.target?.name,
      LocationID: values?.locationID?.target?.value
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

    console.log(variablesData, values, 'variablesDatavariablesData')
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
              Add New Shipper
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
                    {/* <LocationComp
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.locationID && errors.locationID)}
                      name={"locationID"} values={values}
                      helperText={Boolean(touched.locationID && errors.locationID)}
                    /> */}
                     <GooglePlacesAutocomplete
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.locationID && errors.locationID)}
                      name="locationID"
                      values={values?.locationID}
                      helperText={Boolean(errors.locationID)}
                      // defaultValue={""}
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
