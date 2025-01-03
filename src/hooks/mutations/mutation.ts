import { gql } from "@apollo/client";


 export const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String!
    $role: String!
    $type: String!
    $status: String!
    $organizationId: Float!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      role: $role
      type: $type
      status: $status
      organizationId: $organizationId
    ) {
      message
      userId
    }
  }
`;


export const ADD_ORGANIZATION = gql`
  mutation AddOrganization($data: OrganizationInput!) {
    addOrganization(data: $data) {
      message
      organization {
        id
        Name
        LocationID
        Website
        Phone
        Email
        isDeleted
      }
    }
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

export const DELETE_MULTIPLE_ORGANIZATIONS = gql`
  mutation DeleteMultipleOrganizations($ids: [Int!]!) {
    deleteMultipleOrganizations(ids: $ids)
  }
`;

export const ADD_USER = gql`
mutation AddUser(
  $firstName: String!
  $lastName: String!
  $email: String!
  $phone: String!
  $role: String!
  $type: String!
  $status: String!
  $organizationId:  Float!
  $password: String!
) {
  addUser(
    firstName: $firstName
    lastName: $lastName
    email: $email
    phone: $phone
    role: $role
    type: $type
    status: $status
    organizationId: $organizationId
    password: $password
  ) {
    id
    firstName
    lastName
    email
  }
}
`;

export const EDIT_USER_MUTATION = gql`
mutation EditUser(
  $id: Float!
  $firstName: String
  $lastName: String
  $email: String
  $phone: String
  $role: String
  $type: String
  $status: String
  $organizationId: Float
  $password: String
) {
  editUser(
    id: $id
    firstName: $firstName
    lastName: $lastName
    email: $email
    phone: $phone
    role: $role
    type: $type
    status: $status
    organizationId: $organizationId
    password: $password
  ) {
    id
    firstName
    lastName
    email
    phone
    role
    type
    status
    organizationId
  }
}
`;

export const DELETE_USERS_MUTATION = gql`
  mutation DeleteUsers($ids: [Float!]!) {
    deleteUsers(ids: $ids)
  }
`;

export const DELETE_MULTIPLE_SHIPPERS = gql`
  mutation DeleteMultipleShippers($ids: [Int!]!) {
    deleteMultipleShipper(ids: $ids)
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
       organization {
        id
      }
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

export const CREATE_EQUIPMENT = gql`
  mutation createEquipment(
    $Type: String!
    $Description: String!
    $organizationId: Float!
  ) {
    createEquipment(
      Type: $Type
      Description: $Description
      organizationId: $organizationId
    ) {
      equipment {
        id
        Type
        Description
       organization {
        id
      }
        isDeleted
      }
      message
    }
  }
`; 

