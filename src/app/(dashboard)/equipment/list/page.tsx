"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "lib/apolloClient";
import EquipmentTable from "@/components/pages/dashboard/analytics/equipmentTable";

function List() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <EquipmentTable/>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default List;
