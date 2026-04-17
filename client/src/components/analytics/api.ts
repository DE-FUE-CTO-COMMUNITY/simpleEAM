import { ApolloClient } from '@apollo/client'

import {
  CREATE_ANALYTICS_REPORT,
  DELETE_ANALYTICS_REPORT,
  GET_ANALYTICS_REPORTS,
  UPDATE_ANALYTICS_REPORT,
} from '@/graphql/analyticsReport'
import { secureApiCall } from '@/utils/sessionUtils'

import {
  AnalyticsDimensionKey,
  AnalyticsElementType,
  AnalyticsMeasureKey,
  AnalyticsReportDefinition,
} from './types'

interface QueryResponse {
  readonly data: Array<{
    readonly label: string
    readonly value: number
  }>
  readonly source: 'cube'
}

interface AnalyticsReportGraphQlResponse {
  readonly id: string
  readonly name: string
  readonly elementType: AnalyticsElementType
  readonly chartType: AnalyticsReportDefinition['chartType']
  readonly dimension: AnalyticsDimensionKey
  readonly measure: AnalyticsMeasureKey
  readonly createdAt: string
  readonly updatedAt: string
  readonly company?: ReadonlyArray<{ readonly id: string }> | null
}

function mapAnalyticsReport(report: AnalyticsReportGraphQlResponse): AnalyticsReportDefinition {
  return {
    id: report.id,
    name: report.name,
    elementType: report.elementType,
    chartType: report.chartType,
    dimension: report.dimension,
    measure: report.measure,
    companyId: report.company?.[0]?.id ?? null,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  }
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message || fallbackMessage)
  }

  return (await response.json()) as T
}

export async function listAnalyticsReports(
  apolloClient: ApolloClient<object>,
  companyId: string | null,
  creatorId: string | null
) {
  if (!companyId || !creatorId) {
    return []
  }

  const result = await apolloClient.query<{
    analyticsReports: AnalyticsReportGraphQlResponse[]
  }>({
    query: GET_ANALYTICS_REPORTS,
    variables: { companyId, creatorId },
    fetchPolicy: 'network-only',
  })

  return (result.data?.analyticsReports ?? []).map(mapAnalyticsReport)
}

export async function createAnalyticsReport(
  apolloClient: ApolloClient<object>,
  input: {
    readonly companyId: string | null
    readonly creatorId: string | null
    readonly name: string
    readonly elementType: AnalyticsElementType
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  if (!input.companyId || !input.creatorId) {
    throw new Error('A company and creator are required to save analytics reports')
  }

  const result = await apolloClient.mutate<{
    createAnalyticsReports: {
      analyticsReports: AnalyticsReportGraphQlResponse[]
    }
  }>({
    mutation: CREATE_ANALYTICS_REPORT,
    variables: {
      input: [
        {
          name: input.name,
          elementType: input.elementType,
          chartType: input.chartType,
          dimension: input.dimension,
          measure: input.measure,
          company: { connect: [{ where: { node: { id: { eq: input.companyId } } } }] },
          createdBy: { connect: [{ where: { node: { id: { eq: input.creatorId } } } }] },
        },
      ],
    },
  })

  const report = result.data?.createAnalyticsReports.analyticsReports?.[0]
  if (!report) {
    throw new Error('Failed to create report')
  }

  return mapAnalyticsReport(report)
}

export async function updateAnalyticsReport(
  apolloClient: ApolloClient<object>,
  reportId: string,
  input: {
    readonly currentCompanyId: string | null
    readonly companyId: string | null
    readonly name: string
    readonly elementType: AnalyticsElementType
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  if (!input.companyId) {
    throw new Error('A company is required to update analytics reports')
  }

  const variables = {
    id: reportId,
    input: {
      name: input.name,
      elementType: input.elementType,
      chartType: input.chartType,
      dimension: input.dimension,
      measure: input.measure,
      ...(input.currentCompanyId && input.currentCompanyId !== input.companyId
        ? {
            company: {
              disconnect: [{ where: { node: { id: { eq: input.currentCompanyId } } } }],
              connect: [{ where: { node: { id: { eq: input.companyId } } } }],
            },
          }
        : {}),
    },
  }

  const result = await apolloClient.mutate<{
    updateAnalyticsReports: {
      analyticsReports: AnalyticsReportGraphQlResponse[]
    }
  }>({
    mutation: UPDATE_ANALYTICS_REPORT,
    variables,
  })

  const report = result.data?.updateAnalyticsReports.analyticsReports?.[0]
  if (!report) {
    throw new Error('Failed to update report')
  }

  return mapAnalyticsReport(report)
}

export async function deleteAnalyticsReport(apolloClient: ApolloClient<object>, reportId: string) {
  const result = await apolloClient.mutate<{
    deleteAnalyticsReports: {
      nodesDeleted: number
    }
  }>({
    mutation: DELETE_ANALYTICS_REPORT,
    variables: { id: reportId },
  })

  const deleted = result.data?.deleteAnalyticsReports.nodesDeleted ?? 0
  if (deleted < 1) {
    throw new Error('Failed to delete report')
  }
}

export async function syncAnalyticsProjection(baseUrl: string, companyId: string | null) {
  return secureApiCall(async token => {
    const response = await fetch(`${baseUrl}/projections/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ companyId }),
    })

    return parseResponse<{
      readonly syncedAt: string
      readonly applications: number
      readonly capabilities: number
      readonly aiComponents: number
      readonly dataObjects: number
      readonly interfaces: number
      readonly infrastructure: number
    }>(response, 'Failed to sync analytics projections')
  })
}

export async function queryAnalyticsPreview(
  baseUrl: string,
  input: {
    readonly companyId: string | null
    readonly elementType: AnalyticsElementType
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  return secureApiCall(async token => {
    const response = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    })

    return parseResponse<QueryResponse>(response, 'Failed to load analytics preview')
  })
}
