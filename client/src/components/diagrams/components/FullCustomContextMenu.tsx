import React, { useState, useEffect, useCallback } from 'react'
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import {
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
  Add as AddRelatedIcon,
  FlipToFront as BringToFrontIcon,
  FlipToBack as SendToBackIcon,
  FileCopy as DuplicateIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'

interface CustomContextMenuProps {
  excalidrawAPI: any
  onOpenAddRelatedElementsDialog: (element: any) => void
  onViewElement?: (element: any) => void
  onEditElement?: (element: any) => void
  viewModeEnabled?: boolean
  isViewerRole?: boolean
}

/**
 * Vollständiger Ersatz für das Excalidraw-Kontext-Menü
 * Bietet alle Standard-Funktionen plus unsere benutzerdefinierten Funktionen
 */
export const FullCustomContextMenu: React.FC<CustomContextMenuProps> = ({
  excalidrawAPI,
  onOpenAddRelatedElementsDialog,
  onViewElement,
  onEditElement,
  viewModeEnabled = false,
  isViewerRole = false,
}) => {
  const t = useTranslations()

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    selectedElements: any[]
    type: 'canvas' | 'element'
  } | null>(null)

  /**
   * Berechnet die optimale Position für das Kontextmenü,
   * damit es vollständig sichtbar bleibt
   */
  const calculateMenuPosition = useCallback(
    (mouseX: number, mouseY: number, hasSelection: boolean) => {
      // Dynamische Menü-Dimensionen basierend auf Inhalten
      const MENU_WIDTH = 200
      // Geschätzte Höhe basierend auf den Menüeinträgen
      const MENU_HEIGHT = hasSelection ? 350 : 120 // Erhöht für mehr Einträge bei Selektion
      const PADDING = 16 // Mindestabstand zum Rand      // Viewport-Dimensionen
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = mouseX
      let adjustedY = mouseY

      // Rechten Rand überprüfen
      if (mouseX + MENU_WIDTH + PADDING > viewportWidth) {
        adjustedX = mouseX - MENU_WIDTH
        // Falls das Menü auch links nicht passt, an den rechten Rand setzen
        if (adjustedX < PADDING) {
          adjustedX = viewportWidth - MENU_WIDTH - PADDING
        }
      }

      // Unteren Rand überprüfen
      if (mouseY + MENU_HEIGHT + PADDING > viewportHeight) {
        adjustedY = mouseY - MENU_HEIGHT
        // Falls das Menü auch oben nicht passt, an den unteren Rand setzen
        if (adjustedY < PADDING) {
          adjustedY = viewportHeight - MENU_HEIGHT - PADDING
        }
      }

      // Mindestabstände einhalten
      adjustedX = Math.max(PADDING, Math.min(adjustedX, viewportWidth - MENU_WIDTH - PADDING))
      adjustedY = Math.max(PADDING, Math.min(adjustedY, viewportHeight - MENU_HEIGHT - PADDING))

      return { x: adjustedX, y: adjustedY }
    },
    []
  )

  const handleRightClick = useCallback(
    (event: Event) => {
      const mouseEvent = event as MouseEvent

      if (!excalidrawAPI) return

      // Verhindere das Standard-Kontext-Menü
      event.preventDefault()
      event.stopPropagation()

      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        // Finde ausgewählte Elemente
        const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

        const menuType = selectedElements.length > 0 ? 'element' : 'canvas'
        const hasSelection = selectedElements.length > 0

        // Berechne die optimale Position für das Menü
        const { x: adjustedX, y: adjustedY } = calculateMenuPosition(
          mouseEvent.clientX,
          mouseEvent.clientY,
          hasSelection
        )

        console.log('FullCustomContextMenu Position Debug:', {
          original: { x: mouseEvent.clientX, y: mouseEvent.clientY },
          adjusted: { x: adjustedX, y: adjustedY },
          viewport: { width: window.innerWidth, height: window.innerHeight },
          hasSelection,
          selectedElementsCount: selectedElements.length,
        })

        setContextMenu({
          mouseX: adjustedX,
          mouseY: adjustedY,
          selectedElements,
          type: menuType,
        })
      } catch (error) {
        console.warn('Error in custom context menu handler:', error)
      }
    },
    [excalidrawAPI, calculateMenuPosition]
  )

  const handleClose = useCallback(() => {
    setContextMenu(null)
  }, [])

  // Standard-Aktionen
  const handleCut = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      // Direkte Verwendung der Excalidraw API
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      // Kopiere ausgewählte Elemente in die Zwischenablage
      const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

      // Simuliere Cut: Kopiere und lösche
      if (selectedElements.length > 0) {
        // Erstelle Kopie für Zwischenablage
        const elementsForClipboard = selectedElements.map((el: any) => ({
          ...el,
          id: `copy_${el.id}_${Date.now()}`,
        }))

        // Speichere in Zwischenablage (vereinfacht)
        ;(window as any).__excalidraw_clipboard = elementsForClipboard

        // Entferne Elemente aus der Szene
        const newElements = elements.filter((el: any) => !appState.selectedElementIds[el.id])

        excalidrawAPI.updateScene({
          elements: newElements,
          appState: { ...appState, selectedElementIds: {} },
        })
      }
    } catch (error) {
      console.warn('Cut action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  const handleCopy = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

      if (selectedElements.length > 0) {
        // Erstelle Kopie für Zwischenablage
        const elementsForClipboard = selectedElements.map((el: any) => ({
          ...el,
          id: `copy_${el.id}_${Date.now()}`,
        }))

        // Speichere in Zwischenablage
        ;(window as any).__excalidraw_clipboard = elementsForClipboard
      }
    } catch (error) {
      console.warn('Copy action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  const handlePaste = useCallback(() => {
    if (!excalidrawAPI) return

    try {
      // Hole Elemente aus der Zwischenablage
      const clipboardElements = (window as any).__excalidraw_clipboard

      if (clipboardElements && clipboardElements.length > 0) {
        const currentElements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        // Erstelle neue IDs und verschiebe die Elemente leicht
        const newElements = clipboardElements.map((el: any, index: number) => ({
          ...el,
          id: `paste_${el.id}_${Date.now()}_${index}`,
          x: el.x + 20,
          y: el.y + 20,
        }))

        // Füge neue Elemente zur Szene hinzu
        const allElements = [...currentElements, ...newElements]

        // Wähle die neuen Elemente aus
        const newSelectedIds = newElements.reduce((acc: any, el: any) => {
          acc[el.id] = true
          return acc
        }, {})

        excalidrawAPI.updateScene({
          elements: allElements,
          appState: { ...appState, selectedElementIds: newSelectedIds },
        })
      }
    } catch (error) {
      console.warn('Paste action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, handleClose])

  const handleDelete = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      // Filtere die ausgewählten Elemente heraus
      const newElements = elements.filter((el: any) => !appState.selectedElementIds[el.id])

      excalidrawAPI.updateScene({
        elements: newElements,
        appState: { ...appState, selectedElementIds: {} },
      })
    } catch (error) {
      console.warn('Delete action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  const handleDuplicate = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

      if (selectedElements.length > 0) {
        // Dupliziere die Elemente mit neuen IDs und leicht versetzter Position
        const duplicatedElements = selectedElements.map((el: any, index: number) => ({
          ...el,
          id: `duplicate_${el.id}_${Date.now()}_${index}`,
          x: el.x + 20,
          y: el.y + 20,
        }))

        const allElements = [...elements, ...duplicatedElements]

        // Wähle die duplizierten Elemente aus
        const newSelectedIds = duplicatedElements.reduce((acc: any, el: any) => {
          acc[el.id] = true
          return acc
        }, {})

        excalidrawAPI.updateScene({
          elements: allElements,
          appState: { ...appState, selectedElementIds: newSelectedIds },
        })
      }
    } catch (error) {
      console.warn('Duplicate action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  const handleBringToFront = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      const app = excalidrawAPI.getAppState?.()?.actionManager?.app || excalidrawAPI
      if (app && app.actionManager) {
        app.actionManager.executeAction('bringToFront')
      }
    } catch (error) {
      console.warn('Bring to front action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  const handleSendToBack = useCallback(() => {
    if (!excalidrawAPI || !contextMenu?.selectedElements.length) return

    try {
      const app = excalidrawAPI.getAppState?.()?.actionManager?.app || excalidrawAPI
      if (app && app.actionManager) {
        app.actionManager.executeAction('sendToBack')
      }
    } catch (error) {
      console.warn('Send to back action failed:', error)
    }
    handleClose()
  }, [excalidrawAPI, contextMenu, handleClose])

  // Benutzerdefinierte Aktion: Verwandte Elemente hinzufügen
  const handleAddRelatedElements = useCallback(() => {
    if (contextMenu?.selectedElements && contextMenu.selectedElements.length > 0) {
      // Finde das erste Element mit einer databaseId
      const elementWithDb = contextMenu.selectedElements.find(
        (el: any) => el.customData?.databaseId
      )

      if (elementWithDb) {
        onOpenAddRelatedElementsDialog(elementWithDb)
      }
    }
    handleClose()
  }, [contextMenu, onOpenAddRelatedElementsDialog, handleClose])

  const handleViewElement = useCallback(() => {
    if (contextMenu && onViewElement) {
      const elementWithDb = contextMenu.selectedElements.find(
        (el: any) => el.customData?.databaseId
      )
      if (elementWithDb) {
        onViewElement(elementWithDb)
      }
    }
    handleClose()
  }, [contextMenu, onViewElement, handleClose])

  const handleEditElement = useCallback(() => {
    if (contextMenu && onEditElement) {
      const elementWithDb = contextMenu.selectedElements.find(
        (el: any) => el.customData?.databaseId
      )
      if (elementWithDb) {
        onEditElement(elementWithDb)
      }
    }
    handleClose()
  }, [contextMenu, onEditElement, handleClose])

  // Event-Listener für Rechtsklick
  useEffect(() => {
    const handleDocumentRightClick = (event: Event) => {
      // Prüfe, ob der Rechtsklick innerhalb des Excalidraw-Canvas erfolgte
      const target = event.target as Element
      if (target?.closest('.excalidraw') || target?.closest('[data-testid="canvas"]')) {
        handleRightClick(event)
      }
    }

    document.addEventListener('contextmenu', handleDocumentRightClick, true)

    return () => {
      document.removeEventListener('contextmenu', handleDocumentRightClick, true)
    }
  }, [handleRightClick])

  // Schließe das Menü bei Klick außerhalb
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Schließe das Menü, wenn außerhalb geklickt wird
      const target = event.target as Element
      if (contextMenu && !target?.closest('[data-testid="custom-context-menu"]')) {
        handleClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && contextMenu) {
        handleClose()
      }
    }

    if (contextMenu) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [contextMenu, handleClose])

  if (!contextMenu) return null

  // Prüfe, ob Elemente ausgewählt sind
  const hasSelection = contextMenu.selectedElements.length > 0
  const hasDbElement = contextMenu.selectedElements.some((el: any) => el.customData?.databaseId)

  return (
    <Paper
      data-testid="custom-context-menu"
      sx={{
        position: 'fixed',
        top: contextMenu.mouseY,
        left: contextMenu.mouseX,
        zIndex: 9999,
        minWidth: 200,
        maxWidth: 300,
      }}
      elevation={8}
    >
      <MenuList dense>
        {/* Standard-Aktionen - nur bei Auswahl */}
        {hasSelection &&
          !viewModeEnabled && [
            <MenuItem key="cut" onClick={handleCut}>
              <ListItemIcon>
                <CutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.cut')}</ListItemText>
            </MenuItem>,

            <MenuItem key="copy" onClick={handleCopy}>
              <ListItemIcon>
                <CopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.copy')}</ListItemText>
            </MenuItem>,

            <MenuItem key="duplicate" onClick={handleDuplicate}>
              <ListItemIcon>
                <DuplicateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.duplicate')}</ListItemText>
            </MenuItem>,
          ]}

        {/* Paste - immer verfügbar (außer im View-Modus) */}
        {!viewModeEnabled && (
          <MenuItem onClick={handlePaste}>
            <ListItemIcon>
              <PasteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('diagrams.contextMenu.paste')}</ListItemText>
          </MenuItem>
        )}

        {/* Trennlinie nach Basis-Aktionen */}
        {((hasSelection && !viewModeEnabled) || !viewModeEnabled) && <Divider />}

        {/* View/Edit-Aktionen - nur für DB-Elemente */}
        {hasDbElement && (
          <MenuItem onClick={handleViewElement}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('diagrams.contextMenu.viewElement')}</ListItemText>
          </MenuItem>
        )}

        {hasDbElement && !viewModeEnabled && !isViewerRole && (
          <MenuItem onClick={handleEditElement}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('diagrams.contextMenu.editElement')}</ListItemText>
          </MenuItem>
        )}

        {/* Verwandte Elemente hinzufügen - nur für DB-Elemente */}
        {hasDbElement && !viewModeEnabled && (
          <MenuItem onClick={handleAddRelatedElements}>
            <ListItemIcon>
              <AddRelatedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('diagrams.contextMenu.addRelatedElements')}</ListItemText>
          </MenuItem>
        )}

        {/* Layer-Aktionen - nur bei Auswahl */}
        {hasSelection &&
          !viewModeEnabled && [
            <Divider key="divider-layer" />,
            <MenuItem key="bring-to-front" onClick={handleBringToFront}>
              <ListItemIcon>
                <BringToFrontIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.bringToFront')}</ListItemText>
            </MenuItem>,

            <MenuItem key="send-to-back" onClick={handleSendToBack}>
              <ListItemIcon>
                <SendToBackIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.sendToBack')}</ListItemText>
            </MenuItem>,
          ]}

        {/* Löschen - ganz am Ende */}
        {hasSelection &&
          !viewModeEnabled && [
            <Divider key="divider-delete" />,
            <MenuItem key="delete" onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('diagrams.contextMenu.delete')}</ListItemText>
            </MenuItem>,
          ]}
      </MenuList>
    </Paper>
  )
}
