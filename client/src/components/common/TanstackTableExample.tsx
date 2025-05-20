'use client'

import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  createColumnHelper,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from '@mui/material'

// Beispieltyp für die Tabelle
interface ExampleData {
  id: string
  name: string
  description: string
  createdAt: string
  status: 'active' | 'inactive' | 'pending'
}

// Beispieldaten
const exampleData: ExampleData[] = [
  {
    id: '1',
    name: 'Beispiel 1',
    description: 'Beschreibung 1',
    createdAt: '2023-01-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Beispiel 2',
    description: 'Beschreibung 2',
    createdAt: '2023-01-02',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Beispiel 3',
    description: 'Beschreibung 3',
    createdAt: '2023-01-03',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Beispiel 4',
    description: 'Beschreibung 4',
    createdAt: '2023-01-04',
    status: 'active',
  },
  {
    id: '5',
    name: 'Beispiel 5',
    description: 'Beschreibung 5',
    createdAt: '2023-01-05',
    status: 'active',
  },
]

/**
 * Eine Beispiel-Komponente zur Demonstration von Tanstack Table V8 mit Material UI
 */
const TanstackTableExample = () => {
  // State für Sortierung
  const [sorting, setSorting] = useState<SortingState>([])

  // Column Helper für Typsicherheit
  const columnHelper = createColumnHelper<ExampleData>()

  // Spalten-Definition im useMemo für Performance
  const columns = useMemo<ColumnDef<ExampleData>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => new Date(info.getValue()).toLocaleDateString('de-DE'),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue()
          return (
            <Box
              component="span"
              sx={{
                backgroundColor:
                  status === 'active'
                    ? 'success.main'
                    : status === 'inactive'
                      ? 'error.main'
                      : 'warning.main',
                color: 'white',
                borderRadius: '4px',
                px: 1,
                py: 0.5,
              }}
            >
              {status === 'active' ? 'Aktiv' : status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
            </Box>
          )
        },
      }),
    ],
    []
  )

  // Table-Hook mit Tanstack Table V8
  const table = useReactTable({
    data: exampleData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 3,
      },
    },
  })

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tanstack Table V8 Beispiel
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      fontWeight: 'bold',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {/* Sortier-Indikator */}
                    <Box component="span" sx={{ pl: 0.5 }}>
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginierung mit Material UI */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={table.getPageCount()}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => table.setPageIndex(page - 1)}
          color="primary"
        />
      </Box>
    </Box>
  )
}

export default TanstackTableExample
