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
 * Extrahiert den Elementnamen aus einem Excalidraw-Element
 * @param element Das Excalidraw-Element
 * @param elementMap Map aller Elemente für die Suche nach verbundenen Text-Elementen
 * @returns Der Elementname oder ein generischer Fallback
 */
const extractElementName = (
  element: ExcalidrawElement | undefined | null,
  elementMap?: Map<string, ExcalidrawElement>
): string => {
  if (!element) return 'New Element'

  // Spezielle Debug-Ausgabe für das problematische Element
  if (element.id === 'CbFFs1XCBYWHiMPUwc-bk') {
    console.log('=== DEBUG für Test App 4 ===')
    console.log('Vollständiges Element:', element)
    console.log('element.customData:', element.customData)
    console.log('element.text:', element.text)
    console.log('element.rawText:', (element as any).rawText)
    console.log('element.boundElements:', (element as any).boundElements)
    console.log('Alle Properties:', Object.keys(element))
    console.log('===========================')
  }

  // Debug: Logge die verfügbaren Eigenschaften
  console.log('extractElementName - Element:', {
    id: element.id,
    customData: element.customData,
    text: element.text,
    type: element.type,
  })

  // Priorisiere customData.elementName
  if (element.customData?.elementName) {
    console.log('Using customData.elementName:', element.customData.elementName)
    return element.customData.elementName
  }

  // Versuche Text zu extrahieren
  let text = ''
  if (typeof element.text === 'string') {
    text = element.text
    console.log('Using element.text (string):', text)
  } else if (element.text?.text) {
    text = element.text.text
    console.log('Using element.text.text:', text)
  }

  // Neu: Suche nach verbundenen Text-Elementen über boundElements
  if (!text && elementMap && (element as any).boundElements) {
    console.log('Searching for bound text elements...')
    const boundElements = (element as any).boundElements as any[]

    for (const boundElement of boundElements) {
      const boundElementObj = elementMap.get(boundElement.id)
      if (boundElementObj && boundElementObj.type === 'text') {
        if (typeof boundElementObj.text === 'string') {
          text = boundElementObj.text
          console.log('Found text in bound element (string):', text)
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
 */
export const analyzeArrows = (elements: ExcalidrawElement[]): ArrowAnalysisCompleteResult => {
  const arrows = elements.filter(el => el.type === 'arrow')
  const elementMap = new Map(elements.map(el => [el.id, el]))

  const analysisResults: ArrowAnalysisResult[] = []

  // Analysiere jeden Pfeil
  for (const arrow of arrows) {
    const result = analyzeArrow(arrow, elementMap)
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

  return {
    validRelationships,
    incompleteRelationships,
    invalidRelationships,
    bindingIssues,
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
            description: `Keine gültige Beziehung zwischen ${sourceType} und ${targetType}`,
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
 * Findet das Hauptelement (falls das aktuelle Element ein Subelement ist)
 */
const getMainElement = (
  element: ExcalidrawElement,
  elementMap: Map<string, ExcalidrawElement>
): ExcalidrawElement => {
  if (element.customData?.isMainElement) {
    return element
  }

  if (element.customData?.mainElementId) {
    const mainElement = elementMap.get(element.customData.mainElementId)
    return mainElement || element
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
    invalidReason = result.issues[0]?.description || 'Ungültige Beziehung'
  }

  const sourceType = sourceElement
    ? normalizeElementType(sourceElement.customData?.elementType || '')
    : null
  const targetType = targetElement
    ? normalizeElementType(targetElement.customData?.elementType || '')
    : null

  // Für ungültige/unvollständige Beziehungen ohne gültige Typen
  if (!sourceType || !targetType) {
    return {
      id: uuidv4(),
      arrowId: result.arrow.id,
      sourceElementId: sourceElement?.id || '',
      targetElementId: targetElement?.id || '',
      sourceElementType: (sourceType || 'application') as ElementType,
      targetElementType: (targetType || 'application') as ElementType,
      sourceElementName: extractElementName(sourceElement, elementMap),
      targetElementName: extractElementName(targetElement, elementMap),
      relationshipDefinition: relationship || {
        type: 'UNKNOWN',
        direction: 'OUT',
        sourceType: 'application',
        targetType: 'application',
        fieldName: 'unknown',
      },
      selected: true,
      status,
      missingElement,
      invalidReason,
    }
  }

  // Standard-Beziehung verwenden oder erste gültige, falls keine spezifiziert
  const finalRelationship =
    relationship ||
    result.suggestedRelationships[0] ||
    ({
      type: 'UNKNOWN',
      direction: 'OUT',
      sourceType: sourceType,
      targetType: targetType,
      fieldName: 'unknown',
    } as RelationshipDefinition)

  return {
    id: uuidv4(),
    arrowId: result.arrow.id,
    sourceElementId: sourceElement?.id || '',
    targetElementId: targetElement?.id || '',
    sourceElementType: sourceType,
    targetElementType: targetType,
    sourceElementName: extractElementName(sourceElement, elementMap),
    targetElementName: extractElementName(targetElement, elementMap),
    relationshipDefinition: finalRelationship,
    selected: true,
    status,
    missingElement,
    invalidReason,
  }
}

/**
 * Filtert die analysierten Beziehungen und entfernt solche, die bereits in der Datenbank existieren
 * (Diese Funktion sollte später mit echten Datenbankabfragen implementiert werden)
 */
export const filterExistingRelationships = async (
  relationships: NewRelationship[]
): Promise<NewRelationship[]> => {
  // TODO: Implementiere echte Datenbankabfrage
  // Für jetzt geben wir alle Beziehungen zurück
  return relationships
}
