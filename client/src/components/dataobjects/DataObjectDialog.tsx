'use client'

import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material'
import { DataObject, DataObjectFormValues } from './types'

interface DataObjectDialogProps {
  dataObject?: DataObject | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DataObjectFormValues) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
}

/**
 * Dialog-Komponente zum Anzeigen, Bearbeiten oder Erstellen von Datenobjekten
 */
const DataObjectDialog: React.FC<DataObjectDialogProps> = ({
  dataObject,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode,
}) => {
  // Dialog-Titel basierend auf dem Modus
  const getDialogTitle = () => {
    if (mode === 'create') return 'Neues Datenobjekt erstellen'
    if (mode === 'edit') return 'Datenobjekt bearbeiten'
    return 'Datenobjekt Details'
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>The DataObject Form will be implemented later</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {mode === 'view' ? 'Schließen' : 'Abbrechen'}
        </Button>
        {mode !== 'view' && (
          <Button
            onClick={() => {
              // Dummy-Implementation, da das Formular nicht wirklich funktioniert
              onClose()
            }}
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Wird gespeichert...' : 'Speichern'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default DataObjectDialog
