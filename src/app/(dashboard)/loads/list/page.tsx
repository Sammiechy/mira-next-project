"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import DriverTable from "@/components/pages/dashboard/analytics/driverTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <DriverTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
