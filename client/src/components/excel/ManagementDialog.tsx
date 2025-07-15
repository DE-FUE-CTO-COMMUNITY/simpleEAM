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
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

import {
  DeleteSettings,
} from './types'
import {
  entityTypeLabels,
} from './constants'

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
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={onCloseDeleteConfirmDialog}>
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <Typography>
            Sind Sie sicher, dass Sie{' '}
            {deleteEntityType === 'all'
              ? 'alle Daten'
              : entityTypeLabels[deleteEntityType as keyof typeof entityTypeLabels]}{' '}
            löschen möchten?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Diese Aktion kann nicht rückgängig gemacht werden!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteConfirmDialog}>Abbrechen</Button>
          <Button onClick={onDeleteConfirm} color="error" disabled={isDeleting}>
            {isDeleting ? 'Lösche...' : 'Löschen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Management Tab Content */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid size={12}>
            <Alert severity="warning" icon={<WarningIcon />}>
              <Typography variant="h6" gutterBottom>
                ⚠️ Admin-Bereich - Datenverwaltung
              </Typography>
              <Typography variant="body2">
                Hier können Sie Daten aus der Datenbank löschen.{' '}
                <strong>Diese Aktionen können nicht rückgängig gemacht werden!</strong>
                Stellen Sie sicher, dass Sie ein Backup haben, bevor Sie Daten löschen.
              </Typography>
            </Alert>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Einzelne Datentypen löschen
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel>Datentyp auswählen</InputLabel>
                <Select
                  value={deleteSettings.entityType}
                  label="Datentyp auswählen"
                  onChange={e =>
                    setDeleteSettings({
                      ...deleteSettings,
                      entityType: e.target.value as DeleteSettings['entityType'],
                    })
                  }
                >
                  {Object.entries(entityTypeLabels)
                    .filter(([key]) => key !== 'all')
                    .map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
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
                    ? 'Lösche...'
                    : `${entityTypeLabels[deleteSettings.entityType]} löschen`}
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Löscht alle Einträge des ausgewählten Datentyps aus der Datenbank.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main' }}>
              <Typography variant="h6" gutterBottom color="error">
                ⚠️ Komplette Datenbank löschen
              </Typography>

              <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                <Typography variant="body2">
                  <strong>ACHTUNG:</strong> Diese Aktion löscht ALLE Daten aus der Datenbank! Dies
                  umfasst alle Business Capabilities, Applikationen, Datenobjekte, Schnittstellen,
                  Personen, Architekturen und Diagramme.
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
                {isDeleting ? 'Lösche...' : 'Alle Daten löschen'}
              </Button>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Diese Aktion kann nicht rückgängig gemacht werden. Stellen Sie sicher, dass Sie ein
                vollständiges Backup haben.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ManagementDialog
