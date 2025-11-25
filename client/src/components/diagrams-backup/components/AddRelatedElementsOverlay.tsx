import React, { useState, useEffect } from 'react'
import { Fab, Tooltip, Zoom } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

interface AddRelatedElementsOverlayProps {
  excalidrawAPI: any
  onOpenDialog: (element: any) => void
  viewModeEnabled?: boolean
}

/**
 * Floating Action Button Overlay, das erscheint, wenn ein Element mit databaseId ausgewählt ist
 */
export const AddRelatedElementsOverlay: React.FC<AddRelatedElementsOverlayProps> = ({
  excalidrawAPI,
  onOpenDialog,
  viewModeEnabled = false,
}) => {
  const t = useTranslations()
  const [selectedElementWithDb, setSelectedElementWithDb] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (!excalidrawAPI || viewModeEnabled) {
      setShowButton(false)
      return
    }

    const checkSelection = () => {
      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        // Find selected elements
        const selectedElements = elements.filter((el: any) => appState.selectedElementIds[el.id])

        if (selectedElements.length === 1) {
          const element = selectedElements[0]
          const hasDbId = element?.customData?.databaseId

          if (hasDbId) {
            setSelectedElementWithDb(element)
            setShowButton(true)
            return
          }
        }

        // Kein geeignetes Element ausgewählt
        setSelectedElementWithDb(null)
        setShowButton(false)
      } catch (error) {
        console.warn('Error checking selection:', error)
        setShowButton(false)
      }
    }

    // Initial check
    checkSelection()

    // Listen for changes - wir müssen einen Listener für Änderungen erstellen
    // Da es keinen direkten onChange-Listener für Selektionen gibt, verwenden wir ein Interval
    const intervalId = setInterval(checkSelection, 200)

    return () => {
      clearInterval(intervalId)
    }
  }, [excalidrawAPI, viewModeEnabled])

  const handleClick = () => {
    if (selectedElementWithDb) {
      onOpenDialog(selectedElementWithDb)
    }
  }

  return (
    <Zoom in={showButton}>
      <Tooltip title={t('diagrams.contextMenu.addRelatedElements')} placement="left">
        <Fab
          color="primary"
          size="medium"
          onClick={handleClick}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  )
}
