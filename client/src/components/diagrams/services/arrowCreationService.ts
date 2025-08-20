/**
 * Pfeil-Erstellung Service mit manuellen Excalidraw Bindings
 * ==========================================================
 *
 * Diese Implementierung erstellt Pfeile mit manuell berechneten Bindings:
 * - Korrekte Gap-Berechnung für Pfeil-Positionierung
 * - Manuelle start/end Bindings mit Element-IDs und Focus-Berechnung
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

/**
 * Bestimmt die beste Seite für die Pfeilverbindung
 */
function determineBestSide(
  from: ExcalidrawBaseElement,
  to: ExcalidrawBaseElement
): { fromSide: string; toSide: string } {
  const fromCenter = {
    x: from.x + from.width / 2,
    y: from.y + from.height / 2,
  }
  const toCenter = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2,
  }

  const dx = toCenter.x - fromCenter.x
  const dy = toCenter.y - fromCenter.y

  // Bestimme dominante Richtung
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant
    return {
      fromSide: dx > 0 ? 'right' : 'left',
      toSide: dx > 0 ? 'left' : 'right',
    }
  } else {
    // Vertikal dominant
    return {
      fromSide: dy > 0 ? 'bottom' : 'top',
      toSide: dy > 0 ? 'top' : 'bottom',
    }
  }
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

  // Berechne Zielkoordinaten relativ zum Startpunkt
  const deltaX = endX - startX
  const deltaY = endY - startY

  let points: [number, number][]

  switch (arrowType) {
    case 'sharp':
      points = [
        [0, 0],
        [deltaX, deltaY],
      ]
      break

    case 'curved':
      points = [
        [0, 0],
        [deltaX, deltaY],
      ]
      break

    case 'elbow': {
      // Rechtwinkliger Pfeil mit Zwischenpunkt
      const midX = deltaX / 2
      points = [
        [0, 0],
        [midX, 0],
        [midX, deltaY],
        [deltaX, deltaY],
      ]
      break
    }

    default:
      points = [
        [0, 0],
        [deltaX, deltaY],
      ]
  }

  // Berechne width und height MIT Vorzeichen (negativ = links/oben, positiv = rechts/unten)
  const width = deltaX
  const height = deltaY

  const result = {
    points,
    bounds: {
      x: startX, // Position ist der tatsächliche Startpunkt
      y: startY,
      width,
      height,
    },
  }

  if (arrowType === 'curved') {
    return { ...result, roundness: { type: 2 } }
  }

  if (arrowType === 'elbow') {
    return { ...result, elbowed: true }
  }

  return result
}

/**
 * Berechnet Focus für Binding-Punkt basierend auf Element-Position
 */
/**
 * Berechnet die Gap-Distanz basierend auf Excalidraw's distanceToBindableElement
 * Vereinfachte Version für rechteckige Elemente
 */
function calculateGap(point: [number, number], element: ExcalidrawBaseElement): number {
  const [px, py] = point
  const { x, y, width, height, angle = 0 } = element

  // Element-Zentrum
  const centerX = x + width / 2
  const centerY = y + height / 2

  // Rotiere Punkt um das Element-Zentrum (umgekehrt zur Element-Rotation)
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)

  const rotatedPX = cos * (px - centerX) - sin * (py - centerY) + centerX
  const rotatedPY = sin * (px - centerX) + cos * (py - centerY) + centerY

  // Berechne Distanz zu den Kanten des rotierten Rechtecks
  const left = x
  const right = x + width
  const top = y
  const bottom = y + height

  // Distanz zu jeder Seite
  const distLeft = Math.abs(rotatedPX - left)
  const distRight = Math.abs(rotatedPX - right)
  const distTop = Math.abs(rotatedPY - top)
  const distBottom = Math.abs(rotatedPY - bottom)

  let minDistance = Infinity

  // Wenn der Punkt innerhalb der X-Grenzen liegt, prüfe Y-Distanz
  if (rotatedPX >= left && rotatedPX <= right) {
    minDistance = Math.min(minDistance, distTop, distBottom)
  }

  // Wenn der Punkt innerhalb der Y-Grenzen liegt, prüfe X-Distanz
  if (rotatedPY >= top && rotatedPY <= bottom) {
    minDistance = Math.min(minDistance, distLeft, distRight)
  }

  // Wenn der Punkt außerhalb ist, berechne Eck-Distanzen
  if (minDistance === Infinity) {
    const corners = [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom },
    ]

    minDistance = Math.min(
      ...corners.map(corner => Math.sqrt((rotatedPX - corner.x) ** 2 + (rotatedPY - corner.y) ** 2))
    )
  }

  return Math.max(1, minDistance)
}

/**
 * Berechnet den Focus basierend auf Excalidraw's determineFocusDistance Algorithmus
 * Dieser bestimmt die signierte Distanz entlang des Element-Randes
 */
function calculateFocus(
  edgePoint: [number, number],
  element: ExcalidrawBaseElement,
  adjacentPoint: [number, number]
): number {
  const [ex, ey] = edgePoint
  const [ax, ay] = adjacentPoint
  const { x, y, width, height, angle = 0 } = element

  // Element-Zentrum
  const centerX = x + width / 2
  const centerY = y + height / 2

  // Wenn beide Punkte gleich sind, ist Focus 0
  if (ex === ax && ey === ay) {
    return 0
  }

  // Rotiere Punkte um das Element-Zentrum (umgekehrt zur Element-Rotation)
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)

  const rotatedAX = cos * (ax - centerX) - sin * (ay - centerY) + centerX
  const rotatedAY = sin * (ax - centerX) + cos * (ay - centerY) + centerY

  const rotatedEX = cos * (ex - centerX) - sin * (ey - centerY) + centerX
  const rotatedEY = sin * (ex - centerX) + cos * (ey - centerY) + centerY

  // Richtungsvektor von adjacentPoint zu edgePoint
  const dirX = rotatedEX - rotatedAX
  const dirY = rotatedEY - rotatedAY
  const dirLength = Math.sqrt(dirX * dirX + dirY * dirY)

  if (dirLength === 0) {
    return 0
  }

  // Normalisierter Richtungsvektor
  const normDirX = dirX / dirLength
  const normDirY = dirY / dirLength

  // Erweiterte Linie von rotatedA durch rotatedE
  const lineLength = Math.max(width * 2, height * 2)
  const lineEndX = rotatedAX + normDirX * lineLength
  const lineEndY = rotatedAY + normDirY * lineLength

  // Berechne Schnittpunkte mit Element-Diagonalen
  const diagonal1 = intersectLineWithLine(
    rotatedAX,
    rotatedAY,
    lineEndX,
    lineEndY,
    x - width,
    y - height,
    x + width * 2,
    y + height * 2
  )

  const diagonal2 = intersectLineWithLine(
    rotatedAX,
    rotatedAY,
    lineEndX,
    lineEndY,
    x + width * 2,
    y - height,
    x - width,
    y + height * 2
  )

  const intersections = [diagonal1, diagonal2].filter(p => p !== null)

  if (intersections.length === 0) {
    return 0
  }

  // Sortiere nach Distanz zu adjacentPoint
  intersections.sort((a, b) => {
    const distA = Math.sqrt((a.x - rotatedAX) ** 2 + (a.y - rotatedAY) ** 2)
    const distB = Math.sqrt((b.x - rotatedAX) ** 2 + (b.y - rotatedAY) ** 2)
    return distA - distB
  })

  const intersection = intersections[0]

  // Vorzeichen bestimmen (Cross-Product)
  const vecToCenter = { x: centerX - rotatedAX, y: centerY - rotatedAY }
  const vecToEdge = { x: rotatedEX - rotatedAX, y: rotatedEY - rotatedAX }
  const sign = Math.sign(vecToEdge.x * vecToCenter.y - vecToEdge.y * vecToCenter.x) * -1

  // Distanz vom Zentrum zum Schnittpunkt
  const distance = Math.sqrt((intersection.x - centerX) ** 2 + (intersection.y - centerY) ** 2)

  // Normalisierung basierend auf Element-Diagonale
  const normalizer = Math.sqrt(width ** 2 + height ** 2) / 2

  return (sign * distance) / normalizer
}

/**
 * Hilfsfunktion für Linien-Schnittpunkt-Berechnung
 */
function intersectLineWithLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): { x: number; y: number } | null {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

  if (Math.abs(denom) < 1e-10) {
    return null // Parallele Linien
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
  }
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

  // Bei reverseArrow: Vertausche Source und Target
  const actualSource = reverseArrow ? targetElement : sourceElement
  const actualTarget = reverseArrow ? sourceElement : targetElement

  // Bestimme beste Verbindungsseiten
  const { fromSide, toSide } = determineBestSide(actualSource, actualTarget)

  // Berechne Gap-Wert
  const gapValue = getGapValue(arrowGap)

  // Berechne Offset für mehrere Pfeile
  const offsetStep = totalArrows > 1 ? 20 : 0
  const offset = totalArrows > 1 ? (arrowIndex - (totalArrows - 1) / 2) * offsetStep : 0

  // Berechne Anchor-Punkte:
  // - Bei normalem Pfeil: Start mit Offset, End in der Mitte
  // - Bei reverse Pfeil: Start in der Mitte, End mit Offset
  let startPoint: [number, number]
  let endPoint: [number, number]

  if (reverseArrow) {
    // Reverse: Ziel-Element (actualSource) bekommt Offset, Start-Element (actualTarget) in der Mitte
    startPoint = calculateTargetAnchorPoint(actualSource, fromSide, gapValue)
    endPoint = calculateAnchorPoint(actualTarget, toSide, offset, gapValue)
  } else {
    // Normal: Start-Element bekommt Offset, Ziel-Element in der Mitte
    startPoint = calculateAnchorPoint(actualSource, fromSide, offset, gapValue)
    endPoint = calculateTargetAnchorPoint(actualTarget, toSide, gapValue)
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
      elementId: actualSource.id,
      focus: startFocus,
      gap: startGap,
    },
    endBinding: {
      elementId: actualTarget.id,
      focus: endFocus,
      gap: endGap,
    },
    startArrowhead: null,
    endArrowhead: 'arrow',
    ...(geometry.roundness && { roundness: geometry.roundness }),
    ...(geometry.elbowed && { elbowed: geometry.elbowed }),
  }

  return arrowElement
}
