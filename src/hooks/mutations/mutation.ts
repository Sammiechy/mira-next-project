import { gql } from "@apollo/client";

export const DELETE_MULTIPLE_SHIPPERS = gql`
  mutation DeleteMultipleShippers($ids: [Int!]!) {
    deleteMultipleShipper(ids: $ids)
  }
`;

export const EDIT_ORGANIZATION = gql`
  mutation EditOrganization($id: Int!, $data: OrganizationInput!) {
    editOrganization(id: $id, data: $data) {
      message
      success
      organization {
        id
        Name
        LocationID
        Website
        Email
      }
    }
  }
`;

 export const CREATE_SHIPPER = gql`
  mutation CreateShipper(
    $Name: String!
    $LocationID: Int!
    $Phone: String!
    $Email: String!
    $organizationId: Float!
  ) {
    createShipper(
      Name: $Name
      LocationID: $LocationID
      Phone: $Phone
      Email: $Email
      organizationId: $organizationId
    ) {
      shipper {
        id
        Name
        LocationID
        Phone
        Email
        organizationId
        isDeleted
      }
      message
    }
  }
`; 

export const EDIT_SHIPPER = gql`
  mutation EditShipper($id: Int!, $data: ShipperInput!) {
    editShipper(id: $id, data: $data) {
      message
      success
      shipper {
        id
        Name
        LocationID
        organizationId
        Email
      }
    }
  }
`;

export const CREATE_RECIEVER = gql`
  mutation createReciever(
    $Name: String!
    $LocationID: Int!
    $Phone: String!
    $Email: String!
    $organizationId: Float!
  ) {
    createReciever(
      Name: $Name
      LocationID: $LocationID
      Phone: $Phone
      Email: $Email
      organizationId: $organizationId
    ) {
      reciever {
        id
        Name
        LocationID
        Phone
        Email
        organizationId
        isDeleted
      }
      message
    }
  }
`; 

export const DELETE_MULTIPLE_RECIEVER = gql`
  mutation DeleteMultipleRecievers($ids: [Int!]!) {
    deleteMultipleReciever(ids: $ids)
  }
`;


