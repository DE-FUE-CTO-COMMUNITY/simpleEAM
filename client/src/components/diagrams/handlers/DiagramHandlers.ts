import { useCallback, useRef } from 'react'
import { useApolloClient } from '@apollo/client'
import { NotificationState } from '../types/DiagramTypes'
import {
  syncDiagramOnOpen,
  syncDiagramOnSave,
  clearMissingElementMarkers,
} from '../utils/databaseSyncUtils'
import {
  optimizeDiagramOnOpen,
  getDiagramOptimizationStats,
} from '../utils/diagramOptimizationUtils'
import {
  saveSceneToStorage,
  saveDiagramToStorage,
  saveLastSavedSceneToStorage,
  clearDiagramStorage,
  saveViewportStateToStorage,
  loadViewportStateFromStorage,
} from '../utils/DiagramStorageUtils'

// Handlers für alle Diagram-Operationen
export const useDiagramHandlers = (
  excalidrawAPI: any,
  currentDiagram: any,
  setCurrentDiagram: (diagram: any) => void,
  setCurrentScene: (scene: any) => void,
  setHasUnsavedChanges: (hasChanges: boolean) => void,
  setLastSavedScene: (scene: any) => void,
  setNotification: (notification: NotificationState) => void,
  _setSaveDialogOpen: (open: boolean) => void,
  _setSaveAsDialogOpen: (open: boolean) => void,
  _lastSavedScene: any
) => {
  const apolloClient = useApolloClient()

  // Ref to track if we're currently saving to prevent onChange from setting hasUnsavedChanges
  const isSavingRef = useRef(false)

  // Ref to track if we're currently loading a diagram to prevent onChange from setting hasUnsavedChanges
  const isLoadingRef = useRef(false)

  // Ref to track the timestamp when we last completed a load operation
  const lastLoadCompletedRef = useRef<number>(0)

  // Add debugging to track potential sources of onChange events
  const logChangeSource = useCallback((source: string, additionalInfo?: any) => {
    const timestamp = new Date().toISOString()
    const timeSinceLastLoad = Date.now() - lastLoadCompletedRef.current
    console.log(`🔍 [${timestamp}] Change source: ${source}`)
    console.log(`  - timeSinceLastLoad: ${timeSinceLastLoad}ms`)
    if (additionalInfo) {
      console.log(`  - additionalInfo:`, additionalInfo)
    }
  }, [])

  // New Diagram Handler
  const handleNewDiagram = useCallback(() => {
    if (!excalidrawAPI) return

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
      },
    }
    const restoredScene = restoreSceneData(emptyScene)

    // Set loading flag to prevent onChange from setting hasUnsavedChanges during scene update
    isLoadingRef.current = true

    // Sofort die Excalidraw-Szene aktualisieren
    excalidrawAPI.updateScene(restoredScene)

    // State-Updates können asynchron erfolgen
    setTimeout(() => {
      setCurrentDiagram(null)
      setCurrentScene(restoredScene)
      setHasUnsavedChanges(false)
      setLastSavedScene(restoredScene)

      // Clear localStorage
      clearDiagramStorage()

      // Explicitly ensure hasUnsavedChanges is false after all operations
      setTimeout(() => {
        console.log('🔒 Final reset: ensuring hasUnsavedChanges is false after new diagram')
        setHasUnsavedChanges(false)
        isLoadingRef.current = false
        // Set timestamp to start cooldown period
        lastLoadCompletedRef.current = Date.now()
        console.log(`⏰ Load cooldown period started (new diagram) at ${new Date().toISOString()}`)
      }, 50)
    }, 0)

    setNotification({
      open: true,
      message: 'Neues Diagramm erstellt',
      severity: 'info',
    })
  }, [
    excalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
  ])

  // Delete Diagram Handler
  const handleDeleteDiagram = useCallback(() => {
    // Reset the current diagram and clear canvas
    setCurrentDiagram(null)
    const emptyScene = {
      elements: [],
      appState: {
        viewBackgroundColor: '#ffffff',
        collaborators: new Map(),
        selectedElementIds: {},
        hoveredElementIds: {},
        selectedGroupIds: {},
        activeTool: { type: 'selection' },
      },
    }
    const restoredScene = restoreSceneData(emptyScene)
    if (excalidrawAPI) {
      excalidrawAPI.updateScene(restoredScene)
    }
    setCurrentScene(restoredScene)

    // Clear localStorage
    clearDiagramStorage()

    setNotification({
      open: true,
      message: 'Diagramm erfolgreich gelöscht',
      severity: 'success',
    })
  }, [excalidrawAPI, setCurrentDiagram, setCurrentScene, setNotification])

  // Open Diagram Handler
  const handleOpenDiagram = useCallback(
    async (diagram: any) => {
      console.log('handleOpenDiagram aufgerufen', diagram?.id)

      // Set loading flag IMMEDIATELY to prevent ANY onChange calls during the entire opening process
      isLoadingRef.current = true

      // Auf globale API-Referenz zurückgreifen, wenn nötig
      const api = excalidrawAPI || (window as any).__excalidrawAPI

      if (!api || !diagram.diagramJson) {
        console.warn('Cannot open diagram: missing API or diagram data', {
          excalidrawAPIExists: !!api,
          diagramJsonExists: !!diagram.diagramJson,
        })
        // Reset loading flag on early exit
        isLoadingRef.current = false
        setNotification({
          open: true,
          message: 'Diagramm kann nicht geöffnet werden - fehlende Daten',
          severity: 'error',
        })
        return
      }

      try {
        console.log('handleOpenDiagram wird ausgeführt mit:', {
          diagramId: diagram.id,
          title: diagram.title,
          apiReady: !!api,
          jsonLength: diagram.diagramJson.length,
        })

        // Parse the diagram JSON data
        const diagramData = JSON.parse(diagram.diagramJson)
        console.log('Diagramm-JSON erfolgreich geparst', {
          elementCount: diagramData.elements?.length || 0,
          hasAppState: !!diagramData.appState,
        })

        // Optimize diagram data by replacing originalElement with elementName
        const optimizedDiagramData = optimizeDiagramOnOpen(diagramData)
        const optimizationStats = getDiagramOptimizationStats(diagramData, optimizedDiagramData)

        if (optimizationStats.optimizedCount > 0) {
          console.log('Diagramm-Optimierung durchgeführt:', {
            elementsOptimized: optimizationStats.optimizedCount,
            totalElementsWithElementName: optimizationStats.elementsWithElementName,
            remainingOriginalElements: optimizationStats.optimizedElementsWithOriginalElement,
          })
        }

        // Try to sync from database with Docker-safe error handling
        let syncedDiagramData
        try {
          syncedDiagramData = await syncDiagramOnOpen(apolloClient, optimizedDiagramData)
          console.log('Datenbank-Sync erfolgreich')
        } catch (syncError) {
          console.warn('Database sync failed, using local data:', syncError)
          syncedDiagramData = optimizedDiagramData
        }

        const sceneData = {
          elements: syncedDiagramData.elements || [],
          appState: {
            ...syncedDiagramData.appState,
            viewBackgroundColor: syncedDiagramData.appState?.viewBackgroundColor || '#ffffff',
            // Docker-safe state restoration - reset problematic properties
            collaborators: new Map(),
            selectedElementIds: {},
            hoveredElementIds: {},
            selectedGroupIds: {},
            selectedLinearElement: null,
            editingLinearElement: null,
            activeTool: { type: 'selection' },
            isLoading: false,
            errorMessage: null,
          },
        }

        // Restore viewport state (position and zoom) if available
        let savedViewportState = null
        savedViewportState = loadViewportStateFromStorage()
        if (savedViewportState) {
          sceneData.appState.scrollX = savedViewportState.scrollX
          sceneData.appState.scrollY = savedViewportState.scrollY
          sceneData.appState.zoom = { value: savedViewportState.zoom }
        }

        const restoredScene = restoreSceneData(sceneData)
        console.log('Szene für das Rendering vorbereitet', {
          elementsCount: restoredScene.elements?.length || 0,
          hasAppState: !!restoredScene.appState,
        })

        // Sicherstellen, dass die Excalidraw-API-Methoden verfügbar sind
        if (typeof api.updateScene !== 'function') {
          console.error('Excalidraw API fehlt updateScene-Methode!')
          // Reset loading flag on error
          isLoadingRef.current = false
          setNotification({
            open: true,
            message: 'Fehler beim Öffnen des Diagramms: Excalidraw API nicht bereit',
            severity: 'error',
          })
          return
        }

        // Sofort die Excalidraw-Szene aktualisieren (mit integrierter Viewport-Position)
        try {
          console.log('Aktualisiere Excalidraw-Szene...')
          api.updateScene(restoredScene)
          console.log('Excalidraw-Szene erfolgreich aktualisiert')
        } catch (updateError) {
          console.error('Fehler beim Aktualisieren der Excalidraw-Szene:', updateError)
          // Reset loading flag on error
          isLoadingRef.current = false
          setNotification({
            open: true,
            message: 'Fehler beim Aktualisieren der Diagrammansicht',
            severity: 'error',
          })
          return
        }

        // Delay state updates to prevent premature onChange calls
        const updateStateAndViewport = () => {
          // State-Updates nach allen Scene-Updates ausführen
          console.log('Aktualisiere Diagramm-Status...')
          console.log('Diagramm-Architektur beim Laden:', diagram.architecture)

          setCurrentDiagram(diagram)
          setCurrentScene(restoredScene)
          setHasUnsavedChanges(false)
          setLastSavedScene(restoredScene)

          // Persist to localStorage
          saveSceneToStorage(restoredScene)
          saveDiagramToStorage(diagram)
          console.log('Diagramm-Status erfolgreich aktualisiert und im localStorage gespeichert')

          setNotification({
            open: true,
            message: `Diagramm "${diagram.title}" erfolgreich geladen!`,
            severity: 'success',
          })
        }

        // Apply viewport state with delay to ensure it takes effect after Excalidraw initialization
        if (savedViewportState) {
          setTimeout(() => {
            try {
              console.log('Wende Viewport-Einstellungen an...')
              // Loading flag should still be set from the main updateScene call

              api.updateScene({
                appState: {
                  scrollX: savedViewportState.scrollX,
                  scrollY: savedViewportState.scrollY,
                  zoom: { value: savedViewportState.zoom },
                },
              })
              console.log('Viewport-Einstellungen erfolgreich angewendet')

              // Update state after viewport is applied
              setTimeout(() => {
                updateStateAndViewport()
                // Explicitly ensure hasUnsavedChanges is false after loading is complete
                setTimeout(() => {
                  console.log(
                    '🔒 Final reset: ensuring hasUnsavedChanges is false after diagram load'
                  )
                  setHasUnsavedChanges(false)
                  isLoadingRef.current = false
                  // Set timestamp to start cooldown period
                  lastLoadCompletedRef.current = Date.now()
                  console.log(`⏰ Load cooldown period started at ${new Date().toISOString()}`)
                }, 100)
              }, 50)
            } catch (viewportError) {
              console.warn('Fehler beim Anwenden der Viewport-Einstellungen:', viewportError)
              // Update state even on viewport error
              updateStateAndViewport()
              // Explicitly ensure hasUnsavedChanges is false even on error
              setTimeout(() => {
                console.log('🔒 Final reset on error: ensuring hasUnsavedChanges is false')
                setHasUnsavedChanges(false)
                isLoadingRef.current = false
                // Set timestamp to start cooldown period even on error
                lastLoadCompletedRef.current = Date.now()
                console.log(
                  `⏰ Load cooldown period started (after error) at ${new Date().toISOString()}`
                )
              }, 50)
            }
          }, 300) // Increased delay to ensure Excalidraw has finished its initial setup
        } else {
          // No viewport update needed, update state immediately
          setTimeout(() => {
            updateStateAndViewport()
            // Explicitly ensure hasUnsavedChanges is false after loading is complete
            setTimeout(() => {
              console.log(
                '🔒 Final reset: ensuring hasUnsavedChanges is false after diagram load (no viewport)'
              )
              setHasUnsavedChanges(false)
              isLoadingRef.current = false
              // Set timestamp to start cooldown period
              lastLoadCompletedRef.current = Date.now()
              console.log(
                `⏰ Load cooldown period started (no viewport) at ${new Date().toISOString()}`
              )
            }, 100)
          }, 100)
        }
      } catch (err) {
        console.error('Error opening diagram:', err)
        // Reset loading flag on error
        isLoadingRef.current = false
        setNotification({
          open: true,
          message: 'Fehler beim Öffnen des Diagramms',
          severity: 'error',
        })
      }
    },
    [
      apolloClient,
      excalidrawAPI,
      setCurrentDiagram,
      setCurrentScene,
      setHasUnsavedChanges,
      setLastSavedScene,
      setNotification,
    ]
  )

  // Save Diagram Handler
  const handleSaveDiagram = useCallback(
    async (savedDiagram: any) => {
      if (!excalidrawAPI) return

      try {
        // Set saving flag to prevent onChange from setting hasUnsavedChanges to true
        isSavingRef.current = true

        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        const sceneData = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        }

        // Try to sync to database with error handling
        try {
          await syncDiagramOnSave(apolloClient, sceneData)
        } catch (syncError) {
          console.warn('Database sync failed during save:', syncError)
          // Continue with local saving even if sync fails
        }

        setCurrentDiagram(savedDiagram)
        setHasUnsavedChanges(false)
        setLastSavedScene(sceneData)

        // Persist to localStorage
        saveSceneToStorage(sceneData)
        saveDiagramToStorage(savedDiagram)
        saveLastSavedSceneToStorage(sceneData)

        setNotification({
          open: true,
          message: `Diagramm "${savedDiagram.title}" erfolgreich gespeichert!`,
          severity: 'success',
        })

        // Reset saving flag after a short delay to ensure all onChange events have been processed
        setTimeout(() => {
          isSavingRef.current = false
        }, 100)
      } catch (err) {
        console.error('Error saving diagram:', err)
        // Reset saving flag on error
        isSavingRef.current = false
        setNotification({
          open: true,
          message: 'Fehler beim Speichern des Diagramms',
          severity: 'error',
        })
      }
    },
    [
      apolloClient,
      excalidrawAPI,
      setCurrentDiagram,
      setHasUnsavedChanges,
      setLastSavedScene,
      setNotification,
    ]
  )

  // Save As Diagram Handler
  const handleSaveAsDiagram = useCallback(
    (savedDiagram: any) => {
      // Set saving flag briefly for consistency
      isSavingRef.current = true

      setCurrentDiagram(savedDiagram)
      setHasUnsavedChanges(false) // Also reset unsaved changes for Save As

      // Persist current diagram to localStorage
      saveDiagramToStorage(savedDiagram)

      setNotification({
        open: true,
        message: `Diagramm "${savedDiagram.title}" erfolgreich als Kopie gespeichert!`,
        severity: 'success',
      })

      // Reset saving flag
      setTimeout(() => {
        isSavingRef.current = false
      }, 100)
    },
    [setCurrentDiagram, setHasUnsavedChanges, setNotification]
  )

  // Change Handler - uses Excalidraw's native onChange to detect ANY change
  const handleChange = useCallback(
    (elements: any[], appState: any) => {
      // Enhanced debugging - log the call stack to see what triggered onChange
      const timestamp = new Date().toISOString()
      const timeSinceLastLoad = Date.now() - lastLoadCompletedRef.current

      console.log(`🔍 [${timestamp}] handleChange called:`)
      console.log(`  - timeSinceLastLoad: ${timeSinceLastLoad}ms`)
      console.log(`  - currentDiagram: ${currentDiagram?.id || 'none'}`)
      console.log(`  - isSaving: ${isSavingRef.current}`)
      console.log(`  - isLoading: ${isLoadingRef.current}`)
      console.log(`  - elements count: ${elements?.length || 0}`)
      console.log(`  - appState keys:`, appState ? Object.keys(appState) : 'none')

      // Log the call stack to see what triggered this onChange
      if (
        timeSinceLastLoad > 2000 &&
        currentDiagram &&
        !isSavingRef.current &&
        !isLoadingRef.current
      ) {
        console.log(
          `🚨 POTENTIAL ISSUE: onChange triggered ${timeSinceLastLoad}ms after load completion!`
        )
        console.trace('Call stack for onChange trigger:')
      }

      // Save viewport state (scrollX, scrollY, zoom) to localStorage whenever it changes
      // Use a debounced approach to avoid excessive localStorage writes
      if (
        appState &&
        typeof appState.scrollX === 'number' &&
        typeof appState.scrollY === 'number' &&
        appState.zoom?.value
      ) {
        const viewportState = {
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
          zoom: appState.zoom.value, // Extract the actual zoom value
        }

        // Only save if viewport has actually changed to avoid excessive writes
        const existingState = loadViewportStateFromStorage()
        const viewportChanged =
          !existingState ||
          Math.abs(existingState.scrollX - viewportState.scrollX) > 1 ||
          Math.abs(existingState.scrollY - viewportState.scrollY) > 1 ||
          Math.abs(existingState.zoom - viewportState.zoom) > 0.01

        if (viewportChanged) {
          console.log(
            `📍 Viewport changed: scroll(${viewportState.scrollX}, ${viewportState.scrollY}), zoom(${viewportState.zoom})`
          )
          saveViewportStateToStorage(viewportState)
        }
      }

      // Check if we're in a cooldown period after loading (ignore onChange for 2 seconds after load completion)
      const isInLoadCooldown = timeSinceLastLoad < 2000 // 2 seconds cooldown

      if (isInLoadCooldown) {
        console.log(
          `⏳ Ignoring onChange during load cooldown period (${timeSinceLastLoad}ms since load)`
        )
        return
      }

      // Track changes if we have a current diagram loaded and we're not currently saving or loading
      // When Excalidraw calls onChange, it means something has changed - mark as unsaved
      if (currentDiagram && !isSavingRef.current && !isLoadingRef.current) {
        console.log(
          `💾 Diagrammänderung erkannt (${timeSinceLastLoad}ms nach Laden), markiere als ungespeichert`
        )
        setHasUnsavedChanges(true)

        // Create scene data for persistence without triggering state update
        const currentScene = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        }

        // Persist current state to localStorage for crash recovery only
        // Do NOT call setCurrentScene here to prevent infinite loops
        saveSceneToStorage(currentScene)
      }
    },
    [currentDiagram, setHasUnsavedChanges]
  )

  // JSON Export Handler
  const handleExportJSON = useCallback(() => {
    if (excalidrawAPI) {
      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        const exportData = {
          type: 'excalidraw',
          version: 2,
          source: 'simple-eam',
          elements: elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: appState.currentItemFontFamily,
            currentItemFontSize: appState.currentItemFontSize,
            currentItemTextAlign: appState.currentItemTextAlign,
            currentItemStrokeColor: appState.currentItemStrokeColor,
            currentItemBackgroundColor: appState.currentItemBackgroundColor,
            currentItemFillStyle: appState.currentItemFillStyle,
            currentItemStrokeWidth: appState.currentItemStrokeWidth,
            currentItemStrokeStyle: appState.currentItemStrokeStyle,
            currentItemRoughness: appState.currentItemRoughness,
            currentItemOpacity: appState.currentItemOpacity,
            gridSize: appState.gridSize,
            showGrid: appState.showGrid,
            zenModeEnabled: appState.zenModeEnabled,
            theme: appState.theme,
          },
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = currentDiagram
          ? `${currentDiagram.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.excalidraw`
          : 'diagram.excalidraw'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()

        setNotification({
          open: true,
          message: 'JSON erfolgreich exportiert!',
          severity: 'success',
        })
      } catch (err) {
        console.error('Error exporting JSON:', err)
        setNotification({
          open: true,
          message: 'Fehler beim JSON Export',
          severity: 'error',
        })
      }
    }
  }, [excalidrawAPI, currentDiagram, setNotification])

  // JSON Import Handler
  const handleImportJSON = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.excalidraw,.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async (e: any) => {
          try {
            const importedData = JSON.parse(e.target.result)

            if (!importedData.elements || !excalidrawAPI) {
              throw new Error('Invalid file format')
            }

            setNotification({
              open: true,
              message: 'JSON Import wird verarbeitet...',
              severity: 'info',
            })

            // Importiere ID-Mapping-Funktionalität
            const { processImportedDiagramData } = await import('../utils/importIdMappingUtils')

            // Verarbeite importierte Daten und mappe IDs bei Bedarf
            const { processedData, mappings, summary } = await processImportedDiagramData(
              apolloClient,
              {
                elements: importedData.elements,
                appState: importedData.appState || { viewBackgroundColor: '#ffffff' },
              }
            )

            const restoredScene = restoreSceneData(processedData)
            excalidrawAPI.updateScene(restoredScene)
            setCurrentScene(restoredScene)

            // Clear current diagram since this is an import
            setCurrentDiagram(null)
            clearDiagramStorage()

            // Zeige detaillierte Erfolgs-Nachricht mit ID-Mapping-Info
            const successMessage =
              mappings.length > 0
                ? `JSON erfolgreich importiert!\n\n${summary}`
                : 'JSON erfolgreich importiert!'

            setNotification({
              open: true,
              message: successMessage,
              severity: 'success',
            })

            // Zusätzliche Warnung bei ID-Mappings
            if (mappings.length > 0) {
              setTimeout(() => {
                setNotification({
                  open: true,
                  message: `Hinweis: ${mappings.length} Element-IDs wurden automatisch an die lokale Datenbank angepasst. Bitte prüfen Sie die Elemente.`,
                  severity: 'warning',
                })
              }, 3000)
            }
          } catch (err) {
            console.error('Error importing JSON:', err)
            setNotification({
              open: true,
              message: `Fehler beim JSON Import: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
              severity: 'error',
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [apolloClient, excalidrawAPI, setCurrentScene, setCurrentDiagram, setNotification])

  // PNG Export Handler
  const handleExportPNG = useCallback(async () => {
    if (!excalidrawAPI) {
      setNotification({
        open: true,
        message: 'Excalidraw API nicht verfügbar',
        severity: 'error',
      })
      return
    }

    try {
      // Import export function dynamically
      const { exportToBlob } = await import('@excalidraw/excalidraw')

      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const files = excalidrawAPI.getFiles()

      if (!elements || elements.length === 0) {
        setNotification({
          open: true,
          message: 'Keine Elemente zum Exportieren vorhanden',
          severity: 'warning',
        })
        return
      }

      setNotification({
        open: true,
        message: 'PNG Export wird vorbereitet...',
        severity: 'info',
      })

      // Export to PNG blob
      const blob = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
          exportWithDarkMode: false,
          exportEmbedScene: false, // Don't embed scene data to keep file size smaller
        },
        files,
        mimeType: 'image/png',
        quality: 0.95,
        exportPadding: 20, // Add some padding around the drawing
      })

      if (!blob) {
        throw new Error('Export failed - no blob generated')
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
      const filename = currentDiagram
        ? `${currentDiagram.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.png`
        : `diagram_${timestamp}.png`

      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      URL.revokeObjectURL(url)

      setNotification({
        open: true,
        message: `PNG erfolgreich exportiert: ${filename}`,
        severity: 'success',
      })
    } catch (err) {
      console.error('Error exporting PNG:', err)
      setNotification({
        open: true,
        message: `Fehler beim PNG Export: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        severity: 'error',
      })
    }
  }, [excalidrawAPI, currentDiagram, setNotification])

  // Manual Sync Handler
  const handleManualSync = useCallback(async () => {
    if (!excalidrawAPI) {
      setNotification({
        open: true,
        message: 'Excalidraw API nicht verfügbar',
        severity: 'error',
      })
      return
    }

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      const sceneData = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
        },
      }

      // Use syncDiagramOnOpen for manual synchronization (loads fresh data from database)
      const syncedDiagramData = await syncDiagramOnOpen(apolloClient, sceneData)

      // Clear any missing element markers if no missing elements found
      const cleanedElements = clearMissingElementMarkers(syncedDiagramData.elements)

      // Update the scene with synced and cleaned elements
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({
          elements: cleanedElements,
          appState: {
            ...syncedDiagramData.appState,
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        })
      }

      setNotification({
        open: true,
        message: 'Datenbankssynchronisation erfolgreich abgeschlossen!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Manual sync failed:', err)
      setNotification({
        open: true,
        message: `Fehler bei der Datenbank-Synchronisation: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        severity: 'error',
      })
    }
  }, [apolloClient, excalidrawAPI, setNotification])

  return {
    handleNewDiagram,
    handleDeleteDiagram,
    handleOpenDiagram,
    handleSaveDiagram,
    handleSaveAsDiagram,
    handleChange,
    handleExportJSON,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
  }
}

// Helper function that was in the original component
const restoreSceneData = (sceneData: any) => {
  if (!sceneData || !sceneData.appState) {
    return sceneData
  }

  // Remove problematic properties that can cause issues in Docker environments
  if (
    sceneData.appState.collaborators &&
    typeof sceneData.appState.collaborators.clear === 'function'
  ) {
    sceneData.appState.collaborators.clear()
  } else {
    sceneData.appState.collaborators = new Map()
  }

  // Initialize editing states ONLY if they are undefined/null to prevent controlled/uncontrolled issues
  // DO NOT reset existing valid values as this causes React warnings
  if (
    sceneData.appState.selectedElementIds === undefined ||
    sceneData.appState.selectedElementIds === null
  ) {
    sceneData.appState.selectedElementIds = {}
  }
  if (
    sceneData.appState.hoveredElementIds === undefined ||
    sceneData.appState.hoveredElementIds === null
  ) {
    sceneData.appState.hoveredElementIds = {}
  }
  if (
    sceneData.appState.selectedGroupIds === undefined ||
    sceneData.appState.selectedGroupIds === null
  ) {
    sceneData.appState.selectedGroupIds = {}
  }
  if (sceneData.appState.selectedLinearElement === undefined) {
    sceneData.appState.selectedLinearElement = null
  }
  if (sceneData.appState.editingLinearElement === undefined) {
    sceneData.appState.editingLinearElement = null
  }
  // Ensure proper timing-independent state
  if (sceneData.appState.isLoading === undefined || sceneData.appState.isLoading === null) {
    sceneData.appState.isLoading = false
  }
  if (sceneData.appState.errorMessage === undefined) {
    sceneData.appState.errorMessage = null
  }

  return sceneData
}
