'use client'

import React from 'react'
import { Dialog } from '@mui/material'
import { DataObject } from '../../gql/generated'
import DataObjectForm, { DataObjectFormValues } from '../dataobjects/DataObjectForm'

interface DataObjectDialogProps {
  dataObject?: DataObject | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DataObjectFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
  onEditMode?: () => void
}

/**
 * Dialog-Komponente zum Anzeigen, Bearbeiten oder Erstellen von Datenobjekten
 */
const DataObjectDialog: React.FC<DataObjectDialogProps> = ({
  dataObject,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isLoading = false,
  mode,
  onEditMode,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DataObjectForm
        dataObject={dataObject}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        onDelete={onDelete}
        mode={mode}
        loading={isLoading}
        onEditMode={onEditMode}
      />
    </Dialog>
  )
}

export default DataObjectDialog
