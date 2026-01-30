'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
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
  findArchimateTemplate,
  loadArchimateLibrary,
  normalizeTemplateFonts,
  createLibraryItemFromDatabaseElement,
} from '../utils/architectureElements'

const SIDEBAR_WIDTH = 340
const HANDLE_WIDTH = 32
const SECTION_ORDER: ElementType[] = [
  'businessCapability',
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
  businessCapability: data => data.businessCapabilities ?? [],
  application: data => data.applications ?? [],
  dataObject: data => data.dataObjects ?? [],
  applicationInterface: data => data.applicationInterfaces ?? [],
  infrastructure: data => data.infrastructures ?? [],
  aiComponent: data => data.aiComponents ?? [],
}

export interface DiagramLibrarySidebarHandle {
  openSearchTab: () => void
}

interface DiagramLibrarySidebarProps {
  excalidrawAPI: any
  defaultFontFamily: number
  isOpen: boolean
  onToggle: () => void
}

const DiagramLibrarySidebar = forwardRef<DiagramLibrarySidebarHandle, DiagramLibrarySidebarProps>(
  function DiagramLibrarySidebar({ excalidrawAPI, defaultFontFamily, isOpen, onToggle }, ref) {
    const companyWhere = useCompanyWhere()
    const tSidebar = useTranslations('diagramEditor.librarySidebar')
    const tTypes = useTranslations('diagramEditor.elementTypes')
    const tToggle = useTranslations('diagramEditor.librarySidebar.toggle')
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

    // Tab state
    const [activeTab, setActiveTab] = useState(0)

    // Search state (for canvas search)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Array<{ id: string; text: string }>>([])
    const [selectedResultIndex, setSelectedResultIndex] = useState(0)
    const [originalColors, setOriginalColors] = useState<
      Map<string, { stroke: string; background: string }>
    >(new Map())
    const originalColorsRef = useRef<Map<string, { stroke: string; background: string }>>(new Map())
    const tSearch = useTranslations('diagramEditor.librarySidebar.search')

    // Library filter state
    const [libraryFilter, setLibraryFilter] = useState('')
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

    // Highlight colors (using stroke/border color)
    const HIGHLIGHT_COLOR = '#ff4444' // Red for all matches
    const ACTIVE_HIGHLIGHT_COLOR = '#ff8800' // Orange for currently focused element

    // Helper function to get actual canvas dimensions
    const getCanvasDimensions = useCallback(() => {
      // Always try to get the actual Excalidraw canvas element - it's the most reliable
      const canvasElement = document.querySelector('.excalidraw__canvas')
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect()
        return {
          width: rect.width,
          height: rect.height,
        }
      }

      // Fallback: Try to get the canvas container
      const canvasContainer = document.querySelector('.excalidraw-wrapper')
      if (canvasContainer) {
        const rect = canvasContainer.getBoundingClientRect()
        return {
          width: rect.width,
          height: rect.height,
        }
      }

      // Last resort: calculate based on window size and visible sidebar
      // Query actual sidebar element to determine width
      const sidebarElement = document.querySelector('[data-testid="library-sidebar"]')
      const actualSidebarWidth = sidebarElement
        ? sidebarElement.getBoundingClientRect().width
        : isOpen
          ? SIDEBAR_WIDTH + HANDLE_WIDTH
          : HANDLE_WIDTH

      return {
        width: window.innerWidth - actualSidebarWidth,
        height: window.innerHeight - 60, // Approximate header height
      }
    }, [isOpen])

    // Keep ref in sync with state
    useEffect(() => {
      originalColorsRef.current = originalColors
    }, [originalColors])

    // Helper to scroll to element only if not visible
    const scrollToElementIfNeeded = useCallback(
      (element: any, updatedElements: any[]) => {
        if (!excalidrawAPI?.updateScene || !element) return

        const appState = excalidrawAPI.getAppState()
        const currentZoom = appState?.zoom?.value || 1
        const currentScrollX = appState?.scrollX || 0
        const currentScrollY = appState?.scrollY || 0

        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions()

        // Calculate element bounds in viewport coordinates
        const elementLeft = element.x * currentZoom + currentScrollX
        const elementTop = element.y * currentZoom + currentScrollY
        const elementRight = (element.x + (element.width || 0)) * currentZoom + currentScrollX
        const elementBottom = (element.y + (element.height || 0)) * currentZoom + currentScrollY

        // Add padding for better visibility (10% of canvas size)
        const paddingX = canvasWidth * 0.1
        const paddingY = canvasHeight * 0.1

        // Check if element is fully visible with padding
        const isVisible =
          elementLeft >= paddingX &&
          elementRight <= canvasWidth - paddingX &&
          elementTop >= paddingY &&
          elementBottom <= canvasHeight - paddingY

        // Only scroll if element is not fully visible
        if (!isVisible) {
          const elementCenterX = element.x + (element.width || 0) / 2
          const elementCenterY = element.y + (element.height || 0) / 2

          const scrollX = canvasWidth / 2 - elementCenterX * currentZoom
          const scrollY = canvasHeight / 2 - elementCenterY * currentZoom

          excalidrawAPI.updateScene(
            {
              elements: updatedElements,
              appState: {
                scrollX,
                scrollY,
              },
            },
            false
          )
        } else {
          // Element is already visible, just update highlighting
          excalidrawAPI.updateScene(
            {
              elements: updatedElements,
            },
            false
          )
        }
      },
      [excalidrawAPI, getCanvasDimensions]
    )

    // Search functionality using Excalidraw API
    const handleSearch = useCallback(
      (query: string) => {
        setSearchQuery(query)

        if (!query.trim() || !excalidrawAPI?.getSceneElements) {
          // Clear search - restore original colors
          if (originalColorsRef.current.size > 0 && excalidrawAPI?.updateScene) {
            const elements = excalidrawAPI.getSceneElements()
            const updatedElements = elements.map((el: any) => {
              const original = originalColorsRef.current.get(el.id)
              if (original) {
                return {
                  ...el,
                  strokeColor: original.stroke,
                  backgroundColor: original.background,
                }
              }
              return el
            })
            excalidrawAPI.updateScene({ elements: updatedElements }, false)
            originalColorsRef.current.clear()
            setOriginalColors(new Map())
          }

          setSearchResults([])
          setSelectedResultIndex(0)
          return
        }

        const elements = excalidrawAPI.getSceneElements() ?? []
        const searchLower = query.toLowerCase()

        const results = elements
          .filter((el: any) => {
            // Search in text elements
            if (el.type === 'text' && el.text?.toLowerCase().includes(searchLower)) {
              return true
            }
            // Search in customData (for database-linked elements)
            if (el.customData?.name?.toLowerCase().includes(searchLower)) {
              return true
            }
            // Search in customData description
            if (el.customData?.description?.toLowerCase().includes(searchLower)) {
              return true
            }
            return false
          })
          .map((el: any) => ({
            id: el.id,
            text: el.text || el.customData?.name || el.customData?.description || el.id,
          }))

        setSearchResults(results)
        setSelectedResultIndex(results.length > 0 ? 0 : -1)

        // Simplified logic: Keep all original colors until search is cleared
        const resultIds = new Set(results.map((r: { id: string; text: string }) => r.id))

        const updatedElements = elements.map((el: any) => {
          const isCurrentMatch = resultIds.has(el.id)
          const wasHighlighted = originalColorsRef.current.has(el.id)

          if (isCurrentMatch) {
            // This element matches the search
            if (!wasHighlighted) {
              // First time highlighting - store original properties immediately in ref
              originalColorsRef.current.set(el.id, {
                stroke: el.strokeColor || '#1e1e1e',
                background: el.backgroundColor || 'transparent',
              })
            }

            // Apply highlight using stroke color with increased width
            const matchIndex = results.findIndex(
              (r: { id: string; text: string }) => r.id === el.id
            )
            const isActive = matchIndex === 0
            const highlightColor = isActive ? ACTIVE_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR

            return {
              ...el,
              strokeColor: highlightColor,
              strokeWidth: 4,
            }
          } else if (wasHighlighted) {
            // Was highlighted before but no longer matches - restore original
            const original = originalColorsRef.current.get(el.id)!
            return {
              ...el,
              strokeColor: original.stroke,
              backgroundColor: original.background,
            }
          }

          return el
        })

        // Sync state with ref for cleanup effects
        setOriginalColors(new Map(originalColorsRef.current))

        // Force Excalidraw to recognize the change by updating with commit history
        if (results.length > 0) {
          const targetElement = elements.find((el: any) => el.id === results[0].id)
          if (targetElement) {
            const appState = excalidrawAPI.getAppState()
            const currentZoom = appState?.zoom?.value || 1
            const currentScrollX = appState?.scrollX || 0
            const currentScrollY = appState?.scrollY || 0

            const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions()

            // Calculate element bounds in viewport coordinates
            const elementLeft = targetElement.x * currentZoom + currentScrollX
            const elementTop = targetElement.y * currentZoom + currentScrollY
            const elementRight =
              (targetElement.x + (targetElement.width || 0)) * currentZoom + currentScrollX
            const elementBottom =
              (targetElement.y + (targetElement.height || 0)) * currentZoom + currentScrollY

            // Add padding for better visibility (10% of canvas size)
            const paddingX = canvasWidth * 0.1
            const paddingY = canvasHeight * 0.1

            // Check if element is fully visible with padding
            const isVisible =
              elementLeft >= paddingX &&
              elementRight <= canvasWidth - paddingX &&
              elementTop >= paddingY &&
              elementBottom <= canvasHeight - paddingY

            // Only scroll if element is not fully visible
            if (!isVisible) {
              const elementCenterX = targetElement.x + (targetElement.width || 0) / 2
              const elementCenterY = targetElement.y + (targetElement.height || 0) / 2

              const scrollX = canvasWidth / 2 - elementCenterX * currentZoom
              const scrollY = canvasHeight / 2 - elementCenterY * currentZoom

              // Use storeAction: "capture" to force re-render
              excalidrawAPI.updateScene({
                elements: updatedElements,
                appState: {
                  scrollX,
                  scrollY,
                },
                storeAction: 'capture',
              })
            } else {
              // Element is already visible, just update highlighting
              excalidrawAPI.updateScene({
                elements: updatedElements,
                storeAction: 'capture',
              })
            }
          } else {
            // No scroll needed, just update elements
            excalidrawAPI.updateScene({
              elements: updatedElements,
              storeAction: 'capture',
            })
          }
        } else {
          // No results, just update elements
          excalidrawAPI.updateScene({
            elements: updatedElements,
            storeAction: 'capture',
          })
        }
      },
      [excalidrawAPI, HIGHLIGHT_COLOR, ACTIVE_HIGHLIGHT_COLOR, getCanvasDimensions]
    )

    const handleNextResult = useCallback(() => {
      if (searchResults.length === 0) return

      const nextIndex = (selectedResultIndex + 1) % searchResults.length
      setSelectedResultIndex(nextIndex)

      if (excalidrawAPI?.updateScene && excalidrawAPI?.getSceneElements) {
        const elements = excalidrawAPI.getSceneElements()

        // Update highlight colors
        const updatedElements = elements.map((el: any) => {
          const matchIndex = searchResults.findIndex(r => r.id === el.id)

          if (matchIndex !== -1) {
            const isActive = matchIndex === nextIndex
            return {
              ...el,
              strokeColor: isActive ? ACTIVE_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR,
              strokeWidth: 4,
            }
          }

          return el
        })

        // Scroll to element if needed
        const targetElement = elements.find((el: any) => el.id === searchResults[nextIndex].id)
        scrollToElementIfNeeded(targetElement, updatedElements)
      }
    }, [
      searchResults,
      selectedResultIndex,
      excalidrawAPI,
      HIGHLIGHT_COLOR,
      ACTIVE_HIGHLIGHT_COLOR,
      scrollToElementIfNeeded,
    ])

    const handlePreviousResult = useCallback(() => {
      if (searchResults.length === 0) return

      const prevIndex =
        selectedResultIndex === 0 ? searchResults.length - 1 : selectedResultIndex - 1
      setSelectedResultIndex(prevIndex)

      if (excalidrawAPI?.updateScene && excalidrawAPI?.getSceneElements) {
        const elements = excalidrawAPI.getSceneElements()

        // Update highlight colors
        const updatedElements = elements.map((el: any) => {
          const matchIndex = searchResults.findIndex(
            (r: { id: string; text: string }) => r.id === el.id
          )

          if (matchIndex !== -1) {
            const isActive = matchIndex === prevIndex
            return {
              ...el,
              strokeColor: isActive ? ACTIVE_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR,
              strokeWidth: 4,
            }
          }

          return el
        })

        // Scroll to element if needed
        const targetElement = elements.find((el: any) => el.id === searchResults[prevIndex].id)
        scrollToElementIfNeeded(targetElement, updatedElements)
      }
    }, [
      searchResults,
      selectedResultIndex,
      excalidrawAPI,
      HIGHLIGHT_COLOR,
      ACTIVE_HIGHLIGHT_COLOR,
      scrollToElementIfNeeded,
    ])

    const handleResultClick = useCallback(
      (index: number) => {
        setSelectedResultIndex(index)

        if (excalidrawAPI?.updateScene && excalidrawAPI?.getSceneElements) {
          const elements = excalidrawAPI.getSceneElements()

          // Update highlight colors
          const updatedElements = elements.map((el: any) => {
            const matchIndex = searchResults.findIndex(
              (r: { id: string; text: string }) => r.id === el.id
            )

            if (matchIndex !== -1) {
              const isActive = matchIndex === index
              return {
                ...el,
                strokeColor: isActive ? ACTIVE_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR,
                strokeWidth: 4,
              }
            }

            return el
          })

          // Scroll to element if needed
          const targetElement = elements.find((el: any) => el.id === searchResults[index].id)
          scrollToElementIfNeeded(targetElement, updatedElements)
        }
      },
      [
        searchResults,
        excalidrawAPI,
        HIGHLIGHT_COLOR,
        ACTIVE_HIGHLIGHT_COLOR,
        scrollToElementIfNeeded,
      ]
    )

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

    // Cleanup: restore original colors when component unmounts or tab changes
    useEffect(() => {
      return () => {
        if (
          originalColors.size > 0 &&
          excalidrawAPI?.updateScene &&
          excalidrawAPI?.getSceneElements
        ) {
          const elements = excalidrawAPI.getSceneElements()
          const updatedElements = elements.map((el: any) => {
            const original = originalColors.get(el.id)
            if (original) {
              return {
                ...el,
                strokeColor: original.stroke,
                backgroundColor: original.background,
              }
            }
            return el
          })
          excalidrawAPI.updateScene({ elements: updatedElements }, false)
        }
      }
    }, [originalColors, excalidrawAPI])

    // Restore colors when switching away from search tab
    useEffect(() => {
      if (
        activeTab !== 1 &&
        originalColors.size > 0 &&
        excalidrawAPI?.updateScene &&
        excalidrawAPI?.getSceneElements
      ) {
        const elements = excalidrawAPI.getSceneElements()
        const updatedElements = elements.map((el: any) => {
          const original = originalColors.get(el.id)
          if (original) {
            return {
              ...el,
              strokeColor: original.stroke,
              backgroundColor: original.background,
            }
          }
          return el
        })
        excalidrawAPI.updateScene({ elements: updatedElements }, false)
        setOriginalColors(new Map())
        setSearchQuery('')
        setSearchResults([])
      }
    }, [activeTab, originalColors, excalidrawAPI])

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

    const typeColors = useMemo(() => {
      const colors: Partial<Record<ElementType, string>> = {}
      SECTION_ORDER.forEach(type => {
        const template = templateLookup[type]
        if (!template?.elements?.length) return
        const rectangle = template.elements.find(
          element => element?.type === 'rectangle' && typeof element.backgroundColor === 'string'
        ) as { backgroundColor?: string } | undefined
        if (rectangle?.backgroundColor) {
          colors[type] = rectangle.backgroundColor
        }
      })
      return colors
    }, [templateLookup])

    const getTypeLabel = useCallback(
      (type: ElementType, variant: 'singular' | 'plural') => {
        try {
          return tTypes(`${type}.${variant}`)
        } catch {
          return ELEMENT_TYPE_CONFIG[type]?.label ?? type
        }
      },
      [tTypes]
    )

    const templateItems = useMemo(() => {
      const items: SidebarItem[] = []
      SECTION_ORDER.forEach(type => {
        const template = templateLookup[type]
        if (!template) return
        items.push({
          id: `template-${type}`,
          title: getTypeLabel(type, 'singular'),
          elementType: type,
          libraryItem: template,
        })
      })
      return items
    }, [getTypeLabel, templateLookup])

    const existingSections: SidebarSection[] = useMemo(() => {
      const filterLower = libraryFilter.toLowerCase()

      return SECTION_ORDER.map(type => {
        const accessor = DATA_ACCESSORS[type]
        const template = templateLookup[type] ?? null
        const list = accessor && data ? accessor(data) : []
        const sorted = [...list].sort((a, b) =>
          a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
        )

        const filteredList = libraryFilter.trim()
          ? sorted.filter(record => record.name.toLowerCase().includes(filterLower))
          : sorted

        const items: SidebarItem[] = template
          ? filteredList.reduce<SidebarItem[]>((acc, record) => {
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
          title: getTypeLabel(type, 'plural'),
          items,
          emptyLabel: template
            ? tSidebar('noRecords', { type: getTypeLabel(type, 'plural') })
            : tSidebar('templateRequired', { type: getTypeLabel(type, 'singular') }),
        }
      })
    }, [data, defaultFontFamily, getTypeLabel, tSidebar, libraryFilter, templateLookup])

    // Auto-expand sections with results when filtering
    useEffect(() => {
      if (libraryFilter.trim()) {
        // When filtering, expand sections that have results
        const sectionsToExpand = new Set<string>()
        existingSections.forEach(section => {
          if (section.items.length > 0) {
            sectionsToExpand.add(section.key)
          }
        })
        setExpandedSections(sectionsToExpand)
      } else {
        // When filter is cleared, collapse all sections
        setExpandedSections(new Set())
      }
    }, [libraryFilter, existingSections])

    // Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        openSearchTab: () => {
          if (!isOpen) {
            onToggle()
          }
          setActiveTab(1)
          // Focus on the search input after a short delay to ensure the tab is visible
          setTimeout(() => {
            const searchInput = document.querySelector<HTMLInputElement>(
              '[data-search-canvas-input]'
            )
            searchInput?.focus()
          }, 100)
        },
      }),
      [isOpen, onToggle]
    )

    const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>, item: SidebarItem) => {
      if (!item?.libraryItem) return
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData(EXCALIDRAW_LIBRARY_MIME, buildLibraryDropPayload(item.libraryItem))
      event.dataTransfer.setData('text/plain', item.title)
    }, [])

    const renderListItem = useCallback(
      (item: SidebarItem) => {
        const color =
          typeColors[item.elementType] ??
          ELEMENT_TYPE_CONFIG[item.elementType]?.color ??
          'transparent'
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
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ noWrap: true }}
              sx={{ mr: 1 }}
            />
          </ListItemButton>
        )
      },
      [handleDragStart, typeColors]
    )

    const renderSection = (section: SidebarSection, loading: boolean) => (
      <Accordion
        key={section.key}
        disableGutters
        square
        expanded={expandedSections.has(section.key)}
        onChange={(_, isExpanded) => {
          setExpandedSections(prev => {
            const next = new Set(prev)
            if (isExpanded) {
              next.add(section.key)
            } else {
              next.delete(section.key)
            }
            return next
          })
        }}
        sx={{
          '&:before': { display: 'none' },
          boxShadow: 'none',
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ px: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
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
          <Tooltip title={isOpen ? tToggle('hide') : tToggle('show')}>
            <IconButton
              size="small"
              onClick={onToggle}
              aria-label={isOpen ? tToggle('hide') : tToggle('show')}
            >
              {isOpen ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
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
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
              >
                <Tab icon={<LibraryBooksIcon fontSize="small" />} label="Library" />
                <Tab icon={<SearchIcon fontSize="small" />} label="Search" />
              </Tabs>

              <Box sx={{ px: 2, py: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {activeTab === 0 ? tSidebar('title') : tSearch('title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeTab === 0 ? tSidebar('description') : tSearch('description')}
                </Typography>
              </Box>

              <Divider />

              {/* Library Tab */}
              {activeTab === 0 && (
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  {/* Library search field */}
                  <Box sx={{ px: 2, py: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={tSidebar('searchPlaceholder')}
                      value={libraryFilter}
                      onChange={e => setLibraryFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Divider />

                  {/* Only show NEW ELEMENTS section when library filter is empty */}
                  {!libraryFilter.trim() && (
                    <>
                      <Typography
                        variant="overline"
                        sx={{ px: 2, pt: 2, pb: 1 }}
                        color="text.secondary"
                      >
                        {tSidebar('newHeading')}
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
                          {tSidebar('noTemplates')}
                        </Typography>
                      )}

                      <Divider sx={{ my: 1.5 }} />
                    </>
                  )}

                  <Typography variant="overline" sx={{ px: 2, pb: 1 }} color="text.secondary">
                    {tSidebar('existingHeading')}
                  </Typography>
                  {existingSections.map(section => renderSection(section, elementsLoading))}
                </Box>
              )}

              {/* Search Tab */}
              {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ px: 2, py: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={tSearch('placeholder')}
                      value={searchQuery}
                      onChange={e => handleSearch(e.target.value)}
                      inputProps={{
                        'data-search-canvas-input': true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: searchResults.length > 0 && (
                          <InputAdornment position="end">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                {tSearch('resultsCount', { count: searchResults.length })}
                              </Typography>
                              <Tooltip title={tSearch('previousResult')}>
                                <IconButton size="small" onClick={handlePreviousResult}>
                                  <NavigateBeforeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={tSearch('nextResult')}>
                                <IconButton size="small" onClick={handleNextResult}>
                                  <NavigateNextIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Divider />

                  {/* Search results */}
                  <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
                    {!searchQuery && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mt: 4 }}
                      >
                        {tSearch('placeholder')}
                      </Typography>
                    )}

                    {searchQuery && searchResults.length > 0 && (
                      <List dense disablePadding>
                        {searchResults.map((result, index) => (
                          <ListItemButton
                            key={result.id}
                            selected={index === selectedResultIndex}
                            onClick={() => handleResultClick(index)}
                            sx={{
                              borderRadius: 1,
                              mb: 0.5,
                              border: theme => `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <ListItemText
                              primary={result.text}
                              primaryTypographyProps={{
                                variant: 'body2',
                                noWrap: true,
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mt: 4 }}
                      >
                        {tSearch('noResults')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }
)

export default DiagramLibrarySidebar
