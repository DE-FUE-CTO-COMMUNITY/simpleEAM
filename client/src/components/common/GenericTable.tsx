'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Box,
  Tooltip,
  IconButton,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as SortDownIcon,
  KeyboardArrowUp as SortUpIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from '@mui/icons-material'
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table'
import { isArchitect } from '@/lib/auth'
import useAutomaticPageSize from '../../hooks/useAutomaticPageSize'
import { useTranslations } from 'next-intl'

/**
 * GenericTableProps definiert die gemeinsamen Eigenschaften für alle Tabellen
 * T ist der Typ der Daten (z.B. Capability, Application, DataObject, Person, Interface)
 * F ist der Typ der Formulardaten (z.B. CapabilityFormValues, ApplicationFormValues)
 */
interface GenericTableProps<TData, TFormValues> {
  data: TData[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  columns: ColumnDef<TData, any>[]
  onCreate?: (data: TFormValues) => Promise<void>
  onUpdate?: (id: string, data: TFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  emptyMessage: string
  createButtonLabel: string
  entityName: string
  FormComponent: React.ComponentType<any>
  getIdFromData: (item: TData) => string
  mapDataToFormValues?: (item: TData) => Record<string, any>
  additionalProps?: Record<string, any>
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
  onTableReady?: (table: any) => void
}

/**
 * GenericTable ist eine wiederverwendbare Tabellenkomponente für verschiedene Entitätstypen
 */
export function GenericTable<T, F>({
  data,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  columns,
  onCreate,
  onUpdate,
  onDelete,
  // emptyMessage: _emptyMessage,
  // createButtonLabel: _createButtonLabel,
  // entityName: _entityName,
  FormComponent,
  getIdFromData,
  mapDataToFormValues,
  additionalProps = {},
  columnVisibility: _columnVisibility,
  onColumnVisibilityChange: _onColumnVisibilityChange,
  onTableReady,
}: GenericTableProps<T, F>) {
  const t = useTranslations('common')
  // State for das Formular-Dialog
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('view')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  // Ref für automatische Seitengrößenberechnung
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Automatische Seitengrößenberechnung basierend auf Fensterhöhe
  const automaticPageSize = useAutomaticPageSize(
    tableContainerRef,
    60, // Header height
    80, // Footer height
    isMobile ? 80 : 60, // Row height (mobil höher)
    200 // Offset height
  )

  // State for die Seitengröße und Seitenindex
  const [pageSize, setPageSize] = useState(automaticPageSize)
  const [pageIndex, setPageIndex] = useState(0)

  // Aktualisiere pageSize wenn sich automaticPageSize ändert
  useEffect(() => {
    setPageSize(automaticPageSize)
    // Reset auf erste Seite wenn sich die Seitengröße ändert
    setPageIndex(0)
  }, [automaticPageSize])

  // Handler für das Öffnen des Formulars zur Detailansicht
  const handleViewItemClick = useCallback(
    (id: string) => {
      if (!id) {
        console.error('GenericTable - Keine gültige ID für die Ansicht erhalten')
        return
      }

      const item = data.find(i => getIdFromData(i) === id)

      if (item) {
        setSelectedItem(item)
        setFormMode('view')
        setIsFormOpen(true)
      } else {
        console.error('GenericTable - Item mit ID nicht gefunden:', id)
      }
    },
    [data, getIdFromData]
  )

  // Handler für das Öffnen des Formulars zum Bearbeiten
  const handleEditItemClick = useCallback(
    (id: string) => {
      const item = data.find(i => getIdFromData(i) === id)
      if (item) {
        setSelectedItem(item)
        setFormMode('edit')
        setIsFormOpen(true)
      } else {
        console.error('GenericTable - Item mit ID nicht gefunden:', id)
      }
    },
    [data, getIdFromData]
  )

  // Handler für das Schließen des Formulars
  const handleFormClose = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  // Handler für das Speichern des Formulars
  const handleFormSubmit = useCallback(
    async (formData: F) => {
      setFormLoading(true)
      try {
        if (formMode === 'create' && onCreate) {
          await onCreate(formData)
          // Nur schließen wenn erfolgreich
          setIsFormOpen(false)
        } else if (formMode === 'edit' && selectedItem && onUpdate) {
          const itemId = getIdFromData(selectedItem)
          await onUpdate(itemId, formData)
          // Nur schließen wenn erfolgreich
          setIsFormOpen(false)
        }
      } catch (error) {
        console.error('💥 GenericTable handleFormSubmit error:', error)
        // Dialog nicht schließen bei Fehler
      } finally {
        setFormLoading(false)
      }
    },
    [formMode, onCreate, onUpdate, selectedItem, getIdFromData]
  )

  // Handler für das Löschen eines Eintrags
  const handleDelete = useCallback(
    async (id: string) => {
      if (onDelete) {
        setFormLoading(true)
        try {
          await onDelete(id)
          setIsFormOpen(false)
        } catch (error) {
          console.error('Error deleting:', error)
        } finally {
          setFormLoading(false)
        }
      }
    },
    [onDelete]
  )

  // Füge Aktionsspalte hinzu, wenn nicht vorhanden
  const columnsWithActions = useMemo(() => {
    // Prüfe, ob bereits eine Aktionsspalte existiert
    const hasActionsColumn = columns.some(col => 'id' in col && col.id === 'actions')

    if (hasActionsColumn) {
      return columns
    }

    // Erstelle eine Aktionsspalte
    const actionColumn: ColumnDef<T, any> = {
      id: 'actions',
      header: t('actions'),
      cell: info => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? 1 : 0.5,
            flexWrap: 'nowrap',
          }}
        >
          <Tooltip title={t('showDetails')}>
            <IconButton
              size={isMobile ? 'medium' : 'small'}
              color="primary"
              sx={{
                mx: isMobile ? 0 : 0.5,
                minWidth: isMobile ? '44px' : 'auto',
                minHeight: isMobile ? '44px' : 'auto',
              }}
              onClick={e => {
                e.stopPropagation()
                handleViewItemClick(getIdFromData(info.row.original))
              }}
            >
              <VisibilityIcon fontSize={isMobile ? 'medium' : 'small'} />
            </IconButton>
          </Tooltip>
          {isArchitect() && (
            <Tooltip title={t('edit')}>
              <IconButton
                size={isMobile ? 'medium' : 'small'}
                color="secondary"
                sx={{
                  mx: isMobile ? 0 : 0.5,
                  minWidth: isMobile ? '44px' : 'auto',
                  minHeight: isMobile ? '44px' : 'auto',
                }}
                onClick={e => {
                  e.stopPropagation()
                  handleEditItemClick(getIdFromData(info.row.original))
                }}
              >
                <EditIcon fontSize={isMobile ? 'medium' : 'small'} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    }

    return [...columns, actionColumn]
  }, [columns, handleViewItemClick, handleEditItemClick, getIdFromData, isMobile, t])

  // TanStack Table initialisieren
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      globalFilter,
      // Externes State-Management für die Spaltenvisibilität
      columnVisibility: _columnVisibility,
      // Lokale Pagination State
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
    onSortingChange: updater =>
      onSortingChange(typeof updater === 'function' ? updater(sorting) : updater),
    // Spaltenvisibilitätsänderungen an den externen State übergeben
    onColumnVisibilityChange: updater => {
      if (_onColumnVisibilityChange) {
        // Bestimme den neuen Zustand
        const newState = typeof updater === 'function' ? updater(_columnVisibility || {}) : updater

        // Update des externen States
        _onColumnVisibilityChange(newState)
      }
    },
    // Pagination State Updates handhaben
    onPaginationChange: updater => {
      const currentState = { pageIndex, pageSize }
      const newState = typeof updater === 'function' ? updater(currentState) : updater

      // Update lokale State
      if (newState.pageIndex !== pageIndex) {
        setPageIndex(newState.pageIndex)
      }
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    enableRowSelection: false,
  })

  // Table-Instanz über Callback bereitstellen
  React.useEffect(() => {
    if (onTableReady) {
      onTableReady(table)
    }

    // Debug-Log für Column Visibility deaktiviert, um ggf. Konsolenausgaben zu vermeiden
  }, [table, onTableReady])

  // Zeige Ladezustand an
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          overflow: 'auto',
          // Add momentum scrolling for iOS
          WebkitOverflowScrolling: 'touch',
          // Better responsive table handling
          '& table': {
            minWidth: isTablet ? '800px' : isMobile ? '600px' : '100%',
            tableLayout: 'fixed', // Fixed layout for better column control
          },
        }}
      >
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${theme.palette.divider}`,
            tableLayout: 'fixed', // Enforce fixed layout for better control
            // Responsive column widths
            '& th, & td': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              [theme.breakpoints.down('xl')]: {
                maxWidth: '200px', // Limit column width for 1800px screens
              },
              [theme.breakpoints.down('lg')]: {
                maxWidth: '150px',
              },
              [theme.breakpoints.down('md')]: {
                maxWidth: '120px',
              },
            },
            // Actions column specific width
            '& th:last-child, & td:last-child': {
              width: isTablet ? '120px' : isMobile ? '100px' : '140px',
              minWidth: isTablet ? '120px' : isMobile ? '100px' : '140px',
              maxWidth: isTablet ? '120px' : isMobile ? '100px' : '140px',
            },
          }}
        >
          <Box component="thead" sx={{ backgroundColor: theme.palette.background.paper }}>
            {table.getHeaderGroups().map(headerGroup => (
              <Box
                component="tr"
                key={headerGroup.id}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {headerGroup.headers.map(header => (
                  <Box
                    component="th"
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    sx={{
                      padding: isMobile ? '8px 4px' : '16px',
                      textAlign: 'left',
                      position: 'relative',
                      fontWeight: 'bold',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      verticalAlign: 'middle',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                      color: theme.palette.text.primary,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <Box component="span" ml={1}>
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'desc' ? (
                              <SortDownIcon fontSize="small" />
                            ) : (
                              <SortUpIcon fontSize="small" />
                            )
                          ) : null}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          <Box component="tbody">
            {table.getRowModel().rows.map(row => (
              <Box
                component="tr"
                key={row.id}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => {
                  const id = getIdFromData(row.original)
                  if (id) {
                    handleViewItemClick(id)
                  } else {
                    console.error(
                      'GenericTable - Fehler: Zeile geklickt, aber keine gültige ID gefunden in:',
                      row.original
                    )
                  }
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <Box
                    component="td"
                    key={cell.id}
                    onClick={cell.column.id === 'actions' ? e => e.stopPropagation() : undefined}
                    sx={{
                      padding: isMobile ? '8px 4px' : '16px',
                      verticalAlign: 'middle',
                      color: theme.palette.text.secondary,
                      '&:last-of-type': {
                        textAlign: cell.column.id === 'actions' ? 'center' : 'left',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                      }}
                      title={
                        typeof cell.getValue() === 'string'
                          ? (cell.getValue() as string)
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Paginierung */}
      <Box
        ref={tableContainerRef}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          p: 2,
          gap: isMobile ? 2 : 0,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Typography variant="body2" sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            {t('ofEntries', {
              total: table.getFilteredRowModel().rows.length,
              pageSize,
              start: pageIndex * pageSize + 1,
              end: Math.min((pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length),
            })}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: isMobile ? 'center' : 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Anfang Button */}
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'small'}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            startIcon={<FirstPageIcon />}
            sx={{
              minWidth: isMobile ? '120px' : 'auto',
              fontSize: isMobile ? '16px' : '14px',
            }}
          >
            {t('first')}
          </Button>

          {/* Zurück Button */}
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'small'}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            startIcon={<BackIcon />}
            sx={{
              minWidth: isMobile ? '44px' : '80px',
              fontSize: isMobile ? '16px' : '14px',
              '& .MuiButton-startIcon': {
                marginRight: isMobile ? 0 : '8px',
              },
            }}
          >
            {!isMobile && t('back')}
          </Button>

          {/* Seitenzahlen */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {(() => {
              const currentPage = pageIndex
              const totalPages = table.getPageCount()
              const maxButtons = isMobile ? 3 : 5
              const buttons: React.ReactNode[] = []

              if (totalPages <= maxButtons) {
                // Wenn weniger oder gleich maxButtons Seiten, zeige alle an
                for (let i = 0; i < totalPages; i++) {
                  buttons.push(
                    <Button
                      key={i}
                      variant={i === currentPage ? 'contained' : 'outlined'}
                      size={isMobile ? 'medium' : 'small'}
                      onClick={() => table.setPageIndex(i)}
                      sx={{
                        minWidth: isMobile ? '44px' : '36px',
                        minHeight: isMobile ? '44px' : '32px',
                        px: 1,
                        fontSize: isMobile ? '16px' : '14px',
                      }}
                    >
                      {i + 1}
                    </Button>
                  )
                }
              } else {
                // Mehr als maxButtons Seiten: intelligente Pagination
                if (currentPage < 2) {
                  // Am Anfang: [1] [2] [3] [4] ... [last]
                  for (let i = 0; i < Math.min(4, totalPages); i++) {
                    buttons.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? 'contained' : 'outlined'}
                        size={isMobile ? 'medium' : 'small'}
                        onClick={() => table.setPageIndex(i)}
                        sx={{
                          minWidth: isMobile ? '44px' : '36px',
                          minHeight: isMobile ? '44px' : '32px',
                          px: 1,
                          fontSize: isMobile ? '16px' : '14px',
                        }}
                      >
                        {i + 1}
                      </Button>
                    )
                  }
                  if (totalPages > 4) {
                    buttons.push(
                      <Box key="ellipsis-end" sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
                        ...
                      </Box>
                    )
                  }
                } else if (currentPage >= totalPages - 2) {
                  // Am Ende: [1] ... [n-3] [n-2] [n-1] [n]
                  buttons.push(
                    <Box key="ellipsis-start" sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
                      ...
                    </Box>
                  )
                  for (let i = Math.max(0, totalPages - 4); i < totalPages; i++) {
                    buttons.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? 'contained' : 'outlined'}
                        size={isMobile ? 'medium' : 'small'}
                        onClick={() => table.setPageIndex(i)}
                        sx={{
                          minWidth: isMobile ? '44px' : '36px',
                          minHeight: isMobile ? '44px' : '32px',
                          px: 1,
                          fontSize: isMobile ? '16px' : '14px',
                        }}
                      >
                        {i + 1}
                      </Button>
                    )
                  }
                } else {
                  // In der Mitte: [1] ... [current-1] [current] [current+1] ... [last]
                  buttons.push(
                    <Box key="ellipsis-start" sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
                      ...
                    </Box>
                  )
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    if (i >= 0 && i < totalPages) {
                      buttons.push(
                        <Button
                          key={i}
                          variant={i === currentPage ? 'contained' : 'outlined'}
                          size={isMobile ? 'medium' : 'small'}
                          onClick={() => table.setPageIndex(i)}
                          sx={{
                            minWidth: isMobile ? '44px' : '36px',
                            minHeight: isMobile ? '44px' : '32px',
                            px: 1,
                            fontSize: isMobile ? '16px' : '14px',
                          }}
                        >
                          {i + 1}
                        </Button>
                      )
                    }
                  }
                  buttons.push(
                    <Box key="ellipsis-end" sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
                      ...
                    </Box>
                  )
                }
              }

              return buttons
            })()}
          </Box>

          {/* Weiter Button */}
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'small'}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            endIcon={<ForwardIcon />}
            sx={{
              minWidth: isMobile ? '44px' : '80px',
              fontSize: isMobile ? '16px' : '14px',
              '& .MuiButton-endIcon': {
                marginLeft: isMobile ? 0 : '8px',
              },
            }}
          >
            {!isMobile && t('next')}
          </Button>

          {/* Ende Button */}
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'small'}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            endIcon={<LastPageIcon />}
            sx={{
              minWidth: isMobile ? '120px' : 'auto',
              fontSize: isMobile ? '16px' : '14px',
            }}
          >
            {t('last')}
          </Button>
        </Box>
      </Box>

      {/* Formular-Dialog */}
      {FormComponent && (
        <FormComponent
          data={selectedItem} // Standardisierte generische Prop
          {...(mapDataToFormValues && selectedItem ? mapDataToFormValues(selectedItem) : {})}
          mode={formMode}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          onDelete={
            onDelete && selectedItem ? () => handleDelete(getIdFromData(selectedItem)) : undefined
          }
          onEditMode={() => setFormMode('edit')}
          loading={formLoading}
          {...additionalProps}
        />
      )}
    </>
  )
}

export default GenericTable
