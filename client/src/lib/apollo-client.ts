import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

/**
 * Erstellt einen Apollo-Client für GraphQL-Anfragen mit Authentifizierungs-Header
 */
export function createApolloClient(token?: string) {
  // HTTP-Link für den GraphQL-Endpunkt
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://api.dev-server.mf2.eu/graphql',
  })

  // Authentifizierungs-Link für Token-Handling
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  // Error-Handling-Link
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      console.error(`[Apollo GraphQL Error] Operation: ${operation.operationName}`, graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        )
      })
    }
    if (networkError) {
      console.error(`[Apollo Network Error]: ${networkError.message}`, networkError)
      if ('statusCode' in networkError) {
        console.error(`Status Code: ${(networkError as any).statusCode}`)
      }
      // Bei Netzwerkfehlern können wir es erneut versuchen
      return forward(operation)
    }
  })

  // Apollo-Client erstellen
  return new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}
