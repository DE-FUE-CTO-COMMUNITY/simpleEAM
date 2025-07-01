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

export interface ExcalidrawElement {
  id: string
  type: 'rectangle' | 'text'
  x: number
  y: number
  width: number
  height: number
  angle: number
  strokeColor: string
  backgroundColor: string
  fillStyle: 'solid' | 'hachure' | 'cross-hatch' | 'dashed' | 'dots' | 'zigzag'
  strokeWidth: number
  strokeStyle: 'solid' | 'dashed' | 'dotted'
  roughness: number
  opacity: number
  groupIds: string[]
  frameId: string | null
  index: string
  roundness: {
    type: number
    value?: number
  } | null
  seed: number
  version: number
  versionNonce: number
  isDeleted: boolean
  boundElements: { id: string; type: 'text' | 'arrow' }[] | null
  updated: number
  link: string | null
  locked: boolean
  customData?: {
    databaseId?: string
    elementType?: string
    originalElement?: any
    isFromDatabase?: boolean
    isMainElement?: boolean
  }
}
