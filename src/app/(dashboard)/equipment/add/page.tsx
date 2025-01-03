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
import { CREATE_EQUIPMENT } from "@/hooks/mutations/mutation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  type: "",
  description: "",
  organizationId: "",
};

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  organizationId: Yup.string().required("Organization is required"),
  description: Yup.string().required("Description is required"),
});


function AddEquipmentForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const [organisation, setOrganisation] = useState<any>("");

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const organisationID = parseFloat(organisation);
    const variablesData = {
      Type: values?.type,
      Description: values?.description,
      organizationId: organisationID,
    };

    try {
      const response = await createEquipment({ variables: variablesData });
      if (response?.data?.createEquipment) {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/equipment/list')
      } else {
        setSubmitting(false);
      }


    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const [createEquipment, { loading, error }] = useMutation(CREATE_EQUIPMENT);

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
              Add New Equipment
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
                      name="type"
                      label="Type"
                      value={values.type}
                      error={Boolean(touched.type && errors.type)}
                      fullWidth
                      helperText={touched.type && errors.type}
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
                    <OrganizationInput
                      name="organizationId"
                      label="Organization"
                      value={values?.organizationId}
                      options={organizationList}
                      error={errors.organizationId}
                      touched={touched.organizationId}
                      onChange={(e: any) => { handleChange(e), setOrganisation(e.target.value)}}
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
                      name="description"
                      label="Description"
                      value={values.description}
                      error={Boolean(touched.description && errors.description)}
                      fullWidth
                      helperText={touched.description && errors.description}
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
        <AddEquipmentForm />
      </React.Fragment>
    </ApolloProviderWrapper>
  );
}

export default FormikPage;
