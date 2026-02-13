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
          break
        }
      }
    }
  }

  // Bereinige und validiere den Text
  if (text && text.trim().length > 0) {
    const cleanText = text.trim()
    return cleanText
  }

  // Fallback auf Element-Typ basiert - verwende englische Begriffe
  const elementType = element.customData?.elementType || 'element'
  const typeMap: Record<string, string> = {
    application: 'Application',
    businessCapability: 'Capability',
    dataObject: 'Data Object',
    interface: 'Interface',
    applicationInterface: 'Interface',
    infrastructure: 'Infrastructure',
  }

  const typeName = typeMap[elementType] || 'Element'
  const fallbackName = `New ${typeName}`
  return fallbackName
}

/**
 * Extrahiert den Text-Label eines Pfeils (falls vorhanden)
 */
export const extractArrowLabel = (
  arrow: ExcalidrawElement,
  elementMap: Map<string, ExcalidrawElement>
): string | undefined => {
  // Suche nach verbundenen Text-Elementen
  if (arrow.boundElements && Array.isArray(arrow.boundElements)) {
    for (const boundElement of arrow.boundElements) {
      const textElement = elementMap.get(boundElement.id)
      if (textElement && textElement.type === 'text') {
        let text = ''
        if (typeof textElement.text === 'string') {
          text = textElement.text
        } else if (textElement.text?.text) {
          text = textElement.text.text
        }
        
        if (text && text.trim().length > 0) {
          return text.trim()
        }
      }
    }
  }
  
  return undefined
}

/**
 * Analysiert alle Pfeile in einem Excalidraw-Diagramm
 * Führt automatische Laufzeitkorrektur für ungültige mainElementId Referenzen durch
 */
export const analyzeArrows = async (
  elements: ExcalidrawElement[],
  client?: any
): Promise<ArrowAnalysisCompleteResult> => {
  const arrows = elements.filter(el => el.type === 'arrow')
  const elementMap = new Map(elements.map(el => [el.id, el]))

  const analysisResults: ArrowAnalysisResult[] = []
  const correctedElements: ExcalidrawElement[] = []

  // Analysiere jeden Pfeil und korrigiere Bindings falls nötig
  for (const arrow of arrows) {
    let correctedArrow = arrow
    let needsCorrection = false

    // Prüfe und korrigiere Start-Binding
    const startCorrection = correctBindingToMainElement(arrow, 'start', elementMap)
    if (startCorrection.corrected && startCorrection.newBinding) {
      correctedArrow = { ...correctedArrow, startBinding: startCorrection.newBinding }
      needsCorrection = true
    }

    // Prüfe und korrigiere End-Binding
    const endCorrection = correctBindingToMainElement(correctedArrow, 'end', elementMap)
    if (endCorrection.corrected && endCorrection.newBinding) {
      correctedArrow = { ...correctedArrow, endBinding: endCorrection.newBinding }
      needsCorrection = true
    }

    // Wenn Korrekturen vorgenommen wurden, füge den korrigierten Pfeil zur Liste hinzu
    if (needsCorrection) {
      correctedElements.push(correctedArrow)
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

  // Filter existing relationships if client is provided
  let filteredValidRelationships = validRelationships
  if (client && validRelationships.length > 0) {
    filteredValidRelationships = await filterExistingRelationships(validRelationships, client)
  }

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
  const issues: ArrowIssue[] = []
  let sourceElement: ExcalidrawElement | undefined
  let targetElement: ExcalidrawElement | undefined

  // Prüfe Start-Binding
  if (!arrow.startBinding) {
    issues.push({
      type: 'missing-start-binding',
      description: 'Pfeil hat kein Start-Binding',
    })
  } else {
    sourceElement = elementMap.get(arrow.startBinding.elementId)
    if (sourceElement) {
      sourceElement = getMainElement(sourceElement, elementMap)
    }
  }

  // Prüfe End-Binding
  if (!arrow.endBinding) {
    issues.push({
      type: 'missing-end-binding',
      description: 'Pfeil hat kein End-Binding',
    })
  } else {
    targetElement = elementMap.get(arrow.endBinding.elementId)
    if (targetElement) {
      targetElement = getMainElement(targetElement, elementMap)
    }
  }

  // Wenn Bindings fehlen, Status auf missing-binding setzen
  if (issues.length > 0) {
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

    if (!sourceType || !targetType) {
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
    return { corrected: false }
  }

  const boundElement = elementMap.get(currentBinding.elementId)
  if (!boundElement) {
    return { corrected: false }
  }

  // Prüfe, ob das Element bereits ein Hauptelement ist
  if (boundElement.customData?.isMainElement) {
    return { corrected: false } // Kein Korrektur nötig
  }

  // Finde das Hauptelement
  const mainElement = getMainElement(boundElement, elementMap)

  // Wenn das Hauptelement dasselbe ist wie das ursprüngliche Element, keine Korrektur nötig
  if (mainElement.id === boundElement.id) {
    return { corrected: false }
  }

  // Zusätzliche Validierung: Prüfe, ob das Hauptelement einen gültigen elementType hat
  if (!mainElement.customData?.elementType) {
    // Letzter Versuch: Suche nach einem anderen nahegelegenen Hauptelement mit elementType
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
  if (element.customData?.isMainElement) {
    return element
  }

  // 1. Versuche mainElementId (falls vorhanden und gültig)
  if (element.customData?.mainElementId) {
    const mainElement = elementMap.get(element.customData.mainElementId)
    if (mainElement) {
      return mainElement
    }
  }

  // 2. Versuche groupIds-basierte Suche (wenn das Element zu einer Gruppe gehört)
  const elementGroupIds = (element as any).groupIds as string[] | undefined
  if (elementGroupIds && elementGroupIds.length > 0) {
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
      return groupMainElement
    }
  }

  // 3. Fallback: Suche nach nahegelegenen Hauptelementen (ursprüngliche Logik)
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

    return nearest
  }

  // Erweiterte Suche: Wenn das Element kein elementType hat, suche nach Elementen in der Nähe
  if (!element.customData?.elementType && element.type === 'text') {
    // Zuerst versuche groupIds-basierte Suche
    const elementGroupIds = (element as any).groupIds as string[] | undefined
    if (elementGroupIds && elementGroupIds.length > 0) {
      const groupMainElements = Array.from(elementMap.values()).filter(el => {
        if (!el.customData?.elementType || !el.customData?.isMainElement) return false
        if (el.id === element.id) return false

        const elGroupIds = (el as any).groupIds as string[] | undefined
        if (!elGroupIds || elGroupIds.length === 0) return false

        return elementGroupIds.some(groupId => elGroupIds.includes(groupId))
      })

      if (groupMainElements.length > 0) {
        const groupMainElement = groupMainElements[0]
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

      return nearest
    }
  }

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
  // Extract arrow label (if available)
  const arrowLabel = extractArrowLabel(result.arrow, elementMap)
  
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
        reverseArrow: false,
      },
      relationshipName: arrowLabel,
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
        reverseArrow: false,
      },
      relationshipName: arrowLabel,
      selected: true,
      status,
      missingElement,
      invalidReason,
    }

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
      reverseArrow: false,
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
    relationshipName: arrowLabel,
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
  if (!relationships) {
    return []
  }

  if (!client || relationships.length === 0) {
    return relationships
  }

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
        filteredRelationships.push(relationship)
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

  return filteredRelationships
}
