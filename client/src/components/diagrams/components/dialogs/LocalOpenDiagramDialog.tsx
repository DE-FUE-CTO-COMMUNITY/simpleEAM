'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Architecture, CalendarToday, Search } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import type { LocalDiagramTypeValue } from './types'

export interface LocalOpenDialogDiagram {
  id: string
  title: string
  description?: string | null
  diagramType?: LocalDiagramTypeValue | null
  diagramJson: string
  updatedAt?: string | null
  architecture?: Array<{
    id: string
    name: string
    type?: string | null
    domain?: string | null
  }>
}

interface LocalOpenDiagramDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (entry: LocalOpenDialogDiagram) => void
}

const AVAILABLE_TYPES: LocalDiagramTypeValue[] = [
  'ARCHITECTURE',
  'APPLICATION_LANDSCAPE',
  'CAPABILITY_MAP',
  'DATA_FLOW',
  'PROCESS',
  'NETWORK',
  'INTEGRATION_ARCHITECTURE',
  'SECURITY_ARCHITECTURE',
  'CONCEPTUAL',
  'OTHER',
]

const LocalOpenDiagramDialog = ({ open, onClose, onSelect }: LocalOpenDiagramDialogProps) => {
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const { selectedCompanyId } = useCompanyContext()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<LocalDiagramTypeValue | ''>('')
  const [selectedArchitecture, setSelectedArchitecture] = useState('')

  useEffect(() => {
    if (open) {
      setSearchTerm('')
      setSelectedType('')
      setSelectedArchitecture('')
    }
  }, [open])

  const { data, loading, error } = useQuery(GET_DIAGRAMS, {
    skip: !open,
    variables: {
      where: selectedCompanyId
        ? {
            OR: [
              { company: { some: { id: { eq: selectedCompanyId } } } },
              { architecture: { some: { company: { some: { id: { eq: selectedCompanyId } } } } } },
            ],
          }
        : undefined,
    },
    fetchPolicy: 'cache-and-network',
  })

  const diagrams: LocalOpenDialogDiagram[] = useMemo(() => data?.diagrams ?? [], [data])

  const architectureOptions = useMemo(() => {
    const map = new Map<string, string>()
    diagrams.forEach(entry => {
      entry.architecture?.forEach(arch => {
        if (arch?.id) {
          map.set(arch.id, arch.name)
        }
      })
    })
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [diagrams])

  const filteredDiagrams = useMemo(() => {
    return diagrams.filter(entry => {
      const matchesSearch =
        !searchTerm ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = !selectedType || entry.diagramType === selectedType

      const matchesArchitecture = (() => {
        if (!selectedArchitecture) {
          return true
        }
        return entry.architecture?.some(arch => arch.id === selectedArchitecture)
      })()

      return matchesSearch && matchesType && matchesArchitecture
    })
  }, [diagrams, searchTerm, selectedArchitecture, selectedType])

  const formattedDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : ''

  const getDiagramTypeLabel = (type?: LocalDiagramTypeValue | null) => {
    if (!type) {
      return undefined
    }
    return t(`diagramTypes.${type}` as const)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )
    }

    if (error) {
      return (
        <Typography color="error" align="center" sx={{ py: 4 }}>
          {error.message}
        </Typography>
      )
    }

    if (filteredDiagrams.length === 0) {
      return (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          {t('dialogs.open.noDiagramsFound')}
        </Typography>
      )
    }

    return (
      <List sx={{ maxHeight: 360, overflow: 'auto' }}>
        {filteredDiagrams.map(entry => (
          <ListItem key={entry.id} disablePadding>
            <ListItemButton
              onClick={() => onSelect(entry)}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {entry.title}
                    </Typography>
                    {entry.diagramType && (
                      <Chip
                        label={getDiagramTypeLabel(entry.diagramType)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {entry.description && (
                      <Typography variant="body2" color="text.secondary">
                        {entry.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {entry.architecture && entry.architecture.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Architecture fontSize="small" color="action" />
                          <Typography variant="caption">
                            {entry.architecture.map(arch => arch.name).join(', ')}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="caption">{formattedDate(entry.updatedAt)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                primaryTypographyProps={{ component: 'div' }}
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('dialogs.open.title')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          placeholder={t('dialogs.open.searchPlaceholder')}
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('dialogs.open.filterByType')}</InputLabel>
            <Select
              value={selectedType}
              label={t('dialogs.open.filterByType')}
              onChange={event => setSelectedType(event.target.value as LocalDiagramTypeValue | '')}
            >
              <MenuItem value="">{t('dialogs.open.allTypes')}</MenuItem>
              {AVAILABLE_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {t(`diagramTypes.${type}` as const)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('dialogs.open.filterByArchitecture')}</InputLabel>
            <Select
              value={selectedArchitecture}
              label={t('dialogs.open.filterByArchitecture')}
              onChange={event => setSelectedArchitecture(event.target.value)}
            >
              <MenuItem value="">{t('dialogs.open.allArchitectures')}</MenuItem>
              {architectureOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{tCommon('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default LocalOpenDiagramDialog
