import React from 'react'
import { Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

interface DiagramNameDisplayProps {
  currentDiagram: any
  hasUnsavedChanges?: boolean
  onSaveClick?: () => void
}

// Basis-Styling für den Chip ohne responsive Werte
const DiagramNameChip = styled(Chip, {
  shouldForwardProp: prop => prop !== 'hasUnsavedChanges',
})<{ hasUnsavedChanges?: boolean }>(({ theme, hasUnsavedChanges }) => ({
  backgroundColor: hasUnsavedChanges ? 'rgba(244, 67, 54, 0.15)' : '#ffffff',
  color: hasUnsavedChanges ? '#d32f2f' : theme.palette.text.primary,
  border: hasUnsavedChanges ? '1px solid rgba(244, 67, 54, 0.15)' : '1px solid #e0e0e0',
  borderRadius: '4px',
  fontWeight: 500,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
  '& .MuiChip-label': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontFamily: 'Assistant, system-ui, sans-serif',
  },
  '&:hover': {
    backgroundColor: hasUnsavedChanges ? 'rgba(244, 67, 54, 0.25)' : '#ffffff',
    border: hasUnsavedChanges ? '1px solid rgba(244, 67, 54, 0.25)' : '1px solid #e0e0e0',
    boxShadow: hasUnsavedChanges ? '0 2px 6px rgba(0, 0, 0, 0.2)' : '0 1px 4px rgba(0, 0, 0, 0.15)',
    cursor: hasUnsavedChanges ? 'pointer' : 'default',
  },
  transition: 'all 0.2s ease-in-out',
}))

const DiagramNameDisplay: React.FC<DiagramNameDisplayProps> = ({
  currentDiagram,
  hasUnsavedChanges = false,
  onSaveClick,
}) => {
  const displayName = currentDiagram?.title || 'Unbenanntes Diagramm'

  const handleClick = () => {
    // Only handle click if there are unsaved changes and onSaveClick is provided
    if (hasUnsavedChanges && onSaveClick) {
      onSaveClick()
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 12, sm: 14, md: 16 }, // Responsive top positioning
        left: { xs: 65, xl: 80 }, // Responsive left positioning
        zIndex: 1000,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DiagramNameChip
        label={displayName}
        hasUnsavedChanges={hasUnsavedChanges}
        variant="outlined"
        title={displayName}
        onClick={handleClick}
        clickable={hasUnsavedChanges}
        sx={{
          // Responsive sizing using MUI System
          height: 40, // Fixed height for the chip
          maxWidth: { xs: 180, lg: 180, xl: 260 }, // Mobile: 180px, Tablet: 280px, Desktop: 504px
          fontSize: { xs: '0.75rem', lg: '0.8rem', xl: '0.85rem' }, // Responsive font sizes
          '& .MuiChip-label': {
            padding: { xs: '0 8px', lg: '0 10px', xl: '0 12px' }, // Responsive padding
            lineHeight: '38px',
          },
        }}
      />
    </Box>
  )
}

export default DiagramNameDisplay
