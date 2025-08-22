import { ApolloClient } from '@apollo/client'
import { loadRelatedElementsFromDatabase } from './databaseRelatedElementsService'

// Types
export interface MultiHopNode {
  id: string
  name: string
  elementType: string
  hop: number
  parentId?: string
  x?: number
  y?: number
}

export interface MultiHopEdge {
  sourceId: string
  targetId: string
  hop: number
  relationshipType?: string
  reverseArrow?: boolean
}

export interface MultiHopResult {
  nodes: MultiHopNode[]
  edges: MultiHopEdge[]
  levels: MultiHopNode[][]
  stats: {
    totalHops: number
    totalUniqueElements: number
    uniqueInterfaces: number
  }
}

export interface MultiHopConfig {
  maxHops: number
  selectedElementTypes: string[]
}

interface FetchParams {
  client: ApolloClient<any>
  rootId: string
  rootType: string
  config: MultiHopConfig
}

/**
 * 100% FAIL-SAFE Multi-Hop Service
 * UNMÖGLICH DUPLIKATE ZU ERZEUGEN
 */
export async function loadMultiHopRelatedElements({
  client,
  rootId,
  rootType,
  config,
}: FetchParams): Promise<MultiHopResult> {
  console.info('[MultiHopFAILSAFE] Start - 100% Duplikatsichere Version')

  // ABSOLUTE EINDEUTIGKEIT - UNMÖGLICH DUPLIKATE ZU ERZEUGEN
  const globalElementMap = new Map<string, MultiHopNode>() // ID -> Node (MASTER TRUTH)
  const usedApplicationEdges = new Set<string>() // Edge-Eindeutigkeit
  const allEdges: MultiHopEdge[] = []
  const levels: MultiHopNode[][] = []

  // Bestimme gewünschte Typen
  const selectedTypes = config.selectedElementTypes || ['interface', 'application']
  console.info(`[MultiHopFAILSAFE] Gewünschte Typen: ${selectedTypes.join(', ')}`)
  console.info(`[MultiHopFAILSAFE] Config:`, config)
  
  // FIX: Map hops -> maxHops
  const maxHops = config.maxHops || (config as any).hops || 4
  console.info(`[MultiHopFAILSAFE] MaxHops: ${maxHops} (original: ${config.maxHops}, fallback: ${(config as any).hops})`)
  console.info(`[MultiHopFAILSAFE] RootId: ${rootId}, RootType: ${rootType}`)
  
  // Parent-Nodes für aktuellen Hop (startet mit Root)
  let currentParents: { id: string; elementType: string; hop: number }[] = [
    { id: rootId, elementType: rootType, hop: 0 },
  ]
  console.info(`[MultiHopFAILSAFE] Initial Parents:`, currentParents)  // Multi-Hop Processing
  console.info(`[MultiHopFAILSAFE] Schleife: von 1 bis ${maxHops}, condition: ${1 <= maxHops}`)
  for (let hop = 1; hop <= maxHops; hop++) {
    console.info(`[MultiHopFAILSAFE][Hop${hop}] Start mit ${currentParents.length} Parents`)

    if (currentParents.length === 0) {
      console.info(`[MultiHopFAILSAFE][Hop${hop}] Keine Parents → Stop`)
      break
    }

    const currentLevelNodes: MultiHopNode[] = []

    // Für jeden Parent: Related Elements laden
    for (const parent of currentParents) {
      try {
        console.info(`[MultiHopFAILSAFE][Hop${hop}] Lade Related für ${parent.id}`)

        // Lade Related Elements mit existing function (mit Filterung)
        console.info(`[MultiHopFAILSAFE][Hop${hop}] API Call - Parent:`, parent)
        const relatedData = await loadRelatedElementsFromDatabase({
          client,
          mainElementId: parent.id,
          mainElementType: parent.elementType,
          selectedTypes, // EFFICIENT: Filterung direkt bei API
        })
        console.info(`[MultiHopFAILSAFE][Hop${hop}] API Response:`, relatedData)

        const elements = relatedData?.elements || []
        console.info(
          `[MultiHopFAILSAFE][Hop${hop}] Parent ${parent.id}: ${elements.length} GEFILTERTE Elements (selectedTypes: ${selectedTypes.join(', ')})`
        )
        
        // Entfernt: Manuelle Filterung nicht mehr nötig - bereits von API gefiltert
        console.info(`[MultiHopFAILSAFE][Hop${hop}] Elements Sample:`, elements.slice(0, 3))

        // FAIL-SAFE: Verarbeite jeden Element mit ABSOLUTER Eindeutigkeit
        for (const element of elements) {
          // Skip Root Element
          if (element.id === rootId) {
            console.info(`[MultiHopFAILSAFE][Hop${hop}] Skip Root Element ${element.id}`)
            continue
          }

          // *** ABSOLUTE EINDEUTIGKEIT ***
          // Prüfe Master Map - EINZIGE WAHRHEIT
          if (globalElementMap.has(element.id)) {
            console.warn(
              `[MultiHopFAILSAFE][Hop${hop}] ✗ Element ${element.id} bereits in Master Map - ABSOLUTER SKIP`
            )
            continue // UNMÖGLICH DUPLIKAT ZU ERZEUGEN
          }

          // Application Edge-Eindeutigkeit (zusätzliche Prüfung)
          if (element.elementType === 'application') {
            const edgeKey = `${parent.id}->${element.id}`
            if (usedApplicationEdges.has(edgeKey)) {
              console.warn(
                `[MultiHopFAILSAFE][Hop${hop}] ✗ Application Edge ${edgeKey} bereits vorhanden`
              )
              continue
            }
            usedApplicationEdges.add(edgeKey)
          }

          // Element ERSTMALIG hinzufügen
          const node: MultiHopNode = {
            id: element.id,
            name: element.name || `Element_${element.id}`,
            elementType: element.elementType,
            parentId: parent.id,
            hop,
            x: 0,
            y: 0,
          }

          // MASTER MAP Update - EINZIGE WAHRHEIT
          globalElementMap.set(element.id, node)
          currentLevelNodes.push(node)

          console.info(
            `[MultiHopFAILSAFE][Hop${hop}] ✓ NEUES Element: ${element.elementType} ${element.id} → Master Map`
          )

          // Edge erstellen
          const edge: MultiHopEdge = {
            sourceId: parent.id,
            targetId: element.id,
            hop,
            relationshipType: 'related',
            reverseArrow: false,
          }
          allEdges.push(edge)
        }
      } catch (error) {
        console.warn(`[MultiHopFAILSAFE][Hop${hop}] Fehler bei Parent ${parent.id}:`, error)
        continue
      }
    }

    // Level abschließen
    levels.push(currentLevelNodes)
    console.info(
      `[MultiHopFAILSAFE][Hop${hop}] Abgeschlossen: ${currentLevelNodes.length} NEUE Elemente`
    )

    // Prepare next hop parents (ALLE Elemente können Parents sein)
    currentParents = currentLevelNodes.map(node => ({
      id: node.id,
      elementType: node.elementType,
      hop: node.hop,
    }))

    console.info(`[MultiHopFAILSAFE][Hop${hop}] Nächster Hop: ${currentParents.length} Parents`)

    // Stopp wenn keine neuen Parents
    if (currentParents.length === 0) {
      console.info(`[MultiHopFAILSAFE][Hop${hop}] Keine neuen Parents → Stop`)
      break
    }
  }

  // Finales Ergebnis aus MASTER MAP
  const allNodes = Array.from(globalElementMap.values())
  const uniqueInterfaces = allNodes.filter(n => n.elementType === 'interface').length

  console.info(
    `[MultiHopFAILSAFE] FERTIG - Master Map: ${allNodes.length} Elemente, ${uniqueInterfaces} Interfaces, ${allEdges.length} Edges`
  )

  return {
    nodes: allNodes,
    edges: allEdges,
    levels,
    stats: {
      totalHops: levels.length,
      totalUniqueElements: allNodes.length,
      uniqueInterfaces,
    },
  }
}
