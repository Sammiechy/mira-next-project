// typeorm.config.ts

import { DataSource } from 'typeorm';
import { User } from './entities/user';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: "1231",
  password: "1222",
  database: "12",
  entities: [User],
  synchronize: true, 
  logging: true,
});
