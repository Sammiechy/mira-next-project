"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import OrganizationTable from "@/components/pages/dashboard/analytics/organizationTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <OrganizationTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
