"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import * as Yup from "yup";
import styled from "@emotion/styled";
import NextLink from "next/link";
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
  Link,
  TextField as MuiTextField,
  Typography,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { spacing } from "@mui/system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams,useRouter } from "next/navigation";
import { GET_SHIPPER_BY_ID } from "@/hooks/queries/queries";
import { EDIT_SHIPPER } from "@/hooks/mutations/mutation";
import LocationComp from "@/components/locationField/LocationComp";

const Card = styled(MuiCard)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
`;

 const dummyLocation= [{id:1,value:"Chandigarh"},{id: 2,value:"Mohali"},{id:3,value:"Delhi"},{id: 4,value:"Pune"},{id: 5,value:"Hyderabad"}]
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
    organizationId: Yup.string().required("organization is required")
});





function EditShipperForm() {
 const {id}= useParams();
 const shipperId= parseFloat(id[0]);
const [fieldError, setFieldError]= useState("");
 const { data, } = useQuery(GET_SHIPPER_BY_ID,{
  variables: {id: shipperId },
});
const [editShipper, {  loading, error }] = useMutation(EDIT_SHIPPER);
 const router= useRouter();
 const [location,setLocation]= useState("");
 const [shipperData,setShipperData]= useState<any>("");

 const initialValues :any= {
  Name:  shipperData?.Name||"",
  LocationID:  shipperData?.address||"",
  email:  shipperData?.Email||location,
  phone:  shipperData?.Phone||"",
  organizationId:  shipperData?.organizationId||"",
};

  useEffect(() => {
    if (data?.getShipperById) {
      setShipperData(data.getShipperById)

    }
  }, [data]);
  

  const handleSubmit = async (
    values: any,
    { resetForm, setErrors, setStatus, errors,setSubmitting }: any
  ) => {

    const variablesData = {
      Name: values?.Name,
      Email: values?.email,
      Phone: values?.phone,
      // organizationId: parseFloat("1"),
      organizationId: values?.organizationId,
      address:values?.locationID?.target?.name,
      LocationID:values?.LocationID,
    };
 
    try {
      const response = await editShipper({
        variables: {
          id: shipperId,
          data: variablesData,
        },
      });
      // const response = await editUser({ variables: { ...variablesData } });
      if (response.data.editShipper.success) {
        router.push('/shippers/list');
        resetForm();
        setStatus({ sent: true });
        setSubmitting(false);
      }else{
        setSubmitting(false);
      }
   
    } catch (error: any) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };



  return (<>
  {shipperData ?  <Formik
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
                      name="Name"
                      label="Name"
                      value={values.Name}
                      defaultValue={values.Name}
                      error={Boolean(touched.Name && errors.Name)}
                      fullWidth
                      helperText={touched.Name ? errors.Name:""}
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
                    <LocationComp defaultValue={values?.LocationID} setFieldValue={setFieldValue} error={Boolean(touched.locationID && errors.locationID)} name="Location" helperText={Boolean(touched.LocationID && errors.LocationID)}/>

                   {/* <FormControl fullWidth  error={Boolean(touched.LocationID && errors.LocationID)}>
                      <InputLabel id="demo-simple-select-error-label">Location</InputLabel>
                      <Select
                        labelId="demo-simple-select-error-label"
                        name="LocationID"
                        label="Location"
                        id="demo-simple-select-error"
                        defaultValue={ dummyLocation?.find(item=>item.id == values?.LocationID)?.id}
                        value={location||dummyLocation?.find(item=>item.id == values?.LocationID)?.id }                      
                         onChange={(e:any)=>{handleChange(e) ,setLocation(e.target.value),setFieldError("location required")}}
                      >
                        {dummyLocation?.map(item=><MenuItem value={item?.id}>{item?.value}</MenuItem>) }
                       
                      </Select>
                      <FormHelperText>{fieldError && fieldError}</FormHelperText>
                    </FormControl> */}
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
                      name="organizationId"
                      label="Organization"
                      value={values.organizationId}
                      error={Boolean(touched.organizationId && errors.organizationId)}
                      fullWidth
                      helperText={touched.Website && errors.organizationId}
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
                  Update Shipper
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </Formik> :"...loading"}
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
