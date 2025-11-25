/**
 * Pfeil-Erstellung Service mit manuellen Excalidraw Bindings
 * ==========================================================
 *
 * Diese Implementierung erstellt Pfeile mit manuell berechneten Bindings:
 * - Korrekte Gap-Berechnung für Pfeil-Positionierung
 * - Manuelle start/end Bindings mit Element-IDs und Focus = 0 (Element-Zentrum)
 * - Präzise Koordinaten-Berechnung (x, y, width, height)
 * - Vollständige Excalidraw Arrow Element Erstellung
 */

import { ArrowType, RelativePosition, ArrowGapSize } from '../types/addRelatedElements'
import { generateElementId } from '../utils/elementIdManager'

// Vereinfachtes Excalidraw Element Interface basierend auf der offiziellen Dokumentation

// Excalidraw Element Typen
export interface ExcalidrawBaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  boundElements?: { id: string; type: 'arrow' | string }[] | null
  angle?: number
  strokeColor?: string
  backgroundColor?: string
  fillStyle?: string
  strokeWidth?: number
  strokeStyle?: string
  roughness?: number
  opacity?: number
  groupIds?: string[]
  frameId?: string | null
  seed?: number
  versionNonce?: number
  isDeleted?: boolean
  updated?: number
  link?: string | null
  locked?: boolean
  [key: string]: any
}

export interface ExcalidrawArrowBinding {
  elementId: string
  focus: number
  gap: number
}

export interface ExcalidrawArrowElement extends ExcalidrawBaseElement {
  type: 'arrow'
  points: readonly [number, number][]
  startBinding: ExcalidrawArrowBinding | null
  endBinding: ExcalidrawArrowBinding | null
  startArrowhead: 'arrow' | null
  endArrowhead: 'arrow' | null
  roundness?: { type: number } | null
  elbowed?: boolean
  lastCommittedPoint?: [number, number] | null
  angle?: number
  strokeColor?: string
  backgroundColor?: string
  fillStyle?: string
  strokeWidth?: number
  strokeStyle?: string
  roughness?: number
  opacity?: number
  groupIds?: string[]
  frameId?: string | null
  seed?: number
  versionNonce?: number
  isDeleted?: boolean
  updated?: number
  link?: string | null
  locked?: boolean
}

// Parameter für Pfeil-Erstellung
export interface CreateArrowParams {
  sourceElement: ExcalidrawBaseElement
  targetElement: ExcalidrawBaseElement
  arrowType?: ArrowType
  position?: RelativePosition
  reverseArrow?: boolean
  totalArrows?: number
  arrowIndex?: number
  arrowGap?: ArrowGapSize
}

/**
 * Konvertiert ArrowGapSize zu numerischem Wert
 */
function getGapValue(gapSize?: ArrowGapSize): number {
  if (typeof gapSize === 'number') {
    return gapSize
  }

  switch (gapSize) {
    case 'small':
      return 8
    case 'medium':
      return 12
    case 'large':
      return 16
    default:
      return 12 // Standard medium gap
  }
}

// Opposite Side Mapping
const oppositeSide: Record<RelativePosition, RelativePosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

/**
 * Berechnet Anchor-Punkt auf Element-Kante mit Gap
 */
function calculateAnchorPoint(
  element: ExcalidrawBaseElement,
  side: string,
  offset: number = 0,
  gap: number = 0
): [number, number] {
  const { x, y, width, height } = element

  switch (side) {
    case 'top':
      return [x + width / 2 + offset, y - gap]
    case 'bottom':
      return [x + width / 2 + offset, y + height + gap]
    case 'left':
      return [x - gap, y + height / 2 + offset]
    case 'right':
      return [x + width + gap, y + height / 2 + offset]
    default:
      return [x + width / 2, y + height / 2]
  }
}

/**
 * Berechnet den Zielpunkt-Anker (ohne Offset, mit Gap für initiale Positionierung)
 */
function calculateTargetAnchorPoint(
  element: ExcalidrawBaseElement,
  side: string,
  gap: number = 0
): [number, number] {
  const { x, y, width, height } = element

  // Berechne Punkt mit Gap-Abstand vom Element-Rand
  // Der Gap ist notwendig für die initiale Pfeil-Positionierung
  switch (side) {
    case 'top':
      return [x + width / 2, y - gap] // Oberhalb der oberen Kante
    case 'bottom':
      return [x + width / 2, y + height + gap] // Unterhalb der unteren Kante
    case 'left':
      return [x - gap, y + height / 2] // Links von der linken Kante
    case 'right':
      return [x + width + gap, y + height / 2] // Rechts von der rechten Kante
    default:
      return [x + width / 2, y + height / 2]
  }
}

/**
 * Erstellt Pfeil-Geometrie basierend auf Typ
 */
function createArrowGeometry(
  startPoint: [number, number],
  endPoint: [number, number],
  arrowType: ArrowType
): {
  points: [number, number][]
  bounds: { x: number; y: number; width: number; height: number }
  roundness?: { type: number } | null
  elbowed?: boolean
} {
  const [startX, startY] = startPoint
  const [endX, endY] = endPoint

  const deltaX = endX - startX
  const deltaY = endY - startY

  let points: [number, number][]
  switch (arrowType) {
    case 'elbow': {
      const midX = deltaX / 2
      points = [
        [0, 0],
        [midX, 0],
        [midX, deltaY],
        [deltaX, deltaY],
      ]
      break
    }
    case 'curved': {
      points = [
        [0, 0],
        [deltaX, deltaY],
      ]
      break
    }
    default: {
      points = [
        [0, 0],
        [deltaX, deltaY],
      ]
    }
  }

  const result = {
    points,
    bounds: {
      x: startX,
      y: startY,
      width: deltaX,
      height: deltaY,
    },
  }

  if (arrowType === 'curved') return { ...result, roundness: { type: 2 } }
  if (arrowType === 'elbow') return { ...result, elbowed: true }
  return result
}

/**
 * Hauptfunktion: Erstellt einen Pfeil zwischen zwei Elementen mit manuellen Bindings
 */
export function createArrowBetweenElements(params: CreateArrowParams): any {
  const {
    sourceElement,
    targetElement,
    arrowType = 'sharp',
    reverseArrow = false,
    totalArrows = 1,
    arrowIndex = 0,
    arrowGap = 'medium',
  } = params

  // Defensive Validierung
  if (!sourceElement || !targetElement) {
    throw new Error('Source and target elements are required')
  }

  // Feste Seiten aus Parameter (kein automatisches Umschalten)
  const desired = params.position || 'right'
  const sourceSide: RelativePosition = desired
  const targetSide: RelativePosition = oppositeSide[desired]

  // Berechne Gap-Wert
  const gapValue = getGapValue(arrowGap)

  // Gleichmäßige Offset-Verteilung entlang der Seite (innerhalb der Seitenlänge, kein Überhang)
  function computeDistributedOffset(
    el: ExcalidrawBaseElement,
    side: RelativePosition,
    count: number,
    index: number
  ): number {
    if (count <= 1) return 0
    const isVerticalSide = side === 'left' || side === 'right' // Offset entlang Y
    const span = isVerticalSide ? el.height : el.width
    if (span <= 0) return 0
    const margin = Math.min(12, span * 0.05) // 5% oder max 12px
    const effectiveSpan = Math.max(0, span - 2 * margin)
    if (effectiveSpan === 0) return 0
    if (count === 2) {
      // symmetrisch zwei Punkte
      return index === 0 ? -effectiveSpan / 2 : effectiveSpan / 2
    }
    // Verteilt von -effectiveSpan/2 bis +effectiveSpan/2 über (count-1) Intervalle
    const step = effectiveSpan / (count - 1)
    return -effectiveSpan / 2 + step * index
  }

  // Offset immer relativ zur ursprünglichen Source-Seite berechnen (auch bei reverse)
  const offset = computeDistributedOffset(sourceElement, sourceSide, totalArrows, arrowIndex)

  // Berechne Anchor-Punkte basierend auf vorgegebenen Seiten
  let startPoint: [number, number]
  let endPoint: [number, number]

  if (!reverseArrow) {
    // Normal Richtung: Source -> Target (Offset an Source-Seite)
    startPoint = calculateAnchorPoint(sourceElement, sourceSide, offset, gapValue)
    endPoint = calculateTargetAnchorPoint(targetElement, targetSide, gapValue)
  } else {
    // Reverse Richtung: Target -> Source; Offset bleibt konzeptionell an ursprünglicher Source-Seite
    startPoint = calculateTargetAnchorPoint(targetElement, targetSide, gapValue) // ohne Offset
    endPoint = calculateAnchorPoint(sourceElement, sourceSide, offset, gapValue) // Offset hier
  }

  // Erstelle Pfeil-Geometrie für Koordinaten-Berechnung
  const geometry = createArrowGeometry(startPoint, endPoint, arrowType)

  // Berechne Focus-Werte für die Bindings
  // Focus 0 bedeutet Zentrum des Elements - das funktioniert korrekt
  const startFocus = 0
  const endFocus = 0

  // Gap-Werte für Bindings sollten den tatsächlichen Gap-Wert widerspiegeln
  // Da wir den Gap bereits in den Koordinaten berücksichtigt haben, verwenden wir den gleichen Wert
  const startGap = gapValue
  const endGap = gapValue

  // Erstelle vollständiges Excalidraw Arrow Element
  const arrowElement: ExcalidrawArrowElement = {
    type: 'arrow',
    id: generateElementId(),
    x: geometry.bounds.x,
    y: geometry.bounds.y,
    width: geometry.bounds.width,
    height: geometry.bounds.height,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    seed: Math.floor(Math.random() * 1000000),
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    updated: Date.now(),
    link: null,
    locked: false,
    points: geometry.points.map(([x, y]) => [x, y] as [number, number]),
    lastCommittedPoint: null,
    startBinding: {
      elementId: (!reverseArrow ? sourceElement : targetElement).id,
      focus: startFocus,
      gap: startGap,
    },
    endBinding: {
      elementId: (!reverseArrow ? targetElement : sourceElement).id,
      focus: endFocus,
      gap: endGap,
    },
    startArrowhead: reverseArrow ? null : null,
    endArrowhead: 'arrow',
    ...(geometry.roundness && { roundness: geometry.roundness }),
    ...(geometry.elbowed && { elbowed: geometry.elbowed }),
  }

  return arrowElement
}
