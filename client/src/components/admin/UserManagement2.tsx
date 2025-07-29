'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  Person as PersonIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { GET_PEOPLE } from '@/lib/queries/person-queries'
import { getUsers, KeycloakUser, KeycloakAdminError } from '@/lib/keycloak-admin'
import { Person } from '@/gql/generated'
import UserFormDialog from './UserFormDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function UserManagement() {
  const [currentTab, setCurrentTab] = useState(0)
  const [keycloakUsers, setKeycloakUsers] = useState<KeycloakUser[]>([])
  const [keycloakLoading, setKeycloakLoading] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Dialog States
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit',
    user: null as KeycloakUser | null,
    personId: null as string | null,
  })

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null as KeycloakUser | null,
    person: null as Person | null,
    mode: 'user' as 'user' | 'person' | 'both',
  })

  // GraphQL Query für Personen
  const {
    data: peopleData,
    loading: peopleLoading,
    error: peopleError,
    refetch: refetchPeople,
  } = useQuery(GET_PEOPLE)

  const people = peopleData?.people || []

  // Keycloak Benutzer laden
  const loadKeycloakUsers = async () => {
    setKeycloakLoading(true)
    setKeycloakError(null)

    try {
      const users = await getUsers()
      setKeycloakUsers(users)
    } catch (error) {
      console.error('Fehler beim Laden der Keycloak-Benutzer:', error)
      if (error instanceof KeycloakAdminError) {
        setKeycloakError(`Keycloak-Fehler: ${error.message}`)
      } else {
        setKeycloakError('Fehler beim Laden der Keycloak-Benutzer')
      }
    } finally {
      setKeycloakLoading(false)
    }
  }

  useEffect(() => {
    loadKeycloakUsers()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  // Gefilterte Listen
  const filteredKeycloakUsers = keycloakUsers.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPeople = people.filter(
    (person: Person) =>
      person.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Dialog Handlers
  const openCreateUserDialog = () => {
    setFormDialog({
      open: true,
      mode: 'create',
      user: null,
      personId: null,
    })
  }

  const openEditUserDialog = (user: KeycloakUser) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      user,
      personId: null,
    })
  }

  const openEditPersonDialog = (person: Person) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      user: null,
      personId: person.id,
    })
  }

  const openDeleteUserDialog = (user: KeycloakUser) => {
    setDeleteDialog({
      open: true,
      user,
      person: null,
      mode: 'user',
    })
  }

  const openDeletePersonDialog = (person: Person) => {
    setDeleteDialog({
      open: true,
      user: null,
      person,
      mode: 'person',
    })
  }

  const closeFormDialog = () => {
    setFormDialog({
      open: false,
      mode: 'create',
      user: null,
      personId: null,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      user: null,
      person: null,
      mode: 'user',
    })
  }

  const handleFormSuccess = () => {
    closeFormDialog()
    loadKeycloakUsers()
    refetchPeople()
  }

  const handleDeleteSuccess = () => {
    closeDeleteDialog()
    loadKeycloakUsers()
    refetchPeople()
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

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Benutzerverwaltung Tabs">
          <Tab
            label={`Keycloak Benutzer (${filteredKeycloakUsers.length})`}
            icon={<AccountBoxIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Personen (${filteredPeople.length})`}
            icon={<PersonIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Keycloak Benutzer Tab */}
        <TabPanel value={currentTab} index={0}>
          {keycloakError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {keycloakError}
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
                    <TableCell>Name</TableCell>
                    <TableCell>E-Mail</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>E-Mail verifiziert</TableCell>
                    <TableCell align="right">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredKeycloakUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : '-'}
                      </TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
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
                      <TableCell colSpan={6} align="center">
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
        </TabPanel>

        {/* Personen Tab */}
        <TabPanel value={currentTab} index={1}>
          {peopleError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Fehler beim Laden der Personen: {peopleError.message}
            </Alert>
          )}

          {peopleLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>E-Mail</TableCell>
                    <TableCell>Telefon</TableCell>
                    <TableCell>Abteilung</TableCell>
                    <TableCell>Rolle</TableCell>
                    <TableCell align="right">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPeople.map((person: Person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        {person.firstName && person.lastName
                          ? `${person.firstName} ${person.lastName}`
                          : '-'}
                      </TableCell>
                      <TableCell>{person.email || '-'}</TableCell>
                      <TableCell>{person.phone || '-'}</TableCell>
                      <TableCell>{person.department || '-'}</TableCell>
                      <TableCell>{person.role || '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Bearbeiten">
                          <IconButton onClick={() => openEditPersonDialog(person)} size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                          <IconButton
                            onClick={() => openDeletePersonDialog(person)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPeople.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Keine Personen gefunden
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Dialoge */}
      <UserFormDialog
        open={formDialog.open}
        onClose={closeFormDialog}
        onSuccess={handleFormSuccess}
        mode={formDialog.mode}
        user={formDialog.user}
        personId={formDialog.personId}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
        user={deleteDialog.user}
        person={deleteDialog.person}
        mode={deleteDialog.mode}
      />
    </Box>
  )
}
