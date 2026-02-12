'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMutation, useQuery, useApolloClient } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { CREATE_DIAGRAM, UPDATE_DIAGRAM, GET_ARCHITECTURES_FOR_DIAGRAM } from '@/graphql/diagram'
import {
  LINK_CAPABILITY_TO_ARCHITECTURE,
  LINK_APPLICATION_TO_ARCHITECTURE,
  LINK_DATA_OBJECT_TO_ARCHITECTURE,
  LINK_APPLICATION_INTERFACE_TO_ARCHITECTURE,
  LINK_INFRASTRUCTURE_TO_ARCHITECTURE,
} from '@/graphql/architectureLinking'
import { useAuth } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import {
  createDiagramRelationshipUpdates,
  createDiagramRelationshipUpdatesWithDisconnect,
  createArchitectureLinkingUpdates,
} from '../utils/diagramRelationshipUtils'
import {
  detectNewElements,
  createNewElementsInDatabase,
  updateElementsWithDatabaseReferences,
  updateRelationshipsWithDatabaseReferences,
} from '../utils/newElementsUtils'
import { detectNameChanges, applyNameChanges, type NameChange } from '../utils/databaseSyncUtils'
import { findLinkedTextElement } from '../utils/textContainerUtils'
import { NameChangesSection } from './NameChangesSection'
import { analyzeArrows } from '../utils/arrowAnalysis'
import { NewRelationship } from '../types/relationshipTypes'
import { createRelationshipsInDatabase } from '../utils/relationshipCreation'
import { getElementTypeLabel } from '../utils/newElementsUtils'
import { getRelationshipDisplayName } from '../utils/relationshipValidation'

export interface DiagramType {
  value: string
  label: string
  description: string
}

// Funktion zum Erstellen übersetzter Diagrammtypen
const createDiagramTypes = (t: any): DiagramType[] => [
  {
    value: 'ARCHITECTURE',
    label: t('diagramTypes.ARCHITECTURE'),
    description: t('diagramTypeDescriptions.ARCHITECTURE'),
  },
  {
    value: 'APPLICATION_LANDSCAPE',
    label: t('diagramTypes.APPLICATION_LANDSCAPE'),
    description: t('diagramTypeDescriptions.APPLICATION_LANDSCAPE'),
  },
  {
    value: 'CAPABILITY_MAP',
    label: t('diagramTypes.CAPABILITY_MAP'),
    description: t('diagramTypeDescriptions.CAPABILITY_MAP'),
  },
  {
    value: 'DATA_FLOW',
    label: t('diagramTypes.DATA_FLOW'),
    description: t('diagramTypeDescriptions.DATA_FLOW'),
  },
  {
    value: 'PROCESS',
    label: t('diagramTypes.PROCESS'),
    description: t('diagramTypeDescriptions.PROCESS'),
  },
  {
    value: 'NETWORK',
    label: t('diagramTypes.NETWORK'),
    description: t('diagramTypeDescriptions.NETWORK'),
  },
  {
    value: 'INTEGRATION_ARCHITECTURE',
    label: t('diagramTypes.INTEGRATION_ARCHITECTURE'),
    description: t('diagramTypeDescriptions.INTEGRATION_ARCHITECTURE'),
  },
  {
    value: 'SECURITY_ARCHITECTURE',
    label: t('diagramTypes.SECURITY_ARCHITECTURE'),
    description: t('diagramTypeDescriptions.SECURITY_ARCHITECTURE'),
  },
  {
    value: 'CONCEPTUAL',
    label: t('diagramTypes.CONCEPTUAL'),
    description: t('diagramTypeDescriptions.CONCEPTUAL'),
  },
  {
    value: 'OTHER',
    label: t('diagramTypes.OTHER'),
    description: t('diagramTypeDescriptions.OTHER'),
  },
]

export interface SaveDiagramDialogProps {
  open: boolean
  onClose: () => void
  onSave: (savedDiagram: any) => Promise<boolean>
  diagramData: string // JSON string des Excalidraw-Diagramms
  onDiagramUpdate?: (updatedDiagramData: string) => void // Handler für Canvas-Updates nach Element-Erstellung
  existingDiagram?: {
    id: string
    title: string
    description?: string
    diagramType?: string
    company?: Array<{ id: string; name: string }> | { id: string; name: string }
    architecture?:
      | {
          id: string
          name: string
          type: string
          domain: string
        }[]
      | {
          id: string
          name: string
          type: string
          domain: string
        }
  }
  forceSaveAs?: boolean // Wenn true, wird immer ein neues Diagramm erstellt (für "Speichern unter")
}

const SaveDiagramDialog: React.FC<SaveDiagramDialogProps> = ({
  open,
  onClose,
  onSave,
  diagramData,
  onDiagramUpdate,
  existingDiagram,
  forceSaveAs = false,
}) => {
  const { keycloak } = useAuth()
  const { selectedCompanyId } = useCompanyContext()
  const apolloClient = useApolloClient()
  const locale = useLocale()
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const tElements = useTranslations('diagrams.dialogs.newElements')
  const tRel = useTranslations('diagrams.dialogs.newRelationships')

  // Translated diagram types
  const diagramTypes = React.useMemo(() => createDiagramTypes(t), [t])

  // Extract user information from Keycloak token
  const user = React.useMemo(() => {
    if (!keycloak?.token) return null

    try {
      const tokenPayload = JSON.parse(atob(keycloak.token.split('.')[1]))
      return {
        id: tokenPayload.sub,
        preferred_username: tokenPayload.preferred_username,
        given_name: tokenPayload.given_name,
        family_name: tokenPayload.family_name,
        email: tokenPayload.email,
      }
    } catch (error) {
      console.error('Fehler beim Parsen des Tokens:', error)
      return null
    }
  }, [keycloak?.token])

  // Aktuellen Benutzer für Owner-Zuweisung abrufen
  const { currentPerson } = useCurrentPerson()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [diagramType, setDiagramType] = useState('ARCHITECTURE')
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [architectureError, setArchitectureError] = useState(false)

  // State for neue Elemente und Beziehungen (integrated in main dialog)
  const [detectedNewElements, setDetectedNewElements] = useState<any[]>([])
  const [selectedNewElements, setSelectedNewElements] = useState<any[]>([])
  const [detectedNewRelationships, setDetectedNewRelationships] = useState<NewRelationship[]>([])
  const [selectedNewRelationships, setSelectedNewRelationships] = useState<NewRelationship[]>([])
  const [detectedIncompleteRelationships, setDetectedIncompleteRelationships] = useState<
    NewRelationship[]
  >([])
  const [detectedInvalidRelationships, setDetectedInvalidRelationships] = useState<
    NewRelationship[]
  >([])
  const [creatingElements, setCreatingElements] = useState(false)

  // State for name changes
  const [detectedNameChanges, setDetectedNameChanges] = useState<NameChange[]>([])

  // Handler for name change edits
  const handleNameChangeEdit = (index: number, newName: string) => {
    setDetectedNameChanges(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], newDatabaseName: newName }
      return updated
    })
  }

  // Helper: Get translated element type label
  const getElementTypeLabelTranslated = (elementType: string): string => {
    const typeKey = getElementTypeLabel(elementType, locale)
    return tElements(`elementTypes.${typeKey}` as any)
  }

  // Element selection handlers
  const handleElementToggle = (elementId: string) => {
    setSelectedNewElements(prev =>
      prev.map(el => (el.id === elementId ? { ...el, selected: !el.selected } : el))
    )
  }

  const handleElementSelectAll = () => {
    const allSelected = selectedNewElements.every(el => el.selected)
    setSelectedNewElements(prev => prev.map(el => ({ ...el, selected: !allSelected })))
  }

  // Relationship selection handlers
  const handleRelationshipToggle = (relationshipId: string) => {
    setSelectedNewRelationships(prev =>
      prev.map(rel => (rel.id === relationshipId ? { ...rel, selected: !rel.selected } : rel))
    )
  }

  const handleRelationshipSelectAll = () => {
    const allSelected = selectedNewRelationships.every(rel => rel.selected)
    setSelectedNewRelationships(prev => prev.map(rel => ({ ...rel, selected: !allSelected })))
  }

  // Format relationship for display
  const formatRelationship = (relationship: NewRelationship): string => {
    const isNewElement = (elementId: string): boolean => {
      return detectedNewElements.some(el => el.id === elementId)
    }

    const getElementDisplay = (
      elementId: string,
      elementName: string,
      missingType?: 'source' | 'target' | 'both'
    ) => {
      if (
        missingType &&
        (relationship.missingElement === missingType || relationship.missingElement === 'both')
      ) {
        return tRel('missingElement')
      } else if (isNewElement(elementId)) {
        return tRel('newElement', { elementName })
      } else {
        return elementName
      }
    }

    const getElementTypeDisplay = (
      elementType: string,
      missingType?: 'source' | 'target' | 'both'
    ) => {
      if (
        missingType &&
        (relationship.missingElement === missingType || relationship.missingElement === 'both')
      ) {
        return ''
      }
      return getElementTypeLabelTranslated(elementType)
    }

    const isReverseRelationship = relationship.relationshipDefinition.direction === 'IN'

    let actualSourceElement, actualTargetElement, actualSourceType, actualTargetType

    if (isReverseRelationship) {
      actualSourceElement = getElementDisplay(
        relationship.targetElementId,
        relationship.targetElementName,
        'target'
      )
      actualTargetElement = getElementDisplay(
        relationship.sourceElementId,
        relationship.sourceElementName,
        'source'
      )
      actualSourceType = getElementTypeDisplay(relationship.targetElementType, 'target')
      actualTargetType = getElementTypeDisplay(relationship.sourceElementType, 'source')
    } else {
      actualSourceElement = getElementDisplay(
        relationship.sourceElementId,
        relationship.sourceElementName,
        'source'
      )
      actualTargetElement = getElementDisplay(
        relationship.targetElementId,
        relationship.targetElementName,
        'target'
      )
      actualSourceType = getElementTypeDisplay(relationship.sourceElementType, 'source')
      actualTargetType = getElementTypeDisplay(relationship.targetElementType, 'target')
    }

    const relationshipName = getRelationshipDisplayName(
      relationship.relationshipDefinition.type,
      locale
    )

    const sourceIsMissing =
      relationship.missingElement === 'source' || relationship.missingElement === 'both'
    const targetIsMissing =
      relationship.missingElement === 'target' || relationship.missingElement === 'both'
    const hasMissingElements = sourceIsMissing || targetIsMissing

    if (hasMissingElements) {
      const sourceDisplay = sourceIsMissing
        ? actualSourceElement
        : `${actualSourceElement} (${actualSourceType})`
      const targetDisplay = targetIsMissing
        ? actualTargetElement
        : `${actualTargetElement} (${actualTargetType})`
      return `${sourceDisplay} → ${relationshipName} → ${targetDisplay}`
    }

    return tRel('relationshipFormat', {
      sourceElement: actualSourceElement,
      sourceType: actualSourceType,
      relationshipName,
      targetElement: actualTargetElement,
      targetType: actualTargetType,
    })
  }

  // Detect changes when dialog opens
  React.useEffect(() => {
    if (open && diagramData) {
      const detectChanges = async () => {
        try {
          const parsedDiagramData = JSON.parse(diagramData)
          const elements = parsedDiagramData.elements || []

          // Detect name changes
          const nameChanges = detectNameChanges(parsedDiagramData)
          setDetectedNameChanges(nameChanges)

          // Detect new elements
          const newElements = detectNewElements(elements)
          setDetectedNewElements(newElements)
          setSelectedNewElements(newElements.map(el => ({ ...el, selected: true })))

          // Perform arrow analysis
          const arrowAnalysis = await analyzeArrows(elements, apolloClient)
          setDetectedNewRelationships(arrowAnalysis.validRelationships)
          setSelectedNewRelationships(
            arrowAnalysis.validRelationships.map(rel => ({ ...rel, selected: true }))
          )
          setDetectedIncompleteRelationships(arrowAnalysis.incompleteRelationships)
          setDetectedInvalidRelationships(arrowAnalysis.invalidRelationships)

          // Update diagram if bindings were corrected
          if (arrowAnalysis.correctedElements && arrowAnalysis.correctedElements.length > 0) {
            const correctedElementMap = new Map(
              arrowAnalysis.correctedElements.map(el => [el.id, el])
            )
            const updatedElements = elements.map((el: any) => correctedElementMap.get(el.id) || el)
            const updatedDiagramData = JSON.stringify({
              ...parsedDiagramData,
              elements: updatedElements,
            })
            if (onDiagramUpdate) {
              onDiagramUpdate(updatedDiagramData)
            }
          }
        } catch (error) {
          console.warn('Error detecting changes:', error)
        }
      }

      detectChanges()
    }
  }, [open, diagramData, apolloClient, onDiagramUpdate])

  // Führe die Query nur aus, wenn der Benutzer authentifiziert ist
  const {
    data: architecturesData,
    loading: architecturesLoading,
    error: architecturesError,
  } = useQuery(GET_ARCHITECTURES_FOR_DIAGRAM, {
    skip: !keycloak?.authenticated || !keycloak?.token,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    variables: selectedCompanyId
      ? {
          where: {
            company: { some: { id: { eq: selectedCompanyId } } },
          },
        }
      : undefined,
  })

  const [createDiagram] = useMutation(CREATE_DIAGRAM)
  const [updateDiagram] = useMutation(UPDATE_DIAGRAM)

  // Mutations für Architektur-Verknüpfungen
  const [linkCapabilityToArchitecture] = useMutation(LINK_CAPABILITY_TO_ARCHITECTURE)
  const [linkApplicationToArchitecture] = useMutation(LINK_APPLICATION_TO_ARCHITECTURE)
  const [linkDataObjectToArchitecture] = useMutation(LINK_DATA_OBJECT_TO_ARCHITECTURE)
  const [linkApplicationInterfaceToArchitecture] = useMutation(
    LINK_APPLICATION_INTERFACE_TO_ARCHITECTURE
  )
  const [linkInfrastructureToArchitecture] = useMutation(LINK_INFRASTRUCTURE_TO_ARCHITECTURE)

  // Funktion zum Verknüpfen aller Diagramm-Elemente mit der Architektur
  const linkElementsToArchitecture = async (diagramJsonString: string, architectureId: string) => {
    console.log('🔗 [SaveDiagram] linkElementsToArchitecture started')
    const linkingStartTime = performance.now()
    
    const linkingData = createArchitectureLinkingUpdates(diagramJsonString, architectureId)
    const totalLinks = 
      linkingData.capabilities.length +
      linkingData.applications.length +
      linkingData.dataObjects.length +
      linkingData.interfaces.length +
      linkingData.infrastructures.length
    
    console.log(`📊 [SaveDiagram] Linking ${totalLinks} elements to architecture:`, {
      capabilities: linkingData.capabilities.length,
      applications: linkingData.applications.length,
      dataObjects: linkingData.dataObjects.length,
      interfaces: linkingData.interfaces.length,
      infrastructures: linkingData.infrastructures.length,
    })
    
    const promises: Promise<any>[] = []

    // BusinessCapabilities verknüpfen
    for (const capabilityId of linkingData.capabilities) {
      promises.push(
        linkCapabilityToArchitecture({
          variables: { id: capabilityId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von BusinessCapability', capabilityId, ':', error)
        })
      )
    }

    // Applications verknüpfen
    for (const applicationId of linkingData.applications) {
      promises.push(
        linkApplicationToArchitecture({
          variables: { id: applicationId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von Application', applicationId, ':', error)
        })
      )
    }

    // DataObjects verknüpfen
    for (const dataObjectId of linkingData.dataObjects) {
      promises.push(
        linkDataObjectToArchitecture({
          variables: { id: dataObjectId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von DataObject', dataObjectId, ':', error)
        })
      )
    }

    // ApplicationInterfaces verknüpfen
    for (const interfaceId of linkingData.interfaces) {
      promises.push(
        linkApplicationInterfaceToArchitecture({
          variables: { id: interfaceId, architectureId },
        }).catch(error => {
          console.warn(
            '⚠️ Fehler beim Verknüpfen von ApplicationInterface',
            interfaceId,
            ':',
            error
          )
        })
      )
    }

    // Infrastructure verknüpfen
    for (const infrastructureId of linkingData.infrastructures) {
      promises.push(
        linkInfrastructureToArchitecture({
          variables: { id: infrastructureId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von Infrastructure', infrastructureId, ':', error)
        })
      )
    }

    // Alle Verknüpfungen parallel ausführen
    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result => result.status === 'fulfilled').length
    const errorCount = results.filter(result => result.status === 'rejected').length
    
    const linkingEndTime = performance.now()
    console.log(`✅ [SaveDiagram] linkElementsToArchitecture completed in ${(linkingEndTime - linkingStartTime).toFixed(2)}ms`, {
      successCount,
      errorCount,
      totalLinks,
    })

    return { successCount, errorCount }
  }

  // Kombinierter useEffect für Dialog-Initialisierung
  React.useEffect(() => {
    if (open) {
      if (existingDiagram) {
        // Bei "Speichern unter" fügen wir " - Kopie" zum Titel hinzu
        const titleValue = forceSaveAs
          ? `${existingDiagram.title} - Kopie`
          : existingDiagram.title || ''
        setTitle(titleValue)
        setDescription(existingDiagram.description || '')
        setDiagramType(existingDiagram.diagramType || 'ARCHITECTURE')

        // Setze die bestehende Architektur wenn vorhanden
        if (existingDiagram.architecture) {
          // Die Architektur kommt als Array, wir nehmen das erste Element
          const architectureValue = Array.isArray(existingDiagram.architecture)
            ? existingDiagram.architecture[0]
            : existingDiagram.architecture

          // Wenn Architekturdaten bereits geladen sind, verwende sie
          if (architecturesData?.architectures && architectureValue?.id) {
            const foundArch = architecturesData.architectures.find(
              (a: any) => a.id === architectureValue.id
            )
            if (foundArch) {
              setSelectedArchitecture(foundArch)
              setArchitectureError(false)
            } else {
              console.warn(
                'Architektur aus Diagramm nicht in verfügbaren Architekturen gefunden:',
                architectureValue.id
              )
              setSelectedArchitecture(architectureValue) // Verwende trotzdem die Original-Daten
              setArchitectureError(false)
            }
          } else {
            // Architekturdaten noch nicht geladen, verwende die Diagramm-Daten
            setSelectedArchitecture(architectureValue)
            setArchitectureError(false)
          }
        } else {
          setSelectedArchitecture(null)
          setArchitectureError(true) // Keine Architektur, Fehler anzeigen
        }

        // Für existierende Diagramme: keine Titel-Fehler beim Laden
        setTitleError(false)
      } else {
        // Reset form for new diagrams
        setTitle('')
        setDescription('')
        setDiagramType('ARCHITECTURE')
        setSelectedArchitecture(null)

        // Für neue Diagramme: Validierungsfehler sofort anzeigen
        setTitleError(true) // Titel ist leer, also Fehler anzeigen
        setArchitectureError(true) // Architektur ist nicht gewählt, also Fehler anzeigen
      }
    }
  }, [open, existingDiagram, forceSaveAs, architecturesData])

  // Separate useEffect für nachträgliche Architektur-Validierung wenn Daten später geladen werden
  React.useEffect(() => {
    if (
      existingDiagram?.architecture &&
      architecturesData?.architectures &&
      open &&
      selectedArchitecture?.id
    ) {
      // Prüfe, ob die aktuell gesetzte Architektur in den verfügbaren Daten existiert
      const foundArch = architecturesData.architectures.find(
        (a: any) => a.id === selectedArchitecture.id
      )

      if (foundArch && foundArch !== selectedArchitecture) {
        // Ersetze mit vollständigen Daten aus der API
        setSelectedArchitecture(foundArch)
        setArchitectureError(false)
      } else if (!foundArch) {
        console.warn(
          'Gesetzte Architektur nicht in verfügbaren Daten gefunden:',
          selectedArchitecture.id
        )
        // Markiere als Fehler, da die Architektur nicht zur aktuellen Company gehört
        setArchitectureError(true)
      }
    }
  }, [architecturesData, selectedArchitecture, open, existingDiagram?.architecture])

  const handleSave = async () => {
    console.log('🕐 [SaveDiagram] handleSave started at', new Date().toISOString())
    const saveStartTime = performance.now()
    
    // Validierung
    const isTitleValid = title.trim().length > 0
    let isArchitectureValid = selectedArchitecture !== null

    // Zusätzliche Validierung: Architektur muss zur ausgewählten Company gehören
    if (isArchitectureValid && selectedCompanyId && architecturesData?.architectures) {
      const existsInFiltered = architecturesData.architectures.some(
        (a: any) => a.id === selectedArchitecture.id
      )
      if (!existsInFiltered) {
        isArchitectureValid = false
      }
    }

    setTitleError(!isTitleValid)
    setArchitectureError(!isArchitectureValid)

    if (!isTitleValid || !isArchitectureValid) {
      console.log('❌ [SaveDiagram] Validation failed')
      return
    }

    console.log('✅ [SaveDiagram] Validation passed, starting performSaveAction')
    // Perform save action (handles name changes, new elements, and relationships)
    await performSaveAction()
    
    const saveEndTime = performance.now()
    console.log(`✅ [SaveDiagram] handleSave completed in ${(saveEndTime - saveStartTime).toFixed(2)}ms`)
  }

  const performSaveAction = async () => {
    console.log('🔄 [SaveDiagram] performSaveAction started')
    const actionStartTime = performance.now()
    setCreatingElements(true)

    try {
      console.log('📊 [SaveDiagram] Parsing diagram data...')
      const parseStartTime = performance.now()
      // Parse diagram data for updates
      const parsedDiagramData = JSON.parse(diagramData)
      let updatedElements = parsedDiagramData.elements
      console.log(`✅ [SaveDiagram] Diagram data parsed in ${(performance.now() - parseStartTime).toFixed(2)}ms`)

      // Apply name changes first (if any)
      if (detectedNameChanges.length > 0) {
        console.log(`📝 [SaveDiagram] Applying ${detectedNameChanges.length} name changes...`)
        const nameChangeStartTime = performance.now()
        const nameChangeResult = await applyNameChanges(apolloClient, detectedNameChanges)
        console.log(`✅ [SaveDiagram] Name changes applied in ${(performance.now() - nameChangeStartTime).toFixed(2)}ms`)
        if (nameChangeResult.success) {
          // Update diagram elements with new synced names
          updatedElements = updatedElements.map((el: any) => {
            const nameChange = detectedNameChanges.find(nc => nc.elementId === el.id)
            if (nameChange && el.customData) {
              return {
                ...el,
                customData: {
                  ...el.customData,
                  lastSyncedName: nameChange.newDatabaseName,
                  elementName: nameChange.newDatabaseName,
                },
              }
            }

            // Also update text elements that are linked to changed container elements
            const linkedContainerChange = detectedNameChanges.find(nc => {
              const containerEl = updatedElements.find((e: any) => e.id === nc.elementId)
              if (containerEl) {
                const linkedText = findLinkedTextElement(containerEl, updatedElements)
                return linkedText?.id === el.id
              }
              return false
            })

            if (linkedContainerChange && el.type === 'text') {
              return {
                ...el,
                text: linkedContainerChange.newDatabaseName,
                rawText: linkedContainerChange.newDatabaseName,
                version: (el.version ?? 1) + 1,
                versionNonce: Math.floor(Math.random() * 1000000),
              }
            }

            return el
          })
        } else {
          console.error('Some name changes failed:', nameChangeResult.errors)
        }
      }

      // Get selected elements and relationships
      const selectedElements = selectedNewElements.filter(el => el.selected)
      const selectedRelationships = selectedNewRelationships.filter(rel => rel.selected)

      // Create selected elements in database
      let creationResult: any = { success: true, createdElements: [] }
      if (selectedElements.length > 0) {
        console.log(`🆕 [SaveDiagram] Creating ${selectedElements.length} new elements...`)
        const createElementsStartTime = performance.now()
        creationResult = await createNewElementsInDatabase(
          apolloClient,
          selectedElements,
          currentPerson?.id,
          selectedCompanyId || undefined
        )
        console.log(`✅ [SaveDiagram] Elements created in ${(performance.now() - createElementsStartTime).toFixed(2)}ms`)
      }

      // Create selected relationships in database
      let relationshipResult: any = { success: true, createdCount: 0, errors: [] }
      if (selectedRelationships.length > 0) {
        console.log(`🔗 [SaveDiagram] Creating ${selectedRelationships.length} new relationships...`)
        const createRelStartTime = performance.now()
        // Update relationships with new database IDs of created elements
        const updatedRelationships = updateRelationshipsWithDatabaseReferences(
          selectedRelationships,
          creationResult.createdElements
        )

        relationshipResult = await createRelationshipsInDatabase(apolloClient, updatedRelationships)
        console.log(`✅ [SaveDiagram] Relationships created in ${(performance.now() - createRelStartTime).toFixed(2)}ms`)
      }

      if (creationResult.success && relationshipResult.success) {
        // Update diagram data with new database references
        updatedElements = updateElementsWithDatabaseReferences(
          updatedElements,
          creationResult.createdElements
        )
        // Update diagramData for saving
        const updatedDiagramData = JSON.stringify({
          ...parsedDiagramData,
          elements: updatedElements,
        })
        // Perform save with updated data
        console.log('💾 [SaveDiagram] Calling performSave with updated data...')
        const performSaveStartTime = performance.now()
        const savedDiagram = await performSave(updatedDiagramData)
        console.log(`✅ [SaveDiagram] performSave completed in ${(performance.now() - performSaveStartTime).toFixed(2)}ms`)

        // Nach erfolgreichem Speichern: Canvas-Update und Parent benachrichtigen
        if (savedDiagram) {
          // Canvas sofort mit den neuen Daten aktualisieren
          if (onDiagramUpdate) {
            onDiagramUpdate(updatedDiagramData)
          }

          // Verwende die gespeicherten Diagrammdaten (mit Datenbankreferenzen) für Parent-Callback
          const diagramWithUpdatedElements = {
            ...savedDiagram,
            diagramJson: updatedDiagramData, // Verwende die aktualisierten Daten
          }

          // Parent-Component über das gespeicherte Diagramm informieren
          const success = await onSave(diagramWithUpdatedElements)
          if (!success) {
            setTitleError(true)
          }
        }
      } else {
        // Zeige Fehler bei der Elementerstellung, aber speichere trotzdem
        console.error('Fehler beim Erstellen der Elemente:', creationResult.errors)
        const savedDiagram = await performSave()
        if (savedDiagram) {
          const success = await onSave(savedDiagram)
          if (!success) {
            setTitleError(true)
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Erstellen neuer Elemente:', error)
      // Bei Fehler trotzdem normal speichern
      const savedDiagram = await performSave()
      if (savedDiagram) {
        const success = await onSave(savedDiagram)
        if (!success) {
          setTitleError(true)
        }
      }
    } finally {
      setCreatingElements(false)
    }
  }

  const performSave = async (customDiagramData?: string) => {
    console.log('💾 [SaveDiagram] performSave started')
    const performSaveStartTime = performance.now()
    const dataToSave = customDiagramData || diagramData

    setSaving(true)
    try {
      // PNG-Generierung vor dem Speichern (light and dark mode)
      console.log('🖼️ [SaveDiagram] Starting PNG generation...')
      const pngStartTime = performance.now()
      let diagramPng: string | null = null
      let diagramPngDark: string | null = null
      try {
        const parsedDiagramData = JSON.parse(dataToSave)
        const elements = parsedDiagramData.elements || []

        if (elements.length > 0) {
          // Import export function dynamically
          console.log('📦 [SaveDiagram] Importing @excalidraw/excalidraw...')
          const importStartTime = performance.now()
          const { exportToBlob } = await import('@excalidraw/excalidraw')
          console.log(`✅ [SaveDiagram] Excalidraw imported in ${(performance.now() - importStartTime).toFixed(2)}ms`)

          const appState = parsedDiagramData.appState || {}

          // Generate light mode preview
          console.log('🌞 [SaveDiagram] Generating light mode PNG...')
          const lightBlobStartTime = performance.now()
          const lightBlob = await exportToBlob({
            elements,
            appState: {
              ...appState,
              collaborators: undefined,
              exportBackground: true,
              viewBackgroundColor: '#ffffff',
              exportWithDarkMode: false,
              exportEmbedScene: false,
            },
            files: {},
            mimeType: 'image/png',
            quality: 0.85,
            exportPadding: 20,
            backgroundColor: '#ffffff',
          })
          console.log(`✅ [SaveDiagram] Light mode PNG generated in ${(performance.now() - lightBlobStartTime).toFixed(2)}ms`)

          // Generate dark mode preview with dark background
          console.log('🌙 [SaveDiagram] Generating dark mode PNG...')
          const darkBlobStartTime = performance.now()
          // Note: exportWithDarkMode applies an invert filter to the entire canvas,
          // so we need to pass white (#ffffff) which will be inverted to dark (#121212)
          const darkAppState = {
            ...appState,
            collaborators: undefined,
            exportBackground: true,
            viewBackgroundColor: '#ffffff', // Will be inverted to dark by THEME_FILTER
            exportWithDarkMode: true,
            exportEmbedScene: false,
            theme: 'dark',
          }

          const darkBlob = await exportToBlob({
            elements,
            appState: darkAppState,
            files: {},
            mimeType: 'image/png',
            quality: 0.85,
            exportPadding: 20,
          })
          console.log(`✅ [SaveDiagram] Dark mode PNG generated in ${(performance.now() - darkBlobStartTime).toFixed(2)}ms`)

          if (lightBlob) {
            // Convert light blob to base64
            console.log('🔄 [SaveDiagram] Converting light PNG to base64...')
            const base64StartTime = performance.now()
            const arrayBuffer = await lightBlob.arrayBuffer()
            const base64String = btoa(
              new Uint8Array(arrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
            diagramPng = base64String
            console.log(`✅ [SaveDiagram] Light PNG converted to base64 in ${(performance.now() - base64StartTime).toFixed(2)}ms`)
          }

          if (darkBlob) {
            // Convert dark blob to base64
            console.log('🔄 [SaveDiagram] Converting dark PNG to base64...')
            const darkBase64StartTime = performance.now()
            const arrayBuffer = await darkBlob.arrayBuffer()
            const base64String = btoa(
              new Uint8Array(arrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
            diagramPngDark = base64String
            console.log(`✅ [SaveDiagram] Dark PNG converted to base64 in ${(performance.now() - darkBase64StartTime).toFixed(2)}ms`)
          }
        }
        console.log(`✅ [SaveDiagram] Total PNG generation completed in ${(performance.now() - pngStartTime).toFixed(2)}ms`)
      } catch (pngError) {
        console.warn('⚠️ [SaveDiagram] PNG generation failed:', pngError)
        console.log(`❌ [SaveDiagram] PNG generation failed after ${(performance.now() - pngStartTime).toFixed(2)}ms`)
        // Speichern ohne PNG fortsetzen
      }

      const baseInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        diagramJson: dataToSave,
        diagramType: diagramType,
        ...(diagramPng && { diagramPng }),
        ...(diagramPngDark && { diagramPngDark }),
        // Safety: always connect diagram to the selected company on create
        ...(selectedCompanyId && {
          company: {
            connect: [
              {
                where: {
                  node: { id: { eq: selectedCompanyId } },
                },
              },
            ],
          },
        }),
        architecture: {
          connect: [
            {
              where: {
                node: { id: { eq: selectedArchitecture.id } },
              },
            },
          ],
        },
        ...(user && {
          creator: {
            connect: [
              {
                where: {
                  node: { id: { eq: user.id } },
                },
              },
            ],
          },
        }),
      }

      console.log('🔧 [SaveDiagram] Preparing mutation input...')
      const mutationPrepStartTime = performance.now()
      
      let result
      if (existingDiagram?.id && !forceSaveAs) {
        // Update bestehende Diagramm
        console.log('📝 [SaveDiagram] Updating existing diagram...')
        const relationshipUpdates = createDiagramRelationshipUpdatesWithDisconnect(dataToSave)

        // Determine existing company ID
        const existingCompanyId = existingDiagram.company
          ? Array.isArray(existingDiagram.company)
            ? existingDiagram.company[0]?.id
            : existingDiagram.company.id
          : null

        // Only update company if:
        // 1. We have a selectedCompanyId AND
        // 2. It's different from the existing company
        // Otherwise, preserve the existing company connection by not including it in the update
        const shouldUpdateCompany = selectedCompanyId && selectedCompanyId !== existingCompanyId

        const updateInput = {
          title: { set: title.trim() },
          description: { set: description.trim() || undefined },
          diagramJson: { set: dataToSave },
          diagramType: { set: diagramType },
          ...(diagramPng && { diagramPng: { set: diagramPng } }),
          ...(diagramPngDark && { diagramPngDark: { set: diagramPngDark } }),
          // Only update company if it actually changed
          ...(shouldUpdateCompany && {
            company: {
              disconnect: [{ where: {} }],
              connect: [
                {
                  where: {
                    node: { id: { eq: selectedCompanyId } },
                  },
                },
              ],
            },
          }),
          architecture: {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: [
              {
                where: {
                  node: { id: { eq: selectedArchitecture.id } },
                },
              },
            ],
          },
          ...relationshipUpdates, // Automatische Beziehungen zu Datenbankelementen
        }
        console.log(`✅ [SaveDiagram] Update mutation input prepared in ${(performance.now() - mutationPrepStartTime).toFixed(2)}ms`)
        console.log('🚀 [SaveDiagram] Sending UPDATE mutation to GraphQL...')
        const mutationStartTime = performance.now()
        result = await updateDiagram({
          variables: {
            id: existingDiagram.id,
            input: updateInput,
          },
        })
        console.log(`✅ [SaveDiagram] UPDATE mutation completed in ${(performance.now() - mutationStartTime).toFixed(2)}ms`)

        if (
          !result.data ||
          !result.data.updateDiagrams ||
          !result.data.updateDiagrams.diagrams[0]
        ) {
          console.error(
            'Save failed: No diagram returned from update mutation. This is likely a permissions issue.'
          )
          throw new Error(
            'Failed to save diagram: You may not have permission to update this diagram. Please ask the diagram owner to save.'
          )
        }

        const savedDiagram = result.data.updateDiagrams.diagrams[0]
        // Nach erfolgreichem Update: Alle Diagramm-Elemente mit der Architektur verknüpfen
        console.log('🔗 [SaveDiagram] Linking elements to architecture...')
        const linkingStartTime = performance.now()
        try {
          await linkElementsToArchitecture(dataToSave, selectedArchitecture.id)
          console.log(`✅ [SaveDiagram] Elements linked to architecture in ${(performance.now() - linkingStartTime).toFixed(2)}ms`)
        } catch (linkingError) {
          console.warn(
            '⚠️ Fehler bei Architektur-Verknüpfung (Diagramm wurde trotzdem gespeichert):',
            linkingError
          )
        }

        return savedDiagram
      } else {
        // Neue Diagramm erstellen (auch bei forceSaveAs)
        console.log('🆕 [SaveDiagram] Creating new diagram...')
        const relationshipUpdates = createDiagramRelationshipUpdates(dataToSave)
        const input = {
          ...baseInput,
          ...relationshipUpdates, // Automatische Beziehungen zu Datenbankelementen
        }
        console.log(`✅ [SaveDiagram] Create mutation input prepared in ${(performance.now() - mutationPrepStartTime).toFixed(2)}ms`)
        console.log('🚀 [SaveDiagram] Sending CREATE mutation to GraphQL...')
        const mutationStartTime = performance.now()
        result = await createDiagram({
          variables: {
            input: [input],
          },
        })
        console.log(`✅ [SaveDiagram] CREATE mutation completed in ${(performance.now() - mutationStartTime).toFixed(2)}ms`)

        if (!result.data || !result.data.createDiagrams) {
          throw new Error('Keine Daten von createDiagrams erhalten')
        }

        const savedDiagram = result.data.createDiagrams.diagrams[0]

        // Nach erfolgreichem Speichern: Alle Diagramm-Elemente mit der Architektur verknüpfen
        console.log('🔗 [SaveDiagram] Linking elements to architecture...')
        const linkingStartTime = performance.now()
        try {
          await linkElementsToArchitecture(dataToSave, selectedArchitecture.id)
          console.log(`✅ [SaveDiagram] Elements linked to architecture in ${(performance.now() - linkingStartTime).toFixed(2)}ms`)
        } catch (linkingError) {
          console.warn(
            '⚠️ [SaveDiagram] Fehler bei Architektur-Verknüpfung (Diagramm wurde trotzdem gespeichert):',
            linkingError
          )
          console.log(`❌ [SaveDiagram] Architecture linking failed after ${(performance.now() - linkingStartTime).toFixed(2)}ms`)
        }

        return savedDiagram
      }
    } catch (error) {
      console.error('❌ [SaveDiagram] Error saving diagram:', error)
      return null
    } finally {
      setSaving(false)
      const performSaveEndTime = performance.now()
      console.log(`✅ [SaveDiagram] performSave total time: ${(performSaveEndTime - performSaveStartTime).toFixed(2)}ms`)
    }
  }

  const selectedDiagramType = diagramTypes.find(type => type.value === diagramType)

  // Handler für Titel-Änderungen mit Validierung
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Sofortige Validierung
    setTitleError(newTitle.trim().length === 0)
  }

  // Handler für Architektur-Änderungen mit Validierung
  const handleArchitectureChange = (_: any, newValue: any) => {
    setSelectedArchitecture(newValue)
    // Sofortige Validierung
    setArchitectureError(newValue === null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {forceSaveAs
            ? t('dialogs.save.title') + '...'
            : existingDiagram
              ? t('dialogs.save.title')
              : t('dialogs.save.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t('dialogs.save.titleField')}
              value={title}
              onChange={handleTitleChange}
              fullWidth
              required
              error={titleError}
              helperText={
                titleError ? t('dialogs.save.titleRequired') : t('dialogs.save.titleHelperText')
              }
            />

            <TextField
              label={t('dialogs.save.descriptionField')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              helperText={t('dialogs.save.descriptionHelperText')}
            />

            <FormControl fullWidth>
              <InputLabel>{t('dialogs.save.typeField')}</InputLabel>
              <Select
                value={diagramType}
                label={t('dialogs.save.typeField')}
                onChange={e => setDiagramType(e.target.value)}
              >
                {diagramTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {selectedDiagramType && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedDiagramType.description}
                </Typography>
              )}
            </FormControl>

            <Autocomplete
              options={architecturesData?.architectures || []}
              value={selectedArchitecture}
              onChange={handleArchitectureChange}
              disabled={architecturesLoading || !!architecturesError}
              loading={architecturesLoading}
              getOptionLabel={option => {
                if (!option || !option.name || !option.type) return ''
                return `${option.name} (${option.type})`
              }}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false
                return option.id === value.id
              }}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props
                return (
                  <Box key={key} component="li" {...otherProps}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.type} • {option.domain}
                      </Typography>
                    </Box>
                  </Box>
                )
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('dialogs.save.architectureField')}
                  required
                  error={architectureError}
                  helperText={
                    architectureError
                      ? t('dialogs.save.architectureRequired')
                      : architecturesError
                        ? t('dialogs.save.loadingArchitecturesError', {
                            message: architecturesError.message,
                          })
                        : architecturesLoading
                          ? t('dialogs.save.loadingArchitectures')
                          : t('dialogs.save.architectureHelperText')
                  }
                />
              )}
              fullWidth
            />

            {/* Name Changes Section - after metadata, before new elements */}
            {detectedNameChanges.length > 0 && (
              <>
                <Divider />
                <NameChangesSection
                  nameChanges={detectedNameChanges}
                  onNameChange={handleNameChangeEdit}
                />
              </>
            )}

            {/* New Elements Section */}
            {detectedNewElements.length > 0 && (
              <>
                <Divider />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {tElements('title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {tElements('description', { count: detectedNewElements.length })}
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedNewElements.every(el => el.selected)}
                              indeterminate={
                                selectedNewElements.some(el => el.selected) &&
                                !selectedNewElements.every(el => el.selected)
                              }
                              onChange={handleElementSelectAll}
                              disabled={creatingElements}
                              title={tElements('selectAll')}
                            />
                          </TableCell>
                          <TableCell>{tElements('tableHeaders.name')}</TableCell>
                          <TableCell>{tElements('tableHeaders.type')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedNewElements.map((element, index) => (
                          <TableRow
                            key={element.id}
                            hover
                            selected={element.selected}
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: element.selected ? 'action.selected' : 'inherit',
                            }}
                            onClick={() => !creatingElements && handleElementToggle(element.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={element.selected} disabled={creatingElements} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {element.text || tElements('elementLabel', { index: index + 1 })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getElementTypeLabelTranslated(element.elementType)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}

            {/* New Relationships Section */}
            {detectedNewRelationships.length > 0 && (
              <>
                <Divider />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {tRel('title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {tRel('description', { count: detectedNewRelationships.length })}
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedNewRelationships.every(rel => rel.selected)}
                              indeterminate={
                                selectedNewRelationships.some(rel => rel.selected) &&
                                !selectedNewRelationships.every(rel => rel.selected)
                              }
                              onChange={handleRelationshipSelectAll}
                              disabled={creatingElements}
                              title={tRel('selectAll')}
                            />
                          </TableCell>
                          <TableCell>{tRel('tableHeaders.relationship')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedNewRelationships.map(relationship => (
                          <TableRow
                            key={relationship.id}
                            hover
                            selected={relationship.selected}
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: relationship.selected
                                ? 'action.selected'
                                : 'inherit',
                            }}
                            onClick={() =>
                              !creatingElements && handleRelationshipToggle(relationship.id)
                            }
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={relationship.selected}
                                disabled={creatingElements}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatRelationship(relationship)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}

            {/* Incomplete Relationships Section */}
            {detectedIncompleteRelationships.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" color="warning.main">
                      {tRel('incompleteTitle')} ({detectedIncompleteRelationships.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {tRel('incompleteDescription')}
                    </Alert>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {detectedIncompleteRelationships.map(relationship => (
                        <Paper
                          key={relationship.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'warning.main',
                            backgroundColor: 'warning.lighter',
                          }}
                        >
                          <Typography variant="body2">
                            {formatRelationship(relationship)}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}

            {/* Invalid Relationships Section */}
            {detectedInvalidRelationships.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" color="error.main">
                      {tRel('invalidTitle')} ({detectedInvalidRelationships.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {tRel('invalidDescription')}
                    </Alert>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {detectedInvalidRelationships.map(relationship => (
                        <Paper
                          key={relationship.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'error.main',
                            backgroundColor: 'error.lighter',
                          }}
                        >
                          <Typography variant="body2">
                            {formatRelationship(relationship)}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving || creatingElements}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!title.trim() || !selectedArchitecture || saving || creatingElements}
            startIcon={saving || creatingElements ? <CircularProgress size={20} /> : undefined}
          >
            {saving || creatingElements
              ? t('dialogs.save.saving')
              : forceSaveAs
                ? t('dialogs.save.saveAsCopy')
                : existingDiagram
                  ? t('dialogs.save.update')
                  : tCommon('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SaveDiagramDialog
