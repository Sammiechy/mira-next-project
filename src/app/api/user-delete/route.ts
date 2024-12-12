import AWS from 'aws-sdk';
import { CognitoIdentityProviderClient, AdminDeleteUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';

AWS.config.update({ region: 'ca-central-1' });
const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'ca-central-1_TVfrslk8O'; 
// const cognitoClient = new CognitoIdentityProviderClient({
//     region: "ca-central-1",
//     credentials: {
//       accessKeyId: process.env.REACT_APP_COGNITO_USER_POOL_ID || "", // Use an empty string as fallback if undefined
//       secretAccessKey: process.env.REACT_APP_COGNITO_CLIENT_SECRET_ID || "", // Use an empty string as fallback if undefined
//     },
//   });
const client = new CognitoIdentityProviderClient({ region: "ca-central-1" });

export async function DELETE(req: Request) {
  const { userId } = await req.json(); // Assuming you're sending userId in the request body
  try {
    // Delete the user from Cognito
    const command = new AdminDeleteUserCommand({
      UserPoolId: "ca-central-1_TVfrslk8O", // Replace with your User Pool ID
      Username: userId,
    });

    await client.send(command);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error:any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user', error: error.message }, { status: 500 });
  }
}


