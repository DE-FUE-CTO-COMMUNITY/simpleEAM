import React from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

import { DeleteSettings, EntityType } from './types'
import { entityTypeLabels, entityTypeOrder } from './constants'
import { useCompanyContext } from '@/contexts/CompanyContext'

interface ManagementDialogProps {
  deleteSettings: DeleteSettings
  setDeleteSettings: (settings: DeleteSettings) => void
  isDeleting: boolean
  showDeleteConfirm: boolean
  deleteEntityType: string
  onDeleteConfirm: () => void
  onOpenDeleteConfirmDialog: (entityType: string) => void
  onCloseDeleteConfirmDialog: () => void
}

const ManagementDialog: React.FC<ManagementDialogProps> = ({
  deleteSettings,
  setDeleteSettings,
  isDeleting,
  showDeleteConfirm,
  deleteEntityType,
  onDeleteConfirm,
  onOpenDeleteConfirmDialog,
  onCloseDeleteConfirmDialog,
}) => {
  const t = useTranslations('importExport.management')
  const tEntityTypes = useTranslations('importExport.entityTypes')
  const tActions = useTranslations('importExport.actions')
  const { selectedCompanyId, companies } = useCompanyContext()
  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name

  // Translation function for entity types
  const getEntityTypeTranslation = (entityType: string): string => {
    switch (entityType) {
      case 'businessCapabilities':
        return tEntityTypes('businessCapabilities')
      case 'applications':
        return tEntityTypes('applications')
      case 'dataObjects':
        return tEntityTypes('dataObjects')
      case 'interfaces':
        return tEntityTypes('interfaces')
      case 'persons':
        return tEntityTypes('persons')
      case 'architectures':
        return tEntityTypes('architectures')
      case 'diagrams':
        return tEntityTypes('diagrams')
      case 'architecturePrinciples':
        return tEntityTypes('architecturePrinciples')
      case 'infrastructures':
        return tEntityTypes('infrastructures')
      case 'aicomponents':
        return tEntityTypes('aicomponents')
      case 'all':
        return tEntityTypes('all')
      default:
        return entityTypeLabels[entityType as EntityType] || entityType
    }
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={onCloseDeleteConfirmDialog}>
        <DialogTitle>{t('confirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmText', {
              entityType:
                deleteEntityType === 'all'
                  ? t('confirmAllText')
                  : getEntityTypeTranslation(deleteEntityType),
            })}
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {t('confirmWarning')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteConfirmDialog}>{tActions('cancel')}</Button>
          <Button onClick={onDeleteConfirm} color="error" disabled={isDeleting}>
            {isDeleting ? t('deleting') : tActions('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Management Tab Content */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid size={12}>
            <Alert severity="warning" icon={false}>
              <Typography variant="h6" gutterBottom>
                {t('title')}
              </Typography>
              <Typography variant="body2">{t('warning')}</Typography>
            </Alert>
          </Grid>

          <Grid size={12}>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                {selectedCompanyName
                  ? t('companyFilterInfo', { companyName: selectedCompanyName })
                  : t('companyFilterDefault')}
              </Typography>
            </Alert>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('individualDelete')}
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel>{t('selectDataType')}</InputLabel>
                <Select
                  value={deleteSettings.entityType}
                  label={t('selectDataType')}
                  onChange={e =>
                    setDeleteSettings({
                      ...deleteSettings,
                      entityType: e.target.value as DeleteSettings['entityType'],
                    })
                  }
                >
                  {entityTypeOrder
                    .filter(entityType => entityType !== 'all')
                    .map(entityType => (
                      <MenuItem key={entityType} value={entityType}>
                        {getEntityTypeTranslation(entityType)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isDeleting}
                  startIcon={isDeleting ? <CircularProgress size={20} /> : <ErrorIcon />}
                  onClick={() => onOpenDeleteConfirmDialog(deleteSettings.entityType)}
                >
                  {isDeleting
                    ? t('deleting')
                    : t('deleteButton', {
                        entityType: getEntityTypeTranslation(deleteSettings.entityType),
                      })}
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {t('deleteDescription')}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main' }}>
              <Typography variant="h6" gutterBottom color="error">
                {t('completeDelete')}
              </Typography>

              <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                <Typography variant="body2">
                  <strong>
                    {selectedCompanyName
                      ? t('companyDeleteWarning', { companyName: selectedCompanyName })
                      : t('completeDeleteWarning')}
                  </strong>
                </Typography>
              </Alert>

              <Button
                variant="contained"
                color="error"
                disabled={isDeleting}
                startIcon={isDeleting ? <CircularProgress size={20} /> : <ErrorIcon />}
                onClick={() => onOpenDeleteConfirmDialog('all')}
                sx={{ mt: 2 }}
              >
                {isDeleting
                  ? t('deleting')
                  : selectedCompanyName
                    ? t('companyDeleteButton', { companyName: selectedCompanyName })
                    : t('deleteAllButton')}
              </Button>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {t('deleteAllDescription')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ManagementDialog
