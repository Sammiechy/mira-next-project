// src/app/api/graphql/schema/organization/typeDefs.ts
export const organizationTypeDefs = /* GraphQL */`
  type Organization {
    id: ID!
    name: String!
    address: String!
  }

  type Query {
    organizations: [Organization!]!
  }

  type Mutation {
    createOrganization(
      name: String!
      address: String!
    ): Organization
  }
`;
