import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from '@apollo/client';
import { ReactNode } from 'react';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('userToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  // uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default ApolloProviderWrapper;
