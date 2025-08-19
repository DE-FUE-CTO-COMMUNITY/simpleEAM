import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { getArchimateTemplateName } from './elementTemplateMapping'
import { filterAlreadyConnectedElements } from './elementFilterService'
import { calculateElementPositions } from './positioningService'
import {
  ExcalidrawBaseElement,
  ExcalidrawArrowElement,
  createArrowBetweenElements,
} from './arrowCreationService'
import {
  createCapabilityElementsFromTemplate,
  createApplicationElementsFromTemplate,
  createDataObjectElementsFromTemplate,
  createInterfaceElementsFromTemplate,
  createInfrastructureElementsFromTemplate,
} from '../utils/elementCreation'

// Extended RelatedElement interface mit reverseArrow support
export interface RelatedElement {
  id: string
  name: string
  description?: string
  elementType: 'capability' | 'application' | 'dataObject' | 'interface' | 'infrastructure'
  relationshipType?: string
  reverseArrow?: boolean
  status?: string
  criticality?: string
  type?: string
  maturityLevel?: number
  businessValue?: number
  classification?: string
  interfaceType?: string
  infrastructureType?: string
}

export interface CreateRelatedElementsResult {
  success: boolean
  elementsAdded: number
  elements: ExcalidrawBaseElement[]
  arrows: ExcalidrawArrowElement[]
  errorMessage?: string
}

/**
 * Erstellt Excalidraw-Elemente aus den verwandten Elementen
 */
export const createExcalidrawElementsFromRelated = async (
  relatedElements: RelatedElement[],
  selectedElement: ExcalidrawBaseElement,
  libraryItems: any[],
  config: AddRelatedElementsConfig,
  excalidrawAPI: { getSceneElements: () => ExcalidrawBaseElement[]; updateScene: (p: any) => void }
): Promise<CreateRelatedElementsResult> => {
  const newElements: ExcalidrawBaseElement[] = []
  const newArrows: ExcalidrawArrowElement[] = []

  const filteredRelatedElements = config.selectedElementTypes
    ? relatedElements.filter(element => config.selectedElementTypes!.includes(element.elementType))
    : relatedElements

  const finalFilteredElements = filterAlreadyConnectedElements(
    filteredRelatedElements as any,
    selectedElement,
    excalidrawAPI
  )

  if (finalFilteredElements.length === 0) {
    return {
      success: true,
      elementsAdded: 0,
      elements: [],
      arrows: [],
    }
  }

  const sourceX = selectedElement.x
  const sourceY = selectedElement.y
  const sourceWidth = selectedElement.width
  const sourceHeight = selectedElement.height

  const positions = calculateElementPositions(
    finalFilteredElements,
    { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight },
    config.position,
    config.spacing,
    config.distance
  )

  for (let i = 0; i < finalFilteredElements.length; i++) {
    const relatedElement = finalFilteredElements[i]
    const position = positions[i]

    const templateName = getArchimateTemplateName(relatedElement.elementType)
    const template = Array.isArray(libraryItems)
      ? libraryItems.find((t: any) => t.name === templateName)
      : null

    if (!template) {
      console.warn(
        `No template found for element type: ${relatedElement.elementType} (template name: ${templateName})`
      )
      continue
    }

    let createdElements: ExcalidrawBaseElement[] = []

    if (relatedElement.elementType === 'capability') {
      createdElements = createCapabilityElementsFromTemplate(
        relatedElement as any,
        'capability',
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'application') {
      createdElements = createApplicationElementsFromTemplate(
        relatedElement as any,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'dataObject') {
      createdElements = createDataObjectElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'interface') {
      createdElements = createInterfaceElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'infrastructure') {
      createdElements = createInfrastructureElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else {
      console.warn(
        `Unbekannter Elementtyp: ${relatedElement.elementType} - Element wird übersprungen`
      )
      continue
    }

    newElements.push(...createdElements)
    // Pfeil zwischen Root und diesem Element
    if (createdElements.length) {
      try {
        const main = createdElements[0]
        const source = relatedElement.reverseArrow ? main : selectedElement
        const target = relatedElement.reverseArrow ? selectedElement : main
        const arrow = createArrowBetweenElements({
          sourceElement: source,
          targetElement: target,
          arrowType: (config.arrowType as any) || 'sharp',
          position: config.position as any,
          reverseArrow: false,
          totalArrows: finalFilteredElements.length,
          arrowIndex: i,
          arrowGap: config.arrowGap,
        })
        // Boundings hinzufügen
        const attach = (el: ExcalidrawBaseElement) => {
          if (!el.boundElements) el.boundElements = []
          if (!el.boundElements.some(b => b.id === arrow.id)) {
            el.boundElements.push({ id: arrow.id, type: 'arrow' })
          }
        }
        attach(source)
        attach(target)
        newArrows.push(arrow)
      } catch (e) {
        console.warn('[SingleHop][Arrow] Fehler beim Erstellen eines Pfeils', e)
      }
    }
  }

  if (newElements.length > 0) {
    const currentElements = excalidrawAPI.getSceneElements()
    const allNewElements: ExcalidrawBaseElement[] = [...newElements, ...newArrows]

    const updatedCurrentElements = currentElements // Keine Arrow-Bindings

    const finalNewElements = allNewElements

    excalidrawAPI.updateScene({
      elements: [...updatedCurrentElements, ...finalNewElements],
    })
  }

  return {
    success: true,
    elementsAdded: finalFilteredElements.length,
    elements: newElements,
    arrows: newArrows,
  }
}
