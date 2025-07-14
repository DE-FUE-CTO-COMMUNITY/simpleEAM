'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Search, ExpandMore } from '@mui/icons-material'
import {
  BusinessCapabilityIcon,
  ApplicationComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
  InfrastructureIcon,
} from '@/components/icons'
import { useQuery } from '@apollo/client'
import {
  GET_LIBRARY_ELEMENTS,
  ELEMENT_TYPE_CONFIG,
  type ElementType,
  type LibraryElement,
} from '@/graphql/library'

interface DatabaseLibraryPanelProps {
  onElementDragStart: (element: LibraryElement, elementType: ElementType) => void
}

const DatabaseLibraryPanel: React.FC<DatabaseLibraryPanelProps> = ({ onElementDragStart }) => {
  const [selectedType, setSelectedType] = useState<ElementType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['all']))

  const { data, loading, error, refetch } = useQuery(GET_LIBRARY_ELEMENTS, {
    errorPolicy: 'all',
    pollInterval: 30000, // Aktualisiere alle 30 Sekunden
  })

  // Filtere Elemente basierend auf Typ und Suchbegriff
  const filteredElements = useMemo(() => {
    if (!data)
      return {
        businessCapabilities: [],
        applications: [],
        dataObjects: [],
        applicationInterfaces: [],
        infrastructures: [],
      }

    const filterBySearch = (elements: LibraryElement[]) => {
      if (!searchTerm) return elements
      return elements.filter(
        element =>
          element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (element.description &&
            element.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    const result = {
      businessCapabilities:
        selectedType === 'all' || selectedType === 'capability'
          ? filterBySearch(data.businessCapabilities || [])
          : [],
      applications:
        selectedType === 'all' || selectedType === 'application'
          ? filterBySearch(data.applications || [])
          : [],
      dataObjects:
        selectedType === 'all' || selectedType === 'dataObject'
          ? filterBySearch(data.dataObjects || [])
          : [],
      applicationInterfaces:
        selectedType === 'all' || selectedType === 'interface'
          ? filterBySearch(data.applicationInterfaces || [])
          : [],
      infrastructures:
        selectedType === 'all' || selectedType === 'infrastructure'
          ? filterBySearch(data.infrastructures || [])
          : [],
    }

    return result
  }, [data, selectedType, searchTerm])

  // Toggle Accordion-Sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  // Drag-and-Drop Handler
  const handleDragStart = (element: LibraryElement, elementType: ElementType) => {
    onElementDragStart(element, elementType)
  }

  // Element-Icons
  const getElementIcon = (elementType: ElementType) => {
    switch (elementType) {
      case 'capability':
        return <BusinessCapabilityIcon sx={{ color: ELEMENT_TYPE_CONFIG.capability.color }} />
      case 'application':
        return <ApplicationComponentIcon sx={{ color: ELEMENT_TYPE_CONFIG.application.color }} />
      case 'dataObject':
        return <BusinessObjectIcon sx={{ color: ELEMENT_TYPE_CONFIG.dataObject.color }} />
      case 'interface':
        return <ApplicationInterfaceIcon sx={{ color: ELEMENT_TYPE_CONFIG.interface.color }} />
      case 'infrastructure':
        return <InfrastructureIcon sx={{ color: ELEMENT_TYPE_CONFIG.infrastructure.color }} />
      default:
        return <BusinessCapabilityIcon />
    }
  }

  // Erstelle hierarchische Struktur für Business Capabilities
  const buildCapabilityHierarchy = (capabilities: any[]) => {
    const rootCapabilities = capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
    const childCapabilities = capabilities.filter(cap => cap.parents && cap.parents.length > 0)

    return { rootCapabilities, childCapabilities }
  }

  const renderElements = (elements: LibraryElement[], elementType: ElementType, title: string) => {
    if (elements.length === 0) return null

    const { rootCapabilities, childCapabilities } =
      elementType === 'capability'
        ? buildCapabilityHierarchy(elements as any[])
        : { rootCapabilities: elements, childCapabilities: [] }

    return (
      <Accordion
        expanded={expandedSections.has(elementType)}
        onChange={() => toggleSection(elementType)}
        sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getElementIcon(elementType)}
            <Typography variant="subtitle2">{title}</Typography>
            <Chip
              label={elements.length}
              size="small"
              variant="outlined"
              sx={{ ml: 'auto', mr: 1 }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense>
            {rootCapabilities.map((element: any) => (
              <React.Fragment key={element.id}>
                <ListItem disablePadding>
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {element.name}
                        </Typography>
                        {element.description && (
                          <Typography variant="caption" display="block">
                            {element.description}
                          </Typography>
                        )}
                        {element.status && (
                          <Typography variant="caption" display="block">
                            Status: {element.status}
                          </Typography>
                        )}
                        {element.maturityLevel && (
                          <Typography variant="caption" display="block">
                            Reifegrad: {element.maturityLevel}
                          </Typography>
                        )}
                        {element.criticality && (
                          <Typography variant="caption" display="block">
                            Kritikalität: {element.criticality}
                          </Typography>
                        )}
                        {element.vendor && (
                          <Typography variant="caption" display="block">
                            Anbieter: {element.vendor}
                          </Typography>
                        )}
                        {element.classification && (
                          <Typography variant="caption" display="block">
                            Klassifizierung: {element.classification}
                          </Typography>
                        )}
                        {element.interfaceType && (
                          <Typography variant="caption" display="block">
                            Interface-Typ: {element.interfaceType}
                          </Typography>
                        )}
                        {element.infrastructureType && (
                          <Typography variant="caption" display="block">
                            Infrastruktur-Typ: {element.infrastructureType}
                          </Typography>
                        )}
                        {element.location && (
                          <Typography variant="caption" display="block">
                            Standort: {element.location}
                          </Typography>
                        )}
                        {element.version && (
                          <Typography variant="caption" display="block">
                            Version: {element.version}
                          </Typography>
                        )}
                      </Box>
                    }
                    placement="right"
                    arrow
                  >
                    <ListItemButton
                      draggable
                      onDragStart={() => handleDragStart(element, elementType)}
                      sx={{
                        border: 1,
                        borderColor: 'transparent',
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          borderColor: ELEMENT_TYPE_CONFIG[elementType].color,
                          backgroundColor: `${ELEMENT_TYPE_CONFIG[elementType].color}20`,
                        },
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {getElementIcon(elementType)}
                        <ListItemText
                          primary={element.name}
                          secondary={
                            element.description && element.description.length > 40
                              ? `${element.description.substring(0, 40)}...`
                              : element.description
                          }
                          primaryTypographyProps={{
                            variant: 'body2',
                            noWrap: true,
                            fontWeight: 500,
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary',
                            noWrap: true,
                          }}
                        />
                        {element.status && (
                          <Chip
                            label={element.status}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                      </Box>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {/* Hierarchische Child-Capabilities anzeigen */}
                {elementType === 'capability' &&
                  childCapabilities
                    .filter((child: any) =>
                      child.parents?.some((parent: any) => parent.id === element.id)
                    )
                    .map((childCap: any) => (
                      <ListItem key={childCap.id} disablePadding sx={{ pl: 2 }}>
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {childCap.name}
                              </Typography>
                              {childCap.description && (
                                <Typography variant="caption" display="block">
                                  {childCap.description}
                                </Typography>
                              )}
                              <Typography variant="caption" display="block">
                                Parent: {element.name}
                              </Typography>
                            </Box>
                          }
                          placement="right"
                          arrow
                        >
                          <ListItemButton
                            draggable
                            onDragStart={() => handleDragStart(childCap, elementType)}
                            sx={{
                              border: 1,
                              borderColor: 'transparent',
                              borderRadius: 1,
                              mb: 0.5,
                              '&:hover': {
                                borderColor: ELEMENT_TYPE_CONFIG[elementType].color,
                                backgroundColor: `${ELEMENT_TYPE_CONFIG[elementType].color}20`,
                              },
                              cursor: 'grab',
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
                            >
                              {getElementIcon(elementType)}
                              <ListItemText
                                primary={`├─ ${childCap.name}`}
                                secondary={
                                  childCap.description && childCap.description.length > 35
                                    ? `${childCap.description.substring(0, 35)}...`
                                    : childCap.description
                                }
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  noWrap: true,
                                  fontWeight: 400,
                                }}
                                secondaryTypographyProps={{
                                  variant: 'caption',
                                  color: 'text.secondary',
                                  noWrap: true,
                                }}
                              />
                              {childCap.status && (
                                <Chip
                                  label={childCap.status}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                              )}
                            </Box>
                          </ListItemButton>
                        </Tooltip>
                      </ListItem>
                    ))}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => refetch()}
          >
            Erneut versuchen
          </Typography>
        }
      >
        Fehler beim Laden der Architektur-Elemente
      </Alert>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Architektur-Bibliothek
        </Typography>

        {/* Filter Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Element-Typ</InputLabel>
            <Select
              value={selectedType}
              label="Element-Typ"
              onChange={e => setSelectedType(e.target.value as ElementType | 'all')}
            >
              <MenuItem value="all">Alle Elemente</MenuItem>
              <MenuItem value="capability">Business Capabilities</MenuItem>
              <MenuItem value="application">Applications</MenuItem>
              <MenuItem value="dataObject">Data Objects</MenuItem>
              <MenuItem value="interface">Interfaces</MenuItem>
              <MenuItem value="infrastructure">Infrastruktur</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            placeholder="Elemente durchsuchen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {filteredElements.businessCapabilities &&
          renderElements(
            filteredElements.businessCapabilities,
            'capability',
            ELEMENT_TYPE_CONFIG.capability.label
          )}

        {filteredElements.applications &&
          renderElements(
            filteredElements.applications,
            'application',
            ELEMENT_TYPE_CONFIG.application.label
          )}

        {filteredElements.dataObjects &&
          renderElements(
            filteredElements.dataObjects,
            'dataObject',
            ELEMENT_TYPE_CONFIG.dataObject.label
          )}

        {filteredElements.applicationInterfaces &&
          renderElements(
            filteredElements.applicationInterfaces,
            'interface',
            ELEMENT_TYPE_CONFIG.interface.label
          )}

        {filteredElements.infrastructures &&
          renderElements(
            filteredElements.infrastructures,
            'infrastructure',
            ELEMENT_TYPE_CONFIG.infrastructure.label
          )}

        {/* Leere Zustand */}
        {Object.values(filteredElements).every((arr: any[]) => arr.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? 'Keine Elemente entsprechen den Suchkriterien'
                : 'Keine Architektur-Elemente vorhanden'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer mit Info */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Ziehen Sie Elemente per Drag & Drop in das Diagramm
        </Typography>
      </Box>
    </Box>
  )
}

export default DatabaseLibraryPanel
