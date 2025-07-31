'use client'

import React, { useState, useEffect } from 'react'
import { Typography, Paper } from '@mui/material'

interface CanvasDebugOverlayProps {
  excalidrawAPI: any
  selectedElementForRelatedElements: any
}

export default function CanvasDebugOverlay({
  excalidrawAPI,
  selectedElementForRelatedElements,
}: CanvasDebugOverlayProps) {
  const [currentSelectedElement, setCurrentSelectedElement] = useState<any>(null)

  // Aktualisiere die aktuell selektierten Elemente vom Canvas
  useEffect(() => {
    if (!excalidrawAPI) return

    const updateSelection = () => {
      try {
        const appState = excalidrawAPI.getAppState()
        const sceneElements = excalidrawAPI.getSceneElements()

        // Finde das erste selektierte Element
        const selectedIds = Object.keys(appState.selectedElementIds || {})
        if (selectedIds.length > 0) {
          const selectedElement = sceneElements.find((el: any) => el.id === selectedIds[0])
          if (selectedElement) {
            setCurrentSelectedElement(selectedElement)
            return
          }
        }

        // Fallback zu null wenn nichts selektiert
        setCurrentSelectedElement(null)
      } catch (error) {
        console.error('Error updating selection:', error)
      }
    }

    // Initiale Aktualisierung
    updateSelection()

    // Regelmäßige Aktualisierung
    const interval = setInterval(updateSelection, 500)

    return () => clearInterval(interval)
  }, [excalidrawAPI])

  // Verwende das Element vom Dialog oder das aktuell selektierte Element
  const elementToShow = selectedElementForRelatedElements || currentSelectedElement

  // Zeige immer die Debug-Box, auch wenn kein Element selektiert ist
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #ff0000',
        borderRadius: 1,
        px: 3,
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontFamily: 'monospace', color: '#ff0000', fontWeight: 'bold' }}
      >
        {elementToShow ? (
          <>
            x={Math.round(elementToShow.x)}, y={Math.round(elementToShow.y)}, width=
            {Math.round(elementToShow.width || 0)}, height={Math.round(elementToShow.height || 0)}
          </>
        ) : (
          <>Kein Element selektiert</>
        )}
      </Typography>
    </Paper>
  )
}
