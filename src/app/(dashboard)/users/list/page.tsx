"use client";
import React from "react";
import DashboardTable from "@/components/pages/dashboard/analytics/Table";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <DashboardTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
