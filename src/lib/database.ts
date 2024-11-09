// import 'reflect-metadata';
import { DataSource } from "typeorm";
import { Users } from "./entities/User";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, 
  entities: [Users], 
  logging: true, 
});
