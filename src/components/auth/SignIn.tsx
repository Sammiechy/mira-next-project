import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { spacing, SpacingProps } from "@mui/system";
import { signUp ,signIn} from "aws-amplify/auth"
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  Alert as MuiAlert,
  Checkbox,
  FormControlLabel,
  Button as MuiButton,
  TextField as MuiTextField,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import useAuth from "@/hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

interface ButtonProps extends SpacingProps {
  component?: React.ElementType;
  to?: string;
  target?: string;
}

type User = {
  id: string;
  name: string;
  email: string;
};

const Button = styled(MuiButton)<ButtonProps>(spacing);

const Centered = styled(MuiTypography)`
  text-align: center;
`;

interface TypographyProps extends SpacingProps {
  as?: string;
}

const Typography = styled(MuiTypography)<TypographyProps>(spacing);

function SignIn() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const dummyUser = {
    firstName: 'Aman',
    lastName: 'Singh',
    email: 'admin@gmail.com',
    password:"Aman@2024",
    phone: '9023277211',
    role: 'Admin',
    status:"1",
    organizationId: 1, 
    type: 'Admin',
  };

  const handleSignUp = async () => {
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


  useEffect(()=>{
   
    // handleSignUp()
  },[])

  // useEffect(() => {
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



  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().min(8).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
      console.log(values?.password,"values?.password")
          try {
            const user = await signIn({
              username: values?.email,
              password: values?.password,
            });
            const session :any = await fetchAuthSession();
            const idToken = session.tokens.idToken;
            const accessToken = session.tokens.accessToken;
            accessToken? localStorage.setItem("token",accessToken):""
            router.push("/dashboard/analytics");
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
        <form onSubmit={handleSubmit} >
          <Alert mt={3} mb={3} severity="info">
            Use <strong>demo@bootlab.io</strong> and{" "}
            <strong>unsafepassword</strong> to sign in
          </Alert>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
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
            onChange={handleChange}
           
            slotProps={{
              input: {
                autoComplete: "new-email",
              },
            }}
            my={2}
          />

          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            autoComplete="off"
            error={Boolean(touched.password && errors.password)}
            fullWidth
            slotProps={{
              input: {
                autoComplete: "off",
              },
            }}
            helperText={touched.password && errors.password}
            onChange={handleChange}
            my={2}
          />
          <Typography as="div" mb={2} variant="caption">
            <Link href="reset-password" component={NextLink}>
              Forgot password?
            </Link>
          </Typography>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            mb={3}
          >
            Sign in
          </Button>
          <Centered>
          </Centered>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
