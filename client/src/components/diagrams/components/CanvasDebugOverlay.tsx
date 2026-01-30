'use client'

import React, { useState, useEffect } from 'react'
import { Typography, Paper, Box, Chip } from '@mui/material'
import { useDebug } from '@/contexts/DebugContext'
import { useTranslations } from 'next-intl'

interface CanvasDebugOverlayProps {
  excalidrawAPI: any
  selectedElementForRelatedElements: any
}

export default function CanvasDebugOverlay({
  excalidrawAPI,
  selectedElementForRelatedElements,
}: CanvasDebugOverlayProps) {
  const { settings: debugSettings } = useDebug()
  const t = useTranslations('admin.debugOverlay')
  const [currentSelectedElement, setCurrentSelectedElement] = useState<any>(null)

  // Update the currently selected elements from the canvas
  useEffect(() => {
    if (!excalidrawAPI) return

    const updateSelection = () => {
      try {
        const appState = excalidrawAPI.getAppState()
        const sceneElements = excalidrawAPI.getSceneElements()

        // Find the first selected element
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

  // Use the element from the dialog or the currently selected element
  const elementToShow = selectedElementForRelatedElements || currentSelectedElement

  // Show debug box only if enabled in settings
  if (!debugSettings.showElementCoordinates) {
    return null
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 70, // 50px nach links verschoben (von 20 auf 70)
        zIndex: 9999,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        minWidth: 280,
        maxWidth: 320,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Chip
          label="Debug"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mr: 1, fontSize: '0.75rem' }}
        />
        <Typography variant="caption" color="text.secondary">
          {t('title')}
        </Typography>
      </Box>

      {elementToShow ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <strong>{t('position')}:</strong> x={Math.round(elementToShow.x)}, y=
            {Math.round(elementToShow.y)}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <strong>{t('size')}:</strong> {Math.round(elementToShow.width || 0)} ×{' '}
            {Math.round(elementToShow.height || 0)}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <strong>{t('type')}:</strong> {elementToShow.type}
          </Typography>
          {elementToShow.customData?.elementType && (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <strong>{t('elementType')}:</strong> {elementToShow.customData.elementType}
            </Typography>
          )}
          {elementToShow.customData?.elementName && (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <strong>{t('name')}:</strong> {elementToShow.customData.elementName}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {t('noElementSelected')}
        </Typography>
      )}
    </Paper>
  )
}
