import React, { useState } from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { signUp,confirmSignUp ,signIn} from "aws-amplify/auth"
import {
  Alert as MuiAlert,
  Button as MuiButton,
  TextField as MuiTextField,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const Centered = styled(Typography)`
  text-align: center;
`;

function SignUp() {
  const router = useRouter();
  const [confirm,setConfirm]= useState<boolean>(false);
  const [code,setCode]= useState<any>("");

  const [emailForConfirmation, setEmailForConfirmation] = useState("");
  // const { signUp } = useAuth();

  const handleSignUp = async (data:any) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: "admin@gmail.com",
        password: "Aman@2024",
        options: {
          userAttributes: {
            email: "admin@gmail.com",
            phone_number: "+919023277211" ,
            name: "Aman", 
          },
        }
      });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const confirmSignup = async () => {
    console.log(emailForConfirmation)
    try {
      await confirmSignUp({
        username: emailForConfirmation,
        confirmationCode: code
      });
      setConfirm(false)
      router.push("/auth/sign-in");
      console.log("User confirmed successfully.");
    } catch (error) {
      console.error("Error confirming sign up:", error);
    }
  };

  const handleClose = () => {
    setConfirm(false);
  };

  return (
    <>
      <Dialog
        open={confirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          the confirmation code sent to your email or phone.
          </DialogContentText>
          <TextField
            type="confirm"
            name="code"
            label="confirm code"
            value={code}
            // error={Boolean(touched.email && errors.email)}
            fullWidth
            // helperText={touched.email && errors.email}
           
            onChange={(e:any)=>setCode(e.target.value)}
            my={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={confirmSignup} >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
   
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("First name is required"),
        lastName: Yup.string().max(255).required("Last name is required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Must be at least 8 characters")
          .max(255)
          .required("Required"),
        confirmPassword: Yup.string().oneOf(
          // @ts-ignore
          [Yup.ref("password"), null],
          "Passwords must match"
        ),
        phoneNumber: Yup.string()
        .matches(/^\+?\d{10,15}$/, "Must be a valid phone number")
        .required("Phone number is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // handleSignUp(
          //   values.email,
          //   values.password,
          //   values.firstName,
          //   values.lastName
          // );
          const { isSignUpComplete, userId, nextStep } :any = await signUp({
            username:  values.email,
            password: values.password,
            options: {
              userAttributes: {
                email:values.email,
                phone_number: values.phoneNumber ,
                name: `${values.firstName} ${ values.lastName}`, 
              },
            }
          });
          localStorage.setItem("userId",userId);
          console.log("Sign-up successful, next step:",userId, nextStep);
          setConfirm(true);
          // Check if there's a confirmation step required
          if (nextStep && nextStep === "CONFIRM_SIGN_UP_STEP") {
            setEmailForConfirmation(values.email)
           
            alert("Please enter the confirmation code sent to your email or phone.")
            console.log("Please enter the confirmation code sent to your email or phone.");
          } else {
            console.log("Sign-up complete, no further steps required.");
          }
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
            type="text"
            name="firstName"
            label="First name"
            value={values.firstName}
            error={Boolean(touched.firstName && errors.firstName)}
            fullWidth
            helperText={touched.firstName && errors.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="lastName"
            label="Last name"
            value={values.lastName}
            error={Boolean(touched.lastName && errors.lastName)}
            fullWidth
            helperText={touched.lastName && errors.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="email"
            name="email"
            label="Email address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
           <TextField
        type="text"
        name="phoneNumber"
        label="Phone Number" 
        placeholder="enter phone number with country code"
        value={values.phoneNumber}
        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
        fullWidth
        helperText={touched.phoneNumber && errors.phoneNumber}
        onBlur={handleBlur}
        onChange={handleChange}
        my={3}
      />
          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
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
            Sign up
          </Button>
          <Centered>
            Already have an account?{" "}
            <Link href="sign-in" component={NextLink}>
              Log in
            </Link>
          </Centered>
        </form>
      )}
    </Formik>
    </>
  );
}

export default SignUp;
