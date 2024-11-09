import { AppDataSource } from "./database";
import { Users } from "./entities/User";

async function testConnection() {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(Users);
    console.log("Database connection is successful! fdfdfd",userRepository);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

testConnection();