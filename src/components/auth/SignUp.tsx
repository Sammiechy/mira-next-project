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
  const [formData,setFormData]= useState<any>("");

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


  const fetchUsers = async () => {
        try {
        const response = await fetch(`http://localhost:3000/api/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            mutation {
              createUser(
                FirstName: "${formData?.firstName}",
                LastName: "${formData?.lastName}",
                Email: "${formData?.email}",
                Phone: "${formData?.phoneNumber}",
                Role: "admin",
                OrganizationId: 1,
                Password:"${formData?.password}",
                Status:"1",
                Type: "1"
              ) {
                FirstName
                LastName
                Email
                Phone
                Role
                OrganizationId
                Type
                Status
                Password
              }
            }
            `,
          }),
        });
    
        const { data,errors } = await response.json();
        if (response.ok) {
          if (data?.createUser) {
            console.log('User created:', data.createUser);
          } else {
            console.error('Error in mutation response:', errors);
          }
        } else {
          console.error('HTTP Error:', response.status, errors);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
       
    }

  //   const fetchUsers = async () => {
  //     try {
  //     const response = await fetch(`http://localhost:3000/api/graphql`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         query: `
  //         mutation {
  //           createUser(
  //             FirstName: "${dummyUser.firstName}",
  //             LastName: "${dummyUser.lastName}",
  //             Email: "${dummyUser.email}",
  //             Phone: "${dummyUser.phone}",
  //             Role: "${dummyUser.role}",
  //             OrganizationId: ${dummyUser.organizationId},
  //             Password:"${dummyUser.password}",
  //             Status:"${dummyUser.status}",
  //             Type: "${dummyUser.type}"
  //           ) {
  //             FirstName
  //             LastName
  //             Email
  //             Phone
  //             Role
  //             OrganizationId
  //             Type
  //             Status
  //             Password
  //           }
  //         }
  //         `,
  //       }),
  //     });
  
  //     const { data,errors } = await response.json();
  //     if (response.ok) {
  //       if (data?.createUser) {
  //         console.log('User created:', data.createUser);
  //       } else {
  //         console.error('Error in mutation response:', errors);
  //       }
  //     } else {
  //       console.error('HTTP Error:', response.status, errors);
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //   }
     
  //   };
  //   fetchUsers();
  // }, []);

  const confirmSignup = async () => {
    console.log(emailForConfirmation,"chbc")
    try {
      await confirmSignUp({
        username: emailForConfirmation,
        confirmationCode: code
      });
      await fetchUsers()
      setConfirm(false);
      
      router.push("/auth/sign-in");
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
          {"Please Confirm your email"}
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
          {/* <Button onClick={handleClose}>Cancel</Button> */}
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
          console.log("Sign-up successful, next step:",userId, nextStep,isSignUpComplete);
          setFormData(values);
         !isSignUpComplete&& setEmailForConfirmation(values.email)

          // Check if there's a confirmation step required
          if (userId) {
            setConfirm(true);
          } else {
            console.log("Sign-up complete, no further steps required.");
          }
         
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
