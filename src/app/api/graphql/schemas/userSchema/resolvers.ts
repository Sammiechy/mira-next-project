import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from 'lib/database';
import { Users } from 'lib/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const userResolvers = {
  Query: {
    users: async () => {
      const userRepository = AppDataSource.getRepository(Users);
      return await userRepository.find();
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { FirstName, LastName, Phone, Email, Role, OrganizationId, Type, Password, Status }: any
    ) => {
      try {
        console.log("Creating user with:", { FirstName, LastName, Phone, Email, Role, OrganizationId, Type, Status });
    
        // Check for missing fields or invalid input
        if (!FirstName || !LastName || !Phone || !Email || !Role || !OrganizationId || !Type || !Password || !Status) {
          throw new Error("Missing required fields.");
        }
    
        const userRepository = AppDataSource.getRepository(Users);
    
        // Ensure the email is unique
        const existingUser = await userRepository.findOne({ where: { Email } });
        if (existingUser) {
          throw new Error("Email already in use.");
        }
    
        const hashedPassword = await bcrypt.hash(Password, 10);
    
        const user = userRepository.create({
          FirstName,
          LastName,
          Phone,
          Email,
          Role,
          OrganizationId:parseInt(OrganizationId),
          Type,
          Password: hashedPassword,
          Status,
        });
    
        await userRepository.save(user);
    
        console.log("User created successfully:", user);
        return user;
      } catch (error:any) {
        console.error("Error creating user:", error);
        throw new Error(`Failed to create user: ${error.message}`);
      }
    },
    
    

    // signup: async (
    //   _: any,
    //   { FirstName, LastName, Email, Password, Role, OrganizationId, Type, Phone }: any
    // ) => {
    //   const userRepository = AppDataSource.getRepository(Users);

    //   // Check if the email is already in use
    //   const existingUser = await userRepository.findOneBy({ Email });
    //   if (existingUser) {
    //     throw new Error("Email already in use");
    //   }

    //   // Hash the password before saving
    //   const hashedPassword = await bcrypt.hash(Password, 10);

    //   // Create a new user and save to the database
    //   const user = userRepository.create({
    //     FirstName,
    //     LastName,
    //     Email,
    //     Password: hashedPassword,
    //     Role,
    //     OrganizationId,
    //     Type,
    //     Phone,
    //   });
    //   await userRepository.save(user);

    //   // Generate JWT token
    //   // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    //   return {
    //     // token,
    //     user,
    //   };
    // },
  },
};
