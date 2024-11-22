// src/app/api/graphql/schema/user/typeDefs.ts


export const userTypeDefs = /* GraphQL */`
type User {
  id: ID!
  FirstName: String!
  LastName: String!
  Email: String!
  Role: String!
  OrganizationId: Int!
  Type: String!
  Phone: String!
  Password: String!
  Status: String!
}

type AuthPayload {
  token: String
  user: User
}

type Query {
  users: [User!]!
}

type Mutation {
  createUser(
    FirstName: String!
    LastName: String!
    Phone: String!
    Email: String!
    Role: String!
    OrganizationId: Int!
    Type: String!
    Password: String!
    Status: String!
  ): User

  signup(
    FirstName: String!
    LastName: String!
    Email: String!
    Password: String!
    Role: String!
    OrganizationId: String
    Type: String
    Phone: String
    Status: String!
  ): AuthPayload

   signIn(
    Email: String!
    Password: String!
  ): AuthPayload

   signOut(
    token: String!
  ): Boolean
}

`;
