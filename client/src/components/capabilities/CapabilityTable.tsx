'use client'

import React, { useState } from 'react'
import { Box, Tooltip, IconButton, CircularProgress, Button, useTheme, Chip } from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as SortDownIcon,
  KeyboardArrowUp as SortUpIcon,
} from '@mui/icons-material'
import { Capability } from './types'
import { formatDate, getLevelLabel } from './utils'
import { BusinessCapability, CapabilityStatus } from '../../gql/generated'
import CapabilityForm, { CapabilityFormValues } from './CapabilityForm'
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

interface CapabilityTableProps {
  id?: string
  capabilities: Capability[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateCapability?: (data: CapabilityFormValues) => Promise<void>
  onUpdateCapability?: (id: string, data: CapabilityFormValues) => Promise<void>
  onDeleteCapability?: (id: string) => Promise<void>
  availableTags?: string[]
}

const CapabilityTable: React.FC<CapabilityTableProps> = ({
  id: _id, // Markiere als unbenutzt
  capabilities,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  onCreateCapability,
  onUpdateCapability,
  onDeleteCapability,
  availableTags = [],
}) => {
  // State für das Formular-Dialog
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('view')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<BusinessCapability | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const theme = useTheme()
  const columnHelper = createColumnHelper<Capability>()

  // Handler für Formular-Operationen
  // Handler für das Öffnen des Formulars zur Detailansicht
  const handleViewCapabilityClick = (id: string) => {
    const capability = capabilities.find(cap => cap.id === id)
    if (capability) {
      setSelectedCapability(capability as unknown as BusinessCapability)
      setFormMode('view')
      setIsFormOpen(true)
    } else {
      onRowClick(id)
    }
  }

  // Handler für das Öffnen des Formulars zum Bearbeiten
  const handleEditCapabilityClick = (id: string) => {
    const capability = capabilities.find(cap => cap.id === id)
    if (capability) {
      setSelectedCapability(capability as unknown as BusinessCapability)
      setFormMode('edit')
      setIsFormOpen(true)
    } else {
      onEditClick(id)
    }
  }

  // Handler für das Erstellen einer neuen Capability (nicht mehr verwendet)
  // Diese Funktion wird jetzt über die Hauptseite (page.tsx) gesteuert

  // Handler für das Schließen des Formulars
  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  // Handler für das Speichern des Formulars
  const handleFormSubmit = async (data: CapabilityFormValues) => {
    setFormLoading(true)
    try {
      if (formMode === 'create' && onCreateCapability) {
        await onCreateCapability(data)
      } else if (formMode === 'edit' && onUpdateCapability && selectedCapability) {
        await onUpdateCapability(selectedCapability.id, data)
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error('Fehler beim Speichern der Capability:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Beschreibung',
      cell: info => {
        const value = info.getValue()
        return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
      },
    }),
    columnHelper.accessor('maturityLevel', {
      header: 'Reifegrad',
      cell: info => {
        const level = info.getValue()
        return (
          <Chip
            label={getLevelLabel(level)}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.lighter,
              color: theme.palette.primary.dark,
            }}
          />
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue() as CapabilityStatus
        return status
      },
    }),
    columnHelper.accessor('businessValue', {
      header: 'Geschäftswert',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('owner', {
      header: 'Verantwortlicher',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('tags', {
      header: 'Tags',
      cell: info => {
        const tags = info.getValue()
        return tags ? tags.join(', ') : '-'
      },
    }),
    columnHelper.accessor('children', {
      header: 'Untergeordnete Capabilities',
      cell: info => {
        const children = info.getValue()
        return children ? children.map(child => child.name).join(', ') : '-'
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Erstellt am',
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Aktualisiert am',
      cell: info => {
        const value = info.getValue()
        return value ? formatDate(value) : '-'
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aktionen',
      cell: info => {
        const capability = info.row.original

        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {' '}
            <Tooltip title="Details anzeigen">
              <IconButton
                onClick={() => handleViewCapabilityClick(capability.id)}
                color="primary"
                size="small"
                sx={{ mx: 0.5 }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {isArchitect() && (
              <Tooltip title="Bearbeiten">
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    handleEditCapabilityClick(capability.id)
                  }}
                  color="secondary"
                  size="small"
                  sx={{ mx: 0.5 }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    }),
  ]

  // TanStack Table konfigurieren
  const table = useReactTable({
    data: capabilities,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: updater => onSortingChange(updater as SortingState),
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {/* Versteckter Button zum Öffnen des Erstellungsformulars */}
      {isArchitect() && onCreateCapability && (
        <Button
          id="create-capability-button"
          style={{ display: 'none' }}
          onClick={() => {
            setSelectedCapability(null)
            setFormMode('create')
            setIsFormOpen(true)
          }}
        >
          Neu erstellen
        </Button>
      )}

      <Box sx={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: '16px',
                      textAlign: header.id === 'actions' ? 'center' : 'left',
                      backgroundColor: theme.palette.grey[100],
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontWeight: 600,
                      position: 'relative',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: header.id === 'actions' ? 'center' : 'flex-start',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <Box sx={{ ml: 1 }}>
                          {{
                            asc: <SortUpIcon fontSize="small" />,
                            desc: <SortDownIcon fontSize="small" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                opacity: 0.3,
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Keine Business Capabilities gefunden.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseOver={e => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor =
                      theme.palette.action.hover
                  }}
                  onMouseOut={e => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '16px',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        textAlign: cell.column.id === 'actions' ? 'center' : 'left',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

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

      {/* Capability-Formular Dialog */}
      <CapabilityForm
        capability={selectedCapability}
        availableCapabilities={capabilities as unknown as BusinessCapability[]}
        availableTags={availableTags}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onDelete={
          onDeleteCapability && selectedCapability
            ? id => {
                setFormLoading(true)
                return onDeleteCapability(id).finally(() => {
                  setFormLoading(false)
                  setIsFormOpen(false)
                })
              }
            : undefined
        }
        mode={formMode}
        loading={formLoading}
        onEditMode={() => setFormMode('edit')}
      />
    </>
  )
}

export default CapabilityTable
