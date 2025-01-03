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
import { useParams, useRouter } from "next/navigation";
import { GET_EQUIPMENT_BY_ID, GET_ORGANIZATIONS } from "@/hooks/queries/queries";
import { EDIT_EQUIPMENT } from "@/hooks/mutations/mutation";
import OrganizationInput from "@/components/pages/dashboard/analytics/OrganizationInput";

const Card = styled(MuiCard)(spacing);
const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  organizationId: Yup.string().required("Organization is required"),
  description: Yup.string().required("Description is required"),
});


function EditEquipmentForm() {
  const { id } = useParams();
  const equipmentId = parseFloat(id[0]);
  const [fieldError, setFieldError] = useState("");
  const { data, } = useQuery(GET_EQUIPMENT_BY_ID, {
    variables: { id: equipmentId },
  });
  const [editEquipment, { loading, error }] = useMutation(EDIT_EQUIPMENT);
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [equipmentData, setEquipmentData] = useState<any>("");
  const [organizationList, setOrganizationList] = useState<any>("");
  const initialValues: any = {
    type: equipmentData?.Type || "",
    description: equipmentData?.Description || "",
    organizationId: equipmentData?.organization?.id || "",
  };


  useEffect(() => {
    if (data?.getEquipmentById) {
      setEquipmentData(data.getEquipmentById)
    }
  }, [data]);

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, errors, setSubmitting }: any
  ) => {
    const variablesData = {
      Type: values?.type,
      Description: values?.description,
      organizationId: parseFloat(values?.organizationId),
    };

    try {
      const response = await editEquipment({
        variables: {
          id: equipmentId,
          data: variablesData,
        },
      });
      if (response.data.editEquipment.success) {
        router.push('/equipment/list');
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
      {equipmentData ? <Formik
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
                Edit Equipment
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
                        defaultValue={values.type}
                        error={Boolean(touched.type && errors.type)}
                        fullWidth
                        helperText={Boolean(touched.type ? errors.type : "")}
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
                        value={values?.organizationId || ""}
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
                        name="description"
                        label="Description"
                        value={values.description}
                        error={Boolean(touched.description && errors.description)}
                        fullWidth
                        helperText={Boolean(touched.description && errors.description)}
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
                    Update Equipment
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
      <EditEquipmentForm />
    </React.Fragment>
  );
}

export default FormikPage;
