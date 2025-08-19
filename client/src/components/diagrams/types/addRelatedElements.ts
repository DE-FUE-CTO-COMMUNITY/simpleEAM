/**
 * Typen und Interfaces für die "Add Related Elements" Funktionalität
 */

/**
 * Position für neue Elemente relativ zum ausgewählten Element
 */
export type RelativePosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * Excalidraw Arrow-Typen basierend auf der offiziellen Excalidraw-Implementierung
 */
export type ArrowType = 'sharp' | 'curved' | 'elbow'

/**
 * Gap-Größen für Pfeil-Bindungen
 */
export type ArrowGapSize = 'none' | 'small' | 'medium' | 'large'

/**
 * Konfiguration für das Hinzufügen verwandter Elemente
 */
export interface AddRelatedElementsConfig {
  /** Anzahl der Hops (1-6) */
  hops: number
  /** Pfeiltyp für Verbindungen */
  arrowType: ArrowType
  /** Position der neuen Elemente */
  position: RelativePosition
  /** Abstand zwischen einzelnen Elementen */
  spacing: number
  /** Distanz zwischen ausgewähltem Element und erster Reihe neuer Elemente (immer gesetzt, initial = gerundete Breite des ausgewählten Elements) */
  distance: number
  /** Gap zwischen Pfeil und Element */
  arrowGap: ArrowGapSize
  /** Ausgewählte Element-Typen (optional, wenn nicht gesetzt werden alle Typen verwendet) */
  selectedElementTypes?: string[]
}

/**
 * Ein Element mit seinen Beziehungen aus der Datenbank
 */
export interface ElementWithRelationships {
  id: string
  type: string
  displayText: string
  x?: number
  y?: number
  width?: number
  height?: number
  relationships: RelatedElement[]
}

/**
 * Ein verwandtes Element aus einer Beziehung
 */
export interface RelatedElement {
  id: string
  type: string
  displayText: string
  relationshipType: string
  reverseArrow: boolean
  sourceId: string
  targetId: string
}

/**
 * Positionierungsinformationen für ein Element
 */
export interface ElementPosition {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Ein Hop-Level mit seinen Elementen
 */
export interface HopLevel {
  level: number
  elements: CreatedElementsResult[]
  totalWidth: number
  totalHeight: number
}

/**
 * Ergebnis der Hop-Berechnung
 */
export interface HopCalculation {
  levels: HopLevel[]
  totalElements: number
  maxWidth: number
  maxHeight: number
}

/**
 * Ergebnis der Element-Erstellung mit allen relevanten Informationen
 */
export interface CreatedElementsResult {
  elements: any[] // ExcalidrawElement[] - wird später typisiert
  totalElements: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
}
