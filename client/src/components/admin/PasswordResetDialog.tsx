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
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff, Key } from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { KeycloakUser } from '@/lib/keycloak-types'
import { keycloak } from '@/lib/auth'

interface PasswordResetData {
  newPassword: string
  confirmPassword: string
}

interface PasswordResetDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user: KeycloakUser | null
  loading?: boolean
  onClipboardMessage?: (message: string, severity: 'success' | 'error') => void
}

// Utility function for password generation
function generatePassword(length: number = 22): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = lowercase + uppercase + numbers + special
  let password = ''

  // Mindestens ein Zeichen aus jeder Kategorie
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Fill remaining characters randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Passwort mischen
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// Utility function for clipboard
async function copyToClipboard(text: string): Promise<boolean> {
  let clipboardSuccess = false

  try {
    // Check if Clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      clipboardSuccess = true
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      clipboardSuccess = document.execCommand('copy')
      textArea.remove()
    }
  } catch (error) {
    console.error('Fehler beim Kopieren:', error)
    clipboardSuccess = false
  }

  return clipboardSuccess
}

export default function PasswordResetDialog({
  open,
  onClose,
  onSuccess,
  user,
  loading = false,
  onClipboardMessage,
}: PasswordResetDialogProps) {
  const t = useTranslations('admin.userManagement.passwordReset')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Zod schema for password validation
  const passwordSchema = React.useMemo(
    () =>
      z
        .object({
          newPassword: z.string().min(8, t('validation.passwordMinLength')),
          confirmPassword: z.string().min(1, t('validation.passwordRequired')),
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
    } as PasswordResetData,
    onSubmit: async ({ value }) => {
      setSubmitLoading(true)
      setError(null)

      try {
        // Check if user is authenticated
        if (!keycloak?.token) {
          throw new Error('Nicht authentifiziert')
        }

        const response = await fetch('/api/admin/keycloak-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({
            action: 'resetPassword',
            userId: user?.id,
            password: value.newPassword,
            temporary: true, // Always temporary as this is the desired default
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || t('error'))
        }

        // Nach erfolgreichem Reset in Zwischenablage kopieren
        await handleCopyToClipboard(value.newPassword)

        onSuccess()
        handleClose()
      } catch (err) {
        console.error('Error resetting password:', err)
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

  // Update form validators when schema changes
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

  // Reset form when dialog is opened/closed
  React.useEffect(() => {
    if (open) {
      form.reset()
      setError(null)
    }
  }, [open, form])

  // Handler for password generation
  const handleGeneratePassword = () => {
    const newPassword = generatePassword(22)
    form.setFieldValue('newPassword', newPassword)
    form.setFieldValue('confirmPassword', newPassword)
  }

  // Handler for clipboard
  const handleCopyToClipboard = async (password: string) => {
    if (!user) return false

    const clipboardText = `${t('clipboard.accessDataIntro')}

${t('clipboard.username')}: ${user.username}
${t('clipboard.email')}: ${user.email || 'N/A'}
${t('clipboard.password')}: ${password}
${t('clipboard.url')}: ${window.location.origin}`

    const success = await copyToClipboard(clipboardText)
    if (onClipboardMessage) {
      if (success) {
        // Erfolgreich in Zwischenablage kopiert
        onClipboardMessage(t('clipboard.copied'), 'success')
      } else {
        // Fallback: In Console ausgegeben
        onClipboardMessage(t('clipboard.consoleOutput'), 'success')
      }
    }
    return success
  }

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

  // Check if user never had a password (first time setting)
  const isFirstTimePassword =
    user?.requiredActions?.includes('UPDATE_PASSWORD') &&
    user?.attributes?.firstPasswordSet?.[0] !== 'true'

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {isFirstTimePassword ? t('titleSet') : t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isFirstTimePassword ? t('subtitleSet') : t('subtitle')}
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

          {/* Info-Text ohne Checkbox */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, mb: 1, fontStyle: 'italic' }}
          >
            {t('forcePasswordChange')}
          </Typography>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        {/* Generate Password Button - links */}
        <Button
          onClick={handleGeneratePassword}
          variant="outlined"
          startIcon={<Key />}
          disabled={submitLoading || loading}
        >
          {t('buttons.generatePassword')}
        </Button>

        {/* Cancel und Reset Buttons - rechts */}
        <Box sx={{ display: 'flex', gap: 1 }}>
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
                {submitLoading
                  ? isFirstTimePassword
                    ? t('buttons.setting')
                    : t('buttons.resetting')
                  : isFirstTimePassword
                    ? t('buttons.setPassword')
                    : t('buttons.resetPassword')}
              </Button>
            )}
          </form.Subscribe>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
