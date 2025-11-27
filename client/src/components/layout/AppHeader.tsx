import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  Box,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import UserProfileMenu from './UserProfileMenu'
import ThemeToggleButton from '../ui/ThemeToggleButton'
import { useCompanyContext } from '@/contexts/CompanyContext'

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
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    isCompanySelectionLocked,
    companySelectionLockReason,
  } = useCompanyContext()
  const hasMultipleCompanies = (companies?.length ?? 0) > 1

  const renderCompanySelector = () => {
    if (!companies || companies.length === 0) {
      return null
    }

    const selector = (
      <Select
        size="small"
        value={selectedCompanyId || ''}
        onChange={e => setSelectedCompanyId(e.target.value as string)}
        disabled={isCompanySelectionLocked}
        sx={{
          color: 'inherit',
          borderColor: 'rgba(255,255,255,0.7)',
          '& .MuiSelect-icon': { color: 'inherit' },
          minWidth: 200,
          bgcolor: 'rgba(255,255,255,0.08)',
        }}
      >
        {companies.map(c => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    )

    if (!isCompanySelectionLocked) {
      return selector
    }

    return (
      <Tooltip
        title={companySelectionLockReason ?? 'Company selection is temporarily locked.'}
        placement="bottom"
        arrow
      >
        <span style={{ display: 'inline-flex' }}>{selector}</span>
      </Tooltip>
    )
  }

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap component="div" sx={{ whiteSpace: 'nowrap' }}>
            Simple Enterprise Architecture Management
          </Typography>
          {/* Company selector: show dropdown if multiple, otherwise static label */}
          {hasMultipleCompanies ? (
            renderCompanySelector()
          ) : (
            <Typography variant="body1" noWrap component="div" sx={{ opacity: 0.9 }}>
              {companies?.[0]?.name || ''}
            </Typography>
          )}
        </Box>
        <ThemeToggleButton />
        {authenticated && <UserProfileMenu userName={userName} />}
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader
