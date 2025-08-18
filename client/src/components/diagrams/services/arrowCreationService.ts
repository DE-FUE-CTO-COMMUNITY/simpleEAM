// arrowCreationService.ts - Erstellung & Geometrie von Pfeilen zwischen Excalidraw Elementen
import { ArrowType, RelativePosition } from '../types/addRelatedElements'
// (distribution now handled locally in computeAnchorPoints)
import { generateElementId } from '../utils/elementIdManager'

// Minimal benötigte Typen für Excalidraw Elemente, um any zu vermeiden
export interface ExcalidrawBaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  boundElements?: { id: string; type: 'arrow' | string }[] | null
  [key: string]: any // Allow extra properties from library-created templates
}

export interface ExcalidrawArrowBinding {
  elementId: string
  focus?: number
  gap?: number
  fixedPoint?: [number, number]
}

export interface ExcalidrawArrowElement extends ExcalidrawBaseElement {
  type: 'arrow'
  points: [number, number][]
  startBinding: ExcalidrawArrowBinding | null
  endBinding: ExcalidrawArrowBinding | null
  startArrowhead: 'arrow' | null
  endArrowhead: 'arrow' | null
  elbowed?: boolean
  fixedSegments?: any
  startIsSpecial?: any
  endIsSpecial?: any
  roundness: { type: number; value?: number } | null
}

export interface CreateArrowParams {
  sourceElement: ExcalidrawBaseElement
  targetElement: ExcalidrawBaseElement
  arrowType: ArrowType
  position?: RelativePosition
  reverseArrow?: boolean
  arrowIndex?: number
  totalArrows?: number
}

export const createArrowBetweenElements = ({
  sourceElement,
  targetElement,
  arrowType,
  position,
  reverseArrow = false,
  arrowIndex = 0,
  totalArrows = 1,
}: CreateArrowParams): ExcalidrawArrowElement => {
  const arrowId = generateElementId()
  const actualSourceElement = sourceElement
  const actualTargetElement = targetElement
  const resolvedPosition = derivePosition(position, actualSourceElement, actualTargetElement)
  const { sourcePoint, targetPoint } = computeAnchorPoints(
    actualSourceElement,
    actualTargetElement,
    resolvedPosition,
    arrowIndex,
    totalArrows
  )
  const arrowConfig = getArrowConfiguration(arrowType)
  const { points, arrowGeometry } = buildArrowGeometry(
    sourcePoint,
    targetPoint,
    arrowType,
    resolvedPosition
  )

  return {
    id: arrowId,
    type: 'arrow',
    ...arrowGeometry,
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
    index: 'a2',
    roundness: arrowConfig.roundness,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    points,
    lastCommittedPoint: null,
    startBinding: calculateBindingForArrowType(actualSourceElement, sourcePoint, arrowType),
    endBinding: calculateBindingForArrowType(actualTargetElement, targetPoint, arrowType),
    startArrowhead: reverseArrow ? 'arrow' : null,
    endArrowhead: reverseArrow ? null : 'arrow',
    elbowed: arrowConfig.elbowed,
    ...(arrowType === 'elbow' && {
      fixedSegments: null,
      startIsSpecial: null,
      endIsSpecial: null,
    }),
  }
}

const calculateBindingForArrowType = (
  element: ExcalidrawBaseElement,
  connectionPoint: { x: number; y: number },
  arrowType: ArrowType
): ExcalidrawArrowBinding => {
  if (arrowType === 'elbow') {
    const fixedPointX = (connectionPoint.x - element.x) / element.width
    const fixedPointY = (connectionPoint.y - element.y) / element.height
    const normalizedFixedPointX = Math.max(0, Math.min(1, fixedPointX))
    const normalizedFixedPointY = Math.max(0, Math.min(1, fixedPointY))
    return {
      elementId: element.id,
      fixedPoint: [normalizedFixedPointX, normalizedFixedPointY],
      focus: 0,
      gap: 0,
    }
  }
  return {
    elementId: element.id,
    focus: calculateBindingFocus(element, connectionPoint),
    gap: 8,
  }
}

// Simplified geometry builder
const buildArrowGeometry = (
  sourcePoint: { x: number; y: number },
  targetPoint: { x: number; y: number },
  arrowType: ArrowType,
  position: RelativePosition
): {
  points: [number, number][]
  arrowGeometry: { x: number; y: number; width: number; height: number }
} => {
  // Compute bounding box
  const minX = Math.min(sourcePoint.x, targetPoint.x)
  const minY = Math.min(sourcePoint.y, targetPoint.y)
  const width = Math.abs(targetPoint.x - sourcePoint.x) || 1
  const height = Math.abs(targetPoint.y - sourcePoint.y) || 1
  const toLocal = (p: { x: number; y: number }): [number, number] => [p.x - minX, p.y - minY]

  if (arrowType === 'sharp') {
    return {
      points: [toLocal(sourcePoint), toLocal(targetPoint)],
      arrowGeometry: { x: minX, y: minY, width, height },
    }
  }

  if (arrowType === 'curved') {
    // Simple cubic-like polyline (Excalidraw poly points)
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y
    const offset = (position === 'left' || position === 'right' ? Math.abs(dy) : Math.abs(dx)) * 0.4
    let c1: { x: number; y: number }
    let c2: { x: number; y: number }
    if (position === 'left' || position === 'right') {
      c1 = { x: sourcePoint.x + dx * 0.3, y: sourcePoint.y + Math.sign(dy || 1) * offset }
      c2 = { x: sourcePoint.x + dx * 0.7, y: targetPoint.y - Math.sign(dy || 1) * offset }
    } else {
      c1 = { x: sourcePoint.x + Math.sign(dx || 1) * offset, y: sourcePoint.y + dy * 0.3 }
      c2 = { x: targetPoint.x - Math.sign(dx || 1) * offset, y: sourcePoint.y + dy * 0.7 }
    }
    return {
      points: [toLocal(sourcePoint), toLocal(c1), toLocal(c2), toLocal(targetPoint)],
      arrowGeometry: { x: minX, y: minY, width, height },
    }
  }

  // Elbow (orthogonal) path
  const mid: { x: number; y: number }[] = []
  if (position === 'left' || position === 'right') {
    const midX = sourcePoint.x + (targetPoint.x - sourcePoint.x) / 2
    mid.push({ x: midX, y: sourcePoint.y }, { x: midX, y: targetPoint.y })
  } else {
    const midY = sourcePoint.y + (targetPoint.y - sourcePoint.y) / 2
    mid.push({ x: sourcePoint.x, y: midY }, { x: targetPoint.x, y: midY })
  }
  return {
    points: [toLocal(sourcePoint), ...mid.map(toLocal), toLocal(targetPoint)] as [number, number][],
    arrowGeometry: { x: minX, y: minY, width, height },
  }
}

// Compute anchors based on side position
function computeAnchorPoints(
  source: ExcalidrawBaseElement,
  target: ExcalidrawBaseElement,
  position: RelativePosition,
  index: number,
  total: number
): { sourcePoint: { x: number; y: number }; targetPoint: { x: number; y: number } } {
  const targetCenterX = target.x + target.width / 2
  const targetCenterY = target.y + target.height / 2

  // Distribution along side
  const distribute = (length: number, start: number, i: number, n: number): number => {
    if (n <= 1) return start + length / 2
    const step = length / (n + 1)
    return start + step * (i + 1)
  }

  let sourcePoint: { x: number; y: number }
  let targetPoint: { x: number; y: number }
  switch (position) {
    case 'left':
      sourcePoint = { x: source.x, y: distribute(source.height, source.y, index, total) }
      targetPoint = { x: target.x + target.width, y: targetCenterY }
      break
    case 'right':
      sourcePoint = {
        x: source.x + source.width,
        y: distribute(source.height, source.y, index, total),
      }
      targetPoint = { x: target.x, y: targetCenterY }
      break
    case 'top':
      sourcePoint = { x: distribute(source.width, source.x, index, total), y: source.y }
      targetPoint = { x: targetCenterX, y: target.y + target.height }
      break
    case 'bottom':
      sourcePoint = {
        x: distribute(source.width, source.x, index, total),
        y: source.y + source.height,
      }
      targetPoint = { x: targetCenterX, y: target.y }
      break
  }
  return { sourcePoint: sourcePoint!, targetPoint: targetPoint! }
}

// Determine position if not provided
function derivePosition(
  explicit: RelativePosition | undefined,
  source: ExcalidrawBaseElement,
  target: ExcalidrawBaseElement
): RelativePosition {
  if (explicit) return explicit
  const dx = target.x + target.width / 2 - (source.x + source.width / 2)
  const dy = target.y + target.height / 2 - (source.y + source.height / 2)
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'bottom' : 'top'
}

// (removed) calculateConnectionPoint – replaced by simpler side-based anchor logic

const calculateBindingFocus = (
  element: ExcalidrawBaseElement,
  connectionPoint: { x: number; y: number }
): number => {
  const centerX = element.x + element.width / 2
  const centerY = element.y + element.height / 2
  const relativeX = (connectionPoint.x - centerX) / (element.width / 2)
  const relativeY = (connectionPoint.y - centerY) / (element.height / 2)
  const absX = Math.abs(relativeX)
  const absY = Math.abs(relativeY)
  let focus: number
  if (absX > absY) {
    focus = relativeY * 0.3
  } else {
    focus = relativeX * 0.3
  }
  focus = Math.round(focus * 10) / 10
  return Math.max(-0.3, Math.min(0.3, focus))
}

const getArrowConfiguration = (arrowType: ArrowType) => {
  switch (arrowType) {
    case 'curved':
      return { roundness: { type: 2, value: 0.5 }, elbowed: false }
    case 'elbow':
      return { roundness: { type: 1 }, elbowed: true }
    case 'sharp':
    default:
      return { roundness: null, elbowed: false }
  }
}

// Fallback (unused with simplified logic) could be reintroduced if needed

export type ArrowCreationExports = {
  createArrowBetweenElements: typeof createArrowBetweenElements
}
