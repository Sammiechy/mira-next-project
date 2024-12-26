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


