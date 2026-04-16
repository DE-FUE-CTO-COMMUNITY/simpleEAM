import { graphqlRequest } from '../../graphql/client'
import { fetchServiceAccessToken } from '../../auth/keycloak-service-token'
import { AnalyticsProjectionCompany, AnalyticsProjectionSyncResult } from '../types'

const COMPANY_BATCH_SIZE = 200

type CompaniesQueryResult = {
  companies: AnalyticsProjectionCompany[]
}

type SyncEndpointResult = {
  companyId: string
  applications: number
  capabilities: number
}

const getAnalyticsSyncUrl = (): string => {
  const configuredUrl = process.env.ANALYTICS_SYNC_URL?.trim()
  if (configuredUrl) {
    return configuredUrl
  }

  const graphqlUrl =
    process.env.GRAPHQL_INTERNAL_URL?.trim() || process.env.GRAPHQL_URL?.trim() || ''

  if (graphqlUrl) {
    return graphqlUrl.replace(/\/graphql\/?$/, '/analytics/projections/sync')
  }

  return 'http://server:4000/analytics/projections/sync'
}

const getServiceAccessToken = async (): Promise<string> => {
  const accessToken = await fetchServiceAccessToken()
  if (!accessToken) {
    throw new Error('Missing service token configuration for analytics projection refresh')
  }
  return accessToken
}

async function fetchAllCompanies(accessToken: string): Promise<AnalyticsProjectionCompany[]> {
  const companies: AnalyticsProjectionCompany[] = []
  let offset = 0

  while (true) {
    const data = await graphqlRequest<CompaniesQueryResult>({
      query: `
        query ListCompaniesForAnalyticsProjectionRefresh($limit: Int!, $offset: Int!) {
          companies(limit: $limit, offset: $offset) {
            id
            name
          }
        }
      `,
      variables: {
        limit: COMPANY_BATCH_SIZE,
        offset,
      },
      accessToken,
    })

    const batch = data.companies.filter(
      company => company.id.trim().length > 0 && company.name.trim().length > 0
    )

    companies.push(...batch)

    if (batch.length < COMPANY_BATCH_SIZE) {
      break
    }

    offset += COMPANY_BATCH_SIZE
  }

  return companies.sort((left, right) => left.name.localeCompare(right.name))
}

export async function discoverAnalyticsCompanies(input: {
  readonly companyId?: string | null
}): Promise<AnalyticsProjectionCompany[]> {
  const accessToken = await getServiceAccessToken()

  if (input.companyId) {
    const data = await graphqlRequest<CompaniesQueryResult>({
      query: `
        query GetAnalyticsProjectionCompany($companyId: ID!) {
          companies(where: { id: { eq: $companyId } }, limit: 1) {
            id
            name
          }
        }
      `,
      variables: {
        companyId: input.companyId,
      },
      accessToken,
    })

    return data.companies
  }

  return fetchAllCompanies(accessToken)
}

export async function syncCompanyAnalyticsProjection(input: {
  readonly companyId: string
  readonly companyName: string
}): Promise<AnalyticsProjectionSyncResult> {
  const accessToken = await getServiceAccessToken()
  const response = await fetch(getAnalyticsSyncUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId: input.companyId }),
  })

  if (!response.ok) {
    const payloadText = await response.text().catch(() => '')
    throw new Error(
      `Analytics sync failed for ${input.companyId} (${response.status}): ${payloadText || response.statusText}`
    )
  }

  const result = (await response.json()) as SyncEndpointResult

  return {
    companyId: result.companyId,
    companyName: input.companyName,
    applications: result.applications,
    capabilities: result.capabilities,
  }
}
