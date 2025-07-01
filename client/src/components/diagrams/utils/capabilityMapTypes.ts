import type { BusinessCapability } from '@/gql/generated'

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  horizontalSpacing: number
  verticalSpacing: number
}

export interface ElementCustomizations {
  width?: number
  height?: number
  backgroundColor?: string
  fontSize?: number
  useTopCenteredText?: boolean
}

export interface RenderResult {
  elements: any[]
  totalHeight: number
}

export interface HierarchyAnalysis {
  totalCapabilities: number
  topLevelCapabilities: number
  childrenToRender: number
  expectedTotal: number
}

export interface MissingCapabilitiesAnalysis extends HierarchyAnalysis {
  renderedCapabilities: number
  missingCapabilities: number
  shouldRender: number
  hierarchyLevels: Map<number, BusinessCapability[]>
  missingDetails: BusinessCapability[]
}
