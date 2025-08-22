import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { loadRelatedElementsFromDatabase } from './databaseRelatedElementsService'
import { RelatedElement as SingleHopRelatedElement } from './relatedElementsCreationService'

export interface MultiHopNode extends SingleHopRelatedElement {
  parentId: string // ID des Elements aus dem vorherigen Hop (Root für Hop1)
  hop: number // 1-basiert: 1 = erster Hop (Nachbarn des Root)
}

export interface MultiHopEdge {
  sourceId: string
  targetId: string
  hop: number // Hop auf dem das Target liegt
  relationshipType?: string
  reverseArrow?: boolean
}

export interface MultiHopResult {
  levels: MultiHopNode[][] // Vereinfacht: nur noch ein Array pro Hop
  edges: MultiHopEdge[]
  totalUniqueElements: number
}

interface FetchParams {
  client: ApolloClient<NormalizedCacheObject>
  rootId: string
  rootType: string
  config: AddRelatedElementsConfig
}

/**
 * Ermittelt den Hop eines Elements (Parent oder normale Lookup)
 */
function getParentHop(
  elementId: string,
  nodeFirstHop: Map<string, number>,
  currentHop: number
): number {
  const hop = nodeFirstHop.get(elementId)
  return hop !== undefined ? hop : currentHop - 1 // Fallback: Parent ist aus dem vorherigen Hop
}

/**
 * Validiert ob eine Edge erlaubt ist (nur hop → hop+1)
 */
function isValidEdge(parentHop: number, targetHop: number): boolean {
  return targetHop === parentHop + 1
}

/**
 * Multi-Hop Laden mit korrekten Eindeutigkeitsregeln:
 * - Interfaces: Global eindeutig (nur einmal im gesamten Diagramm)
 * - Applications: Edge-basiert eindeutig pro Hop (mehrfach pro Hop erlaubt, aber nur einmal pro Parent)
 */
export const loadMultiHopRelatedElements = async ({
  client,
  rootId,
  rootType,
  config,
}: FetchParams): Promise<MultiHopResult> => {
  const maxHops = Math.max(1, config.hops)
  const selectedTypes = config.selectedElementTypes
  const levels: MultiHopNode[][] = [] // Alle Elemente pro Hop
  const edges: MultiHopEdge[] = []
  const nodeFirstHop = new Map<string, number>() // elementId -> first hop discovered
  const interfacesSeen = new Set<string>() // Interfaces nur einmal im gesamten Diagramm

  console.group('[MultiHop] Start - Vereinfachte Logik')
  console.info('[MultiHop] Root:', { id: rootId, type: rootType, maxHops, selectedTypes })

  // Helper: apply type filter
  const filterBySelectedTypes = (
    elements: SingleHopRelatedElement[]
  ): SingleHopRelatedElement[] => {
    if (!selectedTypes || !Array.isArray(selectedTypes) || selectedTypes.length === 0)
      return elements
    return elements.filter(e => selectedTypes.includes(e.elementType))
  }

  // Generische Expansion für alle Hops (1..maxHops)
  interface ParentHolder {
    id: string
    elementType: string
    parentId: string | null
    hop: number
  }
  let parents: ParentHolder[] = [{ id: rootId, elementType: rootType, parentId: null, hop: 0 }]

  for (let hop = 1; hop <= maxHops; hop++) {
    if (!parents.length) {
      console.info(`[MultiHop][Hop${hop}] Abbruch – keine Parents mehr`)
      break
    }
    const currentLevelNodes: MultiHopNode[] = []
    const currentHopElementIds = new Set<string>() // Edge-basierte Eindeutigkeit pro Hop (Parent->Child)
    console.group(`[MultiHop][Hop${hop}] Expansion`)

    for (const parentNode of parents) {
      // Root-Placeholder soll nicht erneut geladen werden nach erstem Hop
      if (hop > 1 && parentNode.id === rootId && parentNode.parentId === null) continue
      console.info(
        `[MultiHop][Hop${hop}] Expand Parent ${parentNode.id} (${parentNode.elementType})`
      )
      try {
        const related = await loadRelatedElementsFromDatabase({
          client: client as any,
          mainElementId: parentNode.id,
          mainElementType: parentNode.elementType,
        })
        console.info(
          `[MultiHop][Hop${hop}] Raw Response Parent ${parentNode.id}:`,
          related.totalElements
        )
        let neighbors = related.elements as SingleHopRelatedElement[]
        const beforeFilter = neighbors.length
        if (beforeFilter) {
          console.info(
            `[MultiHop][Hop${hop}] Parent ${parentNode.id} Roh IDs: ${neighbors
              .map(n => `${n.id}:${n.elementType}`)
              .join(', ')}`
          )
        }
        // Typfilter
        const afterTypeFilter = filterBySelectedTypes(neighbors)
        const removedByType = neighbors.filter(n => !afterTypeFilter.includes(n))
        neighbors = afterTypeFilter
        if (removedByType.length) {
          console.info(
            `[MultiHop][Hop${hop}] Entfernt durch Typfilter: ${removedByType
              .map(n => `${n.id}:${n.elementType}`)
              .join(', ')}`
          )
        }
        // Parent Exklusion (ab Hop 2)
        const beforeParent = neighbors.length
        if (hop >= 2) {
          const exclusionId = hop === 2 ? rootId : parentNode.parentId
          neighbors = neighbors.filter(n => n.id !== exclusionId)
          const removed = beforeParent - neighbors.length
          if (removed > 0) {
            console.info(
              `[MultiHop][Hop${hop}] Parent-Exklusion (${exclusionId}) entfernte ${removed}`
            )
          }
        }
        console.info(
          `[MultiHop][Hop${hop}] Parent ${parentNode.id} -> roh ${beforeFilter}, final ${neighbors.length}`
        )

        // EINDEUTIGKEITSREGELN SEQUENZIELL ABARBEITEN
        for (const nb of neighbors) {
          const existingHop = nodeFirstHop.get(nb.id)
          const isInterface = nb.elementType === 'interface'

          // EINDEUTIGKEITS-PRÜFUNGEN - alle an einem Ort
          let shouldSkip = false
          let skipReason = ''

          // 1. Edge-Validierung: nur hop → hop+1 erlaubt
          const parentHop = getParentHop(parentNode.id, nodeFirstHop, hop)
          const targetHop = hop
          if (!isValidEdge(parentHop, targetHop)) {
            shouldSkip = true
            skipReason = `Edge blockiert: Parent (Hop ${parentHop}) -> ${nb.id} (Hop ${targetHop})`
          }

          // 2. Interface: Global eindeutig (nur einmal im gesamten Diagramm)
          if (!shouldSkip && isInterface) {
            if (interfacesSeen.has(nb.id)) {
              shouldSkip = true
              skipReason = `Interface ${nb.id} bereits im Diagramm`
            }
          }

          // 3. Application: Edge-basierte Eindeutigkeit pro Hop
          if (!shouldSkip && nb.elementType === 'application') {
            const edgeKey = `${parentNode.id}->${nb.id}`
            if (currentHopElementIds.has(edgeKey)) {
              shouldSkip = true
              skipReason = `Edge ${edgeKey} bereits in diesem Hop`
            }
          }

          // Skip wenn irgendein Check fehlgeschlagen ist
          if (shouldSkip) {
            console.info(`[MultiHop][Hop${hop}] ✗ Überspringe: ${skipReason}`)
            continue
          }

          // MARKIERUNGEN - nur wenn alle Checks OK sind
          if (isInterface) {
            // Interface erst jetzt markieren (nach allen Validierungen)
            interfacesSeen.add(nb.id)
            console.info(
              `[MultiHop][Hop${hop}] 🔒 Interface ${nb.id} in interfacesSeen markiert (Größe: ${interfacesSeen.size})`
            )
            console.info(`[MultiHop][Hop${hop}] ✓ Interface ${nb.id} hinzugefügt`)
          }

          if (nb.elementType === 'application') {
            const edgeKey = `${parentNode.id}->${nb.id}`
            currentHopElementIds.add(edgeKey)
            console.info(
              `[MultiHop][Hop${hop}] ✓ Application ${nb.id} hinzugefügt (Edge: ${edgeKey})`
            )
          }

          // Element hinzufügen (nur wenn alle Validierungen OK sind)
          const node: MultiHopNode = { ...nb, parentId: parentNode.id, hop }
          currentLevelNodes.push(node)

          // Tracking für Hop-Zuordnung
          if (!existingHop) {
            nodeFirstHop.set(nb.id, hop)
          }

          // Edge erstellen (da wir wissen, dass sie gültig ist)
          edges.push({
            sourceId: parentNode.id,
            targetId: nb.id,
            hop,
            relationshipType: nb.relationshipType,
            reverseArrow: nb.reverseArrow,
          })

          console.info(
            `[MultiHop][Hop${hop}] ✓ Edge: Parent (Hop ${parentHop}) -> ${nb.id} (Hop ${hop})`
          )
          console.info(
            `[MultiHop][Hop${hop}] + ${nb.id} (${nb.elementType}) Parent ${parentNode.id}`
          )
        }
      } catch (e) {
        console.warn(`[MultiHop][Hop${hop}] Fehler beim Laden für Parent ${parentNode.id}:`, e)
      }
    }

    console.info(`[MultiHop][Hop${hop}] Elemente in diesem Hop: ${currentLevelNodes.length}`)
    levels.push(currentLevelNodes)
    console.groupEnd()

    // Nächste Parents = alle Elemente dieses Hops (die als neue Parents dienen können)
    // Interfaces können als Parents dienen, aber nur wenn sie in diesem Hop zum ersten Mal vorkommen
    parents = currentLevelNodes
      .filter(n => {
        const firstHop = nodeFirstHop.get(n.id)
        const isFirstOccurrence = !firstHop || firstHop === hop

        // Für Interfaces: nur als Parent verwenden, wenn es das erste Auftreten ist
        if (n.elementType === 'interface') {
          const shouldInclude = isFirstOccurrence
          console.info(
            `[MultiHop][Hop${hop}] Interface ${n.id}: firstHop=${firstHop}, currentHop=${hop}, include as parent=${shouldInclude}`
          )
          return shouldInclude
        }

        // Für andere Elemente: immer als Parent verwenden (Applications, etc.)
        return true
      })
      .map(n => ({
        id: n.id,
        elementType: n.elementType,
        parentId: n.parentId,
        hop: n.hop,
      }))

    const interfaceCount = parents.filter(p => p.elementType === 'interface').length
    console.info(
      `[MultiHop][Hop${hop}] Parents für nächsten Hop: ${parents.length} (${interfaceCount} Interfaces)`
    )
  }

  console.info(
    '[MultiHop] Fertig. Hops:',
    levels.length,
    'Unique Elements:',
    nodeFirstHop.size,
    'Edges:',
    edges.length
  )
  console.info('[MultiHop] Edge Sample (erste 10):', edges.slice(0, 10))
  levels.forEach((lvl, idx) => {
    const ids = lvl.map(n => n.id).join(', ')
    console.info(`[MultiHop] Hop ${idx + 1}: ${lvl.length} Elemente -> ${ids}`)
  })
  console.groupEnd()

  return { levels, edges, totalUniqueElements: nodeFirstHop.size }
}
