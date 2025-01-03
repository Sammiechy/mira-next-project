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
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import LocationComp from "@/components/locationField/LocationComp";
import { EDIT_ORGANIZATION } from "@/hooks/mutations/mutation";
import { GET_ORGANIZATION_BY_ID } from "@/hooks/queries/queries";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const validationSchema = Yup.object().shape({
  Name: Yup.string().required("name is required"),
  email: Yup.string().required("Email is required"),
  LocationID: Yup.string().required("Location is required"),
  //  phone: Yup.string().required("phone required"),
  phone: Yup.string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  Website: Yup.string().required("Website is required")
});


function EditUserForm() {
  const { id } = useParams();
  const organizationId = parseFloat(id[0]);

  const { data, } = useQuery(GET_ORGANIZATION_BY_ID, {
    variables: { id: organizationId },
  });
  const [editOrganization, { loading, error }] = useMutation(EDIT_ORGANIZATION);
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [organisationData, setOrganizationData] = useState<any>("");

  const initialValues: any = {
    Name: organisationData?.Name || "",
    LocationID: organisationData?.address || "",
    email: organisationData?.Email || location,
    phone: organisationData?.Phone || "",
    Website: organisationData?.Website || "",
  };

  useEffect(() => {
    if (data?.getOrganizationById) {
      setOrganizationData(data.getOrganizationById)

    }
  }, [data]);


  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, errors, setSubmitting }: any
  ) => {

    const variablesData = {
      Name: values?.Name,
      Email: values?.email,
      Phone: values?.phone,
      Website: values?.Website,
      LocationID: values?.locationID?.target?.value,
      address: values?.locationID?.target?.name
    };

    try {
      const response = await editOrganization({
        variables: {
          id: organizationId,
          data: variablesData,
        },
      });
      if (response.data.editOrganization.success) {
        router.push('/organization/list');
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

  return (
    <>
      {organisationData ? <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          touched,
          values,
          status,
        }) => (
          <Card mb={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit Organization
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
                        helperText={Boolean(touched.email && errors.email)}
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
                      <LocationComp
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.locationID && errors.locationID)}
                        name={"locationID"}
                        defaultValue={values?.LocationID}
                        helperText={Boolean(touched.locationID && errors.locationID)}
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
                        // type="text"
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
                        helperText={Boolean(touched.Website && errors.Website)}
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
                    Update Organization
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
      <EditUserForm />
    </React.Fragment>
  );
}

export default FormikPage;
