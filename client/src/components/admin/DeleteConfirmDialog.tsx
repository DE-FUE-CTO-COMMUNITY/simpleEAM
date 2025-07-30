'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { KeycloakUser } from '@/lib/keycloak-admin'
import { DELETE_PERSON, GET_PEOPLE } from '@/lib/queries/person-queries'
import { Person } from '@/gql/generated'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user?: KeycloakUser | null
  person?: Person | null
  mode: 'user' | 'person' | 'both'
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onSuccess,
  user,
  person,
  mode,
}: DeleteConfirmDialogProps) {
  const t = useTranslations('admin.userManagement.deleteDialog')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // GraphQL Mutation für Person löschen
  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  })

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'user' || mode === 'both') {
        // Keycloak-Benutzer über API-Route löschen
        if (user?.id) {
          const response = await fetch('/api/admin/keycloak-users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'delete',
              userId: user.id,
            }),
          })

          if (!response.ok) {
            throw new Error(`Fehler beim Löschen: ${response.status}`)
          }
        }
      }

      if (mode === 'person' || mode === 'both') {
        // Person aus Datenbank löschen
        if (person?.id) {
          await deletePerson({
            variables: {
              where: { id: person.id },
            },
          })
        }
      }

      onSuccess()
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unbekannter Fehler beim Löschen')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  const getDialogTitle = () => {
    switch (mode) {
      case 'user':
        return t('title.user')
      case 'person':
        return t('title.person')
      case 'both':
        return t('title.both')
      default:
        return t('title.user')
    }
  }

  const getConfirmationText = () => {
    const userName = user?.username || user?.email || 'Unbekannt'
    const personName = person ? `${person.firstName} ${person.lastName}` : 'Unbekannt'

    switch (mode) {
      case 'user':
        return (
          <>
            <Typography variant="body1" gutterBottom>
              {t('confirmation.user')}
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{t('labels.username')}</strong> {userName}
              </Typography>
              {user?.email && (
                <Typography variant="body2">
                  <strong>{t('labels.email')}</strong> {user.email}
                </Typography>
              )}
              {user?.firstName && user?.lastName && (
                <Typography variant="body2">
                  <strong>
                    {t('labels.firstName')} {t('labels.lastName')}
                  </strong>{' '}
                  {user.firstName} {user.lastName}
                </Typography>
              )}
            </Box>
          </>
        )

      case 'person':
        return (
          <>
            <Typography variant="body1" gutterBottom>
              {t('confirmation.person')}
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>
                  {t('labels.firstName')} {t('labels.lastName')}
                </strong>{' '}
                {personName}
              </Typography>
              {person?.email && (
                <Typography variant="body2">
                  <strong>{t('labels.email')}</strong> {person.email}
                </Typography>
              )}
              {person?.department && (
                <Typography variant="body2">
                  <strong>{t('labels.department')}</strong> {person.department}
                </Typography>
              )}
              {person?.role && (
                <Typography variant="body2">
                  <strong>{t('labels.role')}</strong> {person.role}
                </Typography>
              )}
            </Box>
          </>
        )

      case 'both':
        return (
          <>
            <Typography variant="body1" gutterBottom>
              {t('confirmation.both')}
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Keycloak-Benutzer:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                <strong>{t('labels.username')}</strong> {userName}
              </Typography>
              {user?.email && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  <strong>{t('labels.email')}</strong> {user.email}
                </Typography>
              )}

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Person:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                <strong>
                  {t('labels.firstName')} {t('labels.lastName')}
                </strong>{' '}
                {personName}
              </Typography>
              {person?.email && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  <strong>{t('labels.email')}</strong> {person.email}
                </Typography>
              )}
            </Box>
          </>
        )

      default:
        return <Typography variant="body1">{t('confirmation.default')}</Typography>
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>{getDialogTitle()}</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getConfirmationText()}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>{t('warning.title')}</strong> {t('warning.irreversible')}
          </Typography>
          {mode === 'user' || mode === 'both' ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('warning.userRemoval')}
            </Typography>
          ) : null}
          {mode === 'person' || mode === 'both' ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('warning.personRemoval')}
            </Typography>
          ) : null}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? t('buttons.deleting') : t('buttons.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
