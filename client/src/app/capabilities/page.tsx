'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  KeyboardArrowDown as SortDownIcon,
  KeyboardArrowUp as SortUpIcon,
} from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAuth, login, isArchitect } from '@/lib/auth';
import RootLayout from '@/components/layout/RootLayout';
import { GET_CAPABILITIES } from '@/graphql/capability';

interface Capability {
  id: string;
  name: string;
  description: string;
  maturityLevel: number; // Geändert von 'level'
  status: string;
  businessValue: number;
  owner?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  children?: { id: string; name: string }[]; // Statt parentCapability
}

const CapabilitiesPage = () => {
  const { authenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login();
    }
  }, [authenticated]);

  // Business Capabilities laden
  const { loading, error, data } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  });

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Business Capabilities', { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const capabilities = data?.businessCapabilities || [];

  // Formatiert das Datum für die Anzeige
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Unbekannt';
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return 'Niedrig';
      case 1:
        return 'Mittel';
      case 2:
        return 'Hoch';
      case 3:
        return 'Sehr Hoch';
      default:
        return `Level ${level}`;
    }
  };

  const columnHelper = createColumnHelper<Capability>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => {
          const value = info.getValue();
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-';
        },
      }),
      columnHelper.accessor('maturityLevel', {
        header: 'Reifegrad',
        cell: info => {
          const level = info.getValue();
          return (
            <Chip
              label={getLevelLabel(level)}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.lighter,
                color: theme.palette.primary.dark,
              }}
            />
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => info.getValue(),
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
          const tags = info.getValue();
          return tags ? tags.join(', ') : '-';
        },
      }),
      columnHelper.accessor('children', {
        header: 'Untergeordnete Capabilities',
        cell: info => {
          const children = info.getValue();
          return children ? children.map(child => child.name).join(', ') : '-';
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => (info.getValue() ? formatDate(info.getValue()) : '-'),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Aktionen',
        cell: info => {
          const capability = info.row.original;

          return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip title="Details anzeigen">
                <IconButton
                  onClick={() => handleViewCapability(capability.id)}
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
                    onClick={() => handleEditCapability(capability.id)}
                    color="secondary"
                    size="small"
                    sx={{ mx: 0.5 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        },
      }),
    ],
    [theme.palette]
  );

  // TanStack Table konfigurieren
  const table = useReactTable({
    data: capabilities,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Business Capability Details anzeigen
  const handleViewCapability = (id: string) => {
    router.push(`/capabilities/${id}`);
  };

  // Business Capability bearbeiten
  const handleEditCapability = (id: string) => {
    router.push(`/capabilities/edit/${id}`);
  };

  // Neue Business Capability erstellen
  const handleCreateCapability = () => {
    router.push('/capabilities/create');
  };

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Business Capabilities
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCapability}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            placeholder="Capabilities durchsuchen..."
            variant="outlined"
            size="small"
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Weitere Filter">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{ overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
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
                    Zeige{' '}
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                      1}{' '}
                    bis{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{' '}
                    von {table.getFilteredRowModel().rows.length} Einträgen
                  </Box>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      table.setPageSize(Number(e.target.value));
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
                    {Array.from(
                      { length: table.getPageCount() > 7 ? 7 : table.getPageCount() },
                      (_, i) => {
                        // Zeige maximal 7 Seitenzahlen an
                        let pageIndex;
                        const currentPage = table.getState().pagination.pageIndex;
                        const totalPages = table.getPageCount();

                        if (totalPages <= 7) {
                          // Wenn weniger als 7 Seiten, zeige alle an
                          pageIndex = i;
                        } else if (currentPage < 3) {
                          // Wenn aktuelle Seite weniger als 3 ist
                          if (i < 5) {
                            pageIndex = i;
                          } else if (i === 5) {
                            return (
                              <Box key="ellipsis-end" sx={{ mx: 1 }}>
                                ...
                              </Box>
                            );
                          } else {
                            pageIndex = totalPages - 1;
                          }
                        } else if (currentPage > totalPages - 4) {
                          // Wenn aktuelle Seite nahe am Ende ist
                          if (i === 0) {
                            pageIndex = 0;
                          } else if (i === 1) {
                            return (
                              <Box key="ellipsis-start" sx={{ mx: 1 }}>
                                ...
                              </Box>
                            );
                          } else {
                            pageIndex = totalPages - 7 + i;
                          }
                        } else {
                          // Wenn aktuelle Seite in der Mitte ist
                          if (i === 0) {
                            pageIndex = 0;
                          } else if (i === 1) {
                            return (
                              <Box key="ellipsis-start" sx={{ mx: 1 }}>
                                ...
                              </Box>
                            );
                          } else if (i === 6) {
                            return (
                              <Box key="ellipsis-end" sx={{ mx: 1 }}>
                                ...
                              </Box>
                            );
                          } else if (i === 5) {
                            pageIndex = totalPages - 1;
                          } else {
                            pageIndex = currentPage + (i - 3);
                          }
                        }

                        // Prüfen und anpassen bei ungültigen pageIndex-Werten
                        if (pageIndex < 0) pageIndex = 0;
                        if (pageIndex >= totalPages) pageIndex = totalPages - 1;

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
                        );
                      }
                    )}
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
            </>
          )}
        </Paper>
      </Card>
    </Box>
  );
};

export default CapabilitiesPage;
