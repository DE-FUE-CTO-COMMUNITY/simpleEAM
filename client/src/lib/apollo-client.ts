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

        // Bei Authentifizierungsfehlern versuche Token-Refresh
        if (message.includes('unauthenticated') || message.includes('Unauthorized')) {
          console.log('Authentifizierungsfehler erkannt, versuche Token-Refresh...')
          // Trigger token refresh via custom event
          window.dispatchEvent(new CustomEvent('authError'))
        }
      })
    }
    if (networkError) {
      console.error(`[Apollo Network Error]: ${networkError.message}`, networkError)
      if ('statusCode' in networkError) {
        const statusCode = (networkError as any).statusCode
        console.error(`Status Code: ${statusCode}`)

        // Bei 401/403 Fehlern Token-Refresh versuchen
        if (statusCode === 401 || statusCode === 403) {
          console.log('HTTP Authentifizierungsfehler erkannt, versuche Token-Refresh...')
          window.dispatchEvent(new CustomEvent('authError'))
        }
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
