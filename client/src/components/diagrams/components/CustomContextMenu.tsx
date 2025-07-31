import React, { useState, useEffect, useCallback } from 'react'
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
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

  const handleRightClick = useCallback(
    (event: Event) => {
      const mouseEvent = event as MouseEvent
      // Verhindere das Standard-Kontext-Menü nur, wenn wir ein geeignetes Element haben
      if (!excalidrawAPI || viewModeEnabled) return

      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        // Finde das Element unter dem Mauszeiger
        const canvasRect = (mouseEvent.target as HTMLElement).getBoundingClientRect()
        const x = mouseEvent.clientX - canvasRect.left
        const y = mouseEvent.clientY - canvasRect.top

        // Finde ausgewählte Elemente
        const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

        if (selectedElements.length === 1) {
          const element = selectedElements[0]
          const hasDbId = element?.customData?.databaseId

          if (hasDbId) {
            // Verhindere das Standard-Kontext-Menü
            mouseEvent.preventDefault()
            mouseEvent.stopPropagation()

            setContextMenu({
              mouseX: mouseEvent.clientX,
              mouseY: mouseEvent.clientY,
              element,
            })
            return
          }
        }
      } catch (error) {
        console.warn('Error in custom context menu handler:', error)
      }
    },
    [excalidrawAPI, viewModeEnabled]
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
          <ListItemText primary="Verwandte Elemente hinzufügen" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleClose}
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          <ListItemText primary="Standard-Menü anzeigen..." />
        </MenuItem>
      </MenuList>
    </Paper>
  )
}
