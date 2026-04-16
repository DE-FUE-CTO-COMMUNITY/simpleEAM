export const analyticsChartTypes = ['bar', 'line', 'pie'] as const
export const analyticsDimensionKeys = ['status', 'criticality', 'vendor', 'month'] as const
export const analyticsMeasureKeys = ['applicationCount', 'monthlyCost'] as const

export type AnalyticsChartType = (typeof analyticsChartTypes)[number]
export type AnalyticsDimensionKey = (typeof analyticsDimensionKeys)[number]
export type AnalyticsMeasureKey = (typeof analyticsMeasureKeys)[number]

export interface AnalyticsProjectionRow {
  readonly id: string
  readonly name: string
  readonly status: string
  readonly criticality: string
  readonly vendor: string
  readonly monthlyCost: number
  readonly updatedMonth: string
}

export interface AnalyticsChartDatum {
  readonly label: string
  readonly value: number
}

export interface AnalyticsReportDefinition {
  readonly id: string
  readonly name: string
  readonly chartType: AnalyticsChartType
  readonly dimension: AnalyticsDimensionKey
  readonly measure: AnalyticsMeasureKey
  readonly companyId?: string | null
  readonly createdAt: string
  readonly updatedAt: string
}

export interface AnalyticsDraftReport {
  readonly id: string | null
  readonly name: string
  readonly chartType: AnalyticsChartType
  readonly dimension: AnalyticsDimensionKey
  readonly measure: AnalyticsMeasureKey
}
