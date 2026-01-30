import type { BusinessCapability } from '@/gql/generated'

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  includeAiComponents: boolean
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
  type: 'rectangle' | 'text' | 'arrow'
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
  // Text-spezifische Eigenschaften
  text?: string
  fontSize?: number
  fontFamily?: number
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  baseline?: number
  containerId?: string | null
  originalText?: string
  rawText?: string
  lineHeight?: number
  // Arrow-spezifische Eigenschaften
  startBinding?: {
    elementId: string
    focus: number
    gap: number
  } | null
  endBinding?: {
    elementId: string
    focus: number
    gap: number
  } | null
  lastCommittedPoint?: [number, number] | null
  startArrowhead?: 'arrow' | 'dot' | 'triangle' | 'triangle_outline' | null
  endArrowhead?: 'arrow' | 'dot' | 'triangle' | 'triangle_outline' | null
  points?: [number, number][]
  // Elbow Arrow spezifische Eigenschaften
  elbowed?: boolean
  fixedSegments?: any[] | null
  startIsSpecial?: boolean | null
  endIsSpecial?: boolean | null
  customData?: {
    databaseId?: string
    elementType?: string
    elementName?: string // Optimierung: Nur der Name statt kompletter originalElement
    originalElement?: any // Für Rückwärtskompatibilität beibehalten
    isFromDatabase?: boolean
    isMainElement?: boolean
    displayText?: string
  }
}
