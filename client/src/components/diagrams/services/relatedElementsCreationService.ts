import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { getArchimateTemplateName } from './elementTemplateMapping'
import { filterAlreadyConnectedElements } from './elementFilterService'
import { calculateElementPositions } from './positioningService'
import {
  createArrowBetweenElements,
  ExcalidrawBaseElement,
  ExcalidrawArrowElement,
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
    config.spacing
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

    if (createdElements.length > 0) {
      const targetElement = createdElements[0]
      const arrow = createArrowBetweenElements({
        sourceElement: selectedElement,
        targetElement,
        arrowType: config.arrowType,
        position: config.position,
        reverseArrow: relatedElement.reverseArrow || false,
        arrowIndex: i,
        totalArrows: finalFilteredElements.length,
      })
      newArrows.push(arrow)
    }
  }

  if (newElements.length > 0 || newArrows.length > 0) {
    const currentElements = excalidrawAPI.getSceneElements()
    const allNewElements: ExcalidrawBaseElement[] = [...newElements, ...newArrows]

    const updatedCurrentElements = currentElements.map(element => {
      if (element.id === selectedElement.id) {
        const connectedArrowIds = newArrows
          .filter(
            arrow =>
              arrow.startBinding?.elementId === element.id ||
              arrow.endBinding?.elementId === element.id
          )
          .map(arrow => arrow.id)

        const existingBoundElements = element.boundElements || []
        const newBoundElements = [...existingBoundElements]

        connectedArrowIds.forEach(arrowId => {
          if (!newBoundElements.find((binding: any) => binding.id === arrowId)) {
            newBoundElements.push({ id: arrowId, type: 'arrow' })
          }
        })

        return { ...element, boundElements: newBoundElements }
      }
      return element
    })

    const finalNewElements = allNewElements.map(element => {
      if (element.type === 'arrow') return element
      const connectedArrows = newArrows.filter(
        arrow =>
          arrow.startBinding?.elementId === element.id || arrow.endBinding?.elementId === element.id
      )
      if (connectedArrows.length > 0) {
        const boundElements = connectedArrows.map(arrow => ({
          id: arrow.id,
          type: 'arrow' as const,
        }))
        return { ...element, boundElements: [...(element.boundElements || []), ...boundElements] }
      }
      return element
    })

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
