import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowData,
  ColumnDef,
  ColumnFiltersState,
  Column,
} from '@tanstack/react-table'
import { Box, Paper, useTheme, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { Trend, Ranking } from '@/gql/generated'
import { useTranslation } from '@/i18n/client'
import FilterDialog from '../TrendToolList/ListFilterDialog'
import ColumnVisibilityDialog from '../TrendToolList/ColumnVisibilityDialog'
import TrendTablePagination from '../TrendToolList/TrendToolTablePagination'
import TrendTable from '../TrendToolList/TrendToolTable'
import { inititalTrendColumnVisibility, maturity, trendStatus } from '../utils'
import { appContext } from '../AppContext'

const TrendList = ({ trends, lng }: { trends: Trend[]; lng: string }) => {
  const { t } = useTranslation(lng)
  const theme = useTheme()
  const tableRef = useRef<HTMLDivElement>(null)
  const context = useContext(appContext)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filterColumn, setFilterColumn] = useState<Column<Trend> | null>(null)
  const [filterValue, setFilterValue] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(inititalTrendColumnVisibility)
  const [columnDialogOpen, setColumnDialogOpen] = useState(false)
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const calculatePageSize = () => {
      if (tableRef.current) {
        const containerHeight = tableRef.current.clientHeight
        const rowHeight = 56 // Assuming each row is 56px high, adjust as needed
        const calculatedPageSize = Math.floor(containerHeight / rowHeight) - 1
        table.setPageSize(calculatedPageSize)
      }
    }
    // Calculate page size on initial render and when window resizes
    calculatePageSize()
    window.addEventListener('resize', calculatePageSize)

    // Set Trend Filter from context
    if (context.trendFilter) {
      const filter = JSON.parse(context.trendFilter)
      setColumnFilters(filter)
    }

    // Set Trend Visibility from context
    if (context.trendVisibility) {
      setColumnVisibility(context.trendVisibility)
    }

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', calculatePageSize)
  }, [])

  const columns: ColumnDef<Trend>[] = useMemo<ColumnDef<Trend>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('trend name'),
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }: { row: { original: Trend } }) => (
          <Tooltip title={row.original.name}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {row.original.name}
            </Box>
          </Tooltip>
        ),
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'category',
        header: t('category'),
        accessorFn: (trend: Trend) => `${trend.section?.category?.name}`,
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }: { row: { original: Trend } }) => (
          <Tooltip title={row.original.section?.category?.name}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {row.original.section?.category?.name}
            </Box>
          </Tooltip>
        ),
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'section',
        header: t('section'),
        accessorFn: (trend: Trend) => `${trend.section?.name}`,
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }: { row: { original: Trend } }) => (
          <Tooltip title={row.original.section?.name}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {row.original.section?.name}
            </Box>
          </Tooltip>
        ),
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'owner',
        header: t('owner'),
        accessorFn: (trend: Trend) =>
          trend.owner
            ? `${trend.owner.firstName} ${trend.owner.lastName}`
            : t('no owner'),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'updated',
        header: t('last updated'),
        accessorFn: (trend: Trend) =>
          new Date(trend.updatedAt ?? trend.createdAt).toLocaleString(lng),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'year',
        header: t('year'),
        accessorFn: (trend: Trend) =>
          new Date(trend.year).getFullYear().toString(),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'horizon',
        header: t('horizon'),
        accessorFn: (trend: Trend) =>
          new Date(trend.horizon).getFullYear().toString(),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'status',
        header: t('status'),
        accessorFn: (trend: Trend) => t(trend.status ?? ''),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'select',
          filterSelectOptions: trendStatus.map(option => ({
            value: option.value,
            label: t(option.value),
          })),
        },
      },
      {
        accessorKey: 'maturity',
        header: t('maturity'),
        accessorFn: (trend: Trend) => t(trend.maturity ?? ''),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'select',
          filterSelectOptions: maturity.map(option => ({
            value: option.value,
            label: t(option.value),
          })),
        },
      },
      {
        accessorKey: 'ranking',
        header: t('ranking'),
        accessorFn: (trend: Trend) => t(trend.ranking ?? ''),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'select',
          filterSelectOptions: Object.values(Ranking).map(option => ({
            value: option,
            label: t(option),
          })),
        },
      },
      {
        accessorKey: 'priority',
        header: t('priority'),
        accessorFn: (trend: Trend) => (trend.priority ? 'true' : 'false'),
        cell: ({ row }: { row: { original: Trend } }) =>
          row.original.priority ? <CheckIcon /> : '',
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          filterVariant: 'boolean',
        },
      },
    ],
    [t],
  )

  const table = useReactTable<Trend>({
    data: trends,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: 'name',
          desc: false,
        },
      ],
    },
    state: {
      columnVisibility,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
  })

  useEffect(() => {
    const filter = table.getState().columnFilters
    context.setTrendFilter(JSON.stringify(filter))
  }, [table.getState().columnFilters])

  useEffect(() => {
    context.setTrendVisibility(columnVisibility)
  }, [columnVisibility])

  const handleFilterDialogOpen = (
    event: React.MouseEvent<HTMLElement>,
    column: Column<Trend, unknown>,
  ) => {
    setFilterColumn(column)
    setFilterValue(String(table.getColumn(column.id)?.getFilterValue() ?? ''))
    setAnchorEl(event.currentTarget)
    setFilterDialogOpen(true)
  }

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false)
    setAnchorEl(null)
  }

  const handleFilterApply = () => {
    if (filterColumn) {
      filterColumn.setFilterValue(filterValue)
    }
    setFilterDialogOpen(false)
    setAnchorEl(null)
  }

  const handleFilterClear = () => {
    if (filterColumn) {
      filterColumn.setFilterValue('')
      setFilterValue('')
    }
    setFilterDialogOpen(false)
    setAnchorEl(null)
  }

  const handleColumnDialogOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColumnAnchorEl(event.currentTarget)
    setColumnDialogOpen(true)
  }

  const handleColumnDialogClose = () => {
    setColumnDialogOpen(false)
    setColumnAnchorEl(null)
  }

  const handleColumnVisibilityChange = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
    table.getColumn(columnId)?.toggleVisibility()
  }

  return (
    <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <TrendTable
        table={table}
        element='trends'
        tableRef={tableRef}
        setFilterDialog={handleFilterDialogOpen}
        setColumnDialog={handleColumnDialogOpen}
        lng={lng}
      />
      <TrendTablePagination columns={columns} table={table} />
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleFilterDialogClose}
        filterColumn={filterColumn}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        applyFilter={handleFilterApply}
        clearFilter={handleFilterClear}
        anchorEl={anchorEl}
        lng={lng}
      />
      <ColumnVisibilityDialog
        open={columnDialogOpen}
        onClose={handleColumnDialogClose}
        anchorE1={columnAnchorEl}
        columns={columns}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        lng={lng}
      />
    </Paper>
  )
}

export default TrendList
