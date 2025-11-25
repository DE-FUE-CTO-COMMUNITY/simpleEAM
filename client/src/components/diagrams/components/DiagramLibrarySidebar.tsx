'use client'

import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useQuery } from '@apollo/client'
import {
  GET_LIBRARY_ELEMENTS,
  ELEMENT_TYPE_CONFIG,
  type ElementType,
  type LibraryElementsResponse,
} from '@/graphql/library'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import {
  type ArchiMateLibrary,
  type ExcalidrawLibraryItem,
  TEMPLATE_NAME_BY_TYPE,
  EXCALIDRAW_LIBRARY_MIME,
  buildLibraryDropPayload,
  createLibraryItemFromDatabaseElement,
  findArchimateTemplate,
  loadArchimateLibrary,
  normalizeTemplateFonts,
} from '../utils/library'

const SIDEBAR_WIDTH = 340
const HANDLE_WIDTH = 32
const SECTION_ORDER: ElementType[] = [
  'capability',
  'application',
  'dataObject',
  'applicationInterface',
  'infrastructure',
  'aiComponent',
]

interface SidebarItem {
  id: string
  title: string
  elementType: ElementType
  libraryItem: ExcalidrawLibraryItem
}

interface SidebarSection {
  key: string
  title: string
  items: SidebarItem[]
  emptyLabel: string
  defaultExpanded?: boolean
}

const DATA_ACCESSORS: Partial<
  Record<ElementType, (data: LibraryElementsResponse) => Array<{ id: string; name: string }>>
> = {
  capability: data => data.businessCapabilities ?? [],
  application: data => data.applications ?? [],
  dataObject: data => data.dataObjects ?? [],
  applicationInterface: data => data.applicationInterfaces ?? [],
  infrastructure: data => data.infrastructures ?? [],
  aiComponent: data => data.aiComponents ?? [],
}

interface DiagramLibrarySidebarProps {
  defaultFontFamily: number
  isOpen: boolean
  onToggle: () => void
}

export default function DiagramLibrarySidebar({
  defaultFontFamily,
  isOpen,
  onToggle,
}: DiagramLibrarySidebarProps) {
  const companyWhere = useCompanyWhere()
  const variables = useMemo(
    () => ({
      capWhere: companyWhere,
      appWhere: companyWhere,
      dataWhere: companyWhere,
      ifaceWhere: companyWhere,
      infraWhere: companyWhere,
      aiWhere: companyWhere,
    }),
    [companyWhere]
  )

  const { data, loading: elementsLoading } = useQuery(GET_LIBRARY_ELEMENTS, {
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const [templateLibrary, setTemplateLibrary] = useState<ArchiMateLibrary | null>(null)
  const [templatesLoading, setTemplatesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setTemplatesLoading(true)

    const loadTemplates = async () => {
      const library = await loadArchimateLibrary()
      if (cancelled) return

      if (library) {
        setTemplateLibrary(normalizeTemplateFonts(library, defaultFontFamily))
      } else {
        setTemplateLibrary(null)
      }
      setTemplatesLoading(false)
    }

    void loadTemplates()

    return () => {
      cancelled = true
    }
  }, [defaultFontFamily])

  const templateLookup = useMemo(() => {
    if (!templateLibrary) {
      return {} as Partial<Record<ElementType, ExcalidrawLibraryItem>>
    }

    const lookup: Partial<Record<ElementType, ExcalidrawLibraryItem>> = {}
    SECTION_ORDER.forEach(type => {
      const templateName = TEMPLATE_NAME_BY_TYPE[type]
      if (!templateName) return
      const template = findArchimateTemplate(templateLibrary, templateName)
      if (template) {
        lookup[type] = template
      }
    })
    return lookup
  }, [templateLibrary])

  const templateItems = useMemo(() => {
    const items: SidebarItem[] = []
    SECTION_ORDER.forEach(type => {
      const template = templateLookup[type]
      if (!template) return
      items.push({
        id: `template-${type}`,
        title: ELEMENT_TYPE_CONFIG[type]?.label ?? type,
        elementType: type,
        libraryItem: template,
      })
    })
    return items
  }, [templateLookup])

  const existingSections: SidebarSection[] = useMemo(() => {
    return SECTION_ORDER.map((type, index) => {
      const accessor = DATA_ACCESSORS[type]
      const template = templateLookup[type] ?? null
      const list = accessor && data ? accessor(data) : []
      const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }))

      const items: SidebarItem[] = template
        ? sorted.reduce<SidebarItem[]>((acc, record) => {
            const libraryItem = createLibraryItemFromDatabaseElement({
              template,
              element: record,
              elementType: type,
              defaultFontFamily,
            })
            if (!libraryItem) {
              return acc
            }

            acc.push({
              id: libraryItem.id,
              title: record.name,
              elementType: type,
              libraryItem,
            })
            return acc
          }, [])
        : []

      return {
        key: `existing-${type}`,
        title: ELEMENT_TYPE_CONFIG[type]?.label ?? type,
        items,
        emptyLabel: template
          ? 'No records available for this type yet'
          : 'Add a template to unlock database elements',
        defaultExpanded: index === 0,
      }
    })
  }, [data, defaultFontFamily, templateLookup])

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>, item: SidebarItem) => {
    if (!item?.libraryItem) return
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData(EXCALIDRAW_LIBRARY_MIME, buildLibraryDropPayload(item.libraryItem))
    event.dataTransfer.setData('text/plain', item.title)
  }, [])

  const renderListItem = useCallback(
    (item: SidebarItem) => {
      const color = ELEMENT_TYPE_CONFIG[item.elementType]?.color ?? 'transparent'
      return (
        <ListItemButton
          key={item.id}
          component="div"
          draggable
          onDragStart={event => handleDragStart(event, item)}
          sx={{
            mb: 0.5,
            borderRadius: 1,
            alignItems: 'center',
            border: theme => `1px solid ${theme.palette.divider}`,
            '&:hover': {
              bgcolor: theme => theme.palette.action.hover,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              width: 6,
              borderRadius: 1,
              bgcolor: color,
              mr: 1,
              alignSelf: 'stretch',
            }}
          />
          <ListItemText primary={item.title} primaryTypographyProps={{ noWrap: true }} sx={{ mr: 1 }} />
        </ListItemButton>
      )
    },
    [handleDragStart]
  )

  const renderSection = (section: SidebarSection, loading: boolean) => (
    <Accordion
      key={section.key}
      disableGutters
      square
      defaultExpanded={section.defaultExpanded}
      sx={{
        '&:before': { display: 'none' },
        boxShadow: 'none',
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {section.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {section.items.length}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1 }}>
        {loading && !section.items.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={18} />
          </Box>
        ) : section.items.length ? (
          <List dense disablePadding>
            {section.items.map(item => renderListItem(item))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {section.emptyLabel}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        borderLeft: theme => `1px solid ${theme.palette.divider}`,
        bgcolor: theme => theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          width: HANDLE_WIDTH,
          borderRight: theme => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip title={isOpen ? 'Hide library' : 'Show library'}>
          <IconButton size="small" onClick={onToggle} aria-label={isOpen ? 'Hide library' : 'Show library'}>
            {isOpen ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          width: isOpen ? SIDEBAR_WIDTH : 0,
          transition: 'width 200ms ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isOpen && (
          <>
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Diagram Library
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag an entry into the canvas to drop it via Excalidraw&rsquo;s native API.
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Typography variant="overline" sx={{ px: 2, pt: 2, pb: 1 }} color="text.secondary">
                New elements
              </Typography>
              {templatesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress size={18} />
                </Box>
              ) : templateItems.length ? (
                <List dense disablePadding sx={{ px: 1 }}>
                  {templateItems.map(item => renderListItem(item))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  Templates are not available yet.
                </Typography>
              )}

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="overline" sx={{ px: 2, pb: 1 }} color="text.secondary">
                Existing elements
              </Typography>
              {existingSections.map(section => renderSection(section, elementsLoading))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
