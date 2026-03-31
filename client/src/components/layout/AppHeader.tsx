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
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import UserProfileMenu from './UserProfileMenu'
import ThemeToggleButton from '../ui/ThemeToggleButton'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useLensSelection } from '@/lib/lens-settings'
import { useBrandConfig } from '@/lib/runtime-config'

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
  const tLenses = useTranslations('lenses')
  const theme = useTheme()
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    isCompanySelectionLocked,
    companySelectionLockReason,
  } = useCompanyContext()
  const hasMultipleCompanies = (companies?.length ?? 0) > 1
  const { selectedLens, setSelectedLens, enabledLenses } = useLensSelection()
  const router = useRouter()
  const brandConfig = useBrandConfig()

  const handleLensChange = (nextLens: typeof selectedLens) => {
    if (nextLens === selectedLens) {
      return
    }

    setSelectedLens(nextLens)
    router.push('/')
  }

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
            {brandConfig.nameLong}
          </Typography>
          {/* Company selector: show dropdown if multiple, otherwise static label */}
          {hasMultipleCompanies ? (
            renderCompanySelector()
          ) : (
            <Typography variant="body1" noWrap component="div" sx={{ opacity: 0.9 }}>
              {companies?.[0]?.name || ''}
            </Typography>
          )}
          {enabledLenses.length > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ opacity: 0.9 }}>
                {tLenses('label')}
              </Typography>
              <Select
                size="small"
                value={selectedLens}
                onChange={e => handleLensChange(e.target.value as typeof selectedLens)}
                sx={{
                  color: 'inherit',
                  borderColor: 'rgba(255,255,255,0.7)',
                  '& .MuiSelect-icon': { color: 'inherit' },
                  minWidth: 180,
                  bgcolor: 'rgba(255,255,255,0.08)',
                }}
              >
                {enabledLenses.map(lens => (
                  <MenuItem key={lens} value={lens}>
                    {tLenses(lens)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>
        <ThemeToggleButton />
        {authenticated && <UserProfileMenu userName={userName} />}
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader
