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
  levels: MultiHopNode[][] // Index 0 = Hop1 (unique per first discovery)
  edges: MultiHopEdge[]
  totalUniqueElements: number
  // Neu: Für Replikationszwecke pro Hop eine Liste inkl. möglicher Duplikate je Parent
  replicatedLevels: MultiHopNode[][]
}

interface FetchParams {
  client: ApolloClient<NormalizedCacheObject>
  rootId: string
  rootType: string
  config: AddRelatedElementsConfig
}

/**
 * Multi-Hop Laden gemäß Anforderung:
 * Hop1: Nachbarn des Root (gefiltert nach ausgewählten Typen)
 * Hop2: Für jeden Hop1-Knoten dessen Nachbarn (gefiltert), excl. Root
 * Hop3: Für jeden Hop2-Knoten dessen Nachbarn (gefiltert), excl. jeweiliger Parent aus Hop2? (Beschreibung: "ohne ... Elemente aus dem ersten Hop" => Ausschluss des direkten Parents)
 * Generalisiert: Beim Expandieren eines Knotens wird dessen Parent ausgeschlossen, um Rücksprünge zu vermeiden.
 * Keine globale Deduplikation außer: Ein Element wird nur einmal als Node pro erstem Entdeckungs-Hop aufgenommen, aber zusätzliche Kanten werden dennoch erfasst.
 */
export const loadMultiHopRelatedElements = async ({
  client,
  rootId,
  rootType,
  config,
}: FetchParams): Promise<MultiHopResult> => {
  const maxHops = Math.max(1, config.hops)
  const selectedTypes = config.selectedElementTypes
  const levels: MultiHopNode[][] = [] // unique nodes per hop (first discovery only)
  const edges: MultiHopEdge[] = []
  const nodeFirstHop = new Map<string, number>() // elementId -> first hop discovered
  const nodeData = new Map<string, MultiHopNode>()
  const replicatedLevels: MultiHopNode[][] = [] // includes duplicates per parent

  console.group('[MultiHop] Start')
  console.info('[MultiHop] Root:', { id: rootId, type: rootType, maxHops, selectedTypes })
  console.info(
    '[MultiHop] Hinweis Filter-Logik: Hop2 schließt nur Root aus; Hop>=3 schließt immer den direkten Parent aus (Rückkante).'
  )

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
  }
  let parents: ParentHolder[] = [{ id: rootId, elementType: rootType, parentId: null }]

  for (let hop = 1; hop <= maxHops; hop++) {
    if (!parents.length) {
      console.info(`[MultiHop][Hop${hop}] Abbruch – keine Parents mehr`)
      break
    }
    const currentLevelNodes: MultiHopNode[] = []
    const replicatedCurrent: MultiHopNode[] = []
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
        // Prozess Nachbarn
        for (const nb of neighbors) {
          const existingHop = nodeFirstHop.get(nb.id)

          if (!existingHop) {
            const node: MultiHopNode = { ...nb, parentId: parentNode.id, hop }
            nodeFirstHop.set(nb.id, hop)
            nodeData.set(nb.id, node)
            currentLevelNodes.push(node)
            replicatedCurrent.push(node)
            console.info(
              `[MultiHop][Hop${hop}] + Neu ${nb.id} (${nb.elementType}) Parent ${parentNode.id}`
            )
          } else {
            const replicated: MultiHopNode = { ...nb, parentId: parentNode.id, hop }
            replicatedCurrent.push(replicated)
            console.info(
              `[MultiHop][Hop${hop}] + Replik ${nb.id} Parent ${parentNode.id} (erstmals Hop ${existingHop})`
            )
          }
          edges.push({
            sourceId: parentNode.id,
            targetId: nb.id,
            hop,
            relationshipType: nb.relationshipType,
            reverseArrow: nb.reverseArrow,
          })
        }
      } catch (e) {
        console.warn(`[MultiHop][Hop${hop}] Fehler beim Laden für Parent ${parentNode.id}:`, e)
      }
    }
    console.info(
      `[MultiHop][Hop${hop}] Neue eindeutige Nodes: ${currentLevelNodes.length} (gesamt uniq: ${nodeFirstHop.size})`
    )
    levels.push(currentLevelNodes)
    replicatedLevels.push(replicatedCurrent)
    console.groupEnd()
    // Nächste Parents = unique Level Nodes dieses Hops
    parents = currentLevelNodes.map(n => ({
      id: n.id,
      elementType: n.elementType,
      parentId: n.parentId,
    }))
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

  return { levels, edges, totalUniqueElements: nodeFirstHop.size, replicatedLevels }
}
