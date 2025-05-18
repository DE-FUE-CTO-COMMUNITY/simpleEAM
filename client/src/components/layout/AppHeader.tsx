import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import UserProfileMenu from './UserProfileMenu'

interface AppHeaderProps {
  open: boolean
  drawerWidth: number
  authenticated: boolean
  userName: string
  handleDrawerToggle: () => void
}

const AppHeader: React.FC<AppHeaderProps> = ({
  open,
  drawerWidth,
  authenticated,
  userName,
  handleDrawerToggle,
}) => {
  const theme = useTheme()

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        ml: open ? `${drawerWidth}px` : 0,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Simple EAM
        </Typography>
        {authenticated && <UserProfileMenu userName={userName} />}
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader
