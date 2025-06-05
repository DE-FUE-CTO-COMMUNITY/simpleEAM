import React from 'react'
import { useReactTable, flexRender, Column } from '@tanstack/react-table'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  useTheme,
  TableSortLabel,
  Box,
  Button,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import EditIcon from '@mui/icons-material/Edit'
import { trendStatus } from '@/components/utils'
import { useTranslation } from '@/i18n/client'
import { useRouter } from 'next/navigation'

const TrendToolTable = ({
  table,
  tableRef,
  setFilterDialog,
  setColumnDialog,
  element,
  lng,
}: {
  table: ReturnType<typeof useReactTable<any>>
  tableRef: React.RefObject<HTMLDivElement | null>
  setFilterDialog: (
    event: React.MouseEvent<HTMLElement>,
    column: Column<any>,
  ) => void
  setColumnDialog: (event: React.MouseEvent<HTMLElement>) => void
  element: string
  lng: string
}) => {
  const theme = useTheme()
  const { t } = useTranslation(lng)
  const router = useRouter()
  return (
    <TableContainer
      ref={tableRef}
      sx={{
        height: 'calc(100% - 52px)',
        width: '100%',
        overflowY: 'hidden',
      }}>
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              sx={{
                height: '56px',
              }}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  sx={{
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    width:
                      header.column.columnDef.header === 'Name'
                        ? '17%'
                        : new Set([t('status'), t('year'), t('horizon')]).has(
                            header.column.columnDef.header as string,
                          )
                        ? '6%'
                        : '12%',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    {header.column.getCanSort() ? (
                      <TableSortLabel
                        sx={{
                          color: theme.palette.primary.contrastText,
                          '&.Mui-active': {
                            color: theme.palette.primary.contrastText,
                          },
                          '& .MuiTableSortLabel-icon': {
                            color: `${theme.palette.primary.contrastText} !important`,
                          },
                        }}
                        active={header.column.getIsSorted() !== false}
                        direction={
                          header.column.getIsSorted() === 'desc'
                            ? 'desc'
                            : 'asc'
                        }
                        onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableSortLabel>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                    {header.column.getCanFilter() ? (
                      <IconButton
                        color='inherit'
                        onClick={event => setFilterDialog(event, header.column)}
                        size='small'
                        sx={{ marginLeft: '8px' }}>
                        {table.getColumn(header.column.id)?.getFilterValue() ? (
                          <FilterAltIcon fontSize='small' />
                        ) : (
                          <FilterListIcon fontSize='small' />
                        )}
                      </IconButton>
                    ) : null}
                  </Box>
                </TableCell>
              ))}
              <TableCell
                align='right'
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,

                  width: '10%',
                }}>
                <IconButton
                  onClick={setColumnDialog}
                  size='small'
                  color='inherit'
                  sx={{ marginLeft: '8px' }}>
                  <ViewColumnIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} sx={{ height: '56px' }}>
              {row.getVisibleCells().map(cell => {
                return (
                  <TableCell
                    key={cell.id}
                    sx={{
                      padding: '8px 16px',
                      color:
                        element === 'trends' &&
                        cell.column.columnDef.header === 'Status'
                          ? trendStatus.find(
                              s =>
                                s.value ===
                                cell.getContext().row.original.status,
                            )?.background ?? 'inherit'
                          : 'inherit',
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
              <TableCell
                align='right'
                sx={{
                  height: '56px',
                  padding: '8px 16px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <IconButton
                  size='small'
                  sx={{ display: { xs: 'block', xxl: 'none' } }}
                  onClick={() => {
                    router.push(`/${element}/${row.original.id}`)
                  }}>
                  <EditIcon />
                </IconButton>
                <Button
                  size='small'
                  variant='outlined'
                  sx={{
                    display: { xs: 'none', xxl: 'flex' },
                    textTransform: 'none',
                    minWidth: 'auto',
                  }}
                  startIcon={<EditIcon />}
                  onClick={() => {
                    router.push(`/${element}/${row.original.id}`)
                  }}>
                  {t('edit')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TrendToolTable
