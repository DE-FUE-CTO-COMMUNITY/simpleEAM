import React, { useState, useEffect } from 'react'
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material'
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { isAdmin, logout, useAuth } from '@/lib/auth'
import { useQuery } from '@apollo/client'
import { GET_PERSON_BY_EMAIL } from '@/graphql/person'
import UserProfileDialog from '@/components/profile/UserProfileDialog'

interface UserProfileMenuProps {
  userName: string
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userName }) => {
  const theme = useTheme()
  const router = useRouter()
  const { authenticated } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [keycloak, setKeycloak] = useState<any>(null)

  // Keycloak initialisieren und E-Mail extrahieren
  useEffect(() => {
    if (typeof window !== 'undefined' && authenticated) {
      import('@/lib/auth').then(({ getKeycloak }) => {
        const kc = getKeycloak()
        setKeycloak(kc)
        if (kc?.tokenParsed?.email) {
          setUserEmail(kc.tokenParsed.email)
        }
      })
    }
  }, [authenticated])

  // GraphQL-Abfrage für Person-Daten basierend auf E-Mail
  const { data } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated,
  })

  const getUserInitials = () => {
    if (keycloak?.tokenParsed) {
      const firstName = keycloak.tokenParsed.given_name || ''
      const lastName = keycloak.tokenParsed.family_name || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return userName.charAt(0).toUpperCase()
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    handleProfileMenuClose()
    setProfileDialogOpen(true)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    logout()
  }

  const avatarUrl = data?.people?.[0]?.avatarUrl

  return (
    <>
      <Tooltip title={userName}>
        <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ ml: 2 }}>
          <Avatar
            src={avatarUrl || undefined}
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.secondary.main,
              fontSize: 14,
            }}
          >
            {!avatarUrl && getUserInitials()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{ mt: '45px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">{userName}</Typography>
        </MenuItem>
        <Divider />
        {isAdmin() && (
          <MenuItem onClick={() => router.push('/admin')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Administration</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abmelden</ListItemText>
        </MenuItem>
      </Menu>

      <UserProfileDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} />
    </>
  )
}

export default UserProfileMenu
