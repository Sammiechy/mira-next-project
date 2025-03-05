"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import DriverTable from "@/components/pages/dashboard/analytics/driverTable";
import LoaderTable from "@/components/pages/dashboard/analytics/LoaderTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <LoaderTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
