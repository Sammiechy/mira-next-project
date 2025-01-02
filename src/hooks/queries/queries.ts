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
        address
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
        address
         organization {
        id
        Name
      }
        isDeleted
        # Add any other fields your shipper entity contains
      }
      totalCount
    }
  }
`;

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($id: Int!) {
    getOrganizationById(id: $id) {
      id
      Name
      LocationID
      Website
      Email
      Phone
    }
  }
`;

 export const GET_SHIPPER_BY_ID = gql`
  query GetShipperById($id: Int!) {
    getShipperById(id: $id) {
      id
      Name
      LocationID
      address
      organizationId
      Email
      Phone
    }
  }
`;


export const GET_RECIEVER = gql`
query GetRecievers($page: Int, $limit: Int) {
  getRecievers(page: $page, limit: $limit) {
    recievers {
      id
      Name
      Email
      Phone
       organization {
        id
        Name
      }
      LocationID
      address
      isDeleted
    
    }
    totalCount
  }
}
`;
export const GET_RECIEVER_BY_ID = gql`
query GetRecieverById($id: Int!) {
  getRecieverById(id: $id) {
    id
    Name
    LocationID
    organizationId
    address
    Email
    Phone
  }
}
`;

export const SEARCH_PLACES = gql`
  query SearchPlaces($input: String!) {
    searchPlaces(input: $input) {
      description
      place_id
    }
  }
`;


