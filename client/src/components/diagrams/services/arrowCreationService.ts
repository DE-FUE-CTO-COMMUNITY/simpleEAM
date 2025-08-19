/**
 * NEUIMPLEMENTIERUNG Pfeil-Erstellung
 * -----------------------------------
 * Diese Datei wurde vollständig neu erstellt entsprechend:
 * - FR-DE-06 (Product Requirements)
 * - EXCALIDRAW-ARROW-FUNCTIONALITY.md (Binding & Geometrie Referenz)
 * - ARROW-CREATION-REQUIREMENTS.md (Architektur & zukünftige Strategien)
 * - arrow_samples.excalidraw (Strukturelle Beispiele für Points & Bindings)
 *
 * WICHTIG: Kein Alt-Code beibehalten; sämtliche Logik frisch implementiert.
 * Fokus: Korrekte Ankerberechnung, Bindings (focus bzw. fixedPoint), Gap-Anwendung,
 * robuste Pfad-Geometrie für sharp | curved | elbow, Reverse-Unterstützung.
 */

import { ArrowType, RelativePosition, ArrowGapSize } from '../types/addRelatedElements'
import { resolveArrowGapPx, applyPhysicalGap } from '../utils/arrowGapUtils'
import { generateElementId } from '../utils/elementIdManager'

// --------------------------------------------------
// Excalidraw relevante minimale Typen
// --------------------------------------------------
export interface ExcalidrawBaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  boundElements?: { id: string; type: 'arrow' | string }[] | null
  [key: string]: any
}

export interface ExcalidrawArrowBinding {
  elementId: string
  focus?: number
  gap?: number
  fixedPoint?: [number, number]
}

export interface ExcalidrawArrowElement extends ExcalidrawBaseElement {
  type: 'arrow'
  points: readonly [number, number][]
  startBinding: ExcalidrawArrowBinding | null
  endBinding: ExcalidrawArrowBinding | null
  startArrowhead: 'arrow' | null
  endArrowhead: 'arrow' | null
  elbowed?: boolean
  fixedSegments?: null
  startIsSpecial?: null
  endIsSpecial?: null
  roundness: { type: number; value?: number } | null
}

// --------------------------------------------------
// Options & Eingabeparameter
// --------------------------------------------------
export interface CreateArrowParams {
  sourceElement: ExcalidrawBaseElement
  targetElement: ExcalidrawBaseElement
  arrowType: ArrowType
  position?: RelativePosition
  reverseArrow?: boolean
  arrowIndex?: number
  totalArrows?: number
  arrowGap?: ArrowGapSize
}

// Interne Struktur für Anchor Points
interface AnchorComputationResult {
  sourceAnchor: Point
  targetAnchor: Point
  side: RelativePosition
  sourceFocus: number // für sharp/curved
  targetFocus: number // Ziel-Fokus kann für spätere Distribution genutzt werden
}

interface Point {
  x: number
  y: number
}

// --------------------------------------------------
// Öffentliche Hauptfunktion
// --------------------------------------------------
export const createArrowBetweenElements = (params: CreateArrowParams): ExcalidrawArrowElement => {
  const {
    sourceElement,
    targetElement,
    arrowType,
    position,
    reverseArrow = false,
    arrowIndex = 0,
    totalArrows = 1,
    arrowGap = 'medium',
  } = params

  const resolvedSide = deriveSide(position, sourceElement, targetElement)
  const anchors = computeAnchors({
    source: sourceElement,
    target: targetElement,
    side: resolvedSide,
    index: arrowIndex,
    total: totalArrows,
  })

  // Reverse: rein logische Invertierung von Start/Ende (inkl. Bindings & Punkte-Reihenfolge)
  const startEl = reverseArrow ? targetElement : sourceElement
  const endEl = reverseArrow ? sourceElement : targetElement
  const startPoint = reverseArrow ? anchors.targetAnchor : anchors.sourceAnchor
  const endPoint = reverseArrow ? anchors.sourceAnchor : anchors.targetAnchor

  const gapPx = resolveArrowGapPx(arrowGap)
  // Strategie: sharp/curved -> physischer Gap durch Geometrie, Binding-Gap=0 (vermeidet doppelte Anwendung & Instabilität)
  // elbow -> nur segmentweiser physischer Gap (wie zuvor), Binding-Gap bleibt 0.
  const physicalGapPx = gapPx
  const bindingGapPx = arrowType === 'elbow' ? 0 : 0 // aktuell immer 0 für Stabilität

  const path = buildPath({
    arrowType,
    start: startPoint,
    end: endPoint,
    side: resolvedSide,
    physicalGapPx,
  })

  const startBinding = buildBinding({
    element: startEl,
    point: startPoint,
    arrowType,
    gapPx: bindingGapPx,
    isStart: true,
  })
  const endBinding = buildBinding({
    element: endEl,
    point: endPoint,
    arrowType,
    gapPx: bindingGapPx,
    isStart: false,
  })

  // Bounding Box aus Punkten generieren
  const { minX, minY, width, height, normalizedPoints } = normalizePoints(path.points)

  return {
    id: generateElementId(),
    type: 'arrow',
    x: minX,
    y: minY,
    width,
    height,
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
    index: 'a1',
    roundness: path.roundness,
    seed: Math.floor(Math.random() * 1_000_000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1_000_000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    points: normalizedPoints,
    lastCommittedPoint: null,
    startBinding,
    endBinding,
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: arrowType === 'elbow',
    ...(arrowType === 'elbow' && {
      fixedSegments: null,
      startIsSpecial: null,
      endIsSpecial: null,
    }),
    customData: {
      ...(typeof (sourceElement as any).customData === 'object' ? (sourceElement as any).customData : {}),
      arrowGapPx: gapPx,
      arrowGapMode: 'physical-only',
    },
  }
}

// --------------------------------------------------
// Seiten-/Richtungsableitung
// --------------------------------------------------
function deriveSide(
  explicit: RelativePosition | undefined,
  source: ExcalidrawBaseElement,
  target: ExcalidrawBaseElement
): RelativePosition {
  if (explicit) return explicit
  const sx = source.x + source.width / 2
  const sy = source.y + source.height / 2
  const tx = target.x + target.width / 2
  const ty = target.y + target.height / 2
  const dx = tx - sx
  const dy = ty - sy
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
  return dy > 0 ? 'bottom' : 'top'
}

// --------------------------------------------------
// Anchor Berechnung (Distribution nur Source-Seite – FR-DE-06: Startpunkt auf definierter Seite)
// --------------------------------------------------
function computeAnchors(args: {
  source: ExcalidrawBaseElement
  target: ExcalidrawBaseElement
  side: RelativePosition
  index: number
  total: number
}): AnchorComputationResult {
  const { source, target, side, index, total } = args
  // Verteilung: gleichmäßige Slots -> i+1 von (total+1)
  const slot = total <= 1 ? 0.5 : (index + 1) / (total + 1)
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
  // Fokus-Bereich erweitern (±0.45) für bessere Entzerrung
  const focus = clamp((slot - 0.5) * 2 * 0.9, -0.9, 0.9) // normalisiert -0.9..0.9

  let sourceAnchor: Point
  let targetAnchor: Point

  switch (side) {
    case 'left': {
      const y = source.y + source.height * slot
      sourceAnchor = { x: source.x, y }
      targetAnchor = { x: target.x + target.width, y: target.y + target.height / 2 }
      break
    }
    case 'right': {
      const y = source.y + source.height * slot
      sourceAnchor = { x: source.x + source.width, y }
      targetAnchor = { x: target.x, y: target.y + target.height / 2 }
      break
    }
    case 'top': {
      const x = source.x + source.width * slot
      sourceAnchor = { x, y: source.y }
      targetAnchor = { x: target.x + target.width / 2, y: target.y + target.height }
      break
    }
    case 'bottom': {
      const x = source.x + source.width * slot
      sourceAnchor = { x, y: source.y + source.height }
      targetAnchor = { x: target.x + target.width / 2, y: target.y }
      break
    }
  }

  return {
    sourceAnchor: sourceAnchor!,
    targetAnchor: targetAnchor!,
    side,
    sourceFocus: focus,
    targetFocus: 0, // (Ziel bleibt mittig laut FR-DE-06)
  }
}

// --------------------------------------------------
// Pfad-Erzeugung (Strategien)
// --------------------------------------------------
interface BuildPathArgs {
  arrowType: ArrowType
  start: Point
  end: Point
  side: RelativePosition
  physicalGapPx: number
}

interface BuiltPath {
  points: Point[]
  roundness: { type: number; value?: number } | null
}

function buildPath(args: BuildPathArgs): BuiltPath {
  const { arrowType } = args
  switch (arrowType) {
    case 'curved':
      return curvedPath(args)
    case 'elbow':
      return elbowPath(args)
    case 'sharp':
    default:
      return sharpPath(args)
  }
}

// Sharp: 2-Punkt Linie + physischer Gap an beiden Enden
function sharpPath({ start, end, physicalGapPx }: BuildPathArgs): BuiltPath {
  let s = start
  let e = end
  if (physicalGapPx > 0) {
    const shortened = applyPhysicalGap(start, end, physicalGapPx, physicalGapPx)
    s = shortened.start
    e = shortened.end
  }
  return { points: [s, e], roundness: null }
}

// Curved: adaptiver Offset auf Basis Distanz + physischer Gap
function curvedPath({ start, end, side, physicalGapPx }: BuildPathArgs): BuiltPath {
  let s = start
  let e = end
  if (physicalGapPx > 0) {
    const shortened = applyPhysicalGap(start, end, physicalGapPx, physicalGapPx)
    s = shortened.start
    e = shortened.end
  }
  const dx = e.x - s.x
  const dy = e.y - s.y
  const distance = Math.hypot(dx, dy)
  // adaptive Krümmung (Clamp 20..160 px)
  const curvature = Math.min(160, Math.max(20, distance * 0.3))
  let c1: Point
  let c2: Point
  if (side === 'left' || side === 'right') {
    // horizontale Hauptrichtung
    const sign = dy === 0 ? 1 : Math.sign(dy)
    c1 = { x: s.x + dx * 0.3, y: s.y + sign * curvature }
    c2 = { x: s.x + dx * 0.7, y: e.y - sign * curvature }
  } else {
    const sign = dx === 0 ? 1 : Math.sign(dx)
    c1 = { x: s.x + sign * curvature, y: s.y + dy * 0.3 }
    c2 = { x: e.x - sign * curvature, y: s.y + dy * 0.7 }
  }
  return { points: [s, c1, c2, e], roundness: { type: 3, value: 0.5 } }
}

// Elbow: Orthogonaler Pfad. Physischer Gap nur äußerste Segmente (Start/End) – Gap = 0 in Bindings.
function elbowPath({ start, end, side, physicalGapPx }: BuildPathArgs): BuiltPath {
  // Grundpunkte vor Verkürzung erzeugen
  const midPoints: Point[] = []
  if (side === 'left' || side === 'right') {
    const midX = start.x + (end.x - start.x) * 0.5
    midPoints.push({ x: midX, y: start.y }, { x: midX, y: end.y })
  } else {
    const midY = start.y + (end.y - start.y) * 0.5
    midPoints.push({ x: start.x, y: midY }, { x: end.x, y: midY })
  }
  // Physische Verkürzung nur entlang erster & letzter Segmentrichtung
  let s = start
  let e = end
  if (physicalGapPx > 0) {
    // Verkürze Start entlang erster Segmentrichtung
    const firstNext = midPoints[0] || end
    const shortenedStart = applyPhysicalGap(start, firstNext, physicalGapPx, 0).start
    s = shortenedStart
    // Verkürze Ende entlang letzter Segmentrichtung
    const lastPrev = midPoints[midPoints.length - 1] || start
    const shortenedEnd = applyPhysicalGap(lastPrev, end, 0, physicalGapPx).end
    e = shortenedEnd
  }
  return { points: [s, ...midPoints, e], roundness: null }
}

// --------------------------------------------------
// Normalisierung (globale -> lokale Punkte & Bounding Box)
// --------------------------------------------------
function normalizePoints(points: Point[]): {
  minX: number
  minY: number
  width: number
  height: number
  normalizedPoints: [number, number][]
} {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  const width = Math.max(1, maxX - minX)
  const height = Math.max(1, maxY - minY)
  const normalizedPoints: [number, number][] = points.map(p => [p.x - minX, p.y - minY])
  // Startpunkt EXCALIDRAW-Konvention: (0,0) – falls erster Punkt nicht (0,0), wird er durch Verschiebung ohnehin 0/0
  return { minX, minY, width, height, normalizedPoints }
}

// --------------------------------------------------
// Binding Erstellung
// --------------------------------------------------
function buildBinding(args: {
  element: ExcalidrawBaseElement
  point: Point
  arrowType: ArrowType
  gapPx: number
  isStart: boolean
}): ExcalidrawArrowBinding {
  const { element, point, arrowType, gapPx } = args
  if (arrowType === 'elbow') {
    // fixedPoint stabile Normalisierung
    const fx = (point.x - element.x) / element.width
    const fy = (point.y - element.y) / element.height
    return {
      elementId: element.id,
      fixedPoint: [clamp01(fx), clamp01(fy)],
      focus: 0,
      gap: 0, // gemäß Samples elbow häufig ohne Binding-Gap
    }
  }
  return {
    elementId: element.id,
    focus: computeFocus(element, point),
    gap: gapPx,
  }
}

function computeFocus(element: ExcalidrawBaseElement, p: Point): number {
  const cx = element.x + element.width / 2
  const cy = element.y + element.height / 2
  const rx = (p.x - cx) / (element.width / 2)
  const ry = (p.y - cy) / (element.height / 2)
  const absX = Math.abs(rx)
  const absY = Math.abs(ry)
  let focus: number
  if (absX > absY) {
    // links/rechts Seite → Variation vertikal
    focus = ry
  } else {
    // oben/unten Seite → Variation horizontal
    focus = rx
  }
  // Clamp etwas breiter als alte Implementation
  return Math.max(-1, Math.min(1, parseFloat(focus.toFixed(3))))
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

// --------------------------------------------------
// Exporte
// --------------------------------------------------
export type ArrowCreationExports = { createArrowBetweenElements: typeof createArrowBetweenElements }
