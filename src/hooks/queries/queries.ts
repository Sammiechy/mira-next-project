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

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($id: Int!) {
    getOrganizationById(id: $id) {
      id
      Name
      LocationID
      Website
      address
      Email
      Phone
    }
  }
`;

export const GET_USERS = gql`
query GetUsers($excludeId: Float  $limit: Float, $offset: Float) {
  users (excludeId: $excludeId limit: $limit, offset: $offset){
    id
    firstName
    lastName
    email
    phone
    role
    status
    type
  }
}
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    GetUserById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      role
      status
      type
    }
  }
`;

export const GET_USER_COUNT = gql`
  query GetUserCount {
    userCount
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

export const GET_SHIPPER_BY_ID = gql`
  query GetShipperById($id: Int!) {
    getShipperById(id: $id) {
      id
      Name
      LocationID
      address
        organization {
        id
        Name
      }
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
   organization {
        id
        Name
      }
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


export const GET_EQUIPMENTS = gql`
  query PaginatedEquipment($page: Int, $limit: Int) {
    getEquipment(page: $page, limit: $limit) {
      equipment {
        id
        Type
        Description
          organization {
          id
          Name
        }
      }
      totalCount
    }
  }
`;

