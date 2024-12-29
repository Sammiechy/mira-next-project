"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import RecieverTable from "@/components/pages/dashboard/analytics/RecieverTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <RecieverTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
