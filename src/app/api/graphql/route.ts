// app/api/graphql/route.ts
import 'reflect-metadata';
import { createYoga, createSchema } from 'graphql-yoga';
import { AppDataSource } from 'lib/database';
import { Users } from 'lib/entities/User';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { userTypeDefs } from './schemas/userSchema/typeDefs';
import { userResolvers } from './schemas/userSchema/resolvers';
import { organizationResolvers } from './schemas/organizationSchema/resolvers';
import { organizationTypeDefs } from './schemas/organizationSchema/typeDefs';

// Initialize the data source if it hasn’t been already
if (!AppDataSource.isInitialized) {
  AppDataSource.initialize().catch((error) =>
    console.error("Data Source Initialization Error:", error)
  );
}

// GraphQL Schema Definition
const typeDefs = `
  ${userTypeDefs}
  ${organizationTypeDefs}
`;

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...organizationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...organizationResolvers.Mutation,
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
