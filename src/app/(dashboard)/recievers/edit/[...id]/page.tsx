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
import { GET_ORGANIZATIONS, GET_RECIEVER_BY_ID } from "@/hooks/queries/queries";
import { EDIT_RECIEVER } from "@/hooks/mutations/mutation";
import LocationComp from "@/components/locationField/LocationComp";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";
import GooglePlacesAutocomplete from "@/components/pages/dashboard/analytics/GooglePlacesAutocomplete";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);

const validationSchema = Yup.object().shape({
  Name: Yup.string().required("name is required"),
  email: Yup.string().required("Email is required"),
  LocationID: Yup.string().required("Location is required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  organizationId: Yup.string().required("organization is required")
});


function EditRecieverForm() {
  const { id } = useParams();
  const shipperId = parseFloat(id[0]);
  const { data, } = useQuery(GET_RECIEVER_BY_ID, {
    variables: { id: shipperId },
  });
  const [editReciever] = useMutation(EDIT_RECIEVER);
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [shipperData, setShipperData] = useState<any>("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const initialValues: any = {
    Name: shipperData?.Name || "",
    LocationID: shipperData?.address || "",
    email: shipperData?.Email || location,
    phone: shipperData?.Phone || "",
    organizationId: shipperData?.organization?.id || "",
  };

  useEffect(() => {
    if (data?.getRecieverById) {
      setShipperData(data.getRecieverById)

    }
  }, [data]);


  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {

    const variablesData = {
      Name: values?.Name,
      Email: values?.email,
      Phone: values?.phone,
      organizationId: parseFloat(values?.organizationId),
      address: values?.locationID?.target?.name,
      LocationID: values?.LocationID,
    };

    try {
      const response = await editReciever({
        variables: {
          id: shipperId,
          data: variablesData,
        },
      });
      if (response.data.editReciever.success) {
        router.push('/recievers/list');
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
      {shipperData ? <Formik
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
          setFieldValue,
          values,
          status,
        }) => (
          <Card mb={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit Reciever
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
                        name="Name"
                        label="Name"
                        value={values.Name}
                        defaultValue={values.Name}
                        error={Boolean(touched.Name && errors.Name)}
                        fullWidth
                        helperText={Boolean(touched.Name ? errors.Name : "")}
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
                        helperText={Boolean(touched.email ? errors.email : "")}
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
                      {/* <LocationComp
                        defaultValue={values?.LocationID}
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.locationID && errors.locationID)}
                        name="Location" helperText={Boolean(touched.LocationID && errors.LocationID)}
                      /> */}
                       <GooglePlacesAutocomplete
                      setFieldValue={setFieldValue}
                      error={Boolean(touched.locationID && errors.locationID)}
                      name="locationID"
                      values={values}
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
                        helperText={Boolean(touched.phone && errors.phone)}
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
                    Update Reciever
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
      <EditRecieverForm />
    </React.Fragment>
  );
}

export default FormikPage;
