'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material'
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useSnackbar } from 'notistack'
import { useAuth } from '@/lib/auth'

interface PasswordChangeDialogProps {
  open: boolean
  onClose: () => void
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { keycloak } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as PasswordFormData,
    onSubmit: async value => {
      setLoading(true)
      try {
        await changePassword(value.value)
        enqueueSnackbar('Passwort erfolgreich geändert', { variant: 'success' })
        onClose()
        form.reset()
      } catch (error: any) {
        enqueueSnackbar(error.message || 'Fehler beim Ändern des Passworts', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.currentPassword) {
          return 'Aktuelles Passwort ist erforderlich'
        }
        if (!value.newPassword || value.newPassword.length < 8) {
          return 'Neues Passwort muss mindestens 8 Zeichen lang sein'
        }
        if (value.newPassword !== value.confirmPassword) {
          return 'Passwörter stimmen nicht überein'
        }
        return undefined
      },
    },
  })

  const changePassword = async (formData: PasswordFormData) => {
    if (!keycloak?.token) {
      throw new Error('Nicht authentifiziert')
    }

    try {
      // Zuerst das aktuelle Passwort mit dem Benutzer-Token validieren
      const validateResponse = await fetch('/api/auth/validate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          password: formData.currentPassword,
        }),
      })

      if (!validateResponse.ok) {
        throw new Error('Aktuelles Passwort ist nicht korrekt')
      }

      // Dann das neue Passwort über die Admin API setzen
      const changeResponse = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
        }),
      })

      if (!changeResponse.ok) {
        const errorData = await changeResponse.json()
        throw new Error(errorData.message || 'Fehler beim Ändern des Passworts')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Fehler beim Ändern des Passworts')
    }
  }

  const handleClose = () => {
    if (!loading) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Passwort ändern</Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Ihr neues Passwort muss mindestens 8 Zeichen lang sein.
          </Alert>

          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Aktuelles Passwort */}
              <form.Field name="currentPassword">
                {field => (
                  <TextField
                    fullWidth
                    label="Aktuelles Passwort"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors[0]}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </form.Field>

              {/* Neues Passwort */}
              <form.Field name="newPassword">
                {field => (
                  <TextField
                    fullWidth
                    label="Neues Passwort"
                    type={showNewPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors[0]}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </form.Field>

              {/* Passwort bestätigen */}
              <form.Field name="confirmPassword">
                {field => (
                  <TextField
                    fullWidth
                    label="Neues Passwort bestätigen"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    helperText={field.state.meta.errors[0]}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </form.Field>
            </Box>
          </form>

          {form.state.errors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {form.state.errors[0]}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Abbrechen
        </Button>
        <Button onClick={() => form.handleSubmit()} variant="contained" disabled={loading}>
          {loading ? 'Wird geändert...' : 'Passwort ändern'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PasswordChangeDialog
