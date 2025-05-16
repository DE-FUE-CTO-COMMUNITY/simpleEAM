import React, { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from '@mui/material'
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Apps as AppsIcon,
  DataObject as DataObjectIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Architecture as ArchitectureIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import AtosLogo from '../common/AtosLogo'
import { useAuth, logout, isAdmin } from '@/lib/auth'

// Konstanten und Styles
const drawerWidth = 240

// Styled-Komponenten für das Layout
const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
)

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
}))

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { keycloak, authenticated } = useAuth()
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    logout()
  }

  const userName = (authenticated && keycloak?.tokenParsed?.preferred_username) || 'Benutzer'
  const userInitial = userName.charAt(0).toUpperCase()

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
    { text: 'Architekturen', icon: <ArchitectureIcon />, href: '/architectures' },
    { text: 'Business Capabilities', icon: <BusinessIcon />, href: '/capabilities' },
    { text: 'Applikationen', icon: <AppsIcon />, href: '/applications' },
    { text: 'Datenobjekte', icon: <DataObjectIcon />, href: '/dataobjects' },
    { text: 'Personen', icon: <PersonIcon />, href: '/persons' },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
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
          {authenticated && (
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
                <MenuItem onClick={() => router.push('/profile')}>
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
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: [1],
          }}
        >
          {open && <AtosLogo height={30} />}
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <Link
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%',
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: isActive(item.href)
                      ? theme.palette.primary.lighter
                      : 'transparent',
                    color: isActive(item.href) ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isActive(item.href) ? theme.palette.primary.main : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: isActive(item.href) ? 500 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <Toolbar /> {/* Spacer für die AppBar */}
        {children}
      </Main>
    </Box>
  )
}

export default RootLayout
