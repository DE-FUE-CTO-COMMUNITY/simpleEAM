import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { keycloak } from './auth'

// Cache for GraphQL URL from runtime config
let graphqlUrlCache: string | null = null

/**
 * Fetch GraphQL URL from runtime config
 */
async function fetchGraphQLUrl(): Promise<string> {
  if (graphqlUrlCache) {
    return graphqlUrlCache as string
  }

  try {
    const response = await fetch('/api/runtime-config')
    if (response.ok) {
      const config = await response.json()
      graphqlUrlCache = config.graphql.url || 'http://localhost:4000/graphql'
      return graphqlUrlCache as string
    }
  } catch (error) {
    console.error('Failed to fetch runtime config for GraphQL:', error)
  }

  // Fallback to localhost
  const fallback = 'http://localhost:4000/graphql'
  graphqlUrlCache = fallback
  return fallback
}

/**
 * Erstellt einen Apollo-Client für GraphQL-Anfragen mit dynamischer Token-Authentifizierung
 * Uses runtime configuration from API
 */
export function createApolloClient(initialToken?: string, graphqlUrl?: string) {
  // HTTP link for GraphQL endpoint
  const httpLink = new HttpLink({
    uri: graphqlUrl || 'http://localhost:4000/graphql',
  })

  // Authentifizierungs-Link für dynamisches Token-Handling
  const authLink = setContext((_, { headers }) => {
    // Get current token from Keycloak instance (if available)
    // or use passed initialToken as fallback
    const currentToken = keycloak?.token || initialToken

    if (!currentToken) {
      console.warn('No authentication token available for GraphQL request')
    }

    return {
      headers: {
        ...headers,
        authorization: currentToken ? `Bearer ${currentToken}` : '',
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
          window.dispatchEvent(new CustomEvent('authError'))
        }
      }
      // On network errors we can retry
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
