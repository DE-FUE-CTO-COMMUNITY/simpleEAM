import { ApolloClient } from '@apollo/client'
import { AddRelatedElementsConfig } from '../types/addRelatedElements'
import { loadRelatedElementsFromDatabase } from '../services/databaseRelatedElementsService'
import { loadArchimateLibrary } from './archimateLibraryUtils'
import {
  createExcalidrawElementsFromRelated,
  CreateRelatedElementsResult as CreationResult,
  RelatedElement as CreationRelatedElement,
} from '../services/relatedElementsCreationService'
import { ExcalidrawBaseElement } from '../services/arrowCreationService'

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

    return await createExcalidrawElementsFromRelated(
      relatedElementsData.elements as CreationRelatedElement[],
      selectedElement,
      library.libraryItems,
      config,
      excalidrawAPI
    )
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
