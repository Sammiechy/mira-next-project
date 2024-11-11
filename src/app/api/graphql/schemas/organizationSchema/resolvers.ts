// src/app/api/graphql/schema/organization/resolvers.ts
import { AppDataSource } from 'lib/database';
import { Organization } from 'lib/entities/Organization';

export const organizationResolvers = {
  Query: {
    organizations: async () => {
      const organizationRepository = AppDataSource.getRepository(Organization);
      return await organizationRepository.find();
    },
  },
  Mutation: {
    createOrganization: async (_: any, { name, address }: any) => {
      const organizationRepository = AppDataSource.getRepository(Organization);
      const organization = new Organization();
    
      await organizationRepository.save(organization);
      return organization;
    },
  },
};
