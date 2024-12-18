"use client";
import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Provider } from "react-redux";

import createTheme from "@/theme";
import { ThemeProvider } from "@/contexts/ThemeContext";
import useTheme from "@/hooks/useTheme";
import { store } from "@/redux/store";

import { AuthProvider } from "@/contexts/JWTContext";
// import { AuthProvider } from "@/contexts/FirebaseAuthContext";
// import { AuthProvider } from "@/contexts/Auth0Context";
// import { AuthProvider } from "@/contexts/CognitoContext";

// Note: Remove the following line if you want to disable the API mocks.
import "@/mocks";

// Global CSS imports
import "@/vendor/perfect-scrollbar.css";
import "animate.css/animate.min.css";
import "@/i18n";

// Initialize Chart.js
import "chart.js/auto";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import awsconfig from '../aws-exports';
import { useRouter, usePathname } from "next/navigation";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";

Amplify.configure(awsconfig); 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const publicRoutes = ["/auth/sign-in", "/auth/sign-up","/auth/reset-password"];
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/auth/sign-in");
    } else if (token && publicRoutes.includes(pathname)) {
      router.push("/dashboard/analytics");
    }
  }, [router, pathname]);

  
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiThemeProvider theme={createTheme(theme)}>
                <AuthProvider>{children}</AuthProvider>
              </MuiThemeProvider>
            </LocalizationProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

const withThemeProvider = (Component: React.ComponentType<any>) => {
  const AppWithThemeProvider = (props: any) => {
    return (
      <ThemeProvider>
        <ApolloProvider client={client}>
        <Component {...props} />
        </ApolloProvider>
      </ThemeProvider>
    );
  };
  AppWithThemeProvider.displayName = "AppWithThemeProvider";
  return AppWithThemeProvider;
};

export default withThemeProvider(RootLayout);
