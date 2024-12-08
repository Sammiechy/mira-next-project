import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import { resetPassword ,confirmResetPassword} from "aws-amplify/auth"
import { useMutation ,gql} from "@apollo/client";
import {
  Alert as MuiAlert,
  Button as MuiButton,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Link,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const Centered = styled(MuiTypography)`
  text-align: center;
`;

const RESET_PASSWORD = gql`
  mutation reset_Password($id: Float!, $newPassword: String!) {
    reset_Password(id: $id, newPassword: $newPassword)
  }
`;

function ResetPassword() {
  const router = useRouter();
  const [reset_Password, { loading, error, data }] = useMutation(RESET_PASSWORD);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'info' | 'success' | 'error' | undefined>(undefined);
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState(""); 
  const [confirmationCode, setConfirmationCode] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const localStore = localStorage.getItem("userInfo");
  const userInfo = localStore ? JSON.parse(localStore) : null;
  // const { resetPassword } = useAuth();

  const resetUserPassword=async(email: any)=>{
    const response= await resetPassword({username:email})
    const { nextStep } = response;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        setAlertSeverity('info');
        setAlertMessage(
          `Confirmation code was sent via ${codeDeliveryDetails.deliveryMedium} to ${codeDeliveryDetails.destination}.`
        );
        setEmail(email);
        setStep(2);
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
    console.log(nextStep,"respppppp")
  }

  const confirm_Reset_Password=async()=>{
    try {
       await confirmResetPassword({
        username: email,
        confirmationCode: confirmationCode,
        newPassword: newPassword,
      });
      setAlertSeverity('success');
    const resp=  await reset_Password({  variables: {
        id: parseInt(userInfo?.id), 
        newPassword,
      },})
      if(resp.data?.reset_Password){
        setStep(1);
        setAlertMessage('Password reset successfully!');
        router.push("/auth/sign-in");
      }else{
        setAlertMessage('Something went wrong!');

      }
 
    } catch (error: any) {
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Failed to reset password.');
    }
  }

  return (
    <>
  {alertMessage && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
   
    {step === 1 && (<Formik
      initialValues={{
        email: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // resetPassword(values.email);
          resetUserPassword(values.email)
          // router.push("/auth/sign-in");
        } catch (error: any) {
          const message = error.message || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            mb={3}
          >
            Reset password
          </Button>
          <Centered>
            Don't have an account?{" "}
            <Link href="sign-up" component={NextLink}>
              Sign up
            </Link>
          </Centered>
        </form>
      )}
    </Formik>)}
    {step === 2 && (
        <form noValidate>
          <TextField
            type="text"
            name="confirmationCode"
            label="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            fullWidth
            my={2}
          />
          <TextField
            type="password"
            name="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            my={2}
          />
          <Button
            onClick={confirm_Reset_Password}
            fullWidth
            variant="contained"
            color="primary"
            mb={3}
          >
            Confirm Reset Password
          </Button>
        </form>
      )}
    </>
  );
}

export default ResetPassword;
