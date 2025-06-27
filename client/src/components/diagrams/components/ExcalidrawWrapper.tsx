import React, { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { ExcalidrawComponentProps } from '../types/DiagramTypes'

// Dynamischer Import von Excalidraw, um Server-Side-Rendering zu vermeiden
const ExcalidrawWrapper = dynamic(
  async () => {
    // Wichtig: Zuerst das CSS importieren, dann die Komponente
    await import('@excalidraw/excalidraw/index.css')

    // Import dynamic theme system - this handles ALL styling including structure and colors
    const { injectExcalidrawThemeCSS } = await import('@/styles/excalidraw-dynamic-theme')

    const { Excalidraw, MainMenu } = await import('@excalidraw/excalidraw')

    const ExcalidrawComponent = ({
      onOpenDialog,
      onSaveDialog,
      onSaveAsDialog,
      onNewDiagram,
      onDeleteDialog,
      onExportJSON,
      onImportJSON,
      onExportPNG: _onExportPNG,
      onManualSync,
      onCapabilityMapGenerator,
      excalidrawAPI,
      onChange,
      uiOptions,
      initialData: _initialData, // Not used - scene updates happen via excalidrawAPI
      viewModeEnabled,
      currentDiagram,
    }: ExcalidrawComponentProps) => {
      const ExcalidrawTyped = Excalidraw as any
      const MainMenuTyped = MainMenu as any

      // Inject dynamic theme CSS based on environment variables
      React.useEffect(() => {
        injectExcalidrawThemeCSS()
      }, [])

      // Process initialData - use provided data or fallback to safe defaults
      const safeInitialData = useMemo(() => {
        console.log('ExcalidrawWrapper: Processing initialData', _initialData)

        if (_initialData && typeof _initialData === 'object') {
          // Use provided initialData but ensure safe structure
          const processedData = {
            elements: _initialData.elements || [],
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
              theme: 'light',
              zenModeEnabled: false,
              gridModeEnabled: false,
              viewModeEnabled: false,
              // Preserve scrollX, scrollY, and zoom from initialData
              ..._initialData.appState,
            },
            // Important: scrollToContent must be false to preserve viewport position
            scrollToContent: false,
          }

          console.log('ExcalidrawWrapper: Using provided initialData with viewport', {
            elementsCount: processedData.elements.length,
            scrollX: processedData.appState.scrollX,
            scrollY: processedData.appState.scrollY,
            zoom: processedData.appState.zoom?.value,
          })

          return processedData
        }

        // Fallback to empty scene
        const defaultData = {
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
            theme: 'light',
            zenModeEnabled: false,
            gridModeEnabled: false,
            viewModeEnabled: false,
          },
          scrollToContent: false,
        }

        console.log('ExcalidrawWrapper: Using default empty initialData')
        return defaultData
      }, [_initialData]) // Depend on actual initialData prop

      return (
        <div style={{ height: '100%', width: '100%' }}>
          <ExcalidrawTyped
            theme="light"
            name="simple-eam-diagram"
            UIOptions={uiOptions}
            initialData={safeInitialData}
            excalidrawAPI={excalidrawAPI}
            onChange={onChange}
            viewModeEnabled={viewModeEnabled}
          >
            <MainMenuTyped>
              {/* Custom New Diagram Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onNewDiagram}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                  }
                  shortcut="Ctrl+N"
                >
                  Neues Diagramm
                </MainMenuTyped.Item>
              )}

              {/* Custom Open Menu Item - available for all users */}
              <MainMenuTyped.Item
                onSelect={onOpenDialog}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                }
                shortcut="Ctrl+O"
              >
                Öffnen
              </MainMenuTyped.Item>

              {/* Custom Save Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onSaveDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                    </svg>
                  }
                  shortcut="Ctrl+S"
                >
                  {currentDiagram ? 'Speichern' : 'Speichern als...'}
                </MainMenuTyped.Item>
              )}

              {/* Custom Save As Menu Item - only for non-viewer users and when a diagram is loaded */}
              {!viewModeEnabled && currentDiagram && (
                <MainMenuTyped.Item
                  onSelect={onSaveAsDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M17,7H19V19H5V5H14V7H17M10,17L14,13L10.5,9.5L9.08,10.92L11.5,13.33L12.92,11.92L17,16V17H10Z" />
                    </svg>
                  }
                  shortcut="Ctrl+Shift+S"
                >
                  Speichern unter...
                </MainMenuTyped.Item>
              )}

              {/* Custom Delete Menu Item - only for non-viewer users and when a diagram is loaded */}
              {!viewModeEnabled && currentDiagram && (
                <MainMenuTyped.Item
                  onSelect={onDeleteDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  }
                  shortcut="Shift+Del"
                >
                  Löschen
                </MainMenuTyped.Item>
              )}

              {/* Manual Database Sync Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onManualSync}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                    </svg>
                  }
                  shortcut="Ctrl+R"
                >
                  DB Synchronisieren
                </MainMenuTyped.Item>
              )}

              {/* Capability Map Generator Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onCapabilityMapGenerator}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z M13,17V15H18V13H13V11L10,14L13,17Z M11,10V8H6V10H11V12L14,9L11,6V8Z" />
                    </svg>
                  }
                  shortcut="Ctrl+M"
                >
                  Capability Map generieren
                </MainMenuTyped.Item>
              )}

              {/* Separator */}
              <MainMenuTyped.Separator />

              {/* Custom Export JSON Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onExportJSON}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z M10,10V16H14V10H10Z" />
                    </svg>
                  }
                  shortcut="Ctrl+E"
                >
                  JSON exportieren
                </MainMenuTyped.Item>
              )}

              {/* Custom Import JSON Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onImportJSON}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z M10,10V16H14V10H10Z" />
                    </svg>
                  }
                  shortcut="Ctrl+I"
                >
                  JSON importieren
                </MainMenuTyped.Item>
              )}

              {/* Custom Export PNG Menu Item - available for all users */}
              <MainMenuTyped.Item
                onSelect={_onExportPNG}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,17L16,12H13V8H11V12H8L12,17Z" />
                  </svg>
                }
                shortcut="Ctrl+Shift+E"
              >
                PNG exportieren
              </MainMenuTyped.Item>
            </MainMenuTyped>
          </ExcalidrawTyped>
        </div>
      )
    }

    return ExcalidrawComponent
  },
  {
    ssr: false,
    loading: () => (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="h5">Lade Diagram-Editor...</Typography>
      </Box>
    ),
  }
)

export default ExcalidrawWrapper
