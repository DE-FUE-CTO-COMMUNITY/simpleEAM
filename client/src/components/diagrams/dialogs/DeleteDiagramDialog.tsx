'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { DELETE_DIAGRAM } from '@/graphql/diagram'
import { Warning } from '@mui/icons-material'

export interface DeleteDiagramDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  diagram?: {
    id: string
    title: string
  }
}

const DeleteDiagramDialog: React.FC<DeleteDiagramDialogProps> = ({
  open,
  onClose,
  onDelete,
  diagram,
}) => {
  const [deleting, setDeleting] = useState(false)
  const [deleteDiagram] = useMutation(DELETE_DIAGRAM)
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')

  const handleDelete = async () => {
    if (!diagram?.id) return

    setDeleting(true)
    try {
      await deleteDiagram({
        variables: {
          id: diagram.id,
        },
      })
      onDelete()
      onClose()
    } catch {
      // Fehler beim Löschen des Diagramms
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    if (!deleting) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          <Typography variant="h6">{t('dialogs.delete.title')}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {t('dialogs.delete.confirmMessage', { title: diagram?.title || '' })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('dialogs.delete.confirmSubtext')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={deleting}>
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={20} /> : undefined}
        >
          {deleting ? `${tCommon('delete')}...` : tCommon('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDiagramDialog
