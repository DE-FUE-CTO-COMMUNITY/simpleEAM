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
import { deleteUser, KeycloakUser, KeycloakAdminError } from '@/lib/keycloak-admin'
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
        // Keycloak-Benutzer löschen
        if (user?.id) {
          await deleteUser(user.id)
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
      if (err instanceof KeycloakAdminError) {
        setError(`Keycloak-Fehler: ${err.message}`)
      } else if (err instanceof Error) {
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
        return 'Benutzer löschen'
      case 'person':
        return 'Person löschen'
      case 'both':
        return 'Benutzer und Person löschen'
      default:
        return 'Löschen bestätigen'
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
              Möchten Sie den Keycloak-Benutzer wirklich löschen?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Benutzername:</strong> {userName}
              </Typography>
              {user?.email && (
                <Typography variant="body2">
                  <strong>E-Mail:</strong> {user.email}
                </Typography>
              )}
              {user?.firstName && user?.lastName && (
                <Typography variant="body2">
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </Typography>
              )}
            </Box>
          </>
        )

      case 'person':
        return (
          <>
            <Typography variant="body1" gutterBottom>
              Möchten Sie die Person wirklich aus der Datenbank löschen?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Name:</strong> {personName}
              </Typography>
              {person?.email && (
                <Typography variant="body2">
                  <strong>E-Mail:</strong> {person.email}
                </Typography>
              )}
              {person?.department && (
                <Typography variant="body2">
                  <strong>Abteilung:</strong> {person.department}
                </Typography>
              )}
              {person?.role && (
                <Typography variant="body2">
                  <strong>Rolle:</strong> {person.role}
                </Typography>
              )}
            </Box>
          </>
        )

      case 'both':
        return (
          <>
            <Typography variant="body1" gutterBottom>
              Möchten Sie sowohl den Keycloak-Benutzer als auch die Person aus der Datenbank löschen?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Keycloak-Benutzer:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                <strong>Benutzername:</strong> {userName}
              </Typography>
              {user?.email && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  <strong>E-Mail:</strong> {user.email}
                </Typography>
              )}

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Person:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                <strong>Name:</strong> {personName}
              </Typography>
              {person?.email && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  <strong>E-Mail:</strong> {person.email}
                </Typography>
              )}
            </Box>
          </>
        )

      default:
        return <Typography variant="body1">Möchten Sie diesen Eintrag wirklich löschen?</Typography>
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>
        {getDialogTitle()}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getConfirmationText()}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden!
          </Typography>
          {mode === 'user' || mode === 'both' ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Der Benutzer wird aus Keycloak entfernt und kann sich nicht mehr anmelden.
            </Typography>
          ) : null}
          {mode === 'person' || mode === 'both' ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Alle Daten der Person werden dauerhaft aus der Datenbank entfernt.
            </Typography>
          ) : null}
        </Alert>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Abbrechen
        </Button>
        <Button 
          onClick={handleDelete}
          variant="contained" 
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Lösche...' : 'Löschen'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
