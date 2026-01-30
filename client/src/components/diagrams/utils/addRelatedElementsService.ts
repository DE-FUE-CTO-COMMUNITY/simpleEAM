import { ApolloClient } from '@apollo/client'
import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { loadRelatedElementsFromDatabase } from '../services/databaseRelatedElementsService'
import { loadMultiHopRelatedElements } from '../services/multiHopRelatedElementsService'
import type { MultiHopNode } from '../services/multiHopRelatedElementsService'
import {
  loadArchimateLibrary,
  createCanvasElementsFromTemplate,
  ElementType,
} from './architectureElements'
import { getArchimateTemplateName } from '../services/elementTemplateMapping'
// import { calculateElementPositions } from '../services/positioningService' // (nicht mehr benötigt im Span-Layout)
import {
  createExcalidrawElementsFromRelated,
  CreateRelatedElementsResult as CreationResult,
  RelatedElement as CreationRelatedElement,
} from '../services/relatedElementsCreationService'
import { ExcalidrawBaseElement, createArrowBetweenElements } from '../services/arrowCreationService'

export type CreateRelatedElementsResult = CreationResult

export const loadAndCreateRelatedElements = async (
  apolloClient: ApolloClient<any>,
  selectedElement: ExcalidrawBaseElement,
  excalidrawAPI: { getSceneElements: () => ExcalidrawBaseElement[]; updateScene: (p: any) => void },
  config: AddRelatedElementsConfig
): Promise<CreateRelatedElementsResult> => {
  try {
    const databaseId = selectedElement.customData?.databaseId
    const elementType = selectedElement.customData?.elementType
    if (!databaseId || !elementType) {
      return {
        success: false,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Element hat keine Datenbankverknüpfung',
      }
    }

    let relatedElements: CreationRelatedElement[] = []
    if (!(config.hops && config.hops > 1)) {
      const relatedElementsData = await loadRelatedElementsFromDatabase({
        client: apolloClient as any,
        mainElementId: databaseId,
        mainElementType: elementType,
      })
      if (relatedElementsData.totalElements === 0) {
        return {
          success: true,
          elementsAdded: 0,
          elements: [],
          arrows: [],
          errorMessage: 'Keine verwandten Elemente gefunden',
        }
      }
      relatedElements = relatedElementsData.elements as CreationRelatedElement[]
    }

    const library = await loadArchimateLibrary()
    if (!library || !Array.isArray(library.libraryItems)) {
      return {
        success: false,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Archimate-Bibliothek konnte nicht geladen werden',
      }
    }

    // Single-Hop Pfad
    if (!(config.hops && config.hops > 1)) {
      return await createExcalidrawElementsFromRelated(
        relatedElements,
        selectedElement,
        library.libraryItems,
        config,
        excalidrawAPI
      )
    }

    // Multi-Hop Pfad: Alle Hops platzieren
    const multiHop = await loadMultiHopRelatedElements({
      client: apolloClient as any,
      rootId: databaseId,
      rootType: elementType,
      config: {
        maxHops: config.hops || 4,
        selectedElementTypes: config.selectedElementTypes || ['interface', 'application'],
        position: config.position || 'right',
        spacing: 50,
        distance: config.distance || 100,
        arrowType:
          config.arrowType === 'curved' || config.arrowType === 'elbow' ? 'rounded' : 'sharp',
        arrowGap: (config.arrowGap === 'none' ? 'small' : config.arrowGap) || 'medium',
      },
    })

    // VEREINFACHTE STRUKTUR: Nur nodes (mit hop-Information)
    const allNodes = multiHop.nodes

    // Nodes nach Hops gruppieren (für Layout)
    const nodesByHop = new Map<number, MultiHopNode[]>()
    for (const node of allNodes) {
      const hopNodes = nodesByHop.get(node.hop) || []
      hopNodes.push(node)
      nodesByHop.set(node.hop, hopNodes)
    }

    // Als Array für bestehende Logik
    const maxHop = Math.max(...allNodes.map(n => n.hop))
    const levels: MultiHopNode[][] = []
    for (let hop = 0; hop <= maxHop; hop++) {
      levels.push(nodesByHop.get(hop) || [])
    }

    // Prüfe ob es verwandte Elemente gibt (Hop 1+, nicht Hop 0 das ist Root)
    const hasRelatedElements = allNodes.some(node => node.hop > 0)
    if (!hasRelatedElements) {
      return {
        success: true,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Keine verwandten Elemente gefunden',
      }
    }

    const rootBounds = {
      x: selectedElement.x,
      y: selectedElement.y,
      width: selectedElement.width,
      height: selectedElement.height,
    }

    const baseDistance = config.distance || Math.round(selectedElement.width)
    const allNewElements: ExcalidrawBaseElement[] = []
    const allNewArrows: ExcalidrawBaseElement[] = []
    const renderedElementIds = new Set<string>() // Für UI: Welche element.id bereits gerendert
    const parentBoundsMap = new Map<
      string,
      { x: number; y: number; width: number; height: number }
    >()
    parentBoundsMap.set(databaseId, rootBounds)

    // Map für alle erzeugten Haupt-Instanzen (auch Duplikate) zur Pfeil-Erstellung
    const instanceMap = new Map<string, ExcalidrawBaseElement[]>() // key = databaseId
    const pushInstance = (dbId: string, el: ExcalidrawBaseElement) => {
      if (!instanceMap.has(dbId)) instanceMap.set(dbId, [])
      instanceMap.get(dbId)!.push(el)
    }
    // Root hinzufügen (Annahme: selectedElement ist Main)
    pushInstance(databaseId, selectedElement)

    const createElementAt = (
      el: CreationRelatedElement,
      x: number,
      y: number,
      storeBounds: boolean = true,
      parentDbId?: string
    ) => {
      const templateName = getArchimateTemplateName(el.elementType)
      const template = library.libraryItems.find((t: any) => t.name === templateName)
      if (!template) {
        console.warn('[MultiHop][Placement] Kein Template für', el.elementType)
        return
      }
      // Für Diagnose: Template Bounding Box berechnen
      try {
        const rects = template.elements.filter((e: any) => e.type === 'rectangle')
        if (rects.length) {
          const mainRect = rects[0]
          console.debug(
            '[MultiHop][Placement][TemplateDim]',
            el.id,
            el.elementType,
            'mainRect(w,h)=',
            mainRect.width,
            mainRect.height
          )
        }
      } catch {
        // ignorieren
      }
      let created: ExcalidrawBaseElement[] = []
      switch (el.elementType) {
        case 'businessCapability':
          created = createCanvasElementsFromTemplate({
            template,
            element: el as any,
            elementType: 'businessCapability' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        case 'application':
          created = createCanvasElementsFromTemplate({
            template,
            element: el as any,
            elementType: 'application' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        case 'dataObject':
          created = createCanvasElementsFromTemplate({
            template,
            element: el,
            elementType: 'dataObject' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        case 'interface':
          created = createCanvasElementsFromTemplate({
            template,
            element: el,
            elementType: 'applicationInterface' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        case 'infrastructure':
          created = createCanvasElementsFromTemplate({
            template,
            element: el,
            elementType: 'infrastructure' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        case 'aiComponent':
          created = createCanvasElementsFromTemplate({
            template,
            element: el,
            elementType: 'aiComponent' as ElementType,
            targetX: x,
            targetY: y,
          })
          break
        default:
          console.warn('[MultiHop][Placement] Unbekannter Typ', el.elementType)
      }
      if (created.length) {
        // Parent-Info in Haupt-Element schreiben (nur erstes Rechteck hat customData.databaseId gesetzt)
        const main = created[0]
        if (main?.customData) {
          main.customData.parentDatabaseId = parentDbId || databaseId
        }
        allNewElements.push(...created)
        pushInstance(el.id, main)
        if (storeBounds) {
          // Vereinfacht: Immer bounds speichern wenn storeBounds=true
          parentBoundsMap.set(el.id, {
            x: main.x,
            y: main.y,
            width: (main as any).width || rootBounds.width,
            height: (main as any).height || rootBounds.height,
          })
        }
      }
    }

    // NEUE REKURSIVE SUBTREE-PLATZIERUNG
    console.info('[MultiHop][Layout] Starte rekursive Span-Berechnung')

    // Hilfsfunktion: Größe (erstes Rechteck) je Elementtyp cachen
    const sizeCache = new Map<string, { width: number; height: number }>()
    const getSize = (type: string) => {
      if (sizeCache.has(type)) return sizeCache.get(type)!
      const templateName = getArchimateTemplateName(type)
      const template = library.libraryItems.find((t: any) => t.name === templateName)
      let w = rootBounds.width
      let h = rootBounds.height
      if (template) {
        const rect = template.elements.find((e: any) => e.type === 'rectangle')
        if (rect) {
          w = rect.width || w
          h = rect.height || h
        }
      }
      sizeCache.set(type, { width: w, height: h })
      return { width: w, height: h }
    }

    interface SpanNode {
      node: MultiHopNode
      children: SpanNode[]
      requiredSpan: number // Ausdehnung entlang Hauptachse (vertikal bei left/right, horizontal bei top/bottom)
      elementHeight: number
      elementWidth: number
      isUnique: boolean
    }

    const hopCount = levels.length
    const direction = config.position
    const horizontal = direction === 'top' || direction === 'bottom'
    const spanLevels: SpanNode[][] = []
    // Set der unique IDs je Hop aus levels (ohne Replikate)
    const uniqueIdSets: Set<string>[] = levels.map(lvl => new Set(lvl.map(n => n.id)))

    // Zuerst alle SpanNodes ohne Children erstellen
    for (let h = 0; h < hopCount; h++) {
      const hopNodes = levels[h]
      const spanNodes = hopNodes.map(n => {
        const size = getSize(n.elementType)
        return {
          node: n,
          children: [] as SpanNode[],
          requiredSpan: horizontal ? size.width : size.height, // initial – wird unten überschrieben falls Kinder
          elementHeight: size.height,
          elementWidth: size.width,
          isUnique: uniqueIdSets[h]?.has(n.id) || false,
        }
      })
      spanLevels.push(spanNodes)
    }

    // Children-Verknüpfung (pro Hop h mit Hop h+1)
    for (let h = 0; h < hopCount - 1; h++) {
      const current = spanLevels[h]
      const next = spanLevels[h + 1]
      const childrenByParent = new Map<string, SpanNode[]>()
      next.forEach(sn => {
        if (sn.node.parentId) {
          // parentId ist optional, also prüfen
          const arr = childrenByParent.get(sn.node.parentId) || []
          arr.push(sn)
          childrenByParent.set(sn.node.parentId, arr)
        }
      })
      current.forEach(sn => {
        // Nur unique Instanzen tragen Kinder (entspricht BFS-Expansion)
        if (sn.isUnique) {
          sn.children = childrenByParent.get(sn.node.id) || []
        }
      })
    }

    // Bottom-Up requiredSpan berechnen
    for (let h = hopCount - 1; h >= 0; h--) {
      spanLevels[h].forEach(sn => {
        if (!sn.children.length) {
          sn.requiredSpan = horizontal ? sn.elementWidth : sn.elementHeight
        } else {
          const sumChildren = sn.children.reduce((acc, c) => acc + c.requiredSpan, 0)
          const spacingTotal = (sn.children.length - 1) * config.spacing
          const ownSize = horizontal ? sn.elementWidth : sn.elementHeight
          sn.requiredSpan = Math.max(ownSize, sumChildren + spacingTotal)
        }
        console.debug(
          '[MultiHop][Layout][Span]',
          'Hop',
          sn.node.hop,
          sn.node.id,
          'span(main)=',
          sn.requiredSpan,
          'elemW=',
          sn.elementWidth,
          'elemH=',
          sn.elementHeight,
          'children=',
          sn.children.length
        )
      })
    }

    // Root Span – Summe der ersten verwandten Elemente (Hop 1)
    const hop1SpanNodes = spanLevels[1] || [] // Hop 1 sind die ersten verwandten Elemente
    if (hop1SpanNodes.length === 0) {
      console.info('[MultiHop][Layout] Keine Hop 1 Elemente gefunden')
      return {
        success: true,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Keine Hop 1 Elemente zum Rendern',
      }
    }

    const rootSpan = hop1SpanNodes.reduce((acc, sn, idx) => {
      return acc + sn.requiredSpan + (idx > 0 ? config.spacing : 0)
    }, 0)
    console.info(
      '[MultiHop][Layout] RootSpan(main)=',
      rootSpan,
      'orientation=',
      horizontal ? 'horizontal' : 'vertical'
    )

    // Platzierung: rekursiv
    const rootCenterY = rootBounds.y + rootBounds.height / 2
    const rootCenterX = rootBounds.x + rootBounds.width / 2
    let currentMain = (horizontal ? rootCenterX : rootCenterY) - rootSpan / 2

    const placeSpanNode = (
      sn: SpanNode,
      hopIndex: number,
      parentBounds?: { x: number; y: number; width: number; height: number }
    ) => {
      let x: number
      let y: number
      if (horizontal) {
        // Hauptachse = X (top/bottom)
        const subtreeStart = subtreeStarts.get(sn)!
        const centerX = subtreeStart + sn.requiredSpan / 2
        x = centerX - sn.elementWidth / 2
        if (hopIndex === 1) {
          // Erste verwandte Elemente (Hop 1)
          y =
            direction === 'bottom'
              ? rootBounds.y + rootBounds.height + baseDistance
              : rootBounds.y - sn.elementHeight - baseDistance
        } else if (parentBounds) {
          y =
            direction === 'bottom'
              ? parentBounds.y + parentBounds.height + baseDistance
              : parentBounds.y - sn.elementHeight - baseDistance
        } else {
          y = rootBounds.y
        }
      } else {
        // Hauptachse = Y (left/right)
        if (hopIndex === 1) {
          // Erste verwandte Elemente (Hop 1)
          x =
            direction === 'right'
              ? rootBounds.x + rootBounds.width + baseDistance
              : rootBounds.x - sn.elementWidth - baseDistance
        } else if (parentBounds) {
          x =
            direction === 'right'
              ? parentBounds.x + parentBounds.width + baseDistance
              : parentBounds.x - sn.elementWidth - baseDistance
        } else {
          x = rootBounds.x
        }
        const subtreeStart = subtreeStarts.get(sn)!
        const centerY = subtreeStart + sn.requiredSpan / 2
        y = centerY - sn.elementHeight / 2
      }
      const el: CreationRelatedElement = {
        id: sn.node.id,
        name: sn.node.name,
        description: (sn.node as any).description,
        elementType: sn.node.elementType,
        relationshipType: sn.node.relationshipType,
        reverseArrow: sn.node.reverseArrow,
        status: (sn.node as any).status,
        criticality: (sn.node as any).criticality,
        type: (sn.node as any).type,
        maturityLevel: (sn.node as any).maturityLevel,
        businessValue: (sn.node as any).businessValue,
        classification: (sn.node as any).classification,
        interfaceType: (sn.node as any).interfaceType,
        infrastructureType: (sn.node as any).infrastructureType,
      }

      // BUSINESS RULE: Interfaces nur einmal rendern, Applications mehrfach erlaubt
      const shouldSkipRendering = el.elementType === 'interface' && renderedElementIds.has(el.id)

      if (shouldSkipRendering) {
        console.debug(
          '[MultiHop][Layout][SKIP]',
          'Hop',
          hopIndex,
          el.id,
          'Interface bereits gerendert - SKIP'
        )
        return // Interface bereits gerendert, nicht nochmal
      }

      const parentDbId = sn.node.parentId
      createElementAt(el, x, y, true, parentDbId) // Immer storeBounds=true

      // Element als gerendert markieren
      if (el.elementType === 'interface') {
        renderedElementIds.add(el.id)
      }

      console.debug(
        '[MultiHop][Layout][Place]',
        'Hop',
        hopIndex,
        el.elementType,
        el.id,
        'at',
        x,
        y,
        'span',
        sn.requiredSpan
      )

      // Children platzieren (nur wenn vorhanden)
      if (sn.children.length) {
        let childCurrentStart = subtreeStarts.get(sn)!
        const pb = parentBoundsMap.get(el.id)
        sn.children.forEach((child, idx) => {
          subtreeStarts.set(child, childCurrentStart)
          placeSpanNode(child, hopIndex + 1, pb) // Nächster Hop
          childCurrentStart +=
            child.requiredSpan + (idx < sn.children.length - 1 ? config.spacing : 0)
        })
      }
    }

    // subtreeTops Map: Beginn (Top-Y) jedes Subtrees
    const subtreeStarts = new Map<SpanNode, number>()
    hop1SpanNodes.forEach((sn, idx) => {
      subtreeStarts.set(sn, currentMain)
      currentMain += sn.requiredSpan + (idx < hop1SpanNodes.length - 1 ? config.spacing : 0)
    })

    // Filter Hop1 anhand selectedElementTypes (wie zuvor), aber wir müssen deren Spans beibehalten – also nur nicht-gewählte überspringen
    console.info('[MultiHop][Layout] Start Rendering - Total Nodes:', allNodes.length)
    console.info(
      '[MultiHop][Layout] Nodes by Hop:',
      [0, 1, 2, 3, 4].map(hop => ({
        hop,
        count: allNodes.filter(n => n.hop === hop).length,
        types: allNodes
          .filter(n => n.hop === hop)
          .map(n => n.elementType)
          .reduce(
            (acc, type) => {
              acc[type] = (acc[type] || 0) + 1
              return acc
            },
            {} as Record<string, number>
          ),
      }))
    )

    hop1SpanNodes.forEach(sn => {
      if (
        config.selectedElementTypes &&
        Array.isArray(config.selectedElementTypes) &&
        !config.selectedElementTypes.includes(sn.node.elementType)
      )
        return
      placeSpanNode(sn, 1) // Hop 1 (erste verwandte Elemente), nicht 0
    })
    console.info('[MultiHop][Placement] Hop 1 + rekursive Kinder fertig (Span-Layout)')

    // ---- Pfeil-Erstellung gemäß FR-DE-06 ----
    const arrowType = config.arrowType || 'sharp'
    const arrowGap = config.arrowGap || 'medium'
    const position = config.position
    // Helper um passende Instanz (Kind unter Parent) zu finden
    const pickInstanceForEdge = (
      dbId: string,
      parentId: string | null
    ): ExcalidrawBaseElement | undefined => {
      const list = instanceMap.get(dbId)
      if (!list || !list.length) return undefined
      if (!parentId) {
        // Fallback: erste Instanz
        return list[0]
      }
      // Exakte Parent-Zuordnung
      const exact = list.find(l => l.customData?.parentDatabaseId === parentId)
      if (exact) return exact
      // Versuche heuristisch: wenn nur eine Instanz existiert
      if (list.length === 1) return list[0]
      // Debug Ausgabe um Fehlzuordnung zu erkennen
      console.debug(
        '[MultiHop][Arrows] Keine exakte Instanz für',
        dbId,
        'parent',
        parentId,
        'Instanzen:',
        list.map(l => l.customData?.parentDatabaseId)
      )
      return list[0]
    }
    // Edge-Gruppierung nach sourceNodeId für seitliche Verteilung
    const edgesBySource = new Map<string, typeof multiHop.edges>()
    multiHop.edges.forEach(e => {
      if (!edgesBySource.has(e.sourceNodeId)) edgesBySource.set(e.sourceNodeId, [] as any)
      ;(edgesBySource.get(e.sourceNodeId) as any).push(e)
    })

    edgesBySource.forEach(edgeList => {
      const total = edgeList.length
      edgeList.forEach((edge, idx) => {
        const sourceEl = pickInstanceForEdge(edge.sourceNodeId, null)
        const targetEl = pickInstanceForEdge(edge.targetNodeId, edge.sourceNodeId)
        if (!sourceEl || !targetEl) return
        try {
          const arrow = createArrowBetweenElements({
            sourceElement: sourceEl,
            targetElement: targetEl,
            arrowType: arrowType as any,
            position: position as any,
            reverseArrow: edge.reverseArrow || false,
            totalArrows: total,
            arrowIndex: idx,
            arrowGap: arrowGap as any,
          })
          // Boundings an Source & Target anhängen
          const attach = (el: ExcalidrawBaseElement) => {
            if (!el.boundElements) el.boundElements = []
            if (!el.boundElements.some(b => b.id === arrow.id)) {
              el.boundElements.push({ id: arrow.id, type: 'arrow' })
            }
          }
          attach(sourceEl)
          attach(targetEl)
          allNewArrows.push(arrow)
        } catch (e) {
          console.warn('[MultiHop][Arrows] Fehler bei Edge', edge, e)
        }
      })
    })

    if (allNewElements.length || allNewArrows.length) {
      const current = excalidrawAPI.getSceneElements().map(el => {
        // Falls Root aktualisierte boundElements bekommen hat (bei Pfeilen aus Root)
        if (el.id === selectedElement.id) {
          return { ...el, boundElements: selectedElement.boundElements }
        }
        return el
      })

      // Defensive Element-Validierung vor updateScene
      const validElements = [...current, ...allNewElements, ...allNewArrows].filter(el => {
        if (!el || typeof el !== 'object') {
          console.warn('Invalid element (not object):', el)
          return false
        }
        if (!el.id || !el.type) {
          console.warn('Invalid element (missing id or type):', el)
          return false
        }
        if (typeof el.x !== 'number' || typeof el.y !== 'number') {
          console.warn('Invalid element (invalid coordinates):', el)
          return false
        }
        return true
      })

      console.log(`[AddRelatedElements] Updating scene with ${validElements.length} elements`)
      excalidrawAPI.updateScene({ elements: validElements })
    }

    return {
      success: true,
      elementsAdded: allNewElements.length,
      elements: allNewElements,
      arrows: allNewArrows as any,
    }
  } catch (error) {
    console.error('Error loading and creating related elements:', error)
    return {
      success: false,
      elementsAdded: 0,
      elements: [],
      arrows: [],
      errorMessage: `Fehler beim Laden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
    }
  }
}
