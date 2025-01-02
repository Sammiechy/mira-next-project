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
    $LocationID: String!
    $Phone: String!
    $Email: String!
    $address:String!
    $organizationId: Float!
  ) {
    createShipper(
      Name: $Name
      LocationID: $LocationID
      Phone: $Phone
      Email: $Email
      address:$address
      organizationId: $organizationId
    ) {
      shipper {
        id
        Name
        LocationID
        Phone
        Email
        address
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
        address
         organization {
        id
      }
        Email
      }
    }
  }
`;

export const CREATE_RECIEVER = gql`
  mutation createReciever(
    $Name: String!
    $LocationID: String!
    $Phone: String!
    $Email: String!
    $address: String!
    $organizationId: Float!
  ) {
    createReciever(
      Name: $Name
      LocationID: $LocationID
      Phone: $Phone
      address: $address
      Email: $Email
      organizationId: $organizationId
    ) {
      reciever {
        id
        Name
        LocationID
        Phone
        Email
        address
        organization {
        id
      }
        isDeleted
      }
      message
    }
  }
`; 

export const EDIT_RECIEVER = gql`
  mutation EditReciever($id: Int!, $data: RecieverInput!) {
    editReciever(id: $id, data: $data) {
      message
      success
      reciever {
        id
        Name
        LocationID
        address
         organization {
        id
      }
        Email
      }
    }
  }
`;

export const DELETE_MULTIPLE_RECIEVER = gql`
  mutation DeleteMultipleRecievers($ids: [Int!]!) {
    deleteMultipleReciever(ids: $ids)
  }
`;

export const CREATE_LOCATION = gql`
  mutation createLocation(
    $Address1: String!
    $places_id: String!
    $Address2: String!
    $City: String!
    $PostalCode_Zip: String!
    $Country: String!
    $State_Province: String!

  ) {
    createLocation(
      Address1: $Address1
      places_id: $places_id
      Address2: $Address2
      City: $City
      PostalCode_Zip: $PostalCode_Zip
       Country: $Country
      State_Province: $State_Province
    ) {
      location {
        id
        Address1
        Address2
        places_id
        City
        Country
        State_Province
      }
      message
    }
  }
`; 

