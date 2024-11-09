import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { spacing, SpacingProps } from "@mui/system";

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
  const { signIn } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const dummyUser = {
    firstName: 'sammie',
    lastName: 'choudhary',
    email: 'sammie@yopmail.com',
    phone: '1234567890',
    role: 'Admin',
    organizationId: 1, 
    type: 'Employee',
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`http://localhost:3000/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          mutation {
            createUser(
              FirstName: "${dummyUser.firstName}",
              LastName: "${dummyUser.lastName}",
              Email: "${dummyUser.email}",
              Phone: "${dummyUser.phone}",
              Role: "${dummyUser.role}",
              OrganizationId: ${dummyUser.organizationId},
              Type: "${dummyUser.type}"
            ) {
              id
              FirstName
              LastName
              Email
              Phone
              Role
              OrganizationId
              Type
            }
          }
          `,
        }),
      });
  
      const { data } = await response.json();
      if (response.ok) {
        setUsers(data?.users);
        console.log('User created:', data.createUser);
      } else {
        console.error('Error creating user:', data.errors);
      }
     
    };
    fetchUsers();
  }, []);



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
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signIn(values.email, values.password);

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
            name="email_field"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onChange={handleChange}
            autoComplete="new-email"
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
