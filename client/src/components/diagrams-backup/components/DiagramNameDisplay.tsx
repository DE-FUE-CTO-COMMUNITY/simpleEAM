import React from 'react'
import { Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Groups } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

interface DiagramNameDisplayProps {
  currentDiagram: any
  hasUnsavedChanges?: boolean
  onSaveClick?: () => void
  isCollaborating?: boolean
}

// Base styling for chip - hasUnsavedChanges functionality disabled
const DiagramNameChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  fontWeight: 500,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
  '& .MuiChip-label': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontFamily: 'Assistant, system-ui, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
    cursor: 'default',
  },
  transition: 'all 0.2s ease-in-out',
}))

const DiagramNameDisplay: React.FC<DiagramNameDisplayProps> = ({
  currentDiagram,
  hasUnsavedChanges: _hasUnsavedChanges = false, // Keep parameter for compatibility but do not use
  onSaveClick: _onSaveClick, // Keep parameter for compatibility but do not use
  isCollaborating = false,
}) => {
  const t = useTranslations('diagrams')
  const displayName = currentDiagram?.title || t('untitledDiagram')

  // Icon und Label zusammensetzen
  const chipLabel = isCollaborating ? (
    <>
      <Groups sx={{ fontSize: '1rem' }} />
      {displayName}
    </>
  ) : (
    displayName
  )

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
        label={chipLabel}
        variant="outlined"
        title={isCollaborating ? `${displayName} (Live Collaboration aktiv)` : displayName}
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
