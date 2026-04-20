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

export type AnalyticsElementType = (typeof analyticsElementTypes)[number]
export type AnalyticsDimensionKey = (typeof analyticsDimensionKeys)[number]
export type AnalyticsMeasureKey = (typeof analyticsMeasureKeys)[number]

export const analyticsSchemaByElementType: Record<
  AnalyticsElementType,
  {
    readonly cubeName: string
    readonly dimensions: readonly AnalyticsDimensionKey[]
    readonly measures: readonly AnalyticsMeasureKey[]
    readonly dimensionMembers: Partial<Record<AnalyticsDimensionKey, string>>
    readonly measureMembers: Partial<Record<AnalyticsMeasureKey, string>>
  }
> = {
  businessCapability: {
    cubeName: 'BusinessCapabilityProjection',
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
    dimensionMembers: {
      status: 'status',
      capabilityType: 'capabilityType',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      averageMaturityLevel: 'averageMaturityLevel',
      totalBusinessValue: 'totalBusinessValue',
      averageBusinessValue: 'averageBusinessValue',
      supportedApplications: 'supportedApplications',
      supportingAiComponents: 'supportingAiComponents',
      relatedDataObjects: 'relatedDataObjects',
    },
  },
  application: {
    cubeName: 'ApplicationProjection',
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
    dimensionMembers: {
      status: 'status',
      criticality: 'criticality',
      vendor: 'vendor',
      timeCategory: 'timeCategory',
      hostingEnvironment: 'hostingEnvironment',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      totalCost: 'totalCost',
      averageCost: 'averageCost',
      supportedCapabilities: 'supportedCapabilities',
      usedDataObjects: 'usedDataObjects',
      aiComponents: 'aiComponents',
      interfaces: 'interfaces',
    },
  },
  aiComponent: {
    cubeName: 'AiComponentProjection',
    dimensions: ['status', 'aiType', 'provider', 'license', 'month'],
    measures: [
      'count',
      'totalCost',
      'averageCost',
      'averageAccuracy',
      'supportedCapabilities',
      'trainingDataObjects',
    ],
    dimensionMembers: {
      status: 'status',
      aiType: 'aiType',
      provider: 'provider',
      license: 'license',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      totalCost: 'totalCost',
      averageCost: 'averageCost',
      averageAccuracy: 'averageAccuracy',
      supportedCapabilities: 'supportedCapabilities',
      trainingDataObjects: 'trainingDataObjects',
    },
  },
  dataObject: {
    cubeName: 'DataObjectProjection',
    dimensions: ['classification', 'format', 'month'],
    measures: ['count', 'usingApplications', 'transferringInterfaces', 'trainingAiComponents'],
    dimensionMembers: {
      classification: 'classification',
      format: 'format',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      usingApplications: 'usingApplications',
      transferringInterfaces: 'transferringInterfaces',
      trainingAiComponents: 'trainingAiComponents',
    },
  },
  applicationInterface: {
    cubeName: 'ApplicationInterfaceProjection',
    dimensions: ['status', 'interfaceType', 'protocol', 'month'],
    measures: ['count', 'sourceApplications', 'targetApplications', 'transferredDataObjects'],
    dimensionMembers: {
      status: 'status',
      interfaceType: 'interfaceType',
      protocol: 'protocol',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      sourceApplications: 'sourceApplications',
      targetApplications: 'targetApplications',
      transferredDataObjects: 'transferredDataObjects',
    },
  },
  infrastructure: {
    cubeName: 'InfrastructureProjection',
    dimensions: ['status', 'infrastructureType', 'vendor', 'location', 'operatingSystem', 'month'],
    measures: ['count', 'totalCost', 'averageCost', 'hostedApplications', 'hostedAiComponents'],
    dimensionMembers: {
      status: 'status',
      infrastructureType: 'infrastructureType',
      vendor: 'vendor',
      location: 'location',
      operatingSystem: 'operatingSystem',
      month: 'updatedMonth',
    },
    measureMembers: {
      count: 'count',
      totalCost: 'totalCost',
      averageCost: 'averageCost',
      hostedApplications: 'hostedApplications',
      hostedAiComponents: 'hostedAiComponents',
    },
  },
}

export function isAnalyticsDimensionSupported(
  elementType: AnalyticsElementType,
  dimension: AnalyticsDimensionKey
): boolean {
  return analyticsSchemaByElementType[elementType].dimensions.includes(dimension)
}

export function isAnalyticsMeasureSupported(
  elementType: AnalyticsElementType,
  measure: AnalyticsMeasureKey
): boolean {
  return analyticsSchemaByElementType[elementType].measures.includes(measure)
}

export function getAnalyticsCubeName(elementType: AnalyticsElementType): string {
  return analyticsSchemaByElementType[elementType].cubeName
}

export function getAnalyticsDimensionMember(
  elementType: AnalyticsElementType,
  dimension: AnalyticsDimensionKey
): string {
  const member = analyticsSchemaByElementType[elementType].dimensionMembers[dimension]
  if (!member) {
    throw new Error(`Unsupported analytics dimension '${dimension}' for ${elementType}`)
  }
  return member
}

export function getAnalyticsMeasureMember(
  elementType: AnalyticsElementType,
  measure: AnalyticsMeasureKey
): string {
  const member = analyticsSchemaByElementType[elementType].measureMembers[measure]
  if (!member) {
    throw new Error(`Unsupported analytics measure '${measure}' for ${elementType}`)
  }
  return member
}
