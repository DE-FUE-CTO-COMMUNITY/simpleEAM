'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from '@mui/material'
import { useTranslations } from 'next-intl'

export interface ElementTypeOption {
  id: string
  label: string
  description?: string
}

interface ElementTypeSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedTypes: string[]) => void
  availableTypes: ElementTypeOption[]
  initialSelectedTypes: string[]
  title: string
  description?: string
}

export default function ElementTypeSelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  availableTypes,
  initialSelectedTypes,
  title,
  description,
}: ElementTypeSelectionDialogProps) {
  const tCommon = useTranslations('common')
  const t = useTranslations('diagrams.addRelatedElements')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelectedTypes)

  // Reset selection when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedTypes(initialSelectedTypes)
    }
  }, [isOpen, initialSelectedTypes])

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    )
  }

  const handleSelectAll = () => {
    setSelectedTypes(availableTypes.map(type => type.id))
  }

  const handleSelectNone = () => {
    setSelectedTypes([])
  }

  const handleConfirm = () => {
    onConfirm(selectedTypes)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Button size="small" onClick={handleSelectAll} sx={{ mr: 1 }}>
            {t('selectAll')}
          </Button>
          <Button size="small" onClick={handleSelectNone}>
            {t('selectNone')}
          </Button>
        </Box>

        <FormGroup>
          {availableTypes.map(type => (
            <FormControlLabel
              key={type.id}
              control={
                <Checkbox
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">{type.label}</Typography>
                  {type.description && (
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  )}
                </Box>
              }
            />
          ))}
        </FormGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('typesSelected', { count: selectedTypes.length, total: availableTypes.length })}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{tCommon('cancel')}</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={selectedTypes.length === 0}>
          {tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
