'use client'

import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react'
import { Box, Alert, Snackbar } from '@mui/material'
import { useApolloClient } from '@apollo/client'
import { FONT_FAMILY } from '@excalidraw/excalidraw'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { GET_DIAGRAM } from '@/graphql/diagram'
import { isAdmin } from '@/lib/auth'
import SaveDiagramDialog from '../dialogs/SaveDiagramDialog'
import OpenDiagramDialog from '../dialogs/OpenDiagramDialog'
import DeleteDiagramDialog from '../dialogs/DeleteDiagramDialog'
import DiagramNameDisplay from './DiagramNameDisplay'
import ExcalidrawWrapper from './ExcalidrawWrapper'
import DiagramLibrarySidebar, { type DiagramLibrarySidebarHandle } from './DiagramLibrarySidebar'
import CanvasDebugOverlay from './CanvasDebugOverlay'
import CapabilityMapGenerator from '../dialogs/CapabilityMapGenerator'
import { DiagramEditorProps } from '../types/DiagramTypes'
import { useDiagramState, useUIOptions } from '../state/DiagramState'
import { useDiagramHandlers } from '../handlers/DiagramHandlers'
import { useKeyboardShortcuts } from '../hooks/DiagramKeyboardShortcuts'
import { loadViewportStateFromStorage, clearDiagramStorage } from '../utils/DiagramStorageUtils'
import { isViewer } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import type { ExcalidrawFont } from '@/components/companies/types'

const COMPANY_FONT_TO_EXCALIDRAW: Record<ExcalidrawFont, number> = {
  'Comic Shanns': FONT_FAMILY['Comic Shanns'],
  Excalifont: FONT_FAMILY.Excalifont,
  'Lilita One': FONT_FAMILY['Lilita One'],
  Nunito: FONT_FAMILY.Nunito,
}

const FALLBACK_EXCALIDRAW_FONT = FONT_FAMILY.Excalifont

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const apolloClient = useApolloClient()
  const t = useTranslations('diagrams')
  const {
    selectedCompanyId,
    selectedCompany,
    setCompanySelectionLock,
    setSelectedCompanyId,
    companies,
  } = useCompanyContext()
  const prevCompanyIdRef = useRef<string | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const collaborationTranslations = useTranslations('diagrams.collaborationDialog')

  const accessibleCompanyIds = useMemo(() => {
    const ids = new Set(companies.map(company => company.id))
    return ids
  }, [companies])

  const companyFontFamily = useMemo(() => {
    const diagramFont = selectedCompany?.diagramFont as ExcalidrawFont | undefined
    if (diagramFont && COMPANY_FONT_TO_EXCALIDRAW[diagramFont]) {
      return COMPANY_FONT_TO_EXCALIDRAW[diagramFont]
    }
    return FALLBACK_EXCALIDRAW_FONT
  }, [selectedCompany?.diagramFont])

  // Collaboration status state
  const [isCollaborating, setIsCollaborating] = useState(false)
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const sidebarRef = useRef<DiagramLibrarySidebarHandle | null>(null)
  // Ref to track if we're in the middle of receiving collaboration data
  const isReceivingCollaborationDataRef = useRef(false)
  // Ref to store broadcastSceneUpdate function from collaboration hook
  const broadcastSceneUpdateRef = useRef<((elements: any[], appState: any) => void) | null>(null)
  // Ref to suppress onChange callbacks after programmatic scene updates (prevents broadcast loops)
  const suppressOnChangeRef = useRef(false)

  // Custom hooks for state management
  const {
    isClient,
    excalidrawAPI,
    currentDiagram,
    currentScene,
    hasUnsavedChanges,
    lastSavedScene,
    dialogStates,
    notification,
    setExcalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
    updateDialogState,
    selectedElementForRelatedElements,
    setSelectedElementForRelatedElements,
  } = useDiagramState()

  // UI Options
  const uiOptions = useUIOptions()

  // Create translated notification wrapper
  const setTranslatedNotification = useCallback(
    (notification: {
      open: boolean
      message: string
      severity: 'success' | 'error' | 'info' | 'warning'
    }) => {
      let translatedMessage = notification.message

      // Handle translation keys with parameters
      if (notification.message.includes(':')) {
        const parts = notification.message.split(':')
        const key = parts[0]

        if (key === 'messages.diagramLoaded') {
          const titleAndCorrection = parts.slice(1).join(':')
          // Check if there's correction information in parentheses
          if (titleAndCorrection.includes(' (') && titleAndCorrection.includes('korrigiert)')) {
            const [title, correction] = titleAndCorrection.split(' (')
            const correctionText = '(' + correction // Restore the opening parenthesis
            translatedMessage =
              t('messages.diagramLoaded', { title: title.trim() }) + ' ' + correctionText
          } else {
            translatedMessage = t('messages.diagramLoaded', { title: titleAndCorrection })
          }
        } else if (key === 'messages.diagramSaved') {
          translatedMessage = t('messages.diagramSaved', { title: parts[1] })
        } else if (key === 'messages.diagramSavedAs') {
          translatedMessage = t('messages.diagramSavedAs', { title: parts[1] })
        }
      } else if (notification.message.startsWith('messages.')) {
        const key = notification.message.replace('messages.', '')
        translatedMessage = t(`messages.${key}` as any)
      } else if (notification.message.startsWith('errors.')) {
        const key = notification.message.replace('errors.', '')
        translatedMessage = t(`errors.${key}` as any)
      }

      setNotification({
        ...notification,
        message: translatedMessage,
      })
    },
    [setNotification, t]
  )

  // Handlers
  const {
    handleNewDiagram,
    handleDeleteDiagram,
    handleOpenDiagram,
    handleSaveDiagram,
    handleSaveAsDiagram,
    handleChange,
    handleExportJSON,
    handleExportDrawIO,
    handleExportArchi,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
    isLoadingRef,
  } = useDiagramHandlers(
    excalidrawAPI,
    currentDiagram,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setTranslatedNotification,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    lastSavedScene,
    companyFontFamily,
    broadcastSceneUpdateRef,
    suppressOnChangeRef
  )

  // Capability Map Generator Handler
  const handleCapabilityMapGenerator = useCallback(() => {
    updateDialogState('capabilityMapGeneratorOpen', true)
  }, [updateDialogState])

  const enforceCompanyFontFamily = useCallback(() => {
    if (!excalidrawAPI) {
      return
    }

    try {
      const appState = excalidrawAPI.getAppState?.()
      if (!appState) {
        return
      }

      if (appState.currentItemFontFamily !== companyFontFamily) {
        excalidrawAPI.updateScene({
          appState: {
            ...appState,
            currentItemFontFamily: companyFontFamily,
          },
        })
      }
    } catch (error) {
      console.warn('DiagramEditor: Failed to synchronize company font family', error)
    }
  }, [companyFontFamily, excalidrawAPI])

  const normalizeElementsFont = useCallback(
    (elements: any[] = []) => {
      if (!elements.length) {
        return elements
      }

      let didUpdate = false
      const patchedElements = elements.map(element => {
        if (element?.type === 'text' && element.fontFamily !== companyFontFamily) {
          didUpdate = true
          return {
            ...element,
            fontFamily: companyFontFamily,
          }
        }
        return element
      })

      return didUpdate ? patchedElements : elements
    },
    [companyFontFamily]
  )

  // Handle generated capability map elements
  const handleCapabilityMapGenerated = useCallback(
    (elements: any[]) => {
      if (!excalidrawAPI) {
        return
      }

      try {
        // Update the scene with generated elements
        excalidrawAPI.updateScene({
          elements: normalizeElementsFont(elements),
          appState: {
            viewBackgroundColor: '#ffffff',
            currentItemFontFamily: companyFontFamily,
          },
        })

        // Mark as having unsaved changes
        setHasUnsavedChanges(true)

        // Count actual capabilities (main elements) instead of all technical elements
        const capabilityCount = elements.filter(
          (el: any) => el.customData?.isMainElement === true
        ).length

        // Show success notification
        setNotification({
          open: true,
          message: t('messages.capabilityMapSuccess', { count: capabilityCount }),
          severity: 'success',
        })
      } catch {
        // Error handling
        setNotification({
          open: true,
          message: t('errors.capabilityMapError'),
          severity: 'error',
        })
      }
    },
    [
      companyFontFamily,
      excalidrawAPI,
      normalizeElementsFont,
      setHasUnsavedChanges,
      setNotification,
      t,
    ]
  )

  // Reset Diagram Editor when company changes
  useEffect(() => {
    // Skip on first mount when prev is undefined
    const prev = prevCompanyIdRef.current

    if (prev !== null && selectedCompanyId !== prev) {
      // Don't clear the canvas during active collaboration
      // The collaboration system will handle content synchronization
      if (isCollaborating) {
        prevCompanyIdRef.current = selectedCompanyId ?? null
        return
      }

      // Don't clear if we're receiving collaboration data (initial sync)
      if (isReceivingCollaborationDataRef.current) {
        prevCompanyIdRef.current = selectedCompanyId ?? null
        return
      }

      // Don't clear if we're loading a diagram
      if (isLoadingRef?.current) {
        prevCompanyIdRef.current = selectedCompanyId ?? null
        return
      }

      // Perform a silent reset of the editor state
      try {
        if (excalidrawAPI) {
          const emptyScene = {
            elements: [],
            appState: {
              viewBackgroundColor: '#ffffff',
              collaborators: new Map(),
              selectedElementIds: {},
              hoveredElementIds: {},
              selectedGroupIds: {},
              selectedLinearElement: null,
              editingLinearElement: null,
              activeTool: { type: 'selection' },
              isLoading: false,
              errorMessage: null,
              currentItemFontFamily: companyFontFamily,
            },
          }
          excalidrawAPI.updateScene(emptyScene)
        }
      } catch {
        // noop
      }

      // Clear local persisted state and reset React state
      clearDiagramStorage()
      setCurrentDiagram(null)
      setCurrentScene(null)
      setHasUnsavedChanges(false)
      setLastSavedScene(null)
      // Optionally close dialogs to avoid stale state
      updateDialogState('saveDialogOpen', false)
      updateDialogState('saveAsDialogOpen', false)
      updateDialogState('openDialogOpen', false)
      updateDialogState('deleteDialogOpen', false)
      updateDialogState('capabilityMapGeneratorOpen', false)
      updateDialogState('addRelatedElementsDialogOpen', false)
    }

    // update prev ref after handling
    prevCompanyIdRef.current = selectedCompanyId ?? null
  }, [
    selectedCompanyId,
    excalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    updateDialogState,
    companyFontFamily,
    isCollaborating,
  ])

  useEffect(() => {
    enforceCompanyFontFamily()
  }, [enforceCompanyFontFamily, currentDiagram?.id, currentScene?.appState?.currentItemFontFamily])

  // Related Elements handlers
  const handleOpenAddRelatedElementsDialog = useCallback(
    (element: any) => {
      setSelectedElementForRelatedElements(element)
      updateDialogState('addRelatedElementsDialogOpen', true)
    },
    [setSelectedElementForRelatedElements, updateDialogState]
  )

  const handleCloseAddRelatedElementsDialog = useCallback(() => {
    updateDialogState('addRelatedElementsDialogOpen', false)
    setSelectedElementForRelatedElements(null)
  }, [updateDialogState, setSelectedElementForRelatedElements])

  // Keyboard shortcuts hook
  useKeyboardShortcuts(
    handleNewDiagram,
    handleExportJSON,
    handleExportDrawIO,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
    handleCapabilityMapGenerator,
    currentDiagram,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    open => updateDialogState('openDialogOpen', open),
    open => updateDialogState('deleteDialogOpen', open)
  )

  // Excalidraw API Handler
  const handleExcalidrawAPI = useCallback(
    (api: any) => {
      // Setze eine Bereitschafts-Eigenschaft für bessere Erkennung
      if (api) {
        api.ready = true
        setExcalidrawAPI(api)
      }
    },
    [setExcalidrawAPI]
  )

  // Get current diagram data for save operations
  const getCurrentDiagramData = () => {
    if (!excalidrawAPI) return '{}'

    const elements = excalidrawAPI.getSceneElements()
    const appState = excalidrawAPI.getAppState()

    return JSON.stringify({
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemFontFamily: appState.currentItemFontFamily,
      },
    })
  }

  // Stop collaboration handler
  const handleStopCollaboration = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stopFn = (window as any).__stopCollaboration
      if (stopFn) {
        stopFn()
        setIsCollaborating(false)
      }
    }
  }, [])

  // Store broadcast function reference for use in handlers
  const handleBroadcastReady = useCallback(
    (broadcastFn: (elements: any[], appState: any) => void) => {
      broadcastSceneUpdateRef.current = broadcastFn
    },
    []
  )

  // Handle diagram metadata updates from collaboration
  const handleCollaborationDiagramUpdate = useCallback(
    (diagram: any) => {
      // Skip if no diagram
      if (!diagram) {
        return
      }

      // Extract company ID from diagram (it's an array in GraphQL response)
      const diagramCompanyId = Array.isArray(diagram.company)
        ? diagram.company[0]?.id
        : diagram.company?.id || diagram.companyId

      // Check if user has access to this company
      if (diagramCompanyId) {
        const hasAccess = isAdmin() || accessibleCompanyIds.has(diagramCompanyId)

        if (!hasAccess) {
          // User doesn't have access - show error and stop collaboration
          enqueueSnackbar(collaborationTranslations('companyPermissionDenied'), {
            variant: 'error',
          })

          // Stop the collaboration properly
          handleStopCollaboration()
          // Remove room parameter from URL
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('room')
            window.history.replaceState({}, '', url.toString())
          }
          return // Don't update diagram or switch company
        }

        // User has access - update metadata WITHOUT calling setCurrentDiagram with full diagram object
        // This prevents triggering any diagram loading logic that would clear the canvas
        // The canvas content comes from the WebSocket collaboration stream, not from database load

        // Set ref to prevent canvas clearing during company switch
        isReceivingCollaborationDataRef.current = true

        // Only update the currentDiagram state to match the collaboration diagram metadata
        // Use functional update to merge with existing state without triggering load
        setCurrentDiagram((prev: any) => ({
          ...prev,
          id: diagram.id,
          title: diagram.title,
          description: diagram.description,
          diagramType: diagram.diagramType,
          company: diagram.company,
          companyId: diagramCompanyId,
          architecture: diagram.architecture,
        }))

        // Then switch company if needed
        if (diagramCompanyId !== selectedCompanyId) {
          setSelectedCompanyId(diagramCompanyId)
        }

        // Reset the flag after a short delay
        setTimeout(() => {
          isReceivingCollaborationDataRef.current = false
        }, 500)
      } else {
        // No company ID in diagram - just update metadata
        setCurrentDiagram((prev: any) => ({
          ...prev,
          id: diagram.id,
          title: diagram.title,
          description: diagram.description,
          diagramType: diagram.diagramType,
          architecture: diagram.architecture,
        }))
      }
    },
    [
      setCurrentDiagram,
      selectedCompanyId,
      accessibleCompanyIds,
      setSelectedCompanyId,
      enqueueSnackbar,
      collaborationTranslations,
      handleStopCollaboration,
      isCollaborating,
    ]
  )

  // Authorization callback for collaboration - check BEFORE loading scene
  const authorizeCollaborationAccess = useCallback(
    (diagram: any) => {
      if (!diagram) {
        return 'allow' // Allow if no diagram info
      }

      const diagramCompanyId = Array.isArray(diagram.company)
        ? diagram.company[0]?.id
        : diagram.company?.id || diagram.companyId

      if (!diagramCompanyId) {
        return 'allow' // Allow if no company specified
      }

      const hasAccess = isAdmin() || accessibleCompanyIds.has(diagramCompanyId)

      if (!hasAccess) {
        enqueueSnackbar(collaborationTranslations('companyPermissionDenied'), {
          variant: 'error',
        })
        return 'deny'
      }

      return 'allow'
    },
    [accessibleCompanyIds, enqueueSnackbar, collaborationTranslations]
  )

  // Handle collaboration status changes
  const handleCollaborationStatusChange = useCallback((collaborating: boolean) => {
    setIsCollaborating(collaborating)
  }, [])

  // Company selection lock during collaboration
  useEffect(() => {
    const lockId = 'diagram-editor-collaboration-lock'
    if (isCollaborating) {
      const reason =
        collaborationTranslations('companySwitchLockedTooltip') ||
        'Stop live collaboration before switching companies.'
      setCompanySelectionLock(lockId, reason)
    } else {
      setCompanySelectionLock(lockId, null)
    }

    return () => {
      setCompanySelectionLock(lockId, null)
    }
  }, [collaborationTranslations, isCollaborating, setCompanySelectionLock])

  // Sidebar handlers
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const handleFindOnCanvas = useCallback(() => {
    // Small delay to ensure any menu closes before opening sidebar
    setTimeout(() => {
      sidebarRef.current?.openSearchTab()
    }, 50)
  }, [])

  // Handle Ctrl+F keyboard shortcut for canvas search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault()
        event.stopPropagation()
        handleFindOnCanvas()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleFindOnCanvas])

  // Create dynamic initialData that includes viewport state
  const baseInitialAppState = useMemo(() => {
    let viewportState = null
    try {
      const savedViewportState = loadViewportStateFromStorage()
      if (savedViewportState) {
        viewportState = savedViewportState
      }
    } catch (error) {
      console.warn('DiagramEditor: Failed to load viewport state:', error)
    }

    return {
      viewBackgroundColor: '#ffffff',
      collaborators: new Map(),
      selectedElementIds: {},
      hoveredElementIds: {},
      selectedGroupIds: {},
      selectedLinearElement: null,
      editingLinearElement: null,
      activeTool: { type: 'selection' },
      isLoading: false,
      errorMessage: null,
      currentItemFontSize: 20,
      currentItemTextAlign: 'left',
      currentItemStrokeColor: '#1e1e1e',
      currentItemBackgroundColor: 'transparent',
      currentItemFillStyle: 'solid',
      currentItemStrokeWidth: 2,
      currentItemStrokeStyle: 'solid',
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      ...(viewportState && {
        scrollX: viewportState.scrollX,
        scrollY: viewportState.scrollY,
        zoom: { value: viewportState.zoom },
      }),
    }
  }, [])

  const initialData = useMemo(() => {
    return {
      elements: [],
      appState: {
        ...baseInitialAppState,
        currentItemFontFamily: companyFontFamily,
      },
      scrollToContent: false,
    }
  }, [baseInitialAppState, companyFontFamily])

  // Debug log for initialData

  // Diagram Update Handler for new elements
  const handleDiagramUpdate = useCallback(
    (updatedDiagramData: string) => {
      if (!excalidrawAPI) {
        console.warn('Excalidraw API nicht verfügbar für Canvas-Update')
        return
      }

      try {
        const parsedData = JSON.parse(updatedDiagramData)
        const { elements, appState } = parsedData

        // Restore scene data to ensure proper structure
        const restoreSceneData = (sceneData: any) => {
          if (!sceneData || !sceneData.appState) {
            return sceneData
          }

          // Ensure collaborators is a Map
          if (
            sceneData.appState.collaborators &&
            typeof sceneData.appState.collaborators.clear === 'function'
          ) {
            sceneData.appState.collaborators.clear()
          } else {
            sceneData.appState.collaborators = new Map()
          }

          return sceneData
        }

        // Update the canvas with the new elements
        const restoredData = restoreSceneData({
          elements: normalizeElementsFont(elements || []),
          appState: {
            ...appState,
            currentItemFontFamily: companyFontFamily,
          },
        })
        excalidrawAPI.updateScene(restoredData)

        // Update current scene state
        setCurrentScene(restoredData)

        // Mark that there are no unsaved changes since we just saved
        setHasUnsavedChanges(false)

        setNotification({
          open: true,
          message: t('messages.elementsCreatedAndLinked'),
          severity: 'success',
        })
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Canvas:', error)
        setNotification({
          open: true,
          message: t('errors.updateElementsError'),
          severity: 'error',
        })
      }
    },
    [
      companyFontFamily,
      excalidrawAPI,
      normalizeElementsFont,
      setCurrentScene,
      setHasUnsavedChanges,
      setNotification,
      t,
    ]
  ) // LocalStorage-basiertes Diagramm laden beim Start
  useEffect(() => {
    const loadDiagramFromStorage = async () => {
      try {
        const pendingDiagram = localStorage.getItem('pendingDiagramToOpen')
        if (pendingDiagram && excalidrawAPI) {
          const diagramData = JSON.parse(pendingDiagram)

          // Entferne aus LocalStorage, damit es nur einmal geladen wird
          localStorage.removeItem('pendingDiagramToOpen')

          // Prüfe, ob diagramJson verfügbar ist
          if (diagramData.diagramJson) {
            // Diagramm hat bereits JSON-Daten, direkt laden
            handleOpenDiagram(diagramData)
          } else {
            // Diagramm benötigt noch JSON-Daten - setze erst die Metadaten
            setCurrentDiagram(diagramData)

            // Lade das komplette Diagramm über GraphQL
            try {
              const { data } = await apolloClient.query({
                query: GET_DIAGRAM,
                variables: { id: diagramData.id },
                fetchPolicy: 'network-only',
              })

              if (data?.diagrams?.[0]) {
                // Führe die vollständigen Diagrammdaten mit den bereits gesetzten Metadaten zusammen
                const fullDiagram = {
                  ...diagramData, // Metadaten aus LocalStorage
                  ...data.diagrams[0], // Vollständige Daten inklusive diagramJson aus GraphQL
                }
                handleOpenDiagram(fullDiagram)
              }
            } catch (error) {
              console.error('Fehler beim Laden der Diagramm-Daten:', error)
              setNotification({
                open: true,
                message: t('errors.loadDiagramError'),
                severity: 'error',
              })
            }
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Diagramms aus LocalStorage:', error)
        localStorage.removeItem('pendingDiagramToOpen') // Cleanup bei Fehler
      }
    }

    if (excalidrawAPI && isClient) {
      // Kleiner Delay um sicherzustellen, dass alles initialisiert ist
      setTimeout(loadDiagramFromStorage, 500)
    }
  }, [
    excalidrawAPI,
    isClient,
    handleOpenDiagram,
    setCurrentDiagram,
    setNotification,
    apolloClient,
    t,
  ])

  if (!isClient) {
    return null
  }

  return (
    <Box
      ref={containerRef}
      className={className}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Hauptcontainer für Excalidraw mit Sidebar */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Editor content wrapper */}
        <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
          {/* Diagram Name Display - positioned next to MainMenu */}
          <DiagramNameDisplay
            currentDiagram={currentDiagram}
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveClick={() => updateDialogState('saveDialogOpen', true)}
            isCollaborating={isCollaborating}
          />

          <ExcalidrawWrapper
            // Remove dynamic key to prevent controlled/uncontrolled input issueses
            // The component should persist throughout the app lifecycle
            onOpenDialog={() => updateDialogState('openDialogOpen', true)}
            onSaveDialog={() => updateDialogState('saveDialogOpen', true)}
            onSaveAsDialog={() => updateDialogState('saveAsDialogOpen', true)}
            onNewDiagram={handleNewDiagram}
            onDeleteDialog={() => updateDialogState('deleteDialogOpen', true)}
            onExportJSON={handleExportJSON}
            onExportDrawIO={handleExportDrawIO}
            onExportArchi={handleExportArchi}
            onImportJSON={handleImportJSON}
            onExportPNG={handleExportPNG}
            onManualSync={handleManualSync}
            onCapabilityMapGenerator={handleCapabilityMapGenerator}
            excalidrawAPI={handleExcalidrawAPI}
            onChange={handleChange}
            uiOptions={uiOptions}
            initialData={initialData}
            viewModeEnabled={isViewer()}
            currentDiagram={currentDiagram}
            onDiagramUpdate={handleCollaborationDiagramUpdate}
            onCollaborationStatusChange={handleCollaborationStatusChange}
            onStopCollaboration={handleStopCollaboration}
            onBroadcastReady={handleBroadcastReady}
            isLoadingRef={isLoadingRef}
            suppressOnChangeRef={suppressOnChangeRef}
            authorizeAccess={authorizeCollaborationAccess}
            selectedElementForRelatedElements={selectedElementForRelatedElements}
            onOpenAddRelatedElementsDialog={handleOpenAddRelatedElementsDialog}
            onCloseAddRelatedElementsDialog={handleCloseAddRelatedElementsDialog}
            isAddRelatedElementsDialogOpen={dialogStates.addRelatedElementsDialogOpen}
          />

          {/* Canvas Debug Overlay - nur in Entwicklungsumgebung */}
          {process.env.NODE_ENV === 'development' && excalidrawAPI && (
            <CanvasDebugOverlay
              excalidrawAPI={excalidrawAPI}
              selectedElementForRelatedElements={selectedElementForRelatedElements}
            />
          )}
        </Box>

        {/* Diagram Library Sidebar */}
        <DiagramLibrarySidebar
          ref={sidebarRef}
          excalidrawAPI={excalidrawAPI}
          defaultFontFamily={companyFontFamily}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
        />
      </Box>

      {/* Save Dialog - only for non-viewer users */}
      {!isViewer() && (
        <SaveDiagramDialog
          open={dialogStates.saveDialogOpen}
          onClose={() => updateDialogState('saveDialogOpen', false)}
          onSave={handleSaveDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
          onDiagramUpdate={handleDiagramUpdate}
        />
      )}

      {/* Save As Dialog - only for non-viewer users */}
      {!isViewer() && (
        <SaveDiagramDialog
          open={dialogStates.saveAsDialogOpen}
          onClose={() => updateDialogState('saveAsDialogOpen', false)}
          onSave={handleSaveAsDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
          forceSaveAs={true}
          onDiagramUpdate={handleDiagramUpdate}
        />
      )}

      {/* Open Dialog - available for all users */}
      <OpenDiagramDialog
        open={dialogStates.openDialogOpen}
        onClose={() => updateDialogState('openDialogOpen', false)}
        onOpen={handleOpenDiagram}
      />

      {/* Delete Dialog - only for non-viewer users */}
      {!isViewer() && (
        <DeleteDiagramDialog
          open={dialogStates.deleteDialogOpen}
          onClose={() => updateDialogState('deleteDialogOpen', false)}
          onDelete={handleDeleteDiagram}
          diagram={currentDiagram}
        />
      )}

      {/* Capability Map Generator Dialog - only for non-viewer users */}
      {!isViewer() && (
        <CapabilityMapGenerator
          open={dialogStates.capabilityMapGeneratorOpen}
          onClose={() => updateDialogState('capabilityMapGeneratorOpen', false)}
          onElementsGenerated={handleCapabilityMapGenerated}
        />
      )}

      {/* Benachrichtigungen */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DiagramEditor
