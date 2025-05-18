import React from 'react'
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled,
  Theme,
  useTheme,
} from '@mui/material'
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material'
import MuiDrawer from '@mui/material/Drawer'
import Link from 'next/link'
import AtosLogo from '../common/AtosLogo'

// Konstanten und Styles
const drawerWidth = 240

// Styled-Komponenten für das Layout
const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden' as const,
})

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden' as const,
  width: `calc(${theme.spacing(7)} + 1px)`,
})

interface DrawerProps {
  open?: boolean
}

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})<DrawerProps>(({ theme, open }) => ({
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
}))

interface MenuItem {
  text: string
  icon: React.ReactNode
  href: string
}

interface SidebarProps {
  open: boolean
  menuItems: MenuItem[]
  handleDrawerToggle: () => void
  isActive: (href: string) => boolean
}

const Sidebar: React.FC<SidebarProps> = ({ open, menuItems, handleDrawerToggle, isActive }) => {
  const theme = useTheme()

  return (
    <StyledDrawer variant="permanent" open={open}>
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
                    ? theme.palette.primary.light
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
    </StyledDrawer>
  )
}

export { drawerWidth }
export default Sidebar
