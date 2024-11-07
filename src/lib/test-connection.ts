import { AppDataSource } from "./database";

async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection is successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

testConnection();