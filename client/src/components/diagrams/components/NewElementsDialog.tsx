'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material'
import { getElementTypeLabel } from '../utils/newElementsUtils'

interface NewElement {
  id: string
  text: string
  elementType: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  backgroundColor: string
  selected: boolean
}

interface NewElementsDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedElements: NewElement[]) => void
  newElements: NewElement[]
  loading?: boolean
}

export const NewElementsDialog: React.FC<NewElementsDialogProps> = ({
  open,
  onClose,
  onConfirm,
  newElements,
  loading = false,
}) => {
  const [selectedElements, setSelectedElements] = useState<NewElement[]>([])

  // Initialize selection state when dialog opens
  React.useEffect(() => {
    if (open && newElements.length > 0) {
      // Initially select all elements
      setSelectedElements(newElements.map(el => ({ ...el, selected: true })))
    }
  }, [open, newElements])

  const handleElementToggle = (elementId: string) => {
    setSelectedElements(prev =>
      prev.map(el => (el.id === elementId ? { ...el, selected: !el.selected } : el))
    )
  }

  const handleSelectAll = () => {
    const allSelected = selectedElements.every(el => el.selected)
    setSelectedElements(prev => prev.map(el => ({ ...el, selected: !allSelected })))
  }

  const handleConfirm = () => {
    const elementsToCreate = selectedElements.filter(el => el.selected)
    onConfirm(elementsToCreate)
  }

  const selectedCount = selectedElements.filter(el => el.selected).length

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableEscapeKeyDown={loading}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Neue Elemente in Datenbank übernehmen
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Das Diagramm enthält {newElements.length} neue Elemente, die noch nicht in der Datenbank
          existieren. Wählen Sie aus, welche Elemente in die Datenbank übernommen werden sollen.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedElements.every(el => el.selected)}
                indeterminate={
                  selectedElements.some(el => el.selected) &&
                  !selectedElements.every(el => el.selected)
                }
                onChange={handleSelectAll}
                disabled={loading}
              />
            }
            label={`Alle auswählen (${selectedCount} von ${newElements.length} ausgewählt)`}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {selectedElements.map((element, index) => (
            <Paper
              key={element.id}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                border: element.selected ? '2px solid' : '1px solid',
                borderColor: element.selected ? 'primary.main' : 'divider',
                backgroundColor: element.selected ? 'action.selected' : 'background.paper',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={element.selected}
                    onChange={() => handleElementToggle(element.id)}
                    disabled={loading}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {element.text || `Element ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Typ: {getElementTypeLabel(element.elementType)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Position: ({Math.round(element.x)}, {Math.round(element.y)}) • Größe:{' '}
                      {Math.round(element.width)} × {Math.round(element.height)}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', margin: 0 }}
              />
            </Paper>
          ))}
        </Box>

        {newElements.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Keine neuen Elemente gefunden.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Abbrechen
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading
            ? 'Erstelle Elemente...'
            : `${selectedCount} ${selectedCount === 1 ? 'Element' : 'Elemente'} erstellen`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
