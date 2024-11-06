// app/api/graphql/route.ts
import 'reflect-metadata';
import { createYoga, createSchema } from 'graphql-yoga';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
  ];

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String!
    users: [User!]!
  }
`;

const resolvers = {
    Query: {
      hello: () => 'Hello from GraphQL Yoga in Next.js!',
      users: () => users, 
    },
  };


const schema = createSchema({
  typeDefs,
  resolvers,
});


const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response: NextResponse },
});

// Export handlers for both GET and POST requests
export const GET = async (req: NextRequest) => yoga.handleRequest(req,{});
export const POST = async (req: NextRequest) => yoga.handleRequest(req,{});
