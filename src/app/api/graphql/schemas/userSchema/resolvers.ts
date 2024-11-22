import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from 'lib/database';
import { Users } from 'lib/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const invalidatedTokens: Set<string> = new Set();

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
    signIn: async (_: any, { Email, Password }: { Email: string; Password: string }) => {
      try {
        console.log("Signing in user with email:", Email);

        const userRepository = AppDataSource.getRepository(Users);

        // Find the user by email
        const user = await userRepository.findOne({ where: { Email } });
        if (!user) {
          throw new Error("User not found.");
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        // Generate a JWT token
        const token = jwt.sign(
          { id: user.id, Email: user.Email, Role: user.Role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        console.log("User signed in successfully:", user);

        // Return the token and user details
        return {
          token,
          user,
        };
      } catch (error: any) {
        console.error("Error during sign-in:", error);
        throw new Error(`Failed to sign in: ${error.message}`);
      }
    },


    signOut: async (_: any, { token }: { token: string }) => {
      try {
        // Invalidate the token by adding it to a blacklist
        if (!token) {
          throw new Error("No token provided.");
        }

        invalidatedTokens.add(token);

        // Optionally, clear the token client-side by providing feedback to the user
        return true; // Sign-out successful
      } catch (error: any) {
        throw new Error(`Failed to sign out: ${error.message}`);
      }
    },
    

  
  },
};
