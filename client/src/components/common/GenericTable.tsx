'use client'

import React, { useState, useCallback, useMemo, ReactNode } from 'react'
import { Box, Tooltip, IconButton, CircularProgress, Button, useTheme, Chip } from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as SortDownIcon,
  KeyboardArrowUp as SortUpIcon,
} from '@mui/icons-material'
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { isArchitect } from '@/lib/auth'

/**
 * GenericTableProps definiert die gemeinsamen Eigenschaften für alle Tabellen
 * T ist der Typ der Daten (z.B. Capability, Application, DataObject, Person, Interface)
 * F ist der Typ der Formulardaten (z.B. CapabilityFormValues, ApplicationFormValues)
 */
export interface GenericTableProps<T, F> {
  id?: string
  data: T[] // Die Daten für die Tabelle
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  columns: ColumnDef<T, any>[] // Spalten-Definition
  onCreate?: (data: F) => Promise<void>
  onUpdate?: (id: string, data: F) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  emptyMessage?: string // Nachricht, wenn keine Daten vorhanden sind
  createButtonLabel?: string // Label für den Erstellungsbutton
  entityName?: string // Name der Entität (z.B. "Capability", "Application")
  FormComponent?: React.ComponentType<any> // Formular-Komponente
  getIdFromData?: (item: T) => string // Funktion zum Extrahieren der ID aus den Daten
  mapDataToFormValues?: (item: T) => F // Funktion zum Mapping der Daten zu Formularwerten
  additionalProps?: Record<string, any> // Zusätzliche Props für das Formular
}

/**
 * GenericTable ist eine wiederverwendbare Tabellenkomponente für verschiedene Entitätstypen
 */
export function GenericTable<T extends { id: string }, F>({
  data,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  columns,
  onCreate,
  onUpdate,
  onDelete,
  emptyMessage = 'Keine Daten gefunden.',
  createButtonLabel = 'Neu erstellen',
  entityName = 'Element',
  FormComponent,
  getIdFromData = (item: T) => item.id,
  mapDataToFormValues,
  additionalProps = {},
}: GenericTableProps<T, F>) {
  // State für das Formular-Dialog
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('view')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const theme = useTheme()

  // Handler für das Öffnen des Formulars zur Detailansicht
  const handleViewItemClick = useCallback(
    (id: string) => {
      console.log('GenericTable - handleViewItemClick mit ID:', id)

      if (!id) {
        console.error('GenericTable - Keine gültige ID für die Ansicht erhalten')
        return
      }

      const item = data.find(i => getIdFromData(i) === id)

      if (item) {
        console.log('GenericTable - Item in Tabellendaten gefunden:', item)
        setSelectedItem(item)
        setFormMode('view')
        setIsFormOpen(true)
      } else {
        console.log('GenericTable - Item nicht in lokalen Daten gefunden, onRowClick aufrufen')
        onRowClick(id)
      }
    },
    [data, onRowClick, getIdFromData]
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
        onEditClick(id)
      }
    },
    [data, onEditClick, getIdFromData]
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
          await onUpdate(getIdFromData(selectedItem), formData)
          // Nur schließen wenn erfolgreich
          setIsFormOpen(false)
        }
      } catch (error) {
        console.error('Fehler beim Speichern:', error)
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
          console.error('Fehler beim Löschen:', error)
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
      header: 'Aktionen',
      cell: info => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Details anzeigen">
            <IconButton
              size="small"
              color="primary"
              sx={{ mx: 0.5 }}
              onClick={e => {
                e.stopPropagation()
                handleViewItemClick(getIdFromData(info.row.original))
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isArchitect() && (
            <Tooltip title="Bearbeiten">
              <IconButton
                size="small"
                color="secondary"
                sx={{ mx: 0.5 }}
                onClick={e => {
                  e.stopPropagation()
                  handleEditItemClick(getIdFromData(info.row.original))
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    }

    return [...columns, actionColumn]
  }, [columns, handleViewItemClick, handleEditItemClick, getIdFromData])

  // TanStack Table initialisieren
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: updater =>
      onSortingChange(typeof updater === 'function' ? updater(sorting) : updater),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Zeige Ladezustand an
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Keine Daten vorhanden und Button zum Erstellen eines neuen Eintrags
  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        {emptyMessage}
        {isArchitect() && onCreate && (
          <Box mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSelectedItem(null)
                setFormMode('create')
                setIsFormOpen(true)
              }}
            >
              {createButtonLabel}
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ overflow: 'auto' }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${theme.palette.divider}`,
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
                      padding: '16px',
                      textAlign: 'left',
                      position: 'relative',
                      fontWeight: 'bold',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                      color: theme.palette.text.primary,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
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
                  console.log('GenericTable - Zeile geklickt, ID:', id, 'Datensatz:', row.original)
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
                      padding: '16px',
                      verticalAlign: 'middle',
                      color: theme.palette.text.secondary,
                      '&:last-of-type': {
                        textAlign: cell.column.id === 'actions' ? 'center' : 'left',
                      },
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Paginierung */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            Zeige {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
            bis{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            von {table.getFilteredRowModel().rows.length} Einträgen
          </Box>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {[5, 10, 25, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize} pro Seite
              </option>
            ))}
          </select>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Zurück
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Array.from({ length: table.getPageCount() > 7 ? 7 : table.getPageCount() }, (_, i) => {
              // Zeige maximal 7 Seitenzahlen an
              let pageIndex
              const currentPage = table.getState().pagination.pageIndex
              const totalPages = table.getPageCount()

              if (totalPages <= 7) {
                // Wenn weniger als 7 Seiten, zeige alle an
                pageIndex = i
              } else if (currentPage < 3) {
                // Wenn aktuelle Seite weniger als 3 ist
                if (i < 5) {
                  pageIndex = i
                } else if (i === 5) {
                  return (
                    <Box key="ellipsis-end" sx={{ mx: 1 }}>
                      ...
                    </Box>
                  )
                } else {
                  pageIndex = totalPages - 1
                }
              } else if (currentPage > totalPages - 4) {
                // Wenn aktuelle Seite nahe am Ende ist
                if (i === 0) {
                  pageIndex = 0
                } else if (i === 1) {
                  return (
                    <Box key="ellipsis-start" sx={{ mx: 1 }}>
                      ...
                    </Box>
                  )
                } else {
                  pageIndex = totalPages - 7 + i
                }
              } else {
                // Wenn aktuelle Seite in der Mitte ist
                if (i === 0) {
                  pageIndex = 0
                } else if (i === 1) {
                  return (
                    <Box key="ellipsis-start" sx={{ mx: 1 }}>
                      ...
                    </Box>
                  )
                } else if (i === 6) {
                  return (
                    <Box key="ellipsis-end" sx={{ mx: 1 }}>
                      ...
                    </Box>
                  )
                } else if (i === 5) {
                  pageIndex = totalPages - 1
                } else {
                  pageIndex = currentPage + (i - 3)
                }
              }

              // Prüfen und anpassen bei ungültigen pageIndex-Werten
              if (pageIndex < 0) pageIndex = 0
              if (pageIndex >= totalPages) pageIndex = totalPages - 1

              return (
                <Button
                  key={pageIndex}
                  variant={pageIndex === currentPage ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => table.setPageIndex(pageIndex)}
                  sx={{
                    minWidth: '36px',
                    px: 1,
                  }}
                >
                  {pageIndex + 1}
                </Button>
              )
            })}
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Weiter
          </Button>
        </Box>
      </Box>

      {/* Formular-Dialog */}
      {FormComponent && (
        <FormComponent
          application={selectedItem} // Für ApplicationForm
          capability={selectedItem} // Für CapabilityForm
          dataObject={selectedItem} // Für DataObjectForm
          applicationInterface={selectedItem} // Für ApplicationInterfaceForm
          person={selectedItem} // Für PersonForm - hinzugefügt
          data={selectedItem} // Fallback für generische Forms
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
