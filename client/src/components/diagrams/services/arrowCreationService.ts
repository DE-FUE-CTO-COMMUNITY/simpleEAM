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

  // Calculate point with gap distance from element edge
  // The gap is necessary for initial arrow positioning
  switch (side) {
    case 'top':
      return [x + width / 2, y - gap] // Above the top edge
    case 'bottom':
      return [x + width / 2, y + height + gap] // Below the bottom edge
    case 'left':
      return [x - gap, y + height / 2] // Left of the left edge
    case 'right':
      return [x + width + gap, y + height / 2] // Right of the right edge
    default:
      return [x + width / 2, y + height / 2]
  }
}

/**
 * Creates arrow geometry based on type
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
 * Main function: Creates an arrow between two elements with manual bindings
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

  // Fixed sides from parameter (no automatic switching)
  const desired = params.position || 'right'
  const sourceSide: RelativePosition = desired
  const targetSide: RelativePosition = oppositeSide[desired]

  // Calculate gap value
  const gapValue = getGapValue(arrowGap)

  // Even offset distribution along the side (within side length, no overhang)
  function computeDistributedOffset(
    el: ExcalidrawBaseElement,
    side: RelativePosition,
    count: number,
    index: number
  ): number {
    if (count <= 1) return 0
    const isVerticalSide = side === 'left' || side === 'right' // Offset along Y
    const span = isVerticalSide ? el.height : el.width
    if (span <= 0) return 0
    const margin = Math.min(12, span * 0.05) // 5% or max 12px
    const effectiveSpan = Math.max(0, span - 2 * margin)
    if (effectiveSpan === 0) return 0
    if (count === 2) {
      // symmetrically two points
      return index === 0 ? -effectiveSpan / 2 : effectiveSpan / 2
    }
    // Distributed from -effectiveSpan/2 to +effectiveSpan/2 over (count-1) intervals
    const step = effectiveSpan / (count - 1)
    return -effectiveSpan / 2 + step * index
  }

  // Offset always calculated relative to the original source side (also when reversed)
  const offset = computeDistributedOffset(sourceElement, sourceSide, totalArrows, arrowIndex)

  // Calculate anchor points based on specified sides
  let startPoint: [number, number]
  let endPoint: [number, number]

  if (!reverseArrow) {
    // Normal direction: Source -> Target (Offset at source side)
    startPoint = calculateAnchorPoint(sourceElement, sourceSide, offset, gapValue)
    endPoint = calculateTargetAnchorPoint(targetElement, targetSide, gapValue)
  } else {
    // Reverse direction: Target -> Source; Offset remains conceptually at original source side
    startPoint = calculateTargetAnchorPoint(targetElement, targetSide, gapValue) // without offset
    endPoint = calculateAnchorPoint(sourceElement, sourceSide, offset, gapValue) // Offset here
  }

  // Create arrow geometry for coordinate calculation
  const geometry = createArrowGeometry(startPoint, endPoint, arrowType)

  // Calculate focus values for the bindings
  // Focus 0 means center of element - this works correctly
  const startFocus = 0
  const endFocus = 0

  // Gap values for bindings should reflect the actual gap value
  // Since we have already considered the gap in the coordinates, we use the same value
  const startGap = gapValue
  const endGap = gapValue

  // Create complete Excalidraw arrow element
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
