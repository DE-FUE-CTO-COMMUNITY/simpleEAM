import dotenv from 'dotenv'

dotenv.config()

const GRAPHQL_URL =
  process.env.GRAPHQL_INTERNAL_URL || process.env.GRAPHQL_URL || 'http://server:4000/graphql'

type GraphQLError = {
  message?: string
}

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

export const graphqlRequest = async <T>(input: {
  readonly query: string
  readonly variables?: Record<string, unknown>
  readonly accessToken?: string | null
}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (input.accessToken) {
    headers.Authorization = `Bearer ${input.accessToken}`
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: input.query,
      variables: input.variables ?? {},
    }),
  })

  if (!response.ok) {
    const payloadText = await response.text().catch(() => '')
    throw new Error(`GraphQL HTTP error ${response.status}: ${payloadText || response.statusText}`)
  }

  const payload = (await response.json()) as GraphQLResponse<T>

  if (payload.errors && payload.errors.length > 0) {
    const errorMessage = payload.errors
      .map(error => error.message || 'Unknown GraphQL error')
      .join('; ')
    throw new Error(errorMessage)
  }

  if (!payload.data) {
    throw new Error('GraphQL response did not include data')
  }

  return payload.data
}

export const isGraphqlReachable = async (): Promise<boolean> => {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'query { __typename }' }),
    })

    return response.ok
  } catch {
    return false
  }
}
