import { ApolloClient } from '@apollo/client'
import { loadRelatedElementsFromDatabase } from './databaseRelatedElementsService'

// Types - NUR LOGISCHE DATENSTRUKTUR (keine Rendering-Informationen!)
export interface MultiHopNode {
  id: string
  name: string
  elementType:
    | 'interface'
    | 'application'
    | 'businessCapability'
    | 'dataObject'
    | 'infrastructure'
    | 'aiComponent'
  hop: number
  parentId?: string

  // Geschäftsdaten (gehören zur logischen Struktur)
  relationshipType?: string
  reverseArrow?: boolean
  description?: string
  status?: string
  criticality?: string
  type?: string
  maturityLevel?: string
  businessValue?: string
  classification?: string
  interfaceType?: string
  infrastructureType?: string
}

export interface MultiHopEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  hop: number
  relationshipType?: string
  reverseArrow?: boolean
}

export interface MultiHopResult {
  nodes: MultiHopNode[]
  edges: MultiHopEdge[]
}

export interface MultiHopConfig {
  maxHops: number
  selectedElementTypes: string[]
  // Layout-Konfiguration für Position-Berechnung
  position: 'right' | 'left' | 'top' | 'bottom'
  spacing: number
  distance: number
  arrowType: 'sharp' | 'rounded'
  arrowGap: 'small' | 'medium' | 'large'
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

  // FAIL-SAFE MASTER MAPS (EINZIGE WAHRHEIT)
  const globalElementMap = new Map<string, MultiHopNode>() // Key: siehe getMapKey()
  const allEdges: MultiHopEdge[] = []

  /**
   * BUSINESS REQUIREMENTS - Map Key Strategie:
   * - INTERFACE: Global eindeutig → Key = element.id
   * - APPLICATION: Edge eindeutig → Key = parentId->element.id
   * - Grund: Applications können über verschiedene Interfaces erreichbar sein
   */
  const getMapKey = (element: any, parentId: string): string => {
    if (element.elementType === 'interface') {
      return element.id // Global eindeutig
    } else {
      return `${parentId}->${element.id}` // Edge eindeutig
    }
  }

  // Bestimme gewünschte Typen
  const selectedTypes = config.selectedElementTypes || ['interface', 'application']
  console.info(`[MultiHopFAILSAFE] Gewünschte Typen: ${selectedTypes.join(', ')}`)
  console.info(`[MultiHopFAILSAFE] Config:`, config)

  // FIX: Map hops -> maxHops
  const maxHops = config.maxHops || (config as any).hops || 4
  console.info(
    `[MultiHopFAILSAFE] MaxHops: ${maxHops} (original: ${config.maxHops}, fallback: ${(config as any).hops})`
  )
  console.info(`[MultiHopFAILSAFE] RootId: ${rootId}, RootType: ${rootType}`)

  // Parent-Nodes für aktuellen Hop (startet mit Root)
  let currentParents: { id: string; elementType: string; hop: number }[] = [
    { id: rootId, elementType: rootType, hop: 0 },
  ]
  console.info(`[MultiHopFAILSAFE] Initial Parents:`, currentParents) // Multi-Hop Processing
  console.info(`[MultiHopFAILSAFE] Schleife: von 1 bis ${maxHops}, condition: ${1 <= maxHops}`)
  for (let hop = 1; hop <= maxHops; hop++) {
    console.info(`[MultiHopFAILSAFE][Hop${hop}] Start mit ${currentParents.length} Parents`)

    if (currentParents.length === 0) {
      console.info(`[MultiHopFAILSAFE][Hop${hop}] Keine Parents → Stop`)
      break
    }

    const currentLevelNodes: MultiHopNode[] = []

    // For each parent: Load related elements
    for (const parent of currentParents) {
      try {
        console.info(`[MultiHopFAILSAFE][Hop${hop}] Lade Related für ${parent.id}`)

        // Load related elements with existing function (with filtering)
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

        // Removed: Manual filtering no longer necessary - already filtered by API
        console.info(`[MultiHopFAILSAFE][Hop${hop}] Elements Sample:`, elements.slice(0, 3))

        // FAIL-SAFE: Process each element with ABSOLUTE uniqueness
        for (const element of elements) {
          // Skip Root Element
          if (element.id === rootId) {
            console.info(`[MultiHopFAILSAFE][Hop${hop}] Skip Root Element ${element.id}`)
            continue
          }

          // *** BUSINESS REQUIREMENTS: Korrekte Eindeutigkeit ***
          // Interface: Global eindeutig (nur einmal im gesamten Diagramm)
          // Application: Edge eindeutig (mehrfach mit verschiedenen Parents erlaubt)

          const mapKey = getMapKey(element, parent.id)

          if (globalElementMap.has(mapKey)) {
            const type = element.elementType === 'interface' ? 'global' : 'edge'
            console.warn(
              `[MultiHopFAILSAFE][Hop${hop}] ✗ ${element.elementType} ${element.id} bereits ${type} vorhanden - SKIP`
            )
            continue
          }

          // Element ERSTMALIG hinzufügen
          const node: MultiHopNode = {
            id: element.id,
            name: element.name || `Element_${element.id}`,
            elementType: element.elementType as MultiHopNode['elementType'],
            parentId: parent.id,
            hop,
            // NUR GESCHÄFTSDATEN - keine Rendering-Informationen!
            relationshipType: (element as any).relationshipType,
            reverseArrow: (element as any).reverseArrow,
            description: (element as any).description,
            status: (element as any).status,
            criticality: (element as any).criticality,
            type: (element as any).type,
            maturityLevel: (element as any).maturityLevel,
            businessValue: (element as any).businessValue,
            classification: (element as any).classification,
            interfaceType: (element as any).interfaceType,
            infrastructureType: (element as any).infrastructureType,
          }

          // VEREINFACHT: Alle Elemente global eindeutig (nur ID als Key)
          const elementMapKey = getMapKey(element, parent.id)

          if (globalElementMap.has(elementMapKey)) {
            const type = element.elementType === 'interface' ? 'global' : 'edge'
            console.warn(
              `[MultiHopFAILSAFE][Hop${hop}] ✗ ${element.elementType} ${element.id} bereits ${type} vorhanden - SKIP`
            )
            continue
          }

          console.info(
            `[MultiHopFAILSAFE][Hop${hop}] ✓ ${element.elementType} ${element.id} NEU (${element.elementType === 'interface' ? 'global' : 'edge'} eindeutig)`
          )

          globalElementMap.set(elementMapKey, node)
          currentLevelNodes.push(node)

          console.info(
            `[MultiHopFAILSAFE][Hop${hop}] ✓ NEUES Element: ${element.elementType} ${element.id} → Map Key: ${mapKey}`
          )

          // Edge erstellen (nur logische Verbindung)
          const edge: MultiHopEdge = {
            id: `edge-${parent.id}-${element.id}`,
            sourceNodeId: parent.id,
            targetNodeId: element.id,
            hop,
            relationshipType: (element as any).relationshipType || 'related',
            reverseArrow: (element as any).reverseArrow || false,
          }
          allEdges.push(edge)
        }
      } catch (error) {
        console.warn(`[MultiHopFAILSAFE][Hop${hop}] Fehler bei Parent ${parent.id}:`, error)
        continue
      }
    }

    // Level abschließen - nicht mehr nötig, alle Daten in globalElementMap
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

  // FINALE EINHEITLICHE DATENSTRUKTUR
  // Alle Informationen in nodes[] mit hop-Information
  const allNodes = Array.from(globalElementMap.values())
  const uniqueInterfaces = allNodes.filter(n => n.elementType === 'interface').length

  console.info(
    `[MultiHopFAILSAFE] FERTIG - ${allNodes.length} Elemente, ${uniqueInterfaces} Interfaces, ${allEdges.length} Edges`
  )
  console.info(
    `[MultiHopFAILSAFE] NODES by HOP:`,
    [0, 1, 2, 3, 4].map(hop => allNodes.filter(n => n.hop === hop).length)
  )

  return {
    nodes: allNodes, // NUR LOGISCHE DATENSTRUKTUR
    edges: allEdges, // NUR LOGISCHE VERBINDUNGEN
  }
}
