import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'
import { ExcalidrawComponentProps } from '../types/DiagramTypes'
import { useThemeMode } from '@/contexts/ThemeContext'
import ExcalidrawLoading from './ExcalidrawLoading'

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

      // Store the API reference for internal use
      const apiRef = React.useRef<any>(null)

      // Hook für Theme-Modus (wird innerhalb der Komponente verwendet)
      const { mode: themeMode } = useThemeMode()

      // Hook für aktuelle Sprache
      const locale = useLocale()
      const t = useTranslations('diagrams')

      // Konvertiere locale zu Excalidraw langCode Format
      const excalidrawLangCode = useMemo(() => {
        switch (locale) {
          case 'de':
            return 'de-DE'
          case 'en':
            return 'en'
          default:
            return 'de-DE'
        }
      }, [locale])

      // Handle excalidrawAPI prop - store the API reference
      React.useEffect(() => {
        if (excalidrawAPI && apiRef.current) {
          excalidrawAPI(apiRef.current)
        }
      }, [excalidrawAPI])

      // Inject dynamic theme CSS based on environment variables and current theme mode
      React.useEffect(() => {
        injectExcalidrawThemeCSS(themeMode)
      }, [themeMode])

      // Process initialData - use provided data or fallback to safe defaults
      const safeInitialData = useMemo(() => {
        if (_initialData && typeof _initialData === 'object') {
          // Use provided initialData but ensure safe structure
          const processedData = {
            elements: _initialData.elements || [],
            appState: {
              viewBackgroundColor: themeMode === 'dark' ? '#121212' : '#ffffff',
              collaborators: new Map(),
              selectedElementIds: {},
              hoveredElementIds: {},
              selectedGroupIds: {},
              selectedLinearElement: null,
              editingLinearElement: null,
              activeTool: { type: 'selection' },
              isLoading: false,
              errorMessage: null,
              zenModeEnabled: false,
              gridModeEnabled: false,
              viewModeEnabled: false,
              // Preserve scrollX, scrollY, and zoom from initialData
              ..._initialData.appState,
              // Override theme to ensure it matches current mode
              theme: themeMode,
            },
            // Important: scrollToContent must be false to preserve viewport position
            scrollToContent: false,
          }

          return processedData
        }

        // Fallback to empty scene
        const defaultData = {
          elements: [],
          appState: {
            viewBackgroundColor: themeMode === 'dark' ? '#121212' : '#ffffff',
            collaborators: new Map(),
            selectedElementIds: {},
            hoveredElementIds: {},
            selectedGroupIds: {},
            selectedLinearElement: null,
            editingLinearElement: null,
            activeTool: { type: 'selection' },
            isLoading: false,
            errorMessage: null,
            theme: themeMode,
            zenModeEnabled: false,
            gridModeEnabled: false,
            viewModeEnabled: false,
          },
          scrollToContent: false,
        }

        return defaultData
      }, [_initialData, themeMode]) // Depend on actual initialData prop and theme mode

      return (
        <div style={{ height: '100%', width: '100%' }}>
          <ExcalidrawTyped
            theme={themeMode}
            langCode={excalidrawLangCode}
            name="simple-eam-diagram"
            UIOptions={uiOptions}
            initialData={safeInitialData}
            excalidrawAPI={(api: any) => {
              // Store the API reference for internal use
              apiRef.current = api
              // Also call the original excalidrawAPI if provided
              if (excalidrawAPI) {
                excalidrawAPI(api)
              }
            }}
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
                  {t('actions.new')}
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
                {t('actions.open')}
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
                  {currentDiagram ? t('actions.save') : t('actions.saveAs')}
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
                  {t('actions.saveAs')}
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
                  {t('actions.delete')}
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
                  {t('actions.syncDatabase')}
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
                  {t('actions.generateCapabilityMap')}
                </MainMenuTyped.Item>
              )}

              {/* Find on Canvas Menu Item - available for all users */}
              <MainMenuTyped.Item
                onSelect={() => {
                  // Use the API to open the search sidebar
                  if (apiRef.current) {
                    // Open search sidebar using the action manager
                    apiRef.current.updateScene({
                      appState: {
                        ...apiRef.current.getAppState(),
                        openSidebar: {
                          name: 'default',
                          tab: 'search',
                        },
                        openDialog: null,
                      },
                    })
                  }
                }}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                }
                shortcut="Ctrl+F"
              >
                {t('actions.findOnCanvas')}
              </MainMenuTyped.Item>

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
                  {t('actions.exportJSON')}
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
                  {t('actions.importJSON')}
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
                {t('actions.exportPNG')}
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
    loading: () => <ExcalidrawLoading />,
  }
)

export default ExcalidrawWrapper
