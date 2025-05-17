'use client'

import React, { useState } from 'react'
import { Box, Tooltip, IconButton, CircularProgress, Button, useTheme, Chip } from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as SortDownIcon,
  KeyboardArrowUp as SortUpIcon,
} from '@mui/icons-material'
import { ApplicationType } from './types'
import { formatDate, getCriticalityLabel, formatCosts } from './utils'
import { Application, ApplicationStatus, CriticalityLevel } from '../../gql/generated'
import ApplicationForm, { ApplicationFormValues } from './ApplicationForm'
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
} from '@tanstack/react-table'
import { isArchitect } from '@/lib/auth'

interface ApplicationTableProps {
  id?: string
  applications: ApplicationType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateApplication?: (data: ApplicationFormValues) => Promise<void>
  onUpdateApplication?: (id: string, data: ApplicationFormValues) => Promise<void>
  onDeleteApplication?: (id: string) => Promise<void>
  availableTechStack?: string[]
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  id: _id, // Markiere als unbenutzt
  applications,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  availableTechStack = [],
}) => {
  // State für das Formular-Dialog
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('view')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const theme = useTheme()
  const columnHelper = createColumnHelper<ApplicationType>()

  // Handler für Formular-Operationen
  // Handler für das Öffnen des Formulars zur Detailansicht
  const handleViewApplicationClick = (id: string) => {
    const application = applications.find(app => app.id === id)
    if (application) {
      // Stelle sicher, dass alle erforderlichen Eigenschaften vorhanden sind
      const completeApplication = {
        ...application,
        usesDataObjects: application.usesDataObjects || [],
        interfacesToApplications: application.interfacesToApplications || [],
      } as unknown as Application

      setSelectedApplication(completeApplication)
      setFormMode('view')
      setIsFormOpen(true)
    } else {
      console.warn('Application not found for viewing, falling back to onRowClick:', id)
      onRowClick(id)
    }
  }

  // Handler für das Öffnen des Formulars zum Bearbeiten
  const handleEditApplicationClick = (id: string) => {
    const application = applications.find(app => app.id === id)
    if (application) {
      // Stelle sicher, dass alle erforderlichen Eigenschaften vorhanden sind
      const completeApplication = {
        ...application,
        usesDataObjects: application.usesDataObjects || [],
        interfacesToApplications: application.interfacesToApplications || [],
      } as unknown as Application

      setSelectedApplication(completeApplication)
      setFormMode('edit')
      setIsFormOpen(true)
    } else {
      console.warn('Application not found for editing, falling back to onEditClick:', id)
      onEditClick(id)
    }
  }

  // Handler für das Schließen des Formulars
  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  // Handler für das Speichern des Formulars
  const handleFormSubmit = async (data: ApplicationFormValues) => {
    setFormLoading(true)
    try {
      if (formMode === 'create' && onCreateApplication) {
        await onCreateApplication(data)
      } else if (formMode === 'edit' && selectedApplication && onUpdateApplication) {
        await onUpdateApplication(selectedApplication.id, data)
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} application:`, error)
    } finally {
      setFormLoading(false)
    }
  }

  // Spalten-Definition mit columnHelper
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
        footer: info => info.column.id,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <Chip label={info.getValue()} size="small" />,
        footer: info => info.column.id,
      }),
      columnHelper.accessor('criticality', {
        header: 'Kritikalität',
        cell: info => getCriticalityLabel(info.getValue() as CriticalityLevel),
        footer: info => info.column.id,
      }),
      columnHelper.accessor('vendor', {
        header: 'Anbieter',
        cell: info => info.getValue() || '-',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('version', {
        header: 'Version',
        cell: info => info.getValue() || '-',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          // Nur den ersten Owner anzeigen, falls vorhanden
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
        footer: info => info.column.id,
      }),
      columnHelper.accessor('costs', {
        header: 'Kosten',
        cell: info => formatCosts(info.getValue()),
        footer: info => info.column.id,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert',
        cell: info => formatDate(info.getValue()),
        footer: info => info.column.id,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Aktionen',
        cell: info => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {' '}
            <Tooltip title="Details anzeigen">
              <IconButton
                size="small"
                color="primary"
                sx={{ mx: 0.5 }}
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleViewApplicationClick(info.row.original.id)
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
                    e.preventDefault()
                    handleEditApplicationClick(info.row.original.id)
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
        footer: info => info.column.id,
      }),
    ],
    []
  )

  // TanStack Table initialisieren
  const table = useReactTable({
    data: applications,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: onSortingChange,
    onGlobalFilterChange: () => {}, // Wird über den Parent gesteuert
    globalFilterFn: 'includesString',
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

  // Keine Daten vorhanden
  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        Keine Applikationen gefunden.
        {isArchitect() && onCreateApplication && (
          <Box mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSelectedApplication(null)
                setFormMode('create')
                setIsFormOpen(true)
              }}
            >
              Neue Applikation erstellen
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'table',
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
              onClick={e => {
                e.preventDefault()
                handleViewApplicationClick(row.original.id)
              }}
            >
              {row.getVisibleCells().map(cell => (
                <Box
                  component="td"
                  key={cell.id}
                  onClick={cell.column.id === 'actions' ? e => e.stopPropagation() : undefined}
                  sx={{
                    padding: '16px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: theme.palette.text.secondary,
                    '&:last-of-type': {
                      textAlign: 'right',
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

      {/* Applikations-Formular Dialog */}
      <ApplicationForm
        application={selectedApplication}
        mode={formMode}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onDelete={
          onDeleteApplication && selectedApplication
            ? id => {
                setFormLoading(true)
                return onDeleteApplication(id).finally(() => {
                  setFormLoading(false)
                  setIsFormOpen(false)
                })
              }
            : undefined
        }
        availableTechStack={availableTechStack}
        onEditMode={() => setFormMode('edit')}
        loading={formLoading}
      />
    </>
  )
}

export default ApplicationTable
