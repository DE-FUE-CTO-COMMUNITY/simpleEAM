'use client'

import { useMutation } from '@apollo/client'
import { Warning } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { DELETE_DIAGRAM } from '@/graphql/diagram'

interface DeleteDiagramDialogProps {
  open: boolean
  onClose: () => void
  onDeleted: () => void
  diagramId?: string | null
  diagramTitle?: string | null
}

const DeleteDiagramDialog = ({
  open,
  onClose,
  onDeleted,
  diagramId,
  diagramTitle,
}: DeleteDiagramDialogProps) => {
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const [deleteDiagramMutation, { loading }] = useMutation(DELETE_DIAGRAM)

  const handleDelete = async () => {
    if (!diagramId || loading) {
      return
    }

    try {
      await deleteDiagramMutation({
        variables: { id: diagramId },
      })
      onDeleted()
      onClose()
    } catch (error) {
      console.error('DiagramEditor: Failed to delete diagram', error)
      window.alert('Failed to delete the diagram. Please try again.')
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          <Typography variant="h6">{t('dialogs.delete.title')}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {t('dialogs.delete.confirmMessage', { title: diagramTitle || '' })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('dialogs.delete.confirmSubtext')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={!diagramId || loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {tCommon('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDiagramDialog
