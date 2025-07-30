'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { KeycloakUser } from '@/lib/keycloak-admin'
import { KeycloakUserAlt } from '@/lib/keycloak-admin-alt'

interface PasswordResetData {
  newPassword: string
  confirmPassword: string
  forcePasswordChange: boolean
}

interface PasswordResetDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user?: KeycloakUser | KeycloakUserAlt | null
  loading?: boolean
}

export default function PasswordResetDialog({
  open,
  onClose,
  onSuccess,
  user,
  loading = false,
}: PasswordResetDialogProps) {
  const t = useTranslations('admin.userManagement.passwordReset')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Zod Schema für Passwort-Validierung
  const passwordSchema = React.useMemo(
    () =>
      z
        .object({
          newPassword: z.string().min(8, t('validation.passwordMinLength')),
          confirmPassword: z.string().min(1, t('validation.passwordRequired')),
          forcePasswordChange: z.boolean(),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: t('validation.passwordsNotMatch'),
          path: ['confirmPassword'],
        }),
    [t]
  )

  // Formular konfigurieren
  const form = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      forcePasswordChange: true, // Standardmäßig aktiviert
    } as PasswordResetData,
    onSubmit: async ({ value }) => {
      setSubmitLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/admin/keycloak-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'resetPassword',
            userId: user?.id,
            password: value.newPassword,
            temporary: value.forcePasswordChange,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || t('error'))
        }

        onSuccess()
        handleClose()
      } catch (err) {
        console.error('Fehler beim Zurücksetzen des Passworts:', err)
        setError(err instanceof Error ? err.message : t('error'))
      } finally {
        setSubmitLoading(false)
      }
    },
    validators: {
      onChange: ({ value }) => {
        const result = passwordSchema.safeParse(value)
        return result.success ? undefined : result.error.format()
      },
      onSubmit: ({ value }) => {
        const result = passwordSchema.safeParse(value)
        return result.success ? undefined : result.error.format()
      },
    },
  })

  // Formular-Validatoren aktualisieren, wenn sich das Schema ändert
  React.useEffect(() => {
    form.options.validators = {
      onChange: ({ value }) => {
        const result = passwordSchema.safeParse(value)
        return result.success ? undefined : result.error.format()
      },
      onSubmit: ({ value }) => {
        const result = passwordSchema.safeParse(value)
        return result.success ? undefined : result.error.format()
      },
    }
  }, [form, passwordSchema])

  // Formular zurücksetzen, wenn Dialog geöffnet/geschlossen wird
  React.useEffect(() => {
    if (open) {
      form.reset()
      setError(null)
    }
  }, [open, form])

  const handleClose = () => {
    if (!submitLoading && !loading) {
      setError(null)
      form.reset()
      onClose()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {user && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Benutzer:</strong> {user.username} ({user.firstName} {user.lastName})
            </Typography>
            {user.email && (
              <Typography variant="body2">
                <strong>E-Mail:</strong> {user.email}
              </Typography>
            )}
          </Box>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name="newPassword">
            {field => (
              <TextField
                fullWidth
                margin="normal"
                label={t('newPassword')}
                type={showPassword ? 'text' : 'password'}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!field.state.meta.isValid}
                helperText={field.state.meta.errors.join(', ')}
                placeholder={t('placeholders.newPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {field => (
              <TextField
                fullWidth
                margin="normal"
                label={t('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={!field.state.meta.isValid}
                helperText={field.state.meta.errors.join(', ')}
                placeholder={t('placeholders.confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </form.Field>

          <form.Field name="forcePasswordChange">
            {field => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.state.value}
                    onChange={e => field.handleChange(e.target.checked)}
                    onBlur={field.handleBlur}
                  />
                }
                label={t('forcePasswordChange')}
                sx={{ mt: 2 }}
              />
            )}
          </form.Field>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitLoading || loading}>
          {t('buttons.cancel')}
        </Button>
        <form.Subscribe selector={state => [state.canSubmit]}>
          {([canSubmit]) => (
            <Button
              onClick={() => form.handleSubmit()}
              variant="contained"
              disabled={!canSubmit || submitLoading || loading}
              startIcon={submitLoading ? <CircularProgress size={16} /> : null}
            >
              {submitLoading ? t('buttons.resetting') : t('buttons.resetPassword')}
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}
