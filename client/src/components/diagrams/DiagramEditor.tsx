'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import dynamic from 'next/dynamic'

// Dynamischer Import von Excalidraw, um Server-Side-Rendering zu vermeiden
// Gemäß der offiziellen Dokumentation: https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration
const ExcalidrawComponent = dynamic(
  async () => {
    // Wichtig: Zuerst das CSS importieren, dann die Komponente
    await import('@excalidraw/excalidraw/index.css')
    const { Excalidraw } = await import('@excalidraw/excalidraw')
    return Excalidraw
  },
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography variant="h5">Lade Diagram-Editor...</Typography>
      </Box>
    ),
  }
)

export interface DiagramEditorProps {
  className?: string
  style?: React.CSSProperties
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Nur Client-seitig rendern
    setIsClient(true)
  }, [])

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {isClient && (
        <div style={{ height: '100%', width: '100%' }}>
          <ExcalidrawComponent
            theme="light"
            name="simple-eam-diagram"
            UIOptions={{
              canvasActions: {
                export: { saveFileToDisk: true },
                saveAsImage: true,
                loadScene: true,
              },
            }}
            initialData={{
              appState: {
                viewBackgroundColor: '#ffffff',
                currentItemFontFamily: 1,
              },
            }}
          />
        </div>
      )}
    </Box>
  )
}

export default DiagramEditor
