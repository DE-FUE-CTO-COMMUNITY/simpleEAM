export const analyticsChartTypes = [
  'bar',
  'groupedBar',
  'pie',
  'stackedArea',
  'treemap',
  'sankey',
] as const
export const analyticsElementTypes = [
  'businessCapability',
  'application',
  'aiComponent',
  'dataObject',
  'applicationInterface',
  'infrastructure',
] as const
export const analyticsDimensionKeys = [
  'status',
  'capabilityType',
  'criticality',
  'vendor',
  'month',
  'timeCategory',
  'hostingEnvironment',
  'aiType',
  'provider',
  'license',
  'classification',
  'format',
  'interfaceType',
  'protocol',
  'infrastructureType',
  'location',
  'operatingSystem',
] as const
export const analyticsMeasureKeys = [
  'count',
  'totalCost',
  'averageCost',
  'totalBusinessValue',
  'averageBusinessValue',
  'averageMaturityLevel',
  'averageAccuracy',
  'supportedApplications',
  'supportingAiComponents',
  'relatedDataObjects',
  'supportedCapabilities',
  'usedDataObjects',
  'aiComponents',
  'interfaces',
  'trainingDataObjects',
  'usingApplications',
  'transferringInterfaces',
  'trainingAiComponents',
  'sourceApplications',
  'targetApplications',
  'transferredDataObjects',
  'hostedApplications',
  'hostedAiComponents',
] as const

export type AnalyticsChartType = (typeof analyticsChartTypes)[number]
export type AnalyticsElementType = (typeof analyticsElementTypes)[number]
export type AnalyticsDimensionKey = (typeof analyticsDimensionKeys)[number]
export type AnalyticsMeasureKey = (typeof analyticsMeasureKeys)[number]

export function normalizeAnalyticsChartType(value: string): AnalyticsChartType {
  switch (value) {
    case 'groupedBar':
    case 'pie':
    case 'stackedArea':
    case 'treemap':
    case 'sankey':
      return value
    default:
      return 'bar'
  }
}

export const analyticsSchemaByElementType: Record<
  AnalyticsElementType,
  {
    readonly dimensions: readonly AnalyticsDimensionKey[]
    readonly measures: readonly AnalyticsMeasureKey[]
  }
> = {
  businessCapability: {
    dimensions: ['status', 'capabilityType', 'month'],
    measures: [
      'count',
      'averageMaturityLevel',
      'totalBusinessValue',
      'averageBusinessValue',
      'supportedApplications',
      'supportingAiComponents',
      'relatedDataObjects',
    ],
  },
  application: {
    dimensions: ['status', 'criticality', 'vendor', 'timeCategory', 'hostingEnvironment', 'month'],
    measures: [
      'count',
      'totalCost',
      'averageCost',
      'supportedCapabilities',
      'usedDataObjects',
      'aiComponents',
      'interfaces',
    ],
  },
  aiComponent: {
    dimensions: ['status', 'aiType', 'provider', 'license', 'month'],
    measures: [
      'count',
      'totalCost',
      'averageCost',
      'averageAccuracy',
      'supportedCapabilities',
      'trainingDataObjects',
    ],
  },
  dataObject: {
    dimensions: ['classification', 'format', 'month'],
    measures: ['count', 'usingApplications', 'transferringInterfaces', 'trainingAiComponents'],
  },
  applicationInterface: {
    dimensions: ['status', 'interfaceType', 'protocol', 'month'],
    measures: ['count', 'sourceApplications', 'targetApplications', 'transferredDataObjects'],
  },
  infrastructure: {
    dimensions: ['status', 'infrastructureType', 'vendor', 'location', 'operatingSystem', 'month'],
    measures: ['count', 'totalCost', 'averageCost', 'hostedApplications', 'hostedAiComponents'],
  },
}

export const analyticsCurrencyMeasures: readonly AnalyticsMeasureKey[] = [
  'totalCost',
  'averageCost',
]

export interface AnalyticsChartDatum {
  readonly label: string
  readonly value: number
  readonly series?: string | null
}

export interface AnalyticsPreviewRecord {
  readonly id: string
  readonly name: string
  readonly label: string
  readonly secondaryLabel?: string | null
  readonly value: number
}

export interface AnalyticsReportDefinition {
  readonly id: string
  readonly name: string
  readonly isPublic: boolean
  readonly elementType: AnalyticsElementType
  readonly chartType: AnalyticsChartType
  readonly dimension: AnalyticsDimensionKey
  readonly secondDimension?: AnalyticsDimensionKey | null
  readonly measure: AnalyticsMeasureKey
  readonly folderId?: string | null
  readonly creatorId?: string | null
  readonly creatorName?: string | null
  readonly companyId?: string | null
  readonly createdAt: string
  readonly updatedAt: string
}

export interface AnalyticsReportFolderDefinition {
  readonly id: string
  readonly name: string
  readonly parentId?: string | null
  readonly creatorId?: string | null
  readonly companyId?: string | null
  readonly createdAt: string
  readonly updatedAt: string
}

export type AnalyticsReportScope = 'all' | 'mine'

export interface AnalyticsDraftReport {
  readonly id: string | null
  readonly name: string
  readonly isPublic: boolean
  readonly elementType: AnalyticsElementType
  readonly chartType: AnalyticsChartType
  readonly dimension: AnalyticsDimensionKey
  readonly secondDimension: AnalyticsDimensionKey | null
  readonly measure: AnalyticsMeasureKey
  readonly folderId: string | null
}
