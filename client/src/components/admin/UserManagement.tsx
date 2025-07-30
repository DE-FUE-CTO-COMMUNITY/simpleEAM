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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  VpnKey as PasswordIcon,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { KeycloakUser } from '@/lib/keycloak-admin'
import { KeycloakUserAlt } from '@/lib/keycloak-admin-alt'
import UserFormDialog from './UserFormDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import PasswordResetDialog from './PasswordResetDialog'

export default function UserManagement() {
  const t = useTranslations('admin.userManagement')
  const [keycloakUsers, setKeycloakUsers] = useState<(KeycloakUser | KeycloakUserAlt)[]>([])
  const [keycloakLoading, setKeycloakLoading] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Hilfsfunktion für Rollenübersetzung
  const translateRole = (role: string): string => {
    const roleKey = role.toLowerCase()
    try {
      return t(`roles.${roleKey}` as any)
    } catch {
      return role // Fallback auf ursprünglichen Wert
    }
  }

  // Hilfsfunktion für Status-Übersetzung
  const translateStatus = (enabled: boolean | undefined): string => {
    return enabled ? t('status.active') : t('status.inactive')
  }

  // Hilfsfunktion für E-Mail-Verifikation-Übersetzung
  const translateEmailVerification = (verified: boolean | undefined): string => {
    return verified ? t('emailVerification.verified') : t('emailVerification.notVerified')
  }

  // Dialog States
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit',
    user: null as (KeycloakUser | KeycloakUserAlt) | null,
  })

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null as (KeycloakUser | KeycloakUserAlt) | null,
  })

  const [passwordResetDialog, setPasswordResetDialog] = useState({
    open: false,
    user: null as (KeycloakUser | KeycloakUserAlt) | null,
  })

  // Keycloak Benutzer laden
  const loadKeycloakUsers = useCallback(async () => {
    setKeycloakLoading(true)
    setKeycloakError(null)

    try {
      console.log('🔄 Lade Keycloak-Benutzer über API-Route...')

      const response = await fetch('/api/admin/keycloak-users')
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status} ${response.statusText}`)
      }

      const users = await response.json()
      console.log('✅ Keycloak-Benutzer erfolgreich geladen:', users.length)
      setKeycloakUsers(users)
    } catch (error) {
      console.error('❌ Fehler beim Laden der Keycloak-Benutzer:', error)
      setKeycloakError(t('loadingError'))
    } finally {
      setKeycloakLoading(false)
    }
  }, [t])

  // CRUD-Operationen für Keycloak-Benutzer
  const createKeycloakUser = async (userData: any) => {
    try {
      const response = await fetch('/api/admin/keycloak-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          userData,
        }),
      })

      if (!response.ok) {
        throw new Error(`Fehler beim Erstellen: ${response.status}`)
      }

      console.log('✅ Benutzer erfolgreich erstellt')
      await loadKeycloakUsers() // Liste neu laden
      return true
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Benutzers:', error)
      throw error
    }
  }

  const updateKeycloakUser = async (userId: string, userData: any) => {
    try {
      const response = await fetch('/api/admin/keycloak-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          userId,
          userData,
        }),
      })

      if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren: ${response.status}`)
      }

      console.log('✅ Benutzer erfolgreich aktualisiert')
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

  const openEditUserDialog = (user: KeycloakUser | KeycloakUserAlt) => {
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

  const openPasswordResetDialog = (user: KeycloakUser | KeycloakUserAlt) => {
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
    // Erfolgsmeldung könnte hier hinzugefügt werden
    console.log('Passwort erfolgreich zurückgesetzt')
  }

  const handleFormSubmit = async (userData: any) => {
    if (formDialog.mode === 'create') {
      // Für neue Benutzer setzen wir Standardwerte für enabled und emailVerified
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

  const openDeleteUserDialog = async (user: KeycloakUser | KeycloakUserAlt) => {
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
                  <TableCell>{t('table.emailVerified')}</TableCell>
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
                    <TableCell>
                      <Chip
                        label={translateEmailVerification(user.emailVerified)}
                        color={user.emailVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('actions.edit')}>
                        <IconButton onClick={() => openEditUserDialog(user)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('actions.resetPassword')}>
                        <IconButton onClick={() => openPasswordResetDialog(user)} size="small">
                          <PasswordIcon />
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
      />

      {/* DeleteConfirmDialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
        user={deleteDialog.user}
        mode="user"
      />
    </Box>
  )
}
