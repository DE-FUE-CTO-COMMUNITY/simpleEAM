'use client'

import React from 'react'
import { Dialog } from '@mui/material'
import { Infrastructure } from '../../gql/generated'
import InfrastructureForm, { InfrastructureFormValues } from './InfrastructureForm'

interface InfrastructureDialogProps {
  infrastructure?: Infrastructure | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InfrastructureFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
  onEditMode?: () => void
}

/**
 * Dialog-Komponente zum Anzeigen, Bearbeiten oder Erstellen von Infrastructure-Elementen
 */
const InfrastructureDialog: React.FC<InfrastructureDialogProps> = ({
  infrastructure,
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
      <InfrastructureForm
        infrastructure={infrastructure}
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

export default InfrastructureDialog
