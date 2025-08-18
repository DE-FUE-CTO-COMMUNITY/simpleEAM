/**
 * Service zum Filtern bereits verbundener Elemente, um Duplikat-Pfeile zu vermeiden
 */
export interface RelatedElementFilterItem {
  id: string
  name: string
  elementType: string
  relationshipType?: string
  reverseArrow?: boolean
}

export const filterAlreadyConnectedElements = (
  relatedElements: RelatedElementFilterItem[],
  selectedElement: { id: string },
  excalidrawAPI: { getSceneElements: () => any[] }
): RelatedElementFilterItem[] => {
  const currentElements = excalidrawAPI.getSceneElements()

  const existingElementsWithDb = currentElements.filter(
    (element: any) => element.customData?.databaseId && element.id !== selectedElement.id
  )

  const connectedDatabaseIds = new Set<string>()

  const connectedArrows = currentElements.filter(
    (element: any) =>
      element.type === 'arrow' &&
      (element.startBinding?.elementId === selectedElement.id ||
        element.endBinding?.elementId === selectedElement.id)
  )

  connectedArrows.forEach((arrow: any) => {
    const otherElementId =
      arrow.startBinding?.elementId === selectedElement.id
        ? arrow.endBinding?.elementId
        : arrow.startBinding?.elementId

    if (otherElementId) {
      const otherElement = existingElementsWithDb.find((el: any) => el.id === otherElementId)
      if (otherElement?.customData?.databaseId) {
        connectedDatabaseIds.add(otherElement.customData.databaseId)
      }
    }
  })

  return relatedElements.filter(relatedElement => !connectedDatabaseIds.has(relatedElement.id))
}
