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
 * NEUE FAIL-SAFE ARCHITEKTUR - Völlig andere Herangehensweise
 *
 * Statt komplizierter Hop-zu-Hop Validierung:
 * 1. Sammle ALLE möglichen Elemente aus ALLEN Hops
 * 2. Wende Eindeutigkeitsregeln auf das GESAMTERGEBNIS an
 * 3. Erstelle finale Hop-Struktur
 */

/**
 * Globale Eindeutigkeits-Registry
 */
class ElementRegistry {
  private interfacesSeen = new Set<string>()
  private applicationEdgesSeen = new Set<string>()
  private allElementsSeen = new Map<string, MultiHopNode>()

  /**
   * Fügt Element zur Registry hinzu, wenn Eindeutigkeitsregeln erfüllt sind
   */
  addElement(element: SingleHopRelatedElement, parentId: string, hop: number): boolean {
    const elementKey = element.id
    const isInterface = element.elementType === 'interface'
    const isApplication = element.elementType === 'application'

    // INTERFACE: Global eindeutig (nur einmal im gesamten Diagramm)
    if (isInterface) {
      if (this.interfacesSeen.has(elementKey)) {
        console.info(`[Registry] ✗ Interface ${elementKey} bereits global registriert`)
        return false
      }
      this.interfacesSeen.add(elementKey)
      console.info(
        `[Registry] ✓ Interface ${elementKey} global registriert (Total: ${this.interfacesSeen.size})`
      )
    }

    // APPLICATION: Edge-basierte Eindeutigkeit
    if (isApplication) {
      const edgeKey = `${parentId}->${elementKey}`
      if (this.applicationEdgesSeen.has(edgeKey)) {
        console.info(`[Registry] ✗ Application Edge ${edgeKey} bereits registriert`)
        return false
      }
      this.applicationEdgesSeen.add(edgeKey)
      console.info(`[Registry] ✓ Application Edge ${edgeKey} registriert`)
    }

    // Element erfolgreich hinzugefügt
    const node: MultiHopNode = { ...element, parentId, hop }
    this.allElementsSeen.set(elementKey, node)
    return true
  }

  /**
   * Gibt alle registrierten Elemente zurück
   */
  getAllElements(): MultiHopNode[] {
    return Array.from(this.allElementsSeen.values())
  }

  /**
   * Gibt Statistiken zurück
   */
  getStats() {
    return {
      totalElements: this.allElementsSeen.size,
      interfaces: this.interfacesSeen.size,
      applicationEdges: this.applicationEdgesSeen.size,
    }
  }
}

/**
 * Sammelt alle möglichen Elemente für einen Hop
 */
async function collectElementsForHop(
  parentNodes: MultiHopNode[],
  hop: number,
  selectedTypes: string[],
  client: ApolloClient<NormalizedCacheObject>,
  registry: ElementRegistry,
  rootId: string
): Promise<MultiHopNode[]> {
  console.info(`[CollectHop${hop}] Verarbeite ${parentNodes.length} Parents`)
  const hopElements: MultiHopNode[] = []

  for (const parentNode of parentNodes) {
    try {
      // Lade alle verwandten Elemente für diesen Parent
      const response = await loadRelatedElementsFromDatabase({
        client,
        mainElementId: parentNode.id,
        mainElementType: parentNode.elementType,
      })

      const rawElements = response.relatedElements || []
      console.info(
        `[CollectHop${hop}] Parent ${parentNode.id} -> ${rawElements.length} raw elements`
      )

      // Filtere nach gewünschten Typen
      const typeFilteredElements = rawElements.filter((element: any) =>
        selectedTypes.includes(element.elementType)
      )

      console.info(`[CollectHop${hop}] Nach Typfilter: ${typeFilteredElements.length} elements`)

      // Entferne Root-Element (Parent-Exklusion)
      const finalElements = typeFilteredElements.filter((element: any) => element.id !== rootId)

      console.info(`[CollectHop${hop}] Nach Root-Exklusion: ${finalElements.length} elements`)

      // Versuche jedes Element zur Registry hinzuzufügen
      for (const element of finalElements) {
        const added = registry.addElement(element, parentNode.id, hop)
        if (added) {
          hopElements.push(registry.getAllElements().find(e => e.id === element.id)!)
        }
      }
    } catch (error) {
      console.warn(`[CollectHop${hop}] Fehler bei Parent ${parentNode.id}:`, error)
    }
  }

  console.info(`[CollectHop${hop}] Fertig: ${hopElements.length} unique elements`)
  return hopElements
}

/**
 * Erstellt Edges zwischen Hops
 */
function createEdges(allElements: MultiHopNode[], rootId: string): MultiHopEdge[] {
  const edges: MultiHopEdge[] = []
  const elementMap = new Map(allElements.map(el => [el.id, el]))

  for (const element of allElements) {
    // Finde Parent-Element
    const parentElement = elementMap.get(element.parentId)
    const parentHop = parentElement ? parentElement.hop : 0 // Root ist Hop 0

    edges.push({
      sourceId: element.parentId,
      targetId: element.id,
      hop: element.hop,
      relationshipType: element.relationshipType,
      reverseArrow: element.reverseArrow,
    })

    console.info(`[Edge] Parent (Hop ${parentHop}) -> ${element.id} (Hop ${element.hop})`)
  }

  return edges
}

/**
 * NEUE HAUPT-FUNKTION - Sammle erst alles, dann organisiere
 */
export async function loadMultiHopRelatedElements({
  client,
  rootId,
  rootType,
  config,
}: FetchParams): Promise<MultiHopResult> {
  console.info('[MultiHopNEW] Start - Fail-Safe Architektur')
  console.info(`[MultiHopNEW] Root: ${rootId} (${rootType}), MaxHops: ${config.maxHops}`)

  const registry = new ElementRegistry()
  const levelResults: MultiHopNode[][] = []

  // Root als erstes "Parent" für Hop 1
  let currentParents: MultiHopNode[] = [
    {
      id: rootId,
      elementType: rootType as any,
      parentId: 'ROOT',
      hop: 0,
    } as MultiHopNode,
  ]

  // Sammle Elemente für jeden Hop
  for (let hop = 1; hop <= config.maxHops; hop++) {
    const hopElements = await collectElementsForHop(
      currentParents,
      hop,
      config,
      client,
      registry,
      rootId
    )

    if (hopElements.length === 0) {
      console.info(`[MultiHopNEW] Hop ${hop}: Keine neuen Elemente - Stop`)
      break
    }

    levelResults.push(hopElements)

    // Nur Interfaces werden als Parents für den nächsten Hop verwendet
    currentParents = hopElements.filter(el => el.elementType === 'interface')
    console.info(
      `[MultiHopNEW] Hop ${hop}: ${hopElements.length} elements, ${currentParents.length} interface parents für nächsten hop`
    )
  }

  // Erstelle finale Struktur
  const allElements = registry.getAllElements().filter(el => el.hop > 0) // Ohne Root
  const edges = createEdges(allElements, rootId)
  const stats = registry.getStats()

  console.info(
    `[MultiHopNEW] Fertig: ${stats.totalElements} elements, ${stats.interfaces} interfaces, ${edges.length} edges`
  )

  return {
    levels: levelResults,
    edges,
    totalUniqueElements: stats.totalElements,
  }
}
