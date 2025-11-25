'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { Search, Architecture, Person, CalendarToday } from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { useCompanyContext } from '@/contexts/CompanyContext'

// Verfügbare Diagrammtypen direkt als Enum-Werte
const AVAILABLE_DIAGRAM_TYPES = [
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
] as const

export interface OpenDiagramDialogProps {
  open: boolean
  onClose: () => void
  onOpen: (diagram: any) => void
}

const OpenDiagramDialog: React.FC<OpenDiagramDialogProps> = ({ open, onClose, onOpen }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedArchitecture, setSelectedArchitecture] = useState('')
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const { selectedCompanyId } = useCompanyContext()

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
  })

  const diagrams = useMemo(() => {
    return data?.diagrams || []
  }, [data?.diagrams])

  // Filtern der Diagramme basierend auf Suchkriterien
  const filteredDiagrams = diagrams.filter((diagram: any) => {
    const matchesSearch =
      !searchTerm ||
      diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (diagram.description && diagram.description.toLowerCase().includes(searchTerm.toLowerCase()))

    // Typ-Filter mit korrektem diagramType Feld
    const matchesType = !selectedType || diagram.diagramType === selectedType

    const matchesArchitecture =
      !selectedArchitecture ||
      (diagram.architecture &&
        diagram.architecture.some((arch: any) => arch.id === selectedArchitecture))

    return matchesSearch && matchesType && matchesArchitecture
  })

  // Eindeutige Architektur-Optionen für Filter extrahieren
  const architectureOptions = React.useMemo(() => {
    const architectures = new Map()
    diagrams.forEach((diagram: any) => {
      if (diagram.architecture) {
        diagram.architecture.forEach((arch: any) => {
          architectures.set(arch.id, arch)
        })
      }
    })
    return Array.from(architectures.values())
  }, [diagrams])

  const handleOpenDiagram = (diagram: any) => {
    onOpen(diagram)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDiagramTypeLabel = (type: string) => {
    // Typsichere Übersetzung der Diagrammtypen
    switch (type) {
      case 'ARCHITECTURE':
        return t('diagramTypes.ARCHITECTURE')
      case 'APPLICATION_LANDSCAPE':
        return t('diagramTypes.APPLICATION_LANDSCAPE')
      case 'CAPABILITY_MAP':
        return t('diagramTypes.CAPABILITY_MAP')
      case 'DATA_FLOW':
        return t('diagramTypes.DATA_FLOW')
      case 'PROCESS':
        return t('diagramTypes.PROCESS')
      case 'NETWORK':
        return t('diagramTypes.NETWORK')
      case 'INTEGRATION_ARCHITECTURE':
        return t('diagramTypes.INTEGRATION_ARCHITECTURE')
      case 'SECURITY_ARCHITECTURE':
        return t('diagramTypes.SECURITY_ARCHITECTURE')
      case 'CONCEPTUAL':
        return t('diagramTypes.CONCEPTUAL')
      case 'OTHER':
        return t('diagramTypes.OTHER')
      default:
        return type
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('dialogs.open.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Suchfeld */}
          <TextField
            placeholder={t('dialogs.open.searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('dialogs.open.filterByType')}</InputLabel>
              <Select
                value={selectedType}
                label={t('dialogs.open.filterByType')}
                onChange={e => setSelectedType(e.target.value)}
              >
                <MenuItem value="">{t('dialogs.open.allTypes')}</MenuItem>
                {AVAILABLE_DIAGRAM_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {getDiagramTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('dialogs.open.filterByArchitecture')}</InputLabel>
              <Select
                value={selectedArchitecture}
                label={t('dialogs.open.filterByArchitecture')}
                onChange={e => setSelectedArchitecture(e.target.value)}
              >
                <MenuItem value="">{t('dialogs.open.allArchitectures')}</MenuItem>
                {architectureOptions.map((arch: any) => (
                  <MenuItem key={arch.id} value={arch.id}>
                    {arch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Diagrammliste */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 4 }}>
            {tErrors('loadError')}: {error.message}
          </Typography>
        ) : filteredDiagrams.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            {diagrams.length === 0
              ? t('dialogs.open.noDiagramsFound')
              : t('dialogs.open.errorLoadingDiagrams')}
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredDiagrams.map((diagram: any) => (
              <ListItem key={diagram.id} disablePadding>
                <ListItemButton
                  onClick={() => handleOpenDiagram(diagram)}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {diagram.title}
                        </Typography>
                        {diagram.diagramType && (
                          <Chip
                            label={getDiagramTypeLabel(diagram.diagramType)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {diagram.description && (
                          <Typography variant="body2" color="text.secondary">
                            {diagram.description}
                          </Typography>
                        )}

                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
                        >
                          {diagram.creator && diagram.creator.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Person fontSize="small" color="action" />
                              <Typography variant="caption">
                                {diagram.creator[0].firstName} {diagram.creator[0].lastName}
                              </Typography>
                            </Box>
                          )}

                          {diagram.architecture && diagram.architecture.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Architecture fontSize="small" color="action" />
                              <Typography variant="caption">
                                {diagram.architecture.map((arch: any) => arch.name).join(', ')}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="caption">
                              {formatDate(diagram.updatedAt || diagram.createdAt)}
                            </Typography>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{tCommon('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OpenDiagramDialog
