// app/api/graphql/route.ts
import 'reflect-metadata';
import { createYoga, createSchema } from 'graphql-yoga';
import { AppDataSource } from 'lib/database';
import { Users } from 'lib/entities/User';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Initialize the data source if it hasn’t been already
if (!AppDataSource.isInitialized) {
  AppDataSource.initialize().catch((error) =>
    console.error("Data Source Initialization Error:", error)
  );
}

// GraphQL Schema Definition
const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    FirstName: String!
    LastName: String!
    Email: String!
    Role: String!
    OrganizationId: Int!
    Type: String!
    Phone: String!
  }

  type Query {
    hello: String!
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
    ): User
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL Yoga in Next.js!',
    users: async () => {
      const userRepository = AppDataSource.getRepository(Users);
      return await userRepository.find();
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { FirstName, LastName, Phone, Email, Role, OrganizationId, Type }: any
    ) => {
      const userRepository = AppDataSource.getRepository(Users);
      console.log("Creating User with:", {
        FirstName,
        LastName,
        Email,
        Phone,
        Role,
        OrganizationId,
        Type,
      });
      
      const user = new Users();
      user.FirstName = FirstName;
      user.LastName = LastName;
      user.Email = Email;
      user.Phone = Phone;
      user.Role = Role;
      user.OrganizationId = OrganizationId;
      user.Type = Type;
      await userRepository.save(user);
      return user;
    },
  },
};

// Create GraphQL Schema
const schema = createSchema({
  typeDefs,
  resolvers,
});

// Initialize Yoga Server
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response: NextResponse },
});

// Export handlers for both GET and POST requests
export const GET = async (req: NextRequest) => yoga.handleRequest(req,{});
export const POST = async (req: NextRequest) => yoga.handleRequest(req,{});
