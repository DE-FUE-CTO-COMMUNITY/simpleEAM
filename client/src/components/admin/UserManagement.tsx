'use client'

import React, { useState, useEffect } from 'react'
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
} from '@mui/icons-material'
import { KeycloakUser } from '@/lib/keycloak-admin'
import { KeycloakUserAlt } from '@/lib/keycloak-admin-alt'
import UserFormDialog from './UserFormDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export default function UserManagement() {
  const [keycloakUsers, setKeycloakUsers] = useState<(KeycloakUser | KeycloakUserAlt)[]>([])
  const [keycloakLoading, setKeycloakLoading] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  // Keycloak Benutzer laden
  const loadKeycloakUsers = async () => {
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
      setKeycloakError('Fehler beim Laden der Keycloak-Benutzer')
    } finally {
      setKeycloakLoading(false)
    }
  }

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
  }, [])

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
          Benutzerverwaltung
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={loadKeycloakUsers}
            startIcon={<RefreshIcon />}
            disabled={keycloakLoading}
          >
            Aktualisieren
          </Button>
          <Button variant="contained" onClick={openCreateUserDialog} startIcon={<AddIcon />}>
            Neuer Benutzer
          </Button>
        </Box>
      </Box>

      {/* Suchfeld */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Benutzer suchen..."
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
                  <TableCell>Benutzername</TableCell>
                  <TableCell>Vorname</TableCell>
                  <TableCell>Nachname</TableCell>
                  <TableCell>E-Mail</TableCell>
                  <TableCell>Rolle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>E-Mail verifiziert</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
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
                        ? user.realmRoles.join(', ')
                        : user.attributes?.role?.[0] || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.enabled ? 'Aktiv' : 'Deaktiviert'}
                        color={user.enabled ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.emailVerified ? 'Verifiziert' : 'Nicht verifiziert'}
                        color={user.emailVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Bearbeiten">
                        <IconButton onClick={() => openEditUserDialog(user)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Löschen">
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
                        Keine Benutzer gefunden
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
