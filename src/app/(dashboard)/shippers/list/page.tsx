"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import ShipperTable from "@/components/pages/dashboard/analytics/shipperTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <ShipperTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
