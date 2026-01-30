'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Snackbar,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  VpnKey as PasswordIcon,
  Key as KeyIcon,
} from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'
import { useMutation, useLazyQuery } from '@apollo/client'
import { KeycloakUser } from '@/lib/keycloak-types'
import { keycloak } from '@/lib/auth'
import { CREATE_PERSON, UPDATE_PERSON, GET_PERSON_BY_EMAIL } from '@/graphql/person'
import UserFormDialog from './UserFormDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import PasswordResetDialog from './PasswordResetDialog'

export default function UserManagement() {
  const t = useTranslations('admin.userManagement')
  const locale = useLocale()
  const [keycloakUsers, setKeycloakUsers] = useState<KeycloakUser[]>([])
  const [keycloakLoading, setKeycloakLoading] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // GraphQL mutations and queries for persons
  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: error => {
      console.error('❌ Fehler beim Erstellen der Person:', error)
    },
  })

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onError: error => {
      console.error('❌ Fehler beim Aktualisieren der Person:', error)
    },
  })

  const [findPersonByEmail] = useLazyQuery(GET_PERSON_BY_EMAIL, {
    onError: error => {
      console.error('❌ Fehler beim Suchen der Person:', error)
    },
  })

  // Hilfsfunktion: Person aus Benutzerdaten erstellen/aktualisieren
  const createOrUpdatePerson = async (userData: any, isUpdate = false) => {
    try {
      const personData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        department: userData.department || null,
        role: userData.role || null,
        phone: userData.phone || null,
      }

      if (isUpdate && userData.email) {
        // First check if person already exists
        const { data } = await findPersonByEmail({
          variables: { email: userData.email },
        })

        if (data?.people && data.people.length > 0) {
          // Person aktualisieren
          const existingPerson = data.people[0]
          await updatePerson({
            variables: {
              id: existingPerson.id,
              input: personData,
            },
          })
        } else {
          // Person existiert nicht, neue erstellen
          await createPerson({
            variables: {
              input: [personData],
            },
          })
        }
      } else {
        // Neue Person erstellen
        await createPerson({
          variables: {
            input: [personData],
          },
        })
      }
    } catch (error) {
      console.error('❌ Fehler bei Person-Operation:', error)
      // Fehler nicht weiterwerfen, damit Benutzer-Erstellung nicht blockiert wird
    }
  }

  const translateRole = (role: string): string => {
    const roleKey = role.toLowerCase()
    try {
      return t(`roles.${roleKey}` as any)
    } catch {
      return role // Fallback to original value
    }
  }

  // Helper function for status translation
  const translateStatus = (enabled: boolean | undefined): string => {
    return enabled ? t('status.active') : t('status.inactive')
  }

  // Helper function for Letztes-Login-Anzeige
  const formatLastLogin = (user: KeycloakUser): string => {
    const lastLogin = user.attributes?.lastLogin?.[0]
    if (!lastLogin) {
      return t('lastLogin.never')
    }

    try {
      const date = new Date(lastLogin)
      // Use current locale for correct internationalization
      const localeString = locale === 'de' ? 'de-DE' : 'en-US'
      return date.toLocaleString(localeString, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('Fehler beim Formatieren des letzten Login-Datums:', error)
      return t('lastLogin.error')
    }
  }

  // Dialog States
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit',
    user: null as KeycloakUser | null,
  })

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null as KeycloakUser | null,
  })

  const [passwordResetDialog, setPasswordResetDialog] = useState({
    open: false,
    user: null as KeycloakUser | null,
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  // Bulk sync company_ids for all users
  const syncAllCompanyIds = async () => {
    try {
      if (!keycloak?.token) {
        throw new Error(t('notAuthenticated'))
      }

      setKeycloakLoading(true)

      const response = await fetch('/api/admin/sync-company-ids', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(
          text || t('apiError', { status: response.status, statusText: response.statusText })
        )
      }

      let payload: any
      try {
        payload = JSON.parse(text)
      } catch {
        payload = { message: text }
      }

      const updated = payload?.updated ?? 0
      const failed = payload?.failed ?? 0
      const skipped = payload?.skipped ?? 0

      setSnackbar({
        open: true,
        message: t('syncSummary', { updated, skipped, failed }),
        severity: failed > 0 ? 'error' : 'success',
      })

      // Liste neu laden, um neue Attribute zu sehen
      await loadKeycloakUsers()
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || t('syncFailed'), severity: 'error' })
    } finally {
      setKeycloakLoading(false)
    }
  }

  // Keycloak Benutzer laden
  const loadKeycloakUsers = useCallback(async () => {
    setKeycloakLoading(true)
    setKeycloakError(null)

    try {
      // Check if Keycloak is initialized
      if (!keycloak) {
        throw new Error(t('keycloakNotInitialized'))
      }

      // Update token if necessary
      await keycloak.updateToken(30)

      // Check if user is authenticated
      if (!keycloak.token) {
        throw new Error(t('notAuthenticatedNoToken'))
      }

      const response = await fetch('/api/admin/keycloak-users', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API-Fehler Response:', errorText)
        throw new Error(t('apiError', { status: response.status, statusText: response.statusText }))
      }

      const users = await response.json()
      setKeycloakUsers(users)
    } catch (error) {
      console.error('❌ Fehler beim Laden der Keycloak-Benutzer:', error)

      // Spezifische Fehlerbehandlung
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setKeycloakError(t('permissionDenied'))
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          setKeycloakError(t('noAdminPermission'))
        } else {
          setKeycloakError(error.message)
        }
      } else {
        setKeycloakError(t('loadingError'))
      }
    } finally {
      setKeycloakLoading(false)
    }
  }, [t])

  // CRUD operations for Keycloak users
  const createKeycloakUser = async (userData: any) => {
    try {
      if (!keycloak?.token) {
        throw new Error(t('notAuthenticated'))
      }

      // Erst Keycloak-Benutzer erstellen
      const response = await fetch('/api/admin/keycloak-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          action: 'create',
          userData,
        }),
      })

      if (!response.ok) {
        throw new Error(t('createErrorWithStatus', { status: response.status }))
      }

      // Dann entsprechende Person erstellen
      if (userData.email) {
        await createOrUpdatePerson(userData, false)
      }

      await loadKeycloakUsers() // Liste neu laden
      return true
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Benutzers:', error)
      throw error
    }
  }

  const updateKeycloakUser = async (userId: string, userData: any) => {
    try {
      if (!keycloak?.token) {
        throw new Error(t('notAuthenticated'))
      }

      // Erst Keycloak-Benutzer aktualisieren
      const response = await fetch('/api/admin/keycloak-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          action: 'update',
          userId,
          userData,
        }),
      })

      if (!response.ok) {
        throw new Error(t('updateErrorWithStatus', { status: response.status }))
      }

      // Dann entsprechende Person aktualisieren (falls E-Mail vorhanden)
      if (userData.email) {
        await createOrUpdatePerson(userData, true)
      }

      await loadKeycloakUsers() // Liste neu laden
      return true
    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren des Benutzers:', error)
      throw error
    }
  }

  useEffect(() => {
    loadKeycloakUsers()
  }, [loadKeycloakUsers])

  // Gefilterte Listen
  const filteredKeycloakUsers = keycloakUsers.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Dialog-Handler mit echten Dialogen
  const openCreateUserDialog = () => {
    setFormDialog({
      open: true,
      mode: 'create',
      user: null,
    })
  }

  const openEditUserDialog = (user: KeycloakUser) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      user,
    })
  }

  const closeFormDialog = () => {
    setFormDialog({
      open: false,
      mode: 'create',
      user: null,
    })
  }

  const openPasswordResetDialog = (user: KeycloakUser) => {
    setPasswordResetDialog({
      open: true,
      user,
    })
  }

  const closePasswordResetDialog = () => {
    setPasswordResetDialog({
      open: false,
      user: null,
    })
  }

  const handlePasswordResetSuccess = () => {
    // Benutzerliste neu laden, um aktualisierte requiredActions zu bekommen
    loadKeycloakUsers()
  }

  const handleClipboardMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleFormSubmit = async (userData: any) => {
    if (formDialog.mode === 'create') {
      // For new users we set default values for enabled and emailVerified
      const userDataWithDefaults = {
        ...userData,
        enabled: true,
        emailVerified: true, // E-Mail automatisch als verifiziert setzen
      }
      await createKeycloakUser(userDataWithDefaults)
    } else if (formDialog.mode === 'edit' && formDialog.user) {
      await updateKeycloakUser(formDialog.user.id!, userData)
    }
    closeFormDialog()
  }

  const openDeleteUserDialog = async (user: KeycloakUser) => {
    setDeleteDialog({
      open: true,
      user,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      user: null,
    })
  }

  const handleDeleteSuccess = () => {
    closeDeleteDialog()
    loadKeycloakUsers() // Liste neu laden
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {t('title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={loadKeycloakUsers}
            startIcon={<RefreshIcon />}
            disabled={keycloakLoading}
          >
            {t('refresh')}
          </Button>
          <Button variant="outlined" onClick={syncAllCompanyIds} disabled={keycloakLoading}>
            {t('syncCompanyIds')}
          </Button>
          <Button variant="contained" onClick={openCreateUserDialog} startIcon={<AddIcon />}>
            {t('newUser')}
          </Button>
        </Box>
      </Box>

      {/* Suchfeld */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Keycloak Benutzer Tabelle */}
      <Paper sx={{ width: '100%' }}>
        {keycloakError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" component="div">
              {keycloakError.split('\n').map((line, index) => (
                <div key={index}>
                  {line.startsWith('Details:') ? (
                    <pre style={{ fontSize: '0.75rem', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                      {line}
                    </pre>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </Typography>
          </Alert>
        )}

        {keycloakLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table.username')}</TableCell>
                  <TableCell>{t('table.firstName')}</TableCell>
                  <TableCell>{t('table.lastName')}</TableCell>
                  <TableCell>{t('table.email')}</TableCell>
                  <TableCell>{t('table.role')}</TableCell>
                  <TableCell>{t('table.status')}</TableCell>
                  <TableCell>{t('table.lastLogin')}</TableCell>
                  <TableCell align="right">{t('table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredKeycloakUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName || '-'}</TableCell>
                    <TableCell>{user.lastName || '-'}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>
                      {user.realmRoles && user.realmRoles.length > 0
                        ? user.realmRoles.map(role => translateRole(role)).join(', ')
                        : translateRole(user.attributes?.role?.[0] || 'user')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={translateStatus(user.enabled)}
                        color={user.enabled ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatLastLogin(user)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('actions.edit')}>
                        <IconButton onClick={() => openEditUserDialog(user)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          // Check if user never had a password (red key)
                          // or only needs to temporarily change new password (normal key)
                          user.requiredActions?.includes('UPDATE_PASSWORD') &&
                          user.attributes?.firstPasswordSet?.[0] !== 'true'
                            ? t('actions.setPassword')
                            : t('actions.resetPassword')
                        }
                      >
                        <IconButton
                          onClick={() => openPasswordResetDialog(user)}
                          size="small"
                          sx={{
                            color:
                              // Red key only for users who never had a password
                              user.requiredActions?.includes('UPDATE_PASSWORD') &&
                              user.attributes?.firstPasswordSet?.[0] !== 'true'
                                ? 'error.main'
                                : 'inherit',
                          }}
                        >
                          {/* Icon-Logik: 
                              - Roter KeyIcon: Benutzer hat noch nie ein Passwort gehabt
                              - Normal KeyIcon: User must change password (temporary)
                              - PasswordIcon: User has valid password */}
                          {user.requiredActions?.includes('UPDATE_PASSWORD') &&
                          user.attributes?.firstPasswordSet?.[0] !== 'true' ? (
                            <KeyIcon />
                          ) : user.requiredActions?.includes('UPDATE_PASSWORD') ? (
                            <KeyIcon />
                          ) : (
                            <PasswordIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('actions.delete')}>
                        <IconButton
                          onClick={() => openDeleteUserDialog(user)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredKeycloakUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('noUsersFound')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* UserFormDialog */}
      <UserFormDialog
        open={formDialog.open}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        mode={formDialog.mode}
        user={formDialog.user}
        loading={keycloakLoading}
      />

      {/* PasswordResetDialog */}
      <PasswordResetDialog
        open={passwordResetDialog.open}
        onClose={closePasswordResetDialog}
        onSuccess={handlePasswordResetSuccess}
        user={passwordResetDialog.user}
        onClipboardMessage={handleClipboardMessage}
      />

      {/* DeleteConfirmDialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
        user={deleteDialog.user}
        mode="user"
      />

      {/* Snackbar for clipboard feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
