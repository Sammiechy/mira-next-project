"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import UserTable from "@/components/pages/dashboard/analytics/UserTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <UserTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
