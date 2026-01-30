'use client'

import React from 'react'
import { Box } from '@mui/material'
import { DiagramEditor } from '@/components/diagrams'
import { MockAuthProvider } from '@/contexts/AuthContext'

const DiagramEditorPage: React.FC = () => {
  return (
    <MockAuthProvider>
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // AppBar-Höhe abziehen
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
        }}
      >
        <DiagramEditor />
      </Box>
    </MockAuthProvider>
  )
}

export default DiagramEditorPage
