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
      totalCount
    users {
      id
      firstName
      lastName
      email
      phone
      role
      status
      organization {
        id
        Name
      }
      type
    }
}
}
`;


export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    getUserById(id: $id) {
      firstName
      lastName
      email
      phone
      role
      status
      type
      organization {
        id
        Name
      }
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

export const GET_EQUIPMENT_BY_ID = gql`
  query GetEquipmentById($id: Int!) {
    getEquipmentById(id: $id) {
      id
      Type
      Description
        organization {
        id
        Name
      }
    }
  }
`;


export const GET_DRIVERS = gql`
  query PaginatedDrivers($page: Int, $limit: Int) {
    getDrivers(page: $page, limit: $limit) {
      drivers {
        id
        FirstName
        LastName
        Email
        Phone
        DOB
        Primary_Phone
        Gender
        PrimaryCitizenship
        SecondaryCitizenship
        address
        PaymentMethod
        Notes
        organization {
          id
          Name
        }
      }
      totalCount
    }
  }
`;


export const GET_DRIVER_BY_ID = gql`
  query GetDriversById($id: Int!) {
    getDriversById(id: $id) {
       id
      FirstName
      LastName
      Email
      Phone
      PaymentMethod
      DOB
      Gender
      Primary_Phone
      PrimaryCitizenship
      SecondaryCitizenship
      address
      Notes
      organization {
        id
        Name
      }
    }
  }
`;

export const SEARCH_ORGANIZATIONS = gql`
  query SearchOrganizations($name: String) {
    searchOrganization(name: $name) {
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

export const SEARCH_RECIEVER = gql`
  query searchReciever($name: String!) {
    searchReciever(name: $name) {
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
  }
`;

export const SEARCH_SHIPPER = gql`
  query searchShipper($name: String!) {
    searchShipper
    (name: $name) {
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
  }
`;

export const SEARCH_EQUIPMENT = gql`
 query SearchEquipment($Type: String) {
      searchEquipment(Type: $Type) {
        id
        Type
        Description
          organization {
          id
          Name
        }
    }
  }
`;

export const SEARCH_DRIVERS = gql`
  query SearchDriversByName($name: String!) {
    searchDriversByName(name: $name) {
      id
      FirstName
      LastName
      Email
      Phone
      organization {
        id
        Name
      }
    }
  }
`;

export const GET_ALL_LOADS = gql`
  query GetAllLoads {
    getAllLoads {
      id
      type
      status
      weight
      description
      notes
      origin_location_id
      destination_location_id
      loading_date
      delivery_date
       organization {
        id
        Name
      }
        drivers {
        id
      FirstName
      LastName
      }
       equipment {
        id
        Type
      }
      shipper {
        id
        Name
        Email
      }
      reciever {
        id
      Name
      Email
      }
    }
  }
`;