import React, { useState } from 'react'
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
import { isAdmin, logout } from '@/lib/auth'
import UserProfileDialog from '@/components/profile/UserProfileDialog'

interface UserProfileMenuProps {
  userName: string
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userName }) => {
  const theme = useTheme()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const userInitial = userName.charAt(0).toUpperCase()

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

  return (
    <>
      <Tooltip title={userName}>
        <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
            {userInitial}
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
      
      <UserProfileDialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)} 
      />
    </>
  )
}

export default UserProfileMenu
