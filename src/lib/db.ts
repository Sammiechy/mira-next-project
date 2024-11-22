// lib/db.ts
import { AppDataSource } from "./database";

export const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    try {
        await AppDataSource.initialize(); 
        console.log('Database connection established successfully!');
        console.log("Entities: ", AppDataSource.entityMetadatas);
        console.log(AppDataSource.manager);

      } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
      }
  }
  return AppDataSource;
};
