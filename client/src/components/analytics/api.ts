import { secureApiCall } from '@/utils/sessionUtils'

import { AnalyticsDimensionKey, AnalyticsMeasureKey, AnalyticsReportDefinition } from './types'

interface ReportsResponse {
  readonly reports: AnalyticsReportDefinition[]
}

interface ReportResponse {
  readonly report: AnalyticsReportDefinition
}

interface QueryResponse {
  readonly data: Array<{
    readonly label: string
    readonly value: number
  }>
  readonly source: 'cube'
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message || fallbackMessage)
  }

  return (await response.json()) as T
}

export async function listAnalyticsReports(baseUrl: string, companyId: string | null) {
  return secureApiCall(async token => {
    const url = new URL(`${baseUrl}/reports`)
    if (companyId) {
      url.searchParams.set('companyId', companyId)
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    const payload = await parseResponse<ReportsResponse>(response, 'Failed to load reports')
    return payload.reports
  })
}

export async function createAnalyticsReport(
  baseUrl: string,
  input: {
    readonly companyId: string | null
    readonly name: string
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  return secureApiCall(async token => {
    const response = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    })

    const payload = await parseResponse<ReportResponse>(response, 'Failed to create report')
    return payload.report
  })
}

export async function updateAnalyticsReport(
  baseUrl: string,
  reportId: string,
  input: {
    readonly companyId: string | null
    readonly name: string
    readonly chartType: AnalyticsReportDefinition['chartType']
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  return secureApiCall(async token => {
    const response = await fetch(`${baseUrl}/reports/${encodeURIComponent(reportId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    })

    const payload = await parseResponse<ReportResponse>(response, 'Failed to update report')
    return payload.report
  })
}

export async function deleteAnalyticsReport(baseUrl: string, reportId: string) {
  return secureApiCall(async token => {
    const response = await fetch(`${baseUrl}/reports/${encodeURIComponent(reportId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    await parseResponse<ReportResponse>(response, 'Failed to delete report')
  })
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
    }>(response, 'Failed to sync analytics projections')
  })
}

export async function queryAnalyticsPreview(
  baseUrl: string,
  input: {
    readonly companyId: string | null
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
