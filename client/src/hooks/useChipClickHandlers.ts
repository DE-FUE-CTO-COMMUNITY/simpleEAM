/**
 * Utility functions for handling chip clicks in GenericForm autocomplete fields
 * This provides a reusable pattern for navigating to related entities or opening diagrams
 */

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Entity type mapping for common relationship field names
 */
export const ENTITY_TYPE_MAP: Record<string, string> = {
  // Common relationships
  ownerId: 'persons',
  ownerIds: 'persons',

  // Application relationships
  supportsCapabilityIds: 'capabilities',
  usesDataObjectIds: 'dataObjects',
  sourceOfInterfaceIds: 'applicationInterfaces',
  targetOfInterfaceIds: 'applicationInterfaces',
  partOfArchitectures: 'architectures',
  implementsPrincipleIds: 'architecturePrinciples',
  depictedInDiagrams: 'diagrams',
  parentIds: 'applications',
  componentIds: 'applications',
  predecessorIds: 'applications',
  successorIds: 'applications',
  hostedOnIds: 'infrastructures',

  // Capability relationships
  supportedByApplicationIds: 'applications',
  supportedByApplications: 'applications',
  children: 'capabilities',
  childCapabilityIds: 'capabilities',
  parentCapabilityIds: 'capabilities',
  partOfDiagrams: 'diagrams',

  // Infrastructure relationships
  hostsApplicationIds: 'applications',

  // Data Object relationships
  usedByApplicationIds: 'applications',
  relatedDataObjects: 'dataObjects',

  // Architecture relationships
  containsApplicationIds: 'applications',
  containsCapabilityIds: 'capabilities',

  // Diagram relationships (these will open in diagram editor)
  relatedDiagramIds: 'diagrams',
}

/**
 * Options for configuring chip click behavior
 */
export interface ChipClickOptions {
  /**
   * Callback to open a nested form dialog
   * If not provided, will attempt to navigate using router
   */
  onOpenNestedForm?: (entityType: string, entityId: string, mode: 'view' | 'edit') => void

  /**
   * Callback to open a diagram in the editor
   * If not provided, will use default diagram opening logic
   */
  onOpenDiagram?: (diagramId: string, diagramTitle: string) => void

  /**
   * Whether to use router navigation instead of nested forms
   * Default: false (use nested forms)
   */
  useRouterNavigation?: boolean

  /**
   * Custom entity type mapping to override defaults
   */
  customEntityTypeMap?: Record<string, string>
}

/**
 * Hook to create chip click handlers for GenericForm autocomplete fields
 *
 * @example
 * ```tsx
 * const { createChipClickHandler, handleOpenDiagram } = useChipClickHandlers({
 *   onOpenNestedForm: (entityType, entityId, mode) => {
 *     // Open nested dialog
 *   }
 * })
 *
 * const fields = [
 *   {
 *     name: 'depictedInDiagrams',
 *     type: 'autocomplete',
 *     multiple: true,
 *     onChipClick: createChipClickHandler('depictedInDiagrams'),
 *   }
 * ]
 * ```
 */
export function useChipClickHandlers(options: ChipClickOptions = {}) {
  const router = useRouter()
  const {
    onOpenNestedForm,
    onOpenDiagram,
    useRouterNavigation = false,
    customEntityTypeMap = {},
  } = options

  // Merge custom and default entity type maps
  const entityTypeMap = { ...ENTITY_TYPE_MAP, ...customEntityTypeMap }

  /**
   * Default handler for opening diagrams in the editor
   */
  const handleOpenDiagram = useCallback(
    (diagramId: string, diagramTitle: string) => {
      console.log(`Opening diagram: ${diagramId} - ${diagramTitle}`)

      // Store diagram info in localStorage for the diagram editor
      localStorage.setItem(
        'pendingDiagramToOpen',
        JSON.stringify({
          id: diagramId,
          title: diagramTitle,
        })
      )

      // Navigate to diagram editor
      router.push('/diagrams')
    },
    [router]
  )

  /**
   * Creates a chip click handler for a specific field
   *
   * @param fieldName - The name of the field (used to determine entity type)
   * @returns A function that can be used as the onChipClick callback
   */
  const createChipClickHandler = useCallback(
    (fieldName: string) => {
      return (option: any, mode: 'view' | 'edit') => {
        // Extract entity ID and label from option
        const entityId = typeof option === 'object' ? option.value : option
        const entityLabel = typeof option === 'object' ? option.label : option

        if (!entityId) {
          console.warn(`Cannot navigate: no entity ID found in option`, option)
          return
        }

        // Determine entity type from field name
        const entityType = entityTypeMap[fieldName]

        if (!entityType) {
          console.warn(`Unknown field name for chip navigation: ${fieldName}`)
          return
        }

        console.log(`Chip clicked: ${fieldName} -> ${entityType}/${entityId} (${mode} mode)`)

        // Special handling for diagrams
        if (entityType === 'diagrams') {
          const diagramHandler = onOpenDiagram || handleOpenDiagram
          diagramHandler(entityId, entityLabel)
          return
        }

        // Handle other entity types
        if (useRouterNavigation) {
          // Navigate to entity page
          router.push(`/${entityType}/${entityId}?mode=${mode}`)
        } else if (onOpenNestedForm) {
          // Open nested form dialog
          onOpenNestedForm(entityType, entityId, mode)
        } else {
          console.warn(
            `No handler configured for non-diagram entity navigation. ` +
              `Provide either onOpenNestedForm or set useRouterNavigation=true`
          )
        }
      }
    },
    [entityTypeMap, onOpenNestedForm, onOpenDiagram, handleOpenDiagram, useRouterNavigation, router]
  )

  /**
   * Creates chip click handlers for multiple fields at once
   *
   * @param fieldNames - Array of field names to create handlers for
   * @returns Object mapping field names to their handlers
   */
  const createMultipleChipClickHandlers = useCallback(
    (fieldNames: string[]) => {
      return fieldNames.reduce(
        (acc, fieldName) => {
          acc[fieldName] = createChipClickHandler(fieldName)
          return acc
        },
        {} as Record<string, (option: any, mode: 'view' | 'edit') => void>
      )
    },
    [createChipClickHandler]
  )

  return {
    createChipClickHandler,
    createMultipleChipClickHandlers,
    handleOpenDiagram,
    entityTypeMap,
  }
}
