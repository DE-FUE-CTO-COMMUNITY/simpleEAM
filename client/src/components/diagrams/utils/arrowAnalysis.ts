/**
 * Haupt-Utility für die Analyse von Excalidraw-Pfeilen und deren Beziehungen
 */

import {
  ExcalidrawElement,
  ArrowAnalysisResult,
  ArrowIssue,
  NewRelationship,
  ArrowAnalysisCompleteResult,
} from '../types/relationshipTypes'
import {
  getValidRelationships,
  normalizeElementType,
  ElementType,
  RelationshipDefinition,
} from './relationshipValidation'
import { v4 as uuidv4 } from 'uuid'

/**
 * Extrahiert die Datenbank-ID aus einem Excalidraw-Element
 * @param element Das Excalidraw-Element
 * @returns Die Datenbank-ID oder die Element-ID als Fallback
 */
const getDatabaseId = (element: ExcalidrawElement | undefined | null): string => {
  if (!element) return ''

  const databaseId = element.customData?.databaseId
  const excalidrawId = element.id

  // Debug-Logging für ID-Verwendung
  if (databaseId && databaseId !== excalidrawId) {
    console.log(`Using database ID: ${databaseId} (instead of Excalidraw ID: ${excalidrawId})`)
  } else if (!databaseId) {
    console.warn(
      `No database ID found for element ${excalidrawId}, using Excalidraw ID as fallback`
    )
  }

  // Verwende databaseId falls vorhanden, sonst Excalidraw-ID als Fallback
  return databaseId || excalidrawId
}

/**
 * Extrahiert den Elementnamen aus verschiedenen Quellen
 */
export const extractElementName = (
  element: ExcalidrawElement | undefined,
  elementMap?: Map<string, ExcalidrawElement>
): string => {
  if (!element) {
    return 'Unbekanntes Element'
  }

  // Priorisiere customData.elementName (optimiert für Rectangle-Elemente)
  if (element.customData?.elementName) {
    return element.customData.elementName
  }

  // Versuche Text zu extrahieren
  let text = ''
  if (typeof element.text === 'string') {
    text = element.text
  } else if (element.text?.text) {
    text = element.text.text
  }

  // Neu: Suche nach verbundenen Text-Elementen über boundElements
  if (!text && elementMap && (element as any).boundElements) {
    const boundElements = (element as any).boundElements as any[]

    for (const boundElement of boundElements) {
      const boundElementObj = elementMap.get(boundElement.id)
      if (boundElementObj && boundElementObj.type === 'text') {
        if (typeof boundElementObj.text === 'string') {
          text = boundElementObj.text
          break
        } else if (boundElementObj.text?.text) {
          text = boundElementObj.text.text
          console.log('Found text in bound element (object):', text)
          break
        }
      }
    }
  }

  // Bereinige und validiere den Text
  if (text && text.trim().length > 0) {
    const cleanText = text.trim()
    console.log('Returning cleaned text:', cleanText)
    return cleanText
  }

  // Fallback auf Element-Typ basiert - verwende englische Begriffe
  const elementType = element.customData?.elementType || 'element'
  const typeMap: Record<string, string> = {
    application: 'Application',
    capability: 'Capability',
    businessCapability: 'Capability',
    dataObject: 'Data Object',
    interface: 'Interface',
    applicationInterface: 'Interface',
    infrastructure: 'Infrastructure',
  }

  const typeName = typeMap[elementType] || 'Element'
  const fallbackName = `New ${typeName}`
  console.log('Using fallback name:', fallbackName)
  return fallbackName
}

/**
 * Analysiert alle Pfeile in einem Excalidraw-Diagramm
 * Führt automatische Laufzeitkorrektur für ungültige mainElementId Referenzen durch
 */
export const analyzeArrows = async (
  elements: ExcalidrawElement[],
  client?: any
): Promise<ArrowAnalysisCompleteResult> => {
  console.log('=== analyzeArrows started - Runtime correction enabled ===')
  const arrows = elements.filter(el => el.type === 'arrow')
  const elementMap = new Map(elements.map(el => [el.id, el]))

  console.log(`Found ${arrows.length} arrows in diagram`)

  const analysisResults: ArrowAnalysisResult[] = []
  const correctedElements: ExcalidrawElement[] = []
  let correctionsApplied = 0

  // Analysiere jeden Pfeil und korrigiere Bindings falls nötig
  for (const arrow of arrows) {
    let correctedArrow = arrow
    let needsCorrection = false

    console.log(`Processing arrow ${arrow.id}`)

    // Prüfe und korrigiere Start-Binding
    const startCorrection = correctBindingToMainElement(arrow, 'start', elementMap)
    if (startCorrection.corrected && startCorrection.newBinding) {
      correctedArrow = { ...correctedArrow, startBinding: startCorrection.newBinding }
      needsCorrection = true
      correctionsApplied++
      console.log(`  Applied start binding correction`)
    }

    // Prüfe und korrigiere End-Binding
    const endCorrection = correctBindingToMainElement(correctedArrow, 'end', elementMap)
    if (endCorrection.corrected && endCorrection.newBinding) {
      correctedArrow = { ...correctedArrow, endBinding: endCorrection.newBinding }
      needsCorrection = true
      correctionsApplied++
      console.log(`  Applied end binding correction`)
    }

    // Wenn Korrekturen vorgenommen wurden, füge den korrigierten Pfeil zur Liste hinzu
    if (needsCorrection) {
      correctedElements.push(correctedArrow)
      console.log(`Corrected bindings for arrow ${arrow.id}`)
    } else {
      console.log(`No corrections needed for arrow ${arrow.id}`)
    }

    // Analysiere den (möglicherweise korrigierten) Pfeil
    const result = analyzeArrow(correctedArrow, elementMap)
    analysisResults.push(result)
  }

  // Kategorisiere die Ergebnisse
  const validRelationships: NewRelationship[] = []
  const incompleteRelationships: NewRelationship[] = []
  const invalidRelationships: NewRelationship[] = []
  const bindingIssues: ArrowAnalysisResult[] = []

  for (const result of analysisResults) {
    if (result.status === 'missing-binding') {
      bindingIssues.push(result)

      // Auch als unvollständige Beziehung hinzufügen, da für Benutzer relevant
      const relationship = createNewRelationshipFromResult(result, 'incomplete', elementMap)
      if (relationship) {
        incompleteRelationships.push(relationship)
      }
      continue
    }

    if (result.status === 'incomplete') {
      // Erstelle NewRelationship für unvollständige Beziehungen
      const relationship = createNewRelationshipFromResult(result, 'incomplete', elementMap)
      if (relationship) {
        incompleteRelationships.push(relationship)
      }
      continue
    }

    if (result.status === 'invalid') {
      // Erstelle NewRelationship für ungültige Beziehungen
      const relationship = createNewRelationshipFromResult(result, 'invalid', elementMap)
      if (relationship) {
        invalidRelationships.push(relationship)
      }
      continue
    }

    if (result.status === 'valid' && result.suggestedRelationships.length > 0) {
      // Erstelle NewRelationship für gültige Beziehungen
      // Nimm die erste vorgeschlagene Beziehung oder die ausgewählte
      const selectedRel = result.selectedRelationship || result.suggestedRelationships[0]
      const relationship = createNewRelationshipFromResult(result, 'valid', elementMap, selectedRel)
      if (relationship) {
        validRelationships.push(relationship)
      }
    }
  }

  console.log('=== analyzeArrows summary ===')
  console.log(`Runtime corrections applied: ${correctionsApplied}`)
  console.log(`Valid: ${validRelationships.length}`)
  console.log(`Incomplete: ${incompleteRelationships.length}`)
  console.log(`Invalid: ${invalidRelationships.length}`)
  console.log(`Binding issues: ${bindingIssues.length}`)
  console.log(`Corrected elements: ${correctedElements.length}`)

  // Filter existing relationships if client is provided
  let filteredValidRelationships = validRelationships
  if (client && validRelationships.length > 0) {
    console.log('\n=== DEBUG: Filtering existing relationships ===')
    filteredValidRelationships = await filterExistingRelationships(validRelationships, client)
    console.log(
      `DEBUG: Filtered valid relationships from ${validRelationships.length} to ${filteredValidRelationships.length}`
    )
  } else {
    console.log('DEBUG: No client provided or no valid relationships to filter')
  }

  console.log('\n=== DEBUG: analyzeArrows complete ===')
  return {
    validRelationships: filteredValidRelationships,
    incompleteRelationships,
    invalidRelationships,
    bindingIssues,
    correctedElements: correctedElements.length > 0 ? correctedElements : undefined,
  }
}

/**
 * Analysiert einen einzelnen Pfeil
 */
const analyzeArrow = (
  arrow: ExcalidrawElement,
  elementMap: Map<string, ExcalidrawElement>
): ArrowAnalysisResult => {
  console.log(`\n--- Analyzing arrow ${arrow.id} ---`)
  const issues: ArrowIssue[] = []
  let sourceElement: ExcalidrawElement | undefined
  let targetElement: ExcalidrawElement | undefined

  // Prüfe Start-Binding
  if (!arrow.startBinding) {
    console.log('  Missing start binding')
    issues.push({
      type: 'missing-start-binding',
      description: 'Pfeil hat kein Start-Binding',
    })
  } else {
    console.log(`  Start binding: ${arrow.startBinding.elementId}`)
    sourceElement = elementMap.get(arrow.startBinding.elementId)
    if (sourceElement) {
      sourceElement = getMainElement(sourceElement, elementMap)
      console.log(
        `  Found source element: ${sourceElement.id} (${sourceElement.customData?.elementType})`
      )
    } else {
      console.log(`  Source element NOT FOUND: ${arrow.startBinding.elementId}`)
    }
  }

  // Prüfe End-Binding
  if (!arrow.endBinding) {
    console.log('  Missing end binding')
    issues.push({
      type: 'missing-end-binding',
      description: 'Pfeil hat kein End-Binding',
    })
  } else {
    console.log(`  End binding: ${arrow.endBinding.elementId}`)
    targetElement = elementMap.get(arrow.endBinding.elementId)
    if (targetElement) {
      targetElement = getMainElement(targetElement, elementMap)
      console.log(
        `  Found target element: ${targetElement.id} (${targetElement.customData?.elementType})`
      )
    } else {
      console.log(`  Target element NOT FOUND: ${arrow.endBinding.elementId}`)
    }
  }

  // Wenn Bindings fehlen, Status auf missing-binding setzen
  if (issues.length > 0) {
    console.log(`  Result: missing-binding (${issues.length} issues)`)
    return {
      arrow,
      sourceElement,
      targetElement,
      status: 'missing-binding',
      issues,
      suggestedRelationships: [],
    }
  }

  // Wenn beide Elemente vorhanden sind, prüfe Beziehungen
  if (sourceElement && targetElement) {
    const sourceType = normalizeElementType(sourceElement.customData?.elementType || '')
    const targetType = normalizeElementType(targetElement.customData?.elementType || '')

    console.log(`  Source type: ${sourceType}, Target type: ${targetType}`)

    if (!sourceType || !targetType) {
      console.log(`  Result: invalid (unknown element types)`)
      return {
        arrow,
        sourceElement,
        targetElement,
        status: 'invalid',
        issues: [
          {
            type: 'invalid-relationship',
            description: 'Unbekannte Elementtypen',
          },
        ],
        suggestedRelationships: [],
      }
    }

    // Finde gültige Beziehungen
    let validRelationships = getValidRelationships(sourceType, targetType)

    // Spezielle Logik für Application-ApplicationInterface Beziehungen
    // Je nach Pfeilrichtung wird INTERFACE_SOURCE oder INTERFACE_TARGET verwendet
    if (
      (sourceType === 'application' && targetType === 'applicationInterface') ||
      (sourceType === 'applicationInterface' && targetType === 'application')
    ) {
      // Filtere nur die Beziehungen, die für die Pfeilrichtung korrekt sind
      validRelationships = validRelationships.filter(rel => {
        if (sourceType === 'application' && targetType === 'applicationInterface') {
          // Pfeil von Application zu ApplicationInterface = INTERFACE_SOURCE
          return rel.type === 'INTERFACE_SOURCE'
        } else if (sourceType === 'applicationInterface' && targetType === 'application') {
          // Pfeil von ApplicationInterface zu Application = INTERFACE_TARGET
          return rel.type === 'INTERFACE_TARGET'
        }
        return true
      })
    }

    if (validRelationships.length === 0) {
      console.log(
        `  Result: invalid (no valid relationships between ${sourceType} and ${targetType})`
      )
      return {
        arrow,
        sourceElement,
        targetElement,
        status: 'invalid',
        issues: [
          {
            type: 'invalid-relationship',
            description: `diagrams.dialogs.newRelationships.invalidReasons.incompatibleElementTypes:sourceType=${sourceType}:targetType=${targetType}`,
          },
        ],
        suggestedRelationships: [],
      }
    }

    console.log(`  Result: valid (${validRelationships.length} valid relationships found)`)
    return {
      arrow,
      sourceElement,
      targetElement,
      status: 'valid',
      issues: [],
      suggestedRelationships: validRelationships,
    }
  }

  // Ein oder beide Elemente fehlen
  console.log(
    `  Result: incomplete (missing elements - source: ${!!sourceElement}, target: ${!!targetElement})`
  )
  return {
    arrow,
    sourceElement,
    targetElement,
    status: 'incomplete',
    issues: [
      {
        type: 'invalid-relationship',
        description: 'Ein oder beide Endpunkte des Pfeils existieren nicht',
      },
    ],
    suggestedRelationships: [],
  }
}

/**
 * Korrigiert ein Binding, damit es auf das Hauptelement zeigt
 */
const correctBindingToMainElement = (
  arrow: ExcalidrawElement,
  binding: 'start' | 'end',
  elementMap: Map<string, ExcalidrawElement>
): { corrected: boolean; newBinding?: { elementId: string; focus: number; gap: number } } => {
  const currentBinding = binding === 'start' ? arrow.startBinding : arrow.endBinding

  if (!currentBinding) {
    console.log(`  No ${binding} binding to correct`)
    return { corrected: false }
  }

  const boundElement = elementMap.get(currentBinding.elementId)
  if (!boundElement) {
    console.log(`  Bound element ${currentBinding.elementId} not found in map`)
    return { corrected: false }
  }

  console.log(`  Checking ${binding} binding to element ${boundElement.id}:`, {
    type: boundElement.type,
    isMainElement: boundElement.customData?.isMainElement,
    elementType: boundElement.customData?.elementType,
    mainElementId: boundElement.customData?.mainElementId,
  })

  // Prüfe, ob das Element bereits ein Hauptelement ist
  if (boundElement.customData?.isMainElement) {
    console.log(`  Element ${boundElement.id} is already a main element - no correction needed`)
    return { corrected: false } // Kein Korrektur nötig
  }

  // Finde das Hauptelement
  const mainElement = getMainElement(boundElement, elementMap)

  console.log(`  Main element for ${boundElement.id} is ${mainElement.id}:`, {
    type: mainElement.type,
    isMainElement: mainElement.customData?.isMainElement,
    elementType: mainElement.customData?.elementType,
  })

  // Wenn das Hauptelement dasselbe ist wie das ursprüngliche Element, keine Korrektur nötig
  if (mainElement.id === boundElement.id) {
    console.log(`  Main element is same as bound element - no correction needed`)
    return { corrected: false }
  }

  // Zusätzliche Validierung: Prüfe, ob das Hauptelement einen gültigen elementType hat
  if (!mainElement.customData?.elementType) {
    console.log(`  Main element ${mainElement.id} has no elementType - cannot correct binding`)

    // Letzter Versuch: Suche nach einem anderen nahegelegenen Hauptelement mit elementType
    console.log(`  Searching for nearby main elements with elementType as last resort`)
    const nearbyValidElements = Array.from(elementMap.values()).filter(el => {
      if (!el.customData?.elementType || !el.customData?.isMainElement) return false
      if (el.id === mainElement.id) return false // Nicht das gleiche Element

      // Prüfe, ob die Elemente überlappen oder sehr nah beieinander sind
      const distance = Math.sqrt(
        Math.pow(el.x - boundElement.x, 2) + Math.pow(el.y - boundElement.y, 2)
      )

      return distance < 50 // Noch kleinerer Radius für die letzte Suche
    })

    if (nearbyValidElements.length > 0) {
      const validNearestElement = nearbyValidElements.reduce((closest, current) => {
        const currentDistance = Math.sqrt(
          Math.pow(current.x - boundElement.x, 2) + Math.pow(current.y - boundElement.y, 2)
        )
        const closestDistance = Math.sqrt(
          Math.pow(closest.x - boundElement.x, 2) + Math.pow(closest.y - boundElement.y, 2)
        )
        return currentDistance < closestDistance ? current : closest
      })

      console.log(`  Found valid nearby element ${validNearestElement.id} as final fallback`)
      return {
        corrected: true,
        newBinding: {
          elementId: validNearestElement.id,
          focus: currentBinding.focus,
          gap: currentBinding.gap,
        },
      }
    }

    return { corrected: false }
  }

  console.log(
    `  Correcting ${binding} binding from ${boundElement.id} to main element ${mainElement.id}`
  )

  return {
    corrected: true,
    newBinding: {
      elementId: mainElement.id,
      focus: currentBinding.focus,
      gap: currentBinding.gap,
    },
  }
}

/**
 * Findet das Hauptelement (falls das aktuelle Element ein Subelement ist)
 * Erweiterte Suche: Nutzt groupIds und Näherungssuche für robuste Element-Erkennung
 */
const getMainElement = (
  element: ExcalidrawElement,
  elementMap: Map<string, ExcalidrawElement>
): ExcalidrawElement => {
  console.log(`    Searching main element for ${element.id}:`, {
    type: element.type,
    isMainElement: element.customData?.isMainElement,
    mainElementId: element.customData?.mainElementId,
    elementType: element.customData?.elementType,
    groupIds: (element as any).groupIds,
  })

  if (element.customData?.isMainElement) {
    console.log(`    Element ${element.id} is already a main element`)
    return element
  }

  // 1. Versuche mainElementId (falls vorhanden und gültig)
  if (element.customData?.mainElementId) {
    const mainElement = elementMap.get(element.customData.mainElementId)
    if (mainElement) {
      console.log(`    Found main element ${mainElement.id} via mainElementId for ${element.id}:`, {
        type: mainElement.type,
        isMainElement: mainElement.customData?.isMainElement,
        elementType: mainElement.customData?.elementType,
      })
      return mainElement
    } else {
      console.log(
        `    Main element ${element.customData.mainElementId} not found in map for ${element.id}`
      )
    }
  }

  // 2. Versuche groupIds-basierte Suche (wenn das Element zu einer Gruppe gehört)
  const elementGroupIds = (element as any).groupIds as string[] | undefined
  if (elementGroupIds && elementGroupIds.length > 0) {
    console.log(`    Element ${element.id} belongs to groups:`, elementGroupIds)

    // Suche nach Hauptelementen in derselben Gruppe
    const groupMainElements = Array.from(elementMap.values()).filter(el => {
      if (!el.customData?.elementType || !el.customData?.isMainElement) return false
      if (el.id === element.id) return false // Nicht das gleiche Element

      const elGroupIds = (el as any).groupIds as string[] | undefined
      if (!elGroupIds || elGroupIds.length === 0) return false

      // Prüfe, ob das Element mindestens eine gemeinsame Gruppe hat
      return elementGroupIds.some(groupId => elGroupIds.includes(groupId))
    })

    if (groupMainElements.length > 0) {
      // Wenn es mehrere gibt, nimm das erste (oder könnte nach Nähe sortieren)
      const groupMainElement = groupMainElements[0]
      console.log(`    Found main element ${groupMainElement.id} via groupIds for ${element.id}:`, {
        type: groupMainElement.type,
        elementType: groupMainElement.customData?.elementType,
        groupIds: (groupMainElement as any).groupIds,
      })
      return groupMainElement
    }
  }

  // 3. Fallback: Suche nach nahegelegenen Hauptelementen (ursprüngliche Logik)
  console.log(`    Searching for alternative main elements near ${element.id}`)
  const nearbyMainElements = Array.from(elementMap.values()).filter(el => {
    if (!el.customData?.elementType || !el.customData?.isMainElement) return false

    // Prüfe, ob die Elemente überlappen oder sehr nah beieinander sind
    const distance = Math.sqrt(Math.pow(el.x - element.x, 2) + Math.pow(el.y - element.y, 2))

    return distance < 100 // Elemente innerhalb von 100 Pixeln
  })

  if (nearbyMainElements.length > 0) {
    // Nimm das nächstgelegene Element
    const nearest = nearbyMainElements.reduce((closest, current) => {
      const currentDistance = Math.sqrt(
        Math.pow(current.x - element.x, 2) + Math.pow(current.y - element.y, 2)
      )
      const closestDistance = Math.sqrt(
        Math.pow(closest.x - element.x, 2) + Math.pow(closest.y - element.y, 2)
      )
      return currentDistance < closestDistance ? current : closest
    })

    console.log(`    Found nearby main element ${nearest.id} as fallback for ${element.id}`)
    return nearest
  }

  // Erweiterte Suche: Wenn das Element kein elementType hat, suche nach Elementen in der Nähe
  if (!element.customData?.elementType && element.type === 'text') {
    console.log(
      `    Text element ${element.id} has no elementType, searching for nearby main elements`
    )

    // Zuerst versuche groupIds-basierte Suche
    const elementGroupIds = (element as any).groupIds as string[] | undefined
    if (elementGroupIds && elementGroupIds.length > 0) {
      console.log(`    Text element ${element.id} belongs to groups:`, elementGroupIds)

      const groupMainElements = Array.from(elementMap.values()).filter(el => {
        if (!el.customData?.elementType || !el.customData?.isMainElement) return false
        if (el.id === element.id) return false

        const elGroupIds = (el as any).groupIds as string[] | undefined
        if (!elGroupIds || elGroupIds.length === 0) return false

        return elementGroupIds.some(groupId => elGroupIds.includes(groupId))
      })

      if (groupMainElements.length > 0) {
        const groupMainElement = groupMainElements[0]
        console.log(
          `    Found main element ${groupMainElement.id} via groupIds for text element ${element.id}`
        )
        return groupMainElement
      }
    }

    // Suche nach überlappenden oder nahegelegenen Elementen mit elementType
    const candidates = Array.from(elementMap.values()).filter(el => {
      if (!el.customData?.elementType || !el.customData?.isMainElement) return false

      // Prüfe, ob die Elemente überlappen oder sehr nah beieinander sind
      const distance = Math.sqrt(Math.pow(el.x - element.x, 2) + Math.pow(el.y - element.y, 2))

      return distance < 100 // Elemente innerhalb von 100 Pixeln
    })

    if (candidates.length > 0) {
      // Nimm das nächstgelegene Element
      const nearest = candidates.reduce((closest, current) => {
        const currentDistance = Math.sqrt(
          Math.pow(current.x - element.x, 2) + Math.pow(current.y - element.y, 2)
        )
        const closestDistance = Math.sqrt(
          Math.pow(closest.x - element.x, 2) + Math.pow(closest.y - element.y, 2)
        )
        return currentDistance < closestDistance ? current : closest
      })

      console.log(`    Found nearby main element ${nearest.id} for text element ${element.id}`)
      return nearest
    }
  }

  console.log(`    No main element reference found for ${element.id}, returning self`)
  return element
}

/**
 * Erstellt eine NewRelationship aus einem AnalysisResult
 */
const createNewRelationshipFromResult = (
  result: ArrowAnalysisResult,
  status: 'valid' | 'incomplete' | 'invalid',
  elementMap: Map<string, ExcalidrawElement>,
  relationship?: RelationshipDefinition
): NewRelationship | null => {
  // Debug nur bei kritischen Fällen
  if (result.status === 'missing-binding' || status === 'invalid') {
    console.log('DEBUG: createNewRelationshipFromResult:', {
      arrowId: result.arrow.id,
      status,
      relationshipType: relationship?.type,
    })
  }

  // Spezielle Behandlung für missing-binding Fälle
  if (result.status === 'missing-binding') {
    const sourceElement = result.sourceElement
    const targetElement = result.targetElement

    let missingElement: 'source' | 'target' | 'both' | undefined
    let invalidReason: string =
      'diagrams.dialogs.newRelationships.invalidReasons.missingConnections'

    if (!sourceElement && !targetElement) {
      missingElement = 'both'
      invalidReason = 'diagrams.dialogs.newRelationships.invalidReasons.missingStartAndEndBinding'
    } else if (!sourceElement) {
      missingElement = 'source'
      invalidReason = 'diagrams.dialogs.newRelationships.invalidReasons.missingStartBinding'
    } else if (!targetElement) {
      missingElement = 'target'
      invalidReason = 'diagrams.dialogs.newRelationships.invalidReasons.missingEndBinding'
    }

    // Verwende die tatsächlichen Elementtypen, wenn verfügbar
    const sourceType = sourceElement
      ? normalizeElementType(sourceElement.customData?.elementType || '') || 'application'
      : 'application'
    const targetType = targetElement
      ? normalizeElementType(targetElement.customData?.elementType || '') || 'application'
      : 'application'

    const newRelationship = {
      id: uuidv4(),
      arrowId: result.arrow.id,
      sourceElementId: getDatabaseId(sourceElement),
      targetElementId: getDatabaseId(targetElement),
      sourceElementType: sourceType as ElementType,
      targetElementType: targetType as ElementType,
      sourceElementName: sourceElement
        ? extractElementName(sourceElement, elementMap)
        : 'Missing Element',
      targetElementName: targetElement
        ? extractElementName(targetElement, elementMap)
        : 'Missing Element',
      relationshipDefinition: {
        type: 'UNKNOWN',
        direction: 'OUT' as const,
        sourceType: sourceType as ElementType,
        targetType: targetType as ElementType,
        fieldName: 'unknown',
      },
      selected: true,
      status: 'incomplete' as const,
      missingElement,
      invalidReason,
    }

    return newRelationship
  }

  // Normale Behandlung für andere Fälle
  if (!result.sourceElement && !result.targetElement) {
    return null
  }

  const sourceElement = result.sourceElement
  const targetElement = result.targetElement

  let missingElement: 'source' | 'target' | undefined
  let invalidReason: string | undefined

  if (!sourceElement) {
    missingElement = 'source'
  } else if (!targetElement) {
    missingElement = 'target'
  }

  if (status === 'invalid') {
    invalidReason =
      result.issues[0]?.description ||
      'diagrams.dialogs.newRelationships.invalidReasons.invalidRelationship'
  }

  const sourceType = sourceElement
    ? normalizeElementType(sourceElement.customData?.elementType || '')
    : null
  const targetType = targetElement
    ? normalizeElementType(targetElement.customData?.elementType || '')
    : null

  // Für ungültige/unvollständige Beziehungen ohne gültige Typen
  if (!sourceType || !targetType) {
    console.log('DEBUG: Creating fallback relationship due to missing types')
    const fallbackRelationship = {
      id: uuidv4(),
      arrowId: result.arrow.id,
      sourceElementId: getDatabaseId(sourceElement),
      targetElementId: getDatabaseId(targetElement),
      sourceElementType: (sourceType || 'application') as ElementType,
      targetElementType: (targetType || 'application') as ElementType,
      sourceElementName: extractElementName(sourceElement, elementMap),
      targetElementName: extractElementName(targetElement, elementMap),
      relationshipDefinition: relationship || {
        type: 'UNKNOWN',
        direction: 'OUT' as const,
        sourceType: 'application' as const,
        targetType: 'application' as const,
        fieldName: 'unknown',
      },
      selected: true,
      status,
      missingElement,
      invalidReason,
    }

    console.log('DEBUG: Created fallback relationship:', fallbackRelationship)
    return fallbackRelationship
  }

  // Standard-Beziehung verwenden oder erste gültige, falls keine spezifiziert
  const finalRelationship =
    relationship ||
    result.suggestedRelationships[0] ||
    ({
      type: 'UNKNOWN',
      direction: 'OUT' as const,
      sourceType: sourceType as ElementType,
      targetType: targetType as ElementType,
      fieldName: 'unknown',
    } as RelationshipDefinition)

  const finalNewRelationship = {
    id: uuidv4(),
    arrowId: result.arrow.id,
    sourceElementId: getDatabaseId(sourceElement),
    targetElementId: getDatabaseId(targetElement),
    sourceElementType: sourceType as ElementType,
    targetElementType: targetType as ElementType,
    sourceElementName: extractElementName(sourceElement, elementMap),
    targetElementName: extractElementName(targetElement, elementMap),
    relationshipDefinition: finalRelationship,
    selected: true,
    status,
    missingElement,
    invalidReason,
  }

  return finalNewRelationship
}

/**
 * Filtert die analysierten Beziehungen und entfernt solche, die bereits in der Datenbank existieren
 */
export const filterExistingRelationships = async (
  relationships: NewRelationship[],
  client?: any // ApolloClient für Datenbankabfragen
): Promise<NewRelationship[]> => {
  console.log('=== DEBUG: filterExistingRelationships called ===')
  console.log(`Input: ${relationships?.length || 0} relationships, client provided: ${!!client}`)

  if (!relationships) {
    console.log('DEBUG: No relationships provided - returning empty array')
    return []
  }

  if (!client || relationships.length === 0) {
    console.log(
      'DEBUG: No client provided or no relationships to filter - returning all relationships'
    )
    return relationships
  }

  console.log(
    `DEBUG: Starting to filter ${relationships.length} relationships for existing ones in database`
  )

  const filteredRelationships: NewRelationship[] = []

  for (let i = 0; i < relationships.length; i++) {
    const relationship = relationships[i]

    try {
      // Nur Beziehungen mit Status 'valid' prüfen
      if (relationship.status !== 'valid') {
        filteredRelationships.push(relationship)
        continue
      }

      // Dynamischer Import um Zirkularität zu vermeiden
      const { checkRelationshipExists } = await import('./relationshipCreation')

      // Konvertiere das NewRelationship Objekt in das erwartete Format
      const relationshipToCheck = {
        type: relationship.relationshipDefinition.type,
        sourceElementId: relationship.sourceElementId,
        targetElementId: relationship.targetElementId,
        sourceElementType: relationship.sourceElementType,
        targetElementType: relationship.targetElementType,
      }

      const exists = await checkRelationshipExists(client, relationshipToCheck)

      if (!exists) {
        console.log(
          `New relationship: ${relationship.relationshipDefinition.type} between ${relationship.sourceElementName} and ${relationship.targetElementName}`
        )
        filteredRelationships.push(relationship)
      } else {
        console.log(
          `Existing relationship filtered out: ${relationship.relationshipDefinition.type} between ${relationship.sourceElementName} and ${relationship.targetElementName}`
        )
      }
    } catch (error) {
      console.error('DEBUG: Error checking relationship existence for filtering:', error)
      console.error('DEBUG: Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        relationship: {
          type: relationship.relationshipDefinition.type,
          sourceId: relationship.sourceElementId,
          targetId: relationship.targetElementId,
        },
      })
      // Bei Fehlern die Beziehung beibehalten (besser eine doppelte als eine fehlende)
      filteredRelationships.push(relationship)
    }
  }

  console.log(
    `DEBUG: Filtering complete - ${relationships.length} input relationships filtered down to ${filteredRelationships.length} new ones`
  )

  return filteredRelationships
}
