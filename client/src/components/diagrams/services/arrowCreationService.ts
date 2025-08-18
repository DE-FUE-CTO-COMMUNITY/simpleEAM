// arrowCreationService.ts - Erstellung & Geometrie von Pfeilen zwischen Excalidraw Elementen
import { ArrowType, RelativePosition } from '../types/addRelatedElements'
import { calculateDistributedArrowY, calculateDistributedArrowX } from '../utils/mathUtils'
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

  const sourceCenter = {
    x: actualSourceElement.x + actualSourceElement.width / 2,
    y: actualSourceElement.y + actualSourceElement.height / 2,
  }
  const targetCenter = {
    x: actualTargetElement.x + actualTargetElement.width / 2,
    y: actualTargetElement.y + actualTargetElement.height / 2,
  }
  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance === 0) {
    return createFallbackArrow(actualSourceElement, actualTargetElement, arrowId, arrowType)
  }
  const normalizedDx = dx / distance
  const normalizedDy = dy / distance
  let sourceConnectionPoint = calculateConnectionPoint(
    actualSourceElement,
    normalizedDx,
    normalizedDy,
    true
  )
  let targetConnectionPoint = calculateConnectionPoint(
    actualTargetElement,
    -normalizedDx,
    -normalizedDy,
    false
  )

  if (position === 'left') {
    const distributedSourceY = calculateDistributedArrowY(
      actualSourceElement.height,
      actualSourceElement.y,
      totalArrows,
      arrowIndex
    )
    sourceConnectionPoint = { x: actualSourceElement.x, y: distributedSourceY }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width,
      y: actualTargetElement.y + actualTargetElement.height / 2,
    }
  } else if (position === 'right') {
    const distributedSourceY = calculateDistributedArrowY(
      actualSourceElement.height,
      actualSourceElement.y,
      totalArrows,
      arrowIndex
    )
    sourceConnectionPoint = {
      x: actualSourceElement.x + actualSourceElement.width,
      y: distributedSourceY,
    }
    targetConnectionPoint = {
      x: actualTargetElement.x,
      y: actualTargetElement.y + actualTargetElement.height / 2,
    }
  } else if (position === 'top') {
    const distributedSourceX = calculateDistributedArrowX(
      actualSourceElement.width,
      actualSourceElement.x,
      totalArrows,
      arrowIndex
    )
    sourceConnectionPoint = { x: distributedSourceX, y: actualSourceElement.y }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width / 2,
      y: actualTargetElement.y + actualTargetElement.height,
    }
  } else if (position === 'bottom') {
    const distributedSourceX = calculateDistributedArrowX(
      actualSourceElement.width,
      actualSourceElement.x,
      totalArrows,
      arrowIndex
    )
    sourceConnectionPoint = {
      x: distributedSourceX,
      y: actualSourceElement.y + actualSourceElement.height,
    }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width / 2,
      y: actualTargetElement.y,
    }
  }

  const arrowConfig = getArrowConfiguration(arrowType)
  const { points, arrowGeometry } = calculateArrowPointsAndGeometry(
    sourceConnectionPoint,
    targetConnectionPoint,
    arrowType,
    position
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
    startBinding: calculateBindingForArrowType(
      actualSourceElement,
      sourceConnectionPoint,
      arrowType
    ),
    endBinding: calculateBindingForArrowType(actualTargetElement, targetConnectionPoint, arrowType),
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

const calculateArrowPointsAndGeometry = (
  sourcePoint: { x: number; y: number },
  targetPoint: { x: number; y: number },
  arrowType: ArrowType,
  position?: RelativePosition
): {
  points: [number, number][]
  arrowGeometry: { x: number; y: number; width: number; height: number }
} => {
  if (arrowType === 'sharp') {
    const minX = Math.min(sourcePoint.x, targetPoint.x)
    const minY = Math.min(sourcePoint.y, targetPoint.y)
    const width = Math.abs(targetPoint.x - sourcePoint.x)
    const height = Math.abs(targetPoint.y - sourcePoint.y)
    return {
      points: [
        [sourcePoint.x - minX, sourcePoint.y - minY],
        [targetPoint.x - minX, targetPoint.y - minY],
      ],
      arrowGeometry: { x: minX, y: minY, width, height },
    }
  }
  let arrowGeometry: { x: number; y: number; width: number; height: number }
  if (position === 'left' || position === 'right' || position === 'top' || position === 'bottom') {
    arrowGeometry = {
      x: sourcePoint.x,
      y: sourcePoint.y,
      width: targetPoint.x - sourcePoint.x,
      height: targetPoint.y - sourcePoint.y,
    }
  } else {
    const minX = Math.min(sourcePoint.x, targetPoint.x)
    const minY = Math.min(sourcePoint.y, targetPoint.y)
    arrowGeometry = {
      x: minX,
      y: minY,
      width: Math.abs(targetPoint.x - sourcePoint.x),
      height: Math.abs(targetPoint.y - sourcePoint.y),
    }
  }
  const relativeTargetX = targetPoint.x - arrowGeometry.x
  const relativeTargetY = targetPoint.y - arrowGeometry.y
  let points: [number, number][]
  if (arrowType === 'elbow') {
    if (position === 'left' || position === 'right') {
      const midX = relativeTargetX / 2
      points = [
        [0, 0],
        [midX, 0],
        [midX, relativeTargetY],
        [relativeTargetX, relativeTargetY],
      ]
    } else {
      const midY = relativeTargetY / 2
      points = [
        [0, 0],
        [0, midY],
        [relativeTargetX, midY],
        [relativeTargetX, relativeTargetY],
      ]
    }
  } else if (arrowType === 'curved') {
    const deltaX = relativeTargetX
    const deltaY = relativeTargetY
    const controlOffset = Math.min(Math.abs(deltaX), Math.abs(deltaY)) * 0.4
    if (position === 'left' || position === 'right') {
      points = [
        [0, 0],
        [deltaX * 0.3, controlOffset * Math.sign(deltaY)],
        [deltaX * 0.7, deltaY - controlOffset * Math.sign(deltaY)],
        [deltaX, deltaY],
      ]
    } else {
      points = [
        [0, 0],
        [controlOffset * Math.sign(deltaX), deltaY * 0.3],
        [deltaX - controlOffset * Math.sign(deltaX), deltaY * 0.7],
        [deltaX, deltaY],
      ]
    }
  } else {
    points = [
      [0, 0],
      [relativeTargetX, relativeTargetY],
    ]
  }
  return { points, arrowGeometry }
}

const calculateConnectionPoint = (
  element: ExcalidrawBaseElement,
  directionX: number,
  directionY: number,
  _isOutgoing: boolean
): { x: number; y: number } => {
  const centerX = element.x + element.width / 2
  const centerY = element.y + element.height / 2
  const halfWidth = element.width / 2
  const halfHeight = element.height / 2
  const absX = Math.abs(directionX)
  const absY = Math.abs(directionY)
  let connectionX: number
  let connectionY: number
  if (absX > absY) {
    connectionX = centerX + (directionX > 0 ? halfWidth : -halfWidth)
    connectionY = centerY + (directionY * halfWidth) / absX
    connectionY = Math.max(element.y, Math.min(element.y + element.height, connectionY))
  } else {
    connectionY = centerY + (directionY > 0 ? halfHeight : -halfHeight)
    connectionX = centerX + (directionX * halfHeight) / absY
    connectionX = Math.max(element.x, Math.min(element.x + element.width, connectionX))
  }
  return { x: connectionX, y: connectionY }
}

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

const createFallbackArrow = (
  sourceElement: ExcalidrawBaseElement,
  targetElement: ExcalidrawBaseElement,
  arrowId: string,
  arrowType: ArrowType
): ExcalidrawArrowElement => {
  const startX = sourceElement.x + sourceElement.width
  const startY = sourceElement.y + sourceElement.height / 2
  const endX = targetElement.x
  const endY = targetElement.y + targetElement.height / 2
  const { points, arrowGeometry } = calculateArrowPointsAndGeometry(
    { x: startX, y: startY },
    { x: endX, y: endY },
    arrowType,
    'right'
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
    roundness: getArrowConfiguration(arrowType).roundness,
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
    startBinding: calculateBindingForArrowType(sourceElement, { x: startX, y: startY }, arrowType),
    endBinding: calculateBindingForArrowType(targetElement, { x: endX, y: endY }, arrowType),
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: getArrowConfiguration(arrowType).elbowed,
    ...(arrowType === 'elbow' && {
      fixedSegments: null,
      startIsSpecial: null,
      endIsSpecial: null,
    }),
  }
}

export type ArrowCreationExports = {
  createArrowBetweenElements: typeof createArrowBetweenElements
}
