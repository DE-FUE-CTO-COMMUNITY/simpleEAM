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
import Logo from '../common/Logo'

// Konstanten und Styles
const drawerWidth = 240

// Styled components for layout
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
  href?: string
  onClick?: () => void
  isDivider?: boolean
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
        {open && <Logo height={30} sx={{ ml: '58px' }} />}
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          // Render divider if isDivider is true
          if (item.isDivider) {
            return <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          }

          const content = (
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                backgroundColor:
                  item.href && isActive(item.href) ? theme.palette.primary.main : 'transparent',
                color:
                  item.href && isActive(item.href) ? theme.palette.primary.contrastText : 'inherit',
              }}
              onClick={item.onClick}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color:
                    item.href && isActive(item.href)
                      ? theme.palette.primary.contrastText
                      : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: item.href && isActive(item.href) ? 500 : 400,
                  },
                }}
              />
            </ListItemButton>
          )

          return (
            <ListItem key={item.text} disablePadding>
              {item.href ? (
                <Link
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </ListItem>
          )
        })}
      </List>
    </StyledDrawer>
  )
}

export { drawerWidth }
export default Sidebar
