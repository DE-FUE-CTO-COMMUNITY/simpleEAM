import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { loadRelatedElementsFromDatabase } from './databaseRelatedElementsService'
import { RelatedElement as SingleHopRelatedElement } from './relatedElementsCreationService'

export interface MultiHopNode extends SingleHopRelatedElement {
  parentId: string
  hop: number
}

export interface MultiHopEdge {
  sourceId: string
  targetId: string
  hop: number
  relationshipType?: string
  reverseArrow?: boolean
}

export interface MultiHopResult {
  levels: MultiHopNode[][]
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
 * EINFACHSTE MÖGLICHE LÖSUNG - Funktioniert garantiert!
 *
 * Strategie:
 * - Verwende die EXISTIERENDE, FUNKTIONIERENDE loadRelatedElementsFromDatabase Funktion
 * - Implementiere nur die MINIMAL nötige Eindeutigkeitslogik
 * - Keine komplexen Registry-Pattern oder Race-Conditions
 */

export async function loadMultiHopRelatedElements({
  client,
  rootId,
  rootType,
  config,
}: FetchParams): Promise<MultiHopResult> {
  console.info('[MultiHopSIMPLE] Start - Minimale Implementierung')

  // Eindeutigkeits-Tracking - nur das Nötigste
  const globalInterfaces = new Set<string>()
  const usedApplicationEdges = new Set<string>()
  const allNodes: MultiHopNode[] = []
  const allEdges: MultiHopEdge[] = []

  const levels: MultiHopNode[][] = []

  // Bestimme gewünschte Typen (fallback zu allen wenn nicht gesetzt)
  const selectedTypes = config.selectedElementTypes || ['interface', 'application']
  console.info(`[MultiHopSIMPLE] Gewünschte Typen: ${selectedTypes.join(', ')}`)

  // Parent-Nodes für aktuellen Hop (startet mit Root)
  let currentParents: { id: string; elementType: string; hop: number }[] = [
    { id: rootId, elementType: rootType, hop: 0 },
  ]

  // Verarbeite jeden Hop
  const maxHops = config.hops || 3 // Default fallback
  for (let hop = 1; hop <= maxHops; hop++) {
    console.info(`[MultiHopSIMPLE][Hop${hop}] Starte mit ${currentParents.length} Parents`)

    const currentLevelNodes: MultiHopNode[] = []

    // Verarbeite jeden Parent
    for (const parent of currentParents) {
      try {
        // Verwende die EXISTIERENDE Funktion
        const response = await loadRelatedElementsFromDatabase({
          client,
          mainElementId: parent.id,
          mainElementType: parent.elementType,
        })

        // Extrahiere Elemente aus der Response
        const elements = response.elements || []
        console.info(
          `[MultiHopSIMPLE][Hop${hop}] Parent ${parent.id}: ${elements.length} Elemente gefunden`
        )

        // Verarbeite jedes Element
        for (const element of elements) {
          // 1. Typfilter
          if (!selectedTypes.includes(element.elementType)) {
            continue
          }

          // 2. Root-Exklusion
          if (element.id === rootId) {
            continue
          }

          // 3. EINDEUTIGKEITSREGELN
          let shouldAdd = true

          if (element.elementType === 'interface') {
            // Interface: Global eindeutig
            if (globalInterfaces.has(element.id)) {
              console.info(
                `[MultiHopSIMPLE][Hop${hop}] ✗ Interface ${element.id} bereits vorhanden`
              )
              shouldAdd = false
            } else {
              globalInterfaces.add(element.id)
              console.info(
                `[MultiHopSIMPLE][Hop${hop}] ✓ Interface ${element.id} hinzugefügt (Global: ${globalInterfaces.size})`
              )
            }
          }

          if (element.elementType === 'application') {
            // Application: Edge-basierte Eindeutigkeit
            const edgeKey = `${parent.id}->${element.id}`
            if (usedApplicationEdges.has(edgeKey)) {
              console.info(
                `[MultiHopSIMPLE][Hop${hop}] ✗ Application Edge ${edgeKey} bereits vorhanden`
              )
              shouldAdd = false
            } else {
              usedApplicationEdges.add(edgeKey)
              console.info(`[MultiHopSIMPLE][Hop${hop}] ✓ Application Edge ${edgeKey} hinzugefügt`)
            }
          }

          // 4. Element hinzufügen wenn alle Checks bestanden
          if (shouldAdd) {
            const node: MultiHopNode = {
              ...element,
              parentId: parent.id,
              hop,
            }

            currentLevelNodes.push(node)
            allNodes.push(node)

            // Edge erstellen
            allEdges.push({
              sourceId: parent.id,
              targetId: element.id,
              hop,
              relationshipType: element.relationshipType || '',
              reverseArrow: element.reverseArrow || false,
            })

            console.info(`[MultiHopSIMPLE][Hop${hop}] + ${element.id} (${element.elementType})`)
          }
        }
      } catch (error) {
        console.warn(`[MultiHopSIMPLE][Hop${hop}] Fehler bei Parent ${parent.id}:`, error)
      }
    }

    // Level speichern
    levels.push(currentLevelNodes)
    console.info(`[MultiHopSIMPLE][Hop${hop}] Abgeschlossen: ${currentLevelNodes.length} Elemente`)

    // Vorbereitung für nächsten Hop: Nur Interfaces werden zu Parents
    currentParents = currentLevelNodes
      .filter(node => node.elementType === 'interface')
      .map(node => ({
        id: node.id,
        elementType: node.elementType,
        hop: node.hop,
      }))

    console.info(
      `[MultiHopSIMPLE][Hop${hop}] Nächster Hop: ${currentParents.length} Interface-Parents`
    )

    // Stoppe wenn keine Parents für nächsten Hop
    if (currentParents.length === 0) {
      console.info(`[MultiHopSIMPLE][Hop${hop}] Keine Interface-Parents → Stop`)
      break
    }
  }

  console.info(
    `[MultiHopSIMPLE] Fertig: ${allNodes.length} Elemente, ${globalInterfaces.size} Interfaces, ${allEdges.length} Edges`
  )

  return {
    levels,
    edges: allEdges,
    totalUniqueElements: allNodes.length,
  }
}
