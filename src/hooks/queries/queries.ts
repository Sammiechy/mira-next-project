import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS = gql`
  query PaginatedOrganizations($page: Int, $limit: Int) {
    getOrganizations(page: $page, limit: $limit) {
      organizations {
        id
        Name
        Email
        Website
        LocationID
        Phone
      }
      totalCount
    }
  }
`;

 export const GET_SHIPPERS = gql`
  query GetShippers($page: Int, $limit: Int) {
    getShippers(page: $page, limit: $limit) {
      shippers {
        id
        Name
        Email
        Phone
        organizationId
        isDeleted
        # Add any other fields your shipper entity contains
      }
      totalCount
    }
  }
`;


