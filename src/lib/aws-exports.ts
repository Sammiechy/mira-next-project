const awsconfig :any = {
  Auth: {
    region: process.env.AWS_REGION || "us-east-1",  // Your AWS region
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || "your_user_pool_id",  // Your Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || "your_user_pool_client_id",  // Your Cognito Client ID
    mandatorySignIn: true,  // Ensure that the user must sign in before accessing resources
     identityPoolId: "",  // Optional: if you're using Federated Identity Pools
  },
  oauth: {
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code',
  },
};

export default awsconfig;