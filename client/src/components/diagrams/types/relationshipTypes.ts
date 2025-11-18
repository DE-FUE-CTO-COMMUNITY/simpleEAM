/**
 * Typen für die Beziehungsanalyse und -erstellung in Excalidraw-Diagrammen
 */

import { ElementType, RelationshipDefinition } from '../utils/relationshipValidation'

// Excalidraw Element Interface (vereinfacht)
export interface ExcalidrawElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  text?: { text: string }
  groupIds?: string[] // Gruppen-IDs für gruppierte Elemente
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?: string
    elementName?: string
    isMainElement?: boolean
    mainElementId?: string
  }
  startBinding?: {
    elementId: string
    focus: number
    gap: number
  }
  endBinding?: {
    elementId: string
    focus: number
    gap: number
  }
  startArrowhead?: string
  endArrowhead?: string
}

// Analyseresultat für einen Pfeil
export interface ArrowAnalysisResult {
  arrow: ExcalidrawElement
  sourceElement?: ExcalidrawElement
  targetElement?: ExcalidrawElement
  status: 'valid' | 'incomplete' | 'invalid' | 'missing-binding'
  issues: ArrowIssue[]
  suggestedRelationships: RelationshipDefinition[]
  selectedRelationship?: RelationshipDefinition
}

// Probleme mit Pfeilen
export interface ArrowIssue {
  type:
    | 'missing-start-binding'
    | 'missing-end-binding'
    | 'invalid-relationship'
    | 'binding-to-non-main-element'
  description: string
  element?: ExcalidrawElement
}

// New relationship to be created
export interface NewRelationship {
  id: string // Eindeutige ID für die UI
  arrowId: string
  sourceElementId: string
  targetElementId: string
  sourceElementType: ElementType
  targetElementType: ElementType
  sourceElementName: string
  targetElementName: string
  relationshipDefinition: RelationshipDefinition
  selected: boolean
  status: 'valid' | 'incomplete' | 'invalid'
  missingElement?: 'source' | 'target' | 'both'
  invalidReason?: string
}

// Erweiterte Props für den NewElementsDialog
export interface ExtendedNewElementsDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedElements: NewElement[], selectedRelationships: NewRelationship[]) => void
  newElements: NewElement[]
  newRelationships: NewRelationship[]
  loading?: boolean
}

// NewElement bleibt unverändert aber hier für Vollständigkeit
export interface NewElement {
  id: string
  text: string
  elementType: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  backgroundColor: string
  selected: boolean
}

// Ergebnis der gesamten Pfeilanalyse
export interface ArrowAnalysisCompleteResult {
  validRelationships: NewRelationship[]
  incompleteRelationships: NewRelationship[]
  invalidRelationships: NewRelationship[]
  bindingIssues: ArrowAnalysisResult[]
  correctedElements?: ExcalidrawElement[] // Elemente mit korrigierten Bindings
}
