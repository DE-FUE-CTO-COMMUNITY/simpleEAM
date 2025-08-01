import React, { useState, useEffect, useCallback } from 'react'
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

interface CustomContextMenuProps {
  excalidrawAPI: any
  onOpenAddRelatedElementsDialog: (element: any) => void
  viewModeEnabled?: boolean
}

/**
 * Custom Context Menu Overlay, das über dem Standard-Kontext-Menü erscheint
 * und zusätzliche Optionen für Datenbank-Elemente bietet
 */
export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  excalidrawAPI,
  onOpenAddRelatedElementsDialog,
  viewModeEnabled = false,
}) => {
  const t = useTranslations()
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    element: any
  } | null>(null)

  /**
   * Berechnet die optimale Position für das Kontextmenü,
   * damit es vollständig sichtbar bleibt
   */
  const calculateMenuPosition = useCallback((mouseX: number, mouseY: number) => {
    // Geschätzte Menü-Dimensionen (diese könnten dynamisch gemessen werden)
    const MENU_WIDTH = 200
    const MENU_HEIGHT = 150 // Erhöht für bessere Abschätzung
    const PADDING = 16 // Erhöhter Mindestabstand zum Rand

    // Viewport-Dimensionen
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
  }, [])

  const handleRightClick = useCallback(
    (event: Event) => {
      const mouseEvent = event as MouseEvent
      // Verhindere das Standard-Kontext-Menü nur, wenn wir ein geeignetes Element haben
      if (!excalidrawAPI || viewModeEnabled) return

      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        // Finde ausgewählte Elemente
        const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

        console.log('Context Menu Debug:', {
          selectedElementsCount: selectedElements.length,
          selectedElements: selectedElements.map((el: any) => ({
            id: el.id,
            type: el.type,
            hasCustomData: !!el.customData,
            databaseId: el.customData?.databaseId,
          })),
          mousePosition: { x: mouseEvent.clientX, y: mouseEvent.clientY },
        })

        if (selectedElements.length === 1) {
          const element = selectedElements[0]
          const hasDbId = element?.customData?.databaseId

          if (hasDbId) {
            // Verhindere das Standard-Kontext-Menü
            mouseEvent.preventDefault()
            mouseEvent.stopPropagation()

            // Berechne die optimale Position für das Menü
            const { x: adjustedX, y: adjustedY } = calculateMenuPosition(
              mouseEvent.clientX,
              mouseEvent.clientY
            )

            console.log('Context Menu Position Debug:', {
              original: { x: mouseEvent.clientX, y: mouseEvent.clientY },
              adjusted: { x: adjustedX, y: adjustedY },
              viewport: { width: window.innerWidth, height: window.innerHeight },
            })

            setContextMenu({
              mouseX: adjustedX,
              mouseY: adjustedY,
              element,
            })
            return
          }
        }
      } catch (error) {
        console.warn('Error in custom context menu handler:', error)
      }
    },
    [excalidrawAPI, viewModeEnabled, calculateMenuPosition]
  )

  const handleClose = useCallback(() => {
    setContextMenu(null)
  }, [])

  const handleAddRelatedElements = useCallback(() => {
    if (contextMenu?.element) {
      console.log(
        'Opening Add Related Elements dialog from custom context menu:',
        contextMenu.element
      )
      onOpenAddRelatedElementsDialog(contextMenu.element)
    }
    handleClose()
  }, [contextMenu, onOpenAddRelatedElementsDialog, handleClose])

  useEffect(() => {
    // Füge Event-Listener zum Canvas hinzu
    const canvasElement = document.querySelector('.excalidraw__canvas')
    if (canvasElement) {
      canvasElement.addEventListener('contextmenu', handleRightClick)

      return () => {
        canvasElement.removeEventListener('contextmenu', handleRightClick)
      }
    }
  }, [handleRightClick])

  useEffect(() => {
    // Schließe das Menü bei Klicks außerhalb oder ESC
    const handleClickOutside = () => handleClose()
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [contextMenu, handleClose])

  if (!contextMenu) return null

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: contextMenu.mouseY,
        left: contextMenu.mouseX,
        zIndex: 9999,
        minWidth: 200,
        boxShadow: 3,
      }}
      elevation={8}
    >
      <MenuList dense>
        <MenuItem onClick={handleAddRelatedElements}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('diagrams.contextMenu.addRelatedElements')} />
        </MenuItem>
      </MenuList>
    </Paper>
  )
}
