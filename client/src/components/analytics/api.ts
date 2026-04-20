import { ApolloClient } from '@apollo/client'

import {
  CREATE_ANALYTICS_REPORT,
  CREATE_REPORT_FOLDER,
  DELETE_ANALYTICS_REPORT,
  DELETE_REPORT_FOLDER,
  GET_ALL_ANALYTICS_REPORTS,
  GET_MY_ANALYTICS_REPORTS,
  GET_REPORT_FOLDERS,
  UPDATE_ANALYTICS_REPORT,
  UPDATE_REPORT_FOLDER,
} from '@/graphql/analyticsReport'
import { secureApiCall } from '@/utils/sessionUtils'

import {
  AnalyticsChartDatum,
  AnalyticsDimensionKey,
  AnalyticsElementType,
  AnalyticsMeasureKey,
  AnalyticsPreviewRecord,
  AnalyticsReportFolderDefinition,
  AnalyticsReportDefinition,
  normalizeAnalyticsChartType,
} from './types'

interface QueryResponse {
  readonly data: AnalyticsChartDatum[]
  readonly records: AnalyticsPreviewRecord[]
  readonly source: 'cube'
}

interface AnalyticsReportGraphQlResponse {
  readonly id: string
  readonly name: string
  readonly isPublic: boolean
  readonly elementType: AnalyticsElementType
  readonly chartType: string
  readonly dimension: AnalyticsDimensionKey
  readonly secondDimension?: AnalyticsDimensionKey | null
  readonly measure: AnalyticsMeasureKey
  readonly createdAt: string | null
  readonly updatedAt: string | null
  readonly company?: ReadonlyArray<{ readonly id: string }> | null
  readonly createdBy?: ReadonlyArray<{
    readonly id: string
    readonly firstName: string
    readonly lastName: string
  }> | null
  readonly folder?: ReadonlyArray<{ readonly id: string; readonly name: string }> | null
}

function getPersonDisplayName(
  person?: {
    readonly firstName: string
    readonly lastName: string
  } | null
) {
  if (!person) {
    return null
  }

  return [person.firstName, person.lastName].filter(Boolean).join(' ') || null
}

interface AnalyticsReportFolderGraphQlResponse {
  readonly id: string
  readonly name: string
  readonly createdAt: string | null
  readonly updatedAt: string | null
  readonly parent?: ReadonlyArray<{ readonly id: string }> | null
  readonly company?: ReadonlyArray<{ readonly id: string }> | null
  readonly createdBy?: ReadonlyArray<{ readonly id: string }> | null
}

function mapAnalyticsReport(report: AnalyticsReportGraphQlResponse): AnalyticsReportDefinition {
  const createdAt = report.createdAt ?? ''
  const creator = report.createdBy?.[0]

  return {
    id: report.id,
    name: report.name,
    isPublic: report.isPublic,
    elementType: report.elementType,
    chartType: normalizeAnalyticsChartType(report.chartType),
    dimension: report.dimension,
    secondDimension: report.secondDimension ?? null,
    measure: report.measure,
    folderId: report.folder?.[0]?.id ?? null,
    creatorId: creator?.id ?? null,
    creatorName: getPersonDisplayName(creator),
    companyId: report.company?.[0]?.id ?? null,
    createdAt,
    updatedAt: report.updatedAt ?? createdAt,
  }
}

function mapAnalyticsReportFolder(
  folder: AnalyticsReportFolderGraphQlResponse
): AnalyticsReportFolderDefinition {
  const createdAt = folder.createdAt ?? ''

  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parent?.[0]?.id ?? null,
    creatorId: folder.createdBy?.[0]?.id ?? null,
    companyId: folder.company?.[0]?.id ?? null,
    createdAt,
    updatedAt: folder.updatedAt ?? createdAt,
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
  creatorId: string | null,
  mineOnly = false
) {
  if (!companyId) {
    return []
  }

  if (!creatorId) {
    return []
  }

  const result = await apolloClient.query<{
    analyticsReports: AnalyticsReportGraphQlResponse[]
  }>({
    query: mineOnly ? GET_MY_ANALYTICS_REPORTS : GET_ALL_ANALYTICS_REPORTS,
    variables: { companyId, creatorId },
    fetchPolicy: 'network-only',
  })

  const reports = (result.data?.analyticsReports ?? []).map(mapAnalyticsReport)

  console.debug('[Analytics] listAnalyticsReports result', {
    mineOnly,
    companyId,
    creatorId,
    rawReports: result.data?.analyticsReports ?? [],
    mappedReports: reports,
    returnedReports: reports,
  })

  return reports
}

export async function listReportFolders(
  apolloClient: ApolloClient<object>,
  companyId: string | null
) {
  if (!companyId) {
    return []
  }

  const result = await apolloClient.query<{
    reportFolders: AnalyticsReportFolderGraphQlResponse[]
  }>({
    query: GET_REPORT_FOLDERS,
    variables: { companyId },
    fetchPolicy: 'network-only',
  })

  const folders = (result.data?.reportFolders ?? []).map(mapAnalyticsReportFolder)

  console.debug('[Analytics] listReportFolders result', {
    companyId,
    rawFolders: result.data?.reportFolders ?? [],
    returnedFolders: folders,
  })

  return folders
}

export async function createAnalyticsReport(
  apolloClient: ApolloClient<object>,
  input: {
    readonly companyId: string | null
    readonly creatorId: string | null
    readonly folderId: string | null
    readonly isPublic: boolean
    readonly name: string
    readonly elementType: AnalyticsElementType
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly secondDimension: AnalyticsDimensionKey | null
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
          isPublic: input.isPublic,
          elementType: input.elementType,
          chartType: input.chartType,
          dimension: input.dimension,
          secondDimension: input.secondDimension,
          measure: input.measure,
          company: { connect: [{ where: { node: { id: { eq: input.companyId } } } }] },
          createdBy: { connect: [{ where: { node: { id: { eq: input.creatorId } } } }] },
          ...(input.folderId
            ? {
                folder: { connect: [{ where: { node: { id: { eq: input.folderId } } } }] },
              }
            : {}),
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
    readonly currentFolderId: string | null
    readonly companyId: string | null
    readonly folderId: string | null
    readonly isPublic: boolean
    readonly name: string
    readonly elementType: AnalyticsElementType
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly secondDimension: AnalyticsDimensionKey | null
    readonly measure: AnalyticsMeasureKey
  }
) {
  if (!input.companyId) {
    throw new Error('A company is required to update analytics reports')
  }

  const variables = {
    id: reportId,
    input: {
      name: { set: input.name },
      isPublic: { set: input.isPublic },
      elementType: { set: input.elementType },
      chartType: { set: input.chartType },
      dimension: { set: input.dimension },
      secondDimension: { set: input.secondDimension },
      measure: { set: input.measure },
      ...(input.currentCompanyId && input.currentCompanyId !== input.companyId
        ? {
            company: {
              disconnect: [{ where: { node: { id: { eq: input.currentCompanyId } } } }],
              connect: [{ where: { node: { id: { eq: input.companyId } } } }],
            },
          }
        : {}),
      ...(input.currentFolderId !== input.folderId
        ? {
            folder: {
              ...(input.currentFolderId
                ? {
                    disconnect: [{ where: { node: { id: { eq: input.currentFolderId } } } }],
                  }
                : {}),
              ...(input.folderId
                ? {
                    connect: [{ where: { node: { id: { eq: input.folderId } } } }],
                  }
                : {}),
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

export async function createReportFolder(
  apolloClient: ApolloClient<object>,
  input: {
    readonly companyId: string | null
    readonly creatorId: string | null
    readonly parentId: string | null
    readonly name: string
  }
) {
  if (!input.companyId || !input.creatorId) {
    throw new Error('A company and creator are required to save analytics folders')
  }

  const result = await apolloClient.mutate<{
    createReportFolders: {
      reportFolders: AnalyticsReportFolderGraphQlResponse[]
    }
  }>({
    mutation: CREATE_REPORT_FOLDER,
    variables: {
      input: [
        {
          name: input.name,
          company: { connect: [{ where: { node: { id: { eq: input.companyId } } } }] },
          createdBy: { connect: [{ where: { node: { id: { eq: input.creatorId } } } }] },
          ...(input.parentId
            ? {
                parent: { connect: [{ where: { node: { id: { eq: input.parentId } } } }] },
              }
            : {}),
        },
      ],
    },
  })

  const folder = result.data?.createReportFolders.reportFolders?.[0]
  if (!folder) {
    throw new Error('Failed to create folder')
  }

  return mapAnalyticsReportFolder(folder)
}

export async function updateReportFolder(
  apolloClient: ApolloClient<object>,
  folderId: string,
  input: {
    readonly name: string
    readonly currentParentId: string | null
    readonly parentId: string | null
  }
) {
  const result = await apolloClient.mutate<{
    updateReportFolders: {
      reportFolders: AnalyticsReportFolderGraphQlResponse[]
    }
  }>({
    mutation: UPDATE_REPORT_FOLDER,
    variables: {
      id: folderId,
      input: {
        name: { set: input.name },
        ...(input.currentParentId !== input.parentId
          ? {
              parent: {
                ...(input.currentParentId
                  ? {
                      disconnect: [{ where: { node: { id: { eq: input.currentParentId } } } }],
                    }
                  : {}),
                ...(input.parentId
                  ? {
                      connect: [{ where: { node: { id: { eq: input.parentId } } } }],
                    }
                  : {}),
              },
            }
          : {}),
      },
    },
  })

  const folder = result.data?.updateReportFolders.reportFolders?.[0]
  if (!folder) {
    throw new Error('Failed to update folder')
  }

  return mapAnalyticsReportFolder(folder)
}

export async function deleteReportFolder(apolloClient: ApolloClient<object>, folderId: string) {
  const result = await apolloClient.mutate<{
    deleteReportFolders: {
      nodesDeleted: number
    }
  }>({
    mutation: DELETE_REPORT_FOLDER,
    variables: { id: folderId },
  })

  const deleted = result.data?.deleteReportFolders.nodesDeleted ?? 0
  if (deleted < 1) {
    throw new Error('Failed to delete folder')
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
    readonly secondDimension: AnalyticsDimensionKey | null
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
