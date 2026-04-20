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
import { CREATE_PERSON, UPDATE_PERSON, DELETE_PERSON, GET_PERSON_BY_EMAIL } from '@/graphql/person'
import UserFormDialog from './UserFormDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import PasswordResetDialog from './PasswordResetDialog'

interface PersonSyncOptions {
  previousEmail?: string | null
}

interface PersonSyncCandidate {
  id: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  role?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  companies?: Array<{ id: string }>
  ownedCapabilities?: Array<{ id: string }>
  ownedApplications?: Array<{ id: string }>
  ownedDataObjects?: Array<{ id: string }>
  ownedArchitectures?: Array<{ id: string }>
  ownedDiagrams?: Array<{ id: string }>
  ownedInfrastructure?: Array<{ id: string }>
  ownedInterfaces?: Array<{ id: string }>
  ownedAIComponents?: Array<{ id: string }>
  ownedBusinessProcesses?: Array<{ id: string }>
  ownedGEAVisions?: Array<{ id: string }>
  ownedGEAMissions?: Array<{ id: string }>
  ownedGEAValues?: Array<{ id: string }>
  ownedGEAGoals?: Array<{ id: string }>
  ownedGEAStrategies?: Array<{ id: string }>
  createdAnalyticsReports?: Array<{ id: string }>
  createdAnalyticsReportFolders?: Array<{ id: string }>
}

export default function UserManagement() {
  const t = useTranslations('admin.userManagement')
  const locale = useLocale()
  const [keycloakUsers, setKeycloakUsers] = useState<KeycloakUser[]>([])
  const [keycloakLoading, setKeycloakLoading] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const roleTranslationKey = (role: string): string | null => {
    switch (role.toLowerCase()) {
      case 'company-admin':
        return 'companyAdmin'
      case 'admin':
        return 'admin'
      case 'architect':
        return 'architect'
      case 'viewer':
        return 'viewer'
      default:
        return null
    }
  }

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

  const [deletePerson] = useMutation(DELETE_PERSON, {
    onError: error => {
      console.error('❌ Fehler beim Löschen der Person:', error)
    },
  })

  const [findPersonByEmail] = useLazyQuery(GET_PERSON_BY_EMAIL, {
    fetchPolicy: 'no-cache',
    onError: error => {
      console.error('❌ Fehler beim Suchen der Person:', error)
    },
  })

  const normalizeOptionalField = (value: unknown): string | null => {
    if (typeof value !== 'string') {
      return null
    }

    const trimmedValue = value.trim()
    return trimmedValue.length > 0 ? trimmedValue : null
  }

  const normalizeRequiredEmail = (value: unknown): string => {
    const normalizedEmail = normalizeOptionalField(value)?.toLowerCase()

    if (!normalizedEmail) {
      throw new Error(t('personSync.emailRequired'))
    }

    return normalizedEmail
  }

  const buildPersonCreateData = (userData: any, email: string) => ({
    firstName: normalizeOptionalField(userData.firstName) || '',
    lastName: normalizeOptionalField(userData.lastName) || '',
    email,
    department: normalizeOptionalField(userData.department),
    role: normalizeOptionalField(userData.role),
    phone: normalizeOptionalField(userData.phone),
  })

  const buildPersonUpdateData = (userData: any, email: string) => ({
    firstName: { set: normalizeOptionalField(userData.firstName) || '' },
    lastName: { set: normalizeOptionalField(userData.lastName) || '' },
    email: { set: email },
    department: { set: normalizeOptionalField(userData.department) },
    role: { set: normalizeOptionalField(userData.role) },
    phone: { set: normalizeOptionalField(userData.phone) },
  })

  const getPeopleByEmail = async (email: string): Promise<PersonSyncCandidate[]> => {
    const { data } = await findPersonByEmail({
      variables: { email },
      fetchPolicy: 'no-cache',
    })

    return (data?.people ?? []) as PersonSyncCandidate[]
  }

  const buildEmailCandidates = (values: Array<string | null | undefined>) => {
    const candidates = new Set<string>()

    for (const value of values) {
      const trimmedValue = normalizeOptionalField(value)

      if (!trimmedValue) {
        continue
      }

      candidates.add(trimmedValue)
      candidates.add(trimmedValue.toLowerCase())
    }

    return Array.from(candidates)
  }

  const getPeopleByEmails = async (emails: string[]) => {
    const peopleById = new Map<string, PersonSyncCandidate>()

    for (const email of emails) {
      const people = await getPeopleByEmail(email)

      for (const person of people) {
        peopleById.set(person.id, person)
      }
    }

    return Array.from(peopleById.values())
  }

  const getPersonLinkCount = (person: PersonSyncCandidate) => {
    return [
      person.companies,
      person.ownedCapabilities,
      person.ownedApplications,
      person.ownedDataObjects,
      person.ownedArchitectures,
      person.ownedDiagrams,
      person.ownedInfrastructure,
      person.ownedInterfaces,
      person.ownedAIComponents,
      person.ownedBusinessProcesses,
      person.ownedGEAVisions,
      person.ownedGEAMissions,
      person.ownedGEAValues,
      person.ownedGEAGoals,
      person.ownedGEAStrategies,
      person.createdAnalyticsReports,
      person.createdAnalyticsReportFolders,
    ].reduce((total, entries) => total + (entries?.length ?? 0), 0)
  }

  const selectCanonicalPerson = (people: PersonSyncCandidate[]) => {
    return [...people].sort((left, right) => {
      const linkCountDifference = getPersonLinkCount(right) - getPersonLinkCount(left)

      if (linkCountDifference !== 0) {
        return linkCountDifference
      }

      const leftTimestamp = Date.parse(left.updatedAt || left.createdAt || '') || 0
      const rightTimestamp = Date.parse(right.updatedAt || right.createdAt || '') || 0

      if (leftTimestamp !== rightTimestamp) {
        return leftTimestamp - rightTimestamp
      }

      return left.id.localeCompare(right.id)
    })[0]
  }

  const cleanupDuplicatePersons = async (
    canonicalPerson: PersonSyncCandidate,
    people: PersonSyncCandidate[],
    email: string
  ) => {
    const duplicatePeople = people.filter(person => person.id !== canonicalPerson.id)

    if (duplicatePeople.length === 0) {
      return
    }

    const removableDuplicates = duplicatePeople.filter(person => getPersonLinkCount(person) === 0)
    const blockedDuplicates = duplicatePeople.filter(person => getPersonLinkCount(person) > 0)

    if (blockedDuplicates.length > 0) {
      throw new Error(
        t('personSync.duplicateConflict', {
          email,
          count: blockedDuplicates.length + 1,
        })
      )
    }

    for (const duplicatePerson of removableDuplicates) {
      await deletePerson({
        variables: { id: duplicatePerson.id },
      })
    }
  }

  // Validates and synchronizes the backing Person record for a Keycloak user save.
  const synchronizePersonForUser = async (userData: any, options: PersonSyncOptions = {}) => {
    const email = normalizeRequiredEmail(userData.email)
    const emailCandidates = buildEmailCandidates([userData.email, options.previousEmail])
    const matchingPeople = await getPeopleByEmails(emailCandidates)
    const canonicalPerson = matchingPeople.length > 0 ? selectCanonicalPerson(matchingPeople) : null

    if (canonicalPerson) {
      await cleanupDuplicatePersons(canonicalPerson, matchingPeople, email)
      await updatePerson({
        variables: {
          id: canonicalPerson.id,
          input: buildPersonUpdateData(userData, email),
        },
      })
    } else {
      await createPerson({
        variables: {
          input: [buildPersonCreateData(userData, email)],
        },
      })
    }

    const verifiedPeople = await getPeopleByEmails(buildEmailCandidates([email]))

    if (verifiedPeople.length > 1) {
      throw new Error(
        t('personSync.duplicateConflict', {
          email,
          count: verifiedPeople.length,
        })
      )
    }

    const verifiedPerson = verifiedPeople[0] ?? null

    if (!verifiedPerson?.id) {
      throw new Error(t('personSync.verificationFailed', { email }))
    }

    return verifiedPerson
  }

  const rollbackCreatedKeycloakUser = async (userId: string) => {
    if (!keycloak?.token) {
      throw new Error(t('notAuthenticated'))
    }

    const response = await fetch('/api/admin/keycloak-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({
        action: 'delete',
        userId,
      }),
    })

    if (!response.ok) {
      throw new Error(t('personSync.rollbackFailed'))
    }
  }

  const translateRole = (role: string): string => {
    const roleKey = roleTranslationKey(role)
    if (!roleKey) {
      return role
    }
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
    let createdUserId: string | null = null

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

      const result = await response.json().catch(() => null)
      createdUserId = result?.userId ?? null

      // Dann entsprechende Person erstellen und das Ergebnis direkt verifizieren.
      if (userData.email) {
        await synchronizePersonForUser(userData)
      }

      await loadKeycloakUsers() // Liste neu laden
      return true
    } catch (error) {
      let errorMessage =
        error instanceof Error
          ? error.message
          : t('personSync.createFailed', { reason: t('syncFailed') })

      if (createdUserId) {
        try {
          await rollbackCreatedKeycloakUser(createdUserId)
          errorMessage = t('personSync.createFailed', { reason: errorMessage })
        } catch (rollbackError) {
          const rollbackMessage =
            rollbackError instanceof Error ? rollbackError.message : t('personSync.rollbackFailed')
          errorMessage = t('personSync.createRollbackFailed', {
            reason: errorMessage,
            rollbackReason: rollbackMessage,
          })
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })

      await loadKeycloakUsers()
      console.error('❌ Fehler beim Erstellen des Benutzers:', error)
      throw new Error(errorMessage)
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

      // Dann entsprechende Person aktualisieren oder fehlend nacherstellen.
      if (userData.email) {
        await synchronizePersonForUser(userData, {
          previousEmail: formDialog.user?.email,
        })
      }

      await loadKeycloakUsers() // Liste neu laden
      return true
    } catch (error) {
      const errorMessage = t('personSync.updateFailed', {
        reason: error instanceof Error ? error.message : t('syncFailed'),
      })

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })

      await loadKeycloakUsers()
      console.error('❌ Fehler beim Aktualisieren des Benutzers:', error)
      throw new Error(errorMessage)
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
