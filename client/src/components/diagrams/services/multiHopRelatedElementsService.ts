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
  const levels: MultiHopNode[][] = []
  const edges: MultiHopEdge[] = []
  const nodeFirstHop = new Map<string, number>()
  const nodeData = new Map<string, MultiHopNode>()
  const replicatedLevels: MultiHopNode[][] = []

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

  // Hop 1
  console.info('[MultiHop][Hop1] Lade Nachbarn für Root...')
  const hop1Related = await loadRelatedElementsFromDatabase({
    client: client as any,
    mainElementId: rootId,
    mainElementType: rootType,
  })
  const hop1 = filterBySelectedTypes(hop1Related.elements as SingleHopRelatedElement[])
  console.info('[MultiHop][Hop1] Roh:', hop1Related.elements.length, 'Gefiltert:', hop1.length)
  if (hop1Related.elements.length > 0) {
    console.info(
      '[MultiHop][Hop1] Roh IDs:',
      hop1Related.elements.map((e: any) => `${e.id}:${e.elementType}`).join(', ')
    )
  }
  if (hop1.length > 0) {
    console.info(
      '[MultiHop][Hop1] Gefiltert IDs:',
      hop1.map(e => `${e.id}:${e.elementType}`).join(', ')
    )
  }

  const hop1Nodes: MultiHopNode[] = hop1.map(el => ({ ...el, parentId: rootId, hop: 1 }))
  hop1Nodes.forEach(n => {
    if (!nodeFirstHop.has(n.id)) {
      nodeFirstHop.set(n.id, 1)
      nodeData.set(n.id, n)
    }
    edges.push({
      sourceId: rootId,
      targetId: n.id,
      hop: 1,
      relationshipType: n.relationshipType,
      reverseArrow: n.reverseArrow,
    })
  })
  levels.push(hop1Nodes)
  replicatedLevels.push([...hop1Nodes])

  // Weitere Hops
  for (let hop = 2; hop <= maxHops; hop++) {
    const prevLevel = levels[hop - 2] // vorheriger Hop-Level
    if (!prevLevel || prevLevel.length === 0) {
      console.info(`[MultiHop][Hop${hop}] Abbruch – vorheriger Hop leer`)
      break
    }
    const currentLevelNodes: MultiHopNode[] = []
    const replicatedCurrent: MultiHopNode[] = []
    console.group(`[MultiHop][Hop${hop}] Expansion`)
    for (const parentNode of prevLevel) {
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
        if (related.totalElements > 0) {
          console.info(
            `[MultiHop][Hop${hop}] Raw Elements Parent ${parentNode.id}: ${related.elements
              .map(r => r.id + ':' + r.elementType)
              .join(', ')}`
          )
        }
        let neighbors = related.elements as SingleHopRelatedElement[]
        const beforeFilter = neighbors.length
        if (beforeFilter > 0) {
          console.info(
            `[MultiHop][Hop${hop}] Parent ${parentNode.id} Roh IDs: ${neighbors
              .map(n => `${n.id}:${n.elementType}`)
              .join(', ')}`
          )
        } else {
          console.info(`[MultiHop][Hop${hop}] Parent ${parentNode.id} keine Nachbarn roh`)
        }
        const afterTypeFilter = filterBySelectedTypes(neighbors)
        const removedByType = Array.isArray(afterTypeFilter)
          ? neighbors.filter(n => !afterTypeFilter.includes(n))
          : []
        neighbors = afterTypeFilter
        const afterTypeIds = neighbors.map(n => `${n.id}:${n.elementType}`)
        if (removedByType.length) {
          console.info(
            `[MultiHop][Hop${hop}] Parent ${parentNode.id} entfernt durch Typfilter: ${removedByType
              .map(n => `${n.id}:${n.elementType}`)
              .join(', ')}`
          )
        }
        const beforeParentExclusion = neighbors.length
        const parentExclusionId = hop === 2 ? rootId : parentNode.parentId
        // Für Hop2 Root ausschließen, sonst direkten Parent (gleich parentNode.parentId, Root bei Hop2 identisch)
        neighbors = neighbors.filter(n => n.id !== parentExclusionId)
        const removedByParent = beforeParentExclusion - neighbors.length
        if (removedByParent > 0) {
          console.info(
            `[MultiHop][Hop${hop}] Parent ${parentNode.id} entfernt durch Parent/Rückkante (${parentExclusionId}) Anzahl: ${removedByParent}`
          )
        }
        console.info(
          `[MultiHop][Hop${hop}] Parent ${parentNode.id} (${parentNode.elementType}) -> roh ${beforeFilter}, Typ-gefiltert ${afterTypeIds.length}, nach Parent-Exklusion ${neighbors.length}`
        )

        for (const nb of neighbors) {
          const existingHop = nodeFirstHop.get(nb.id)
          if (!existingHop) {
            const node: MultiHopNode = { ...nb, parentId: parentNode.id, hop }
            nodeFirstHop.set(nb.id, hop)
            nodeData.set(nb.id, node)
            currentLevelNodes.push(node)
            replicatedCurrent.push(node)
            console.info(
              `[MultiHop][Hop${hop}] + Node ${nb.id} (${nb.elementType}) neu (Parent ${parentNode.id})`
            )
          } else {
            // Erzeuge eine replizierte Instanz für diesen Parent
            const replicated: MultiHopNode = { ...nb, parentId: parentNode.id, hop }
            replicatedCurrent.push(replicated)
            console.info(
              `[MultiHop][Hop${hop}] + Replik Node ${nb.id} für Parent ${parentNode.id} (erstmals auf Hop ${existingHop})`
            )
          }
          edges.push({
            sourceId: parentNode.id,
            targetId: nb.id,
            hop: hop,
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
