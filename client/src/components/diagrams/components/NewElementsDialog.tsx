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
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('diagrams.dialogs.newElements')
  const tCommon = useTranslations('common')

  // Translate element types using internationalization
  const getElementTypeLabelTranslated = (elementType: string): string => {
    return t(`elementTypes.${elementType}` as any) || getElementTypeLabel(elementType)
  }

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
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('description', { count: newElements.length })}
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
            label={t('selectAll', { 
              selectedCount, 
              totalCount: newElements.length 
            })}
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
                      {element.text || t('elementLabel', { index: index + 1 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('elementType', { type: getElementTypeLabelTranslated(element.elementType) })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('elementPosition', {
                        x: Math.round(element.x),
                        y: Math.round(element.y),
                        width: Math.round(element.width),
                        height: Math.round(element.height)
                      })}
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
            {t('noElementsFound')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading
            ? t('creatingElements')
            : t('createButton', { 
                count: selectedCount, 
                elementText: selectedCount === 1 ? 'Element' : 'Elemente' 
              })}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
