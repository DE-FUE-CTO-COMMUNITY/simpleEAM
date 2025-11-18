'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
  Alert,
  Skeleton,
} from '@mui/material'
import {
  Person as PersonIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useAuth, getRoles } from '@/lib/auth'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { GET_PERSON_BY_EMAIL, UPDATE_PERSON, CREATE_PERSON } from '@/graphql/person'
import PasswordChangeDialog from './PasswordChangeDialog'
import AvatarUploadDialog from './AvatarUploadDialog'

interface UserProfileDialogProps {
  open: boolean
  onClose?: () => void
  fullScreen?: boolean
}

interface UserProfileFormData {
  firstName: string
  lastName: string
  email: string
  department: string
  role: string
  phone: string
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onClose,
  fullScreen = false,
}) => {
  const theme = useTheme()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [isEditing, setIsEditing] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  // Auth-Kontext
  const { authenticated } = useAuth()
  const userRoles = getRoles()

  // Keycloak-Instanz für Passwort-Änderung
  const [keycloak, setKeycloak] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/auth').then(({ getKeycloak }) => {
        const kc = getKeycloak()
        setKeycloak(kc)

        // E-Mail aus dem Keycloak-Token extrahieren
        if (kc?.tokenParsed?.email) {
          setUserEmail(kc.tokenParsed.email)
        }
      })
    }
  }, [])

  // GraphQL query for Person data based on email
  const { loading, error, data, refetch } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated,
  })

  // Update-Mutation
  const [updatePerson, { loading: updateLoading }] = useMutation(UPDATE_PERSON, {
    onCompleted: () => {
      enqueueSnackbar('Profil erfolgreich aktualisiert', { variant: 'success' })
      setIsEditing(false)
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren: ${error.message}`, { variant: 'error' })
    },
  })

  // Create-Mutation für neue Personen
  const [createPerson, { loading: createLoading }] = useMutation(CREATE_PERSON, {
    onCompleted: () => {
      enqueueSnackbar('Profil erfolgreich erstellt', { variant: 'success' })
      setIsEditing(false)
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen: ${error.message}`, { variant: 'error' })
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: '',
      phone: '',
    },
    onSubmit: async value => {
      try {
        if (!data?.people || data.people.length === 0) {
          // Neue Person erstellen
          await createPerson({
            variables: {
              input: [
                {
                  firstName: value.value.firstName,
                  lastName: value.value.lastName,
                  email: value.value.email,
                  department: value.value.department,
                  role: value.value.role,
                  phone: value.value.phone,
                },
              ],
            },
          })
        } else {
          // Bestehende Person aktualisieren
          const person = data.people[0]
          await updatePerson({
            variables: {
              id: person.id,
              input: {
                firstName: { set: value.value.firstName },
                lastName: { set: value.value.lastName },
                email: { set: value.value.email },
                department: { set: value.value.department },
                role: { set: value.value.role },
                phone: { set: value.value.phone },
              },
            },
          })
        }
      } catch (err) {
        console.error('Submit error:', err)
      }
    },
    validators: {
      // Primary validation on changes
      onChange: undefined,
      // Validation on submit
      onSubmit: undefined,
    },
  })

  // Formular mit aktuellen Daten füllen
  useEffect(() => {
    if (data?.people && data.people.length > 0) {
      // Person gefunden - mit Datenbankdaten füllen
      const person = data.people[0]
      form.setFieldValue('firstName', person.firstName || '')
      form.setFieldValue('lastName', person.lastName || '')
      form.setFieldValue('email', person.email || '')
      form.setFieldValue('department', person.department || '')
      form.setFieldValue('role', person.role || '')
      form.setFieldValue('phone', person.phone || '')
    } else if (keycloak?.tokenParsed && userEmail && !loading) {
      // Keine Person gefunden - mit Keycloak-Daten initialisieren
      const tokenData = keycloak.tokenParsed
      form.setFieldValue('firstName', tokenData.given_name || '')
      form.setFieldValue('lastName', tokenData.family_name || '')
      form.setFieldValue('email', userEmail)
      form.setFieldValue('department', tokenData.department || '')
      form.setFieldValue(
        'role',
        tokenData.realm_access?.roles?.find(
          (role: string) =>
            role !== 'offline_access' &&
            role !== 'uma_authorization' &&
            role !== 'default-roles-simple-eam'
        ) || ''
      )
      form.setFieldValue('phone', tokenData.phone_number || '')

      // Automatisch in Bearbeitungsmodus setzen für neue Profile
      setIsEditing(true)
    }
  }, [data?.people, keycloak?.tokenParsed, userEmail, loading, form])

  const handleChangePassword = () => {
    setPasswordDialogOpen(true)
  }

  const handleClose = () => {
    if (fullScreen) {
      router.push('/')
    } else {
      onClose?.()
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Änderungen verwerfen
      if (data?.people && data.people.length > 0) {
        // Bestehende Person - Datenbankdaten wiederherstellen
        const person = data.people[0]
        form.setFieldValue('firstName', person.firstName || '')
        form.setFieldValue('lastName', person.lastName || '')
        form.setFieldValue('email', person.email || '')
        form.setFieldValue('department', person.department || '')
        form.setFieldValue('role', person.role || '')
        form.setFieldValue('phone', person.phone || '')
      } else if (keycloak?.tokenParsed && userEmail) {
        // Neue Person - Keycloak-Daten wiederherstellen
        const tokenData = keycloak.tokenParsed
        form.setFieldValue('firstName', tokenData.given_name || '')
        form.setFieldValue('lastName', tokenData.family_name || '')
        form.setFieldValue('email', userEmail)
        form.setFieldValue('department', tokenData.department || '')
        form.setFieldValue(
          'role',
          tokenData.realm_access?.roles?.find(
            (role: string) =>
              role !== 'offline_access' &&
              role !== 'uma_authorization' &&
              role !== 'default-roles-simple-eam'
          ) || ''
        )
        form.setFieldValue('phone', tokenData.phone_number || '')
      }
    }
    setIsEditing(!isEditing)
  }

  const getUserInitials = () => {
    if (keycloak?.tokenParsed) {
      const firstName = keycloak.tokenParsed.given_name || ''
      const lastName = keycloak.tokenParsed.family_name || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  const getDisplayName = () => {
    if (keycloak?.tokenParsed) {
      const firstName = keycloak.tokenParsed.given_name || ''
      const lastName = keycloak.tokenParsed.family_name || ''
      return (
        `${firstName} ${lastName}`.trim() ||
        keycloak.tokenParsed.preferred_username ||
        'Unbekannter Benutzer'
      )
    }
    return 'Unbekannter Benutzer'
  }

  const getUserEmail = () => {
    return keycloak?.tokenParsed?.email || 'Keine E-Mail verfügbar'
  }

  const renderField = (
    name: keyof UserProfileFormData,
    label: string,
    icon: React.ReactNode,
    multiline = false
  ) => (
    <form.Field name={name}>
      {field => (
        <Grid size={{ xs: 12, sm: multiline ? 12 : 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ mt: 2, color: 'text.secondary' }}>{icon}</Box>
            <Box sx={{ flex: 1 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label={label}
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  multiline={multiline}
                  rows={multiline ? 3 : 1}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {label}
                  </Typography>
                  <Typography variant="body1">{field.state.value || '-'}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      )}
    </form.Field>
  )

  if (!authenticated) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen || isSmallScreen}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Benutzerprofil</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)} size="small">
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Card elevation={0} sx={{ bgcolor: 'background.default' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={data?.people?.[0]?.avatarUrl || undefined}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                    }}
                  >
                    {!data?.people?.[0]?.avatarUrl && getUserInitials()}
                  </Avatar>
                  <IconButton
                    size="small"
                    onClick={() => setAvatarDialogOpen(true)}
                    sx={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {getDisplayName()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {getUserEmail()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {userRoles.map(role => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info für neue Profile */}
        {!loading && (!data?.people || data.people.length === 0) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Ihr Profil wurde noch nicht erstellt. Die Felder wurden automatisch mit Ihren
              Keycloak-Daten befüllt. Bitte überprüfen und speichern Sie Ihre Daten.
            </Typography>
          </Alert>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          {' '}
          <Grid container spacing={3}>
            {loading ? (
              // Loading-Skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              ))
            ) : (
              <>
                {renderField('firstName', 'Vorname', <PersonIcon />)}
                {renderField('lastName', 'Nachname', <PersonIcon />)}
                {renderField('email', 'E-Mail', <EmailIcon />)}
                {renderField('department', 'Abteilung', <BusinessIcon />)}
                {renderField('role', 'Rolle', <BadgeIcon />)}
                {renderField('phone', 'Telefon', <PhoneIcon />)}
              </>
            )}
          </Grid>
        </form>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Sicherheit
          </Typography>
          <Card elevation={0} sx={{ bgcolor: 'background.default' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <KeyIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">Passwort ändern</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ändern Sie Ihr Passwort sicher über den Dialog
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" startIcon={<KeyIcon />} onClick={handleChangePassword}>
                  Passwort ändern
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Fehler beim Laden der Profildaten: {error.message}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleEditToggle} startIcon={<CancelIcon />} variant="outlined">
              Abbrechen
            </Button>
            <Button
              onClick={() => form.handleSubmit()}
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={loading || updateLoading || createLoading}
            >
              {!data?.people || data.people.length === 0 ? 'Profil erstellen' : 'Speichern'}
            </Button>
          </Box>
        ) : (
          <Button onClick={handleClose} variant="outlined">
            Schließen
          </Button>
        )}
      </DialogActions>

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        currentAvatarUrl={data?.people?.[0]?.avatarUrl}
        onAvatarChanged={() => {
          refetch() // Profildaten aktualisieren
        }}
      />
    </Dialog>
  )
}

export default UserProfileDialog
