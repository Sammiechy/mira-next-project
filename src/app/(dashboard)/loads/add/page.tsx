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
import { GET_DRIVERS, GET_EQUIPMENTS, GET_ORGANIZATIONS, GET_RECIEVER, GET_SHIPPERS } from "hooks/queries/queries";
import { ADD_LOAD_MUTATION, CREATE_DRIVERS } from "@/hooks/mutations/mutation";
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
  ShipperId: "",
  ReceiverId: "",
  DriverIds: "",
  EquipmentIds: "",
  OriginLocationId: "",
  DestinationLocationId: "",
  Type: "",
  Weight: "",
  Description: "",
  Notes: "",
  OrganizationId: "",
  Status: "",
  LoadingDate: null,
  DeliveryDate: null
};

const validationSchema = Yup.object().shape({
  ShipperId: Yup.string().required("Shipper is required"),
  ReceiverId: Yup.string().required("Receiver is required"),
  DriverIds: Yup.string().required("Driver is required"),
  EquipmentIds: Yup.string().required("Equipment is required"),
  OriginLocationId: Yup.string().required("Origin Location is required"),
  DestinationLocationId: Yup.string().required("Destination Location is required"),
  Type: Yup.string().required("Type is required"),
  Weight: Yup.string().required("Weight is required"),
  Description: Yup.string().required("Description is required"),
  Notes: Yup.string().required("Notes is required"),
  OrganizationId: Yup.string().required("Organization is required"),
  Status: Yup.string().required("Status is required"),
  LoadingDate: Yup.string().required("Loading Date is required"),
  DeliveryDate: Yup.string().required("Delivery Date is required"),
});


function AddShipperForm() {
  const router = useRouter();
  const [organizationList, setOrganizationList] = useState<any>("");
  const [shipperList, setShipperList] = useState<any>("");
  const [recieverList, setRecieverList] = useState<any>("");
  const [driverList, setDriverList] = useState<any>("");
  const [equipmentList, setEquipmntList] = useState<any>("");

  const [organisation, setOrganisation] = useState<any>("");
  const [addLoad, { loading, error, data:loadData }] = useMutation(ADD_LOAD_MUTATION);


  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, setSubmitting }: any
  ) => {
    const organisationID = parseFloat(organisation);
    const variablesData = {
      organizationId:values?.OrganizationId,
      notes: values?.Notes,
      description: values?.Description,
      loading_date: values?.LoadingDate || "1993-05-03",
      equipment_id: values?.equipment_id || 1,
      type:values?.Type||"",
      weight:values?.Weight||"",
      origin_location_id: values?.OriginLocationId||"",
      destination_location_id: values?.DestinationLocationId||"",
      delivery_date:values?.DeliveryDate||"",
      status:values?.Status||"",
      driver_id:values?.DriverIds,
      reciever_id:values?.ReceiverId,
      shipper_id:values?.ShipperId
    };

    try {
      const response = await addLoad({  variables: { data: variablesData }  });
      if (response?.data?.addLoad) {
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
        router.push('/loads/list')
      } else {
        setSubmitting(false);
      }


    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };
  
  const { data:shippers ,refetch:shipperFetch } = useQuery(GET_SHIPPERS, {
    variables: { page: 1, limit: 1000 },
  });
  const { data:receiver ,refetch:recieverFetch} = useQuery(GET_RECIEVER, {
    variables: { page: 1, limit: 1000 },
  });

  const { data, refetch } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 1000 },
  });

  
  const { data:euipment,refetch:equipfetch } = useQuery(GET_EQUIPMENTS, {
    variables: { page: 1, limit: 1000 },
  });
  const { data:driver,refetch:driverfetch } = useQuery(GET_DRIVERS, {
    variables: { page: 1, limit: 1000 },
  });

  useEffect(() => {
    if (data) {
      setOrganizationList(data.getOrganizations?.organizations);
    }
    if(shippers){
      setShipperList(shippers.getShippers?.shippers)
    }
    if(receiver){
      setRecieverList(receiver.getRecievers?.recievers)
    }
    refetch();
    shipperFetch();
    recieverFetch();
    equipfetch();
    driverfetch()
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
              Add New Loads
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

                    <FormControl fullWidth error={Boolean(touched.ShipperId && errors.ShipperId)}>
                      <InputLabel id={`ShipperId-label`}>Shipper</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="ShipperId"
                        label="Shipper"
                        id="demo-simple-select-error"
                        value={values.ShipperId}
                        onChange={handleChange}
                      >
                        {Array.isArray(shippers?.getShippers?.shippers) &&
                          shippers?.getShippers?.shippers?.length > 0 &&
                          shippers?.getShippers?.shippers?.map((org: { id: any; Name: any; }, index: React.Key | null | undefined) => (
                            <MenuItem key={index} value={org?.id || ""}>
                              {org?.Name || "Unknown Name"}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.ShipperId && errors.ShipperId && (
                        <FormHelperText>{errors.ShipperId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.ReceiverId && errors.ReceiverId)}>
                      <InputLabel id={`Receiver-label`}>Receiver</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="ReceiverId"
                        label="Receiver"
                        id="demo-simple-select-error"
                        value={values.ReceiverId}
                        onChange={handleChange}
                      >
                        {Array.isArray(receiver?.getRecievers?.recievers) &&
                          receiver?.getRecievers?.recievers?.length > 0 &&
                          receiver?.getRecievers?.recievers?.map((org: { id: any; Name: any; }, index: React.Key | null | undefined) => (
                            <MenuItem key={index} value={org?.id || ""}>
                              {org?.Name || "Unknown Name"}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.ReceiverId && errors.ReceiverId && (
                        <FormHelperText>{errors.ReceiverId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.DriverIds && errors.DriverIds)}>
                      <InputLabel id={`driver-label`}>Driver</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="DriverIds"
                        label="Driver"
                        id="demo-simple-select-error"
                        value={values.DriverIds}
                        onChange={handleChange}
                      >
                        {Array.isArray(driver?.getDrivers?.drivers) &&
                          driver?.getDrivers?.drivers?.length > 0 &&
                          driver?.getDrivers?.drivers?.map((org: { id: any; FirstName: any;LastName:any }, index: React.Key | null | undefined) => (
                            <MenuItem key={index} value={org?.id || ""}>
                              {org?.FirstName } { org?.LastName} 
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.DriverIds && errors.DriverIds && (
                        <FormHelperText>{errors.DriverIds}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.EquipmentIds && errors.EquipmentIds)}>
                      <InputLabel id="Equipment-label">Equipment</InputLabel>
                      <Select
                        labelId="Equipment-label"
                        name="EquipmentIds"
                        label="Equipment"
                        id="demo-simple-select-error"
                        value={values.EquipmentIds}
                        onChange={handleChange}
                        onBlur={handleBlur} // Ensure field is marked as touched
                      >
                        {Array.isArray(euipment?.getEquipment?.equipment) &&
                          euipment?.getEquipment?.equipment.length > 0 &&
                          euipment?.getEquipment?.equipment.map((org: { id: any; Type: any; }, index: React.Key | null | undefined) => (
                            <MenuItem key={index} value={org?.id || ""}>
                              {org?.Type || "Unknown Name"}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.EquipmentIds && errors.EquipmentIds && (
                        <FormHelperText>{errors.EquipmentIds}</FormHelperText>
                      )}
                    </FormControl>

                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.OriginLocationId && errors.OriginLocationId)}>
                      <GooglePlacesAutocomplete
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.OriginLocationId && errors.OriginLocationId)}
                        name="OriginLocationId"
                        values={values?.OriginLocationId}
                        helperText={Boolean(errors.OriginLocationId)}
                        label='Origin Location'
                      // defaultValue={""}
                      />
                      <FormHelperText>{Boolean(touched && errors.OriginLocationId)}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={{
                    md: 6,
                  }}>
                    <FormControl fullWidth error={Boolean(touched.DestinationLocationId && errors.DestinationLocationId)}>
                      <GooglePlacesAutocomplete
                        setFieldValue={setFieldValue}
                        error={Boolean(touched.DestinationLocationId && errors.DestinationLocationId)}
                        name="DestinationLocationId"
                        values={values?.DestinationLocationId}
                        helperText={Boolean(errors.DestinationLocationId)}
                        label='Destination Location'
                      // defaultValue={""}
                      />
                      <FormHelperText>{Boolean(touched && errors.DestinationLocationId)}</FormHelperText>
                    </FormControl>

                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <TextField
                      name="Type"
                      label="Type"
                      value={values.Type}
                      error={Boolean(touched.Type && errors.Type)}
                      fullWidth
                      helperText={touched.Type && errors.Type}
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
                      name="Weight"
                      label="Weight"
                      value={values.Weight}
                      error={Boolean(touched.Weight && errors.Weight)}
                      fullWidth
                      helperText={touched.Weight && errors.Weight}
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
                     <FormControl fullWidth error={Boolean(touched.OrganizationId && errors.OrganizationId)}>
                      <InputLabel id="Equipment-label">Organization</InputLabel>
                      <Select
                        labelId="Equipment-label"
                        name="OrganizationId"
                        label="Organization"
                        id="demo-simple-select-error"
                        value={values?.OrganizationId}
                        onChange={handleChange}
                        onBlur={handleBlur} // Ensure field is marked as touched
                      >
                        {Array.isArray(organizationList) &&
                          organizationList?.length > 0 &&
                          organizationList?.map((org: { id: any; Name: any; }, index: React.Key | null | undefined) => (
                            <MenuItem key={index} value={org?.id || ""}>
                              {org?.Name || "Unknown Name"}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.EquipmentIds && errors.EquipmentIds && (
                        <FormHelperText>{errors.EquipmentIds}</FormHelperText>
                      )}
                    </FormControl>
                    {/* <OrganizationInput
                      name="organizationId"
                      label="Organization"
                      value={values?.OrganizationId}
                      options={organizationList}
                      error={errors.OrganizationId}
                      touched={touched.OrganizationId}
                      onChange={(e: any) => { handleChange(e,"OrganizationId"), setOrganisation(e.target.value) }}
                    /> */}
                  </Grid>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.Status && errors.Status)}>
                      <InputLabel id="demo-simple-select-error-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="Status"
                        label="Status"
                        id="demo-simple-select-error"
                        value={values.Status}
                        onChange={handleChange}
                      >
                        <MenuItem value={'New'}>New</MenuItem>
                        <MenuItem value={'Assigned'}>Assigned</MenuItem>
                        <MenuItem value={'InProgress'}>In Progress</MenuItem>
                        <MenuItem value={'Completed'}>Completed</MenuItem>
                        <MenuItem value={'Paid'}>Paid</MenuItem>
                      </Select>
                      <FormHelperText>{Boolean(touched && errors.Status)}</FormHelperText>
                    </FormControl>

                  </Grid>
                </Grid>

                <Grid container spacing={6}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.LoadingDate && errors.LoadingDate)}>
                      <DatePicker
                        label="Loading Date"
                        value={values?.LoadingDate}
                        name="LoadingDate"
                        onChange={(newValue) => setFieldValue("LoadingDate", newValue)}
                      />
                    </FormControl>
                    <FormHelperText>{Boolean(touched && errors.LoadingDate)}</FormHelperText>
                  </Grid>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(touched.DeliveryDate && errors.DeliveryDate)}>
                      <DatePicker
                        label="Delivery Date"
                        value={values?.DeliveryDate}
                        name="DeliveryDate"
                        onChange={(newValue) => setFieldValue("DeliveryDate", newValue)}
                      />
                    </FormControl>
                    <FormHelperText>{Boolean(touched && errors.DeliveryDate)}</FormHelperText>

                  </Grid>
                </Grid>

                <Grid container spacing={12}>
                  <Grid
                    size={{
                      md: 6,
                    }}
                  >
                    <TextField
                      name="Description"
                      label="Description"
                      value={values.Description}
                      error={Boolean(touched.Description && errors.Description)}
                      fullWidth
                      helperText={Boolean(touched.Description && errors.Description)}
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
