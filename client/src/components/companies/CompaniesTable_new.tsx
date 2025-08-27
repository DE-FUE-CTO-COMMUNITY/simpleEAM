'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IconButton, Tooltip, Chip, Link as MuiLink } from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import { GenericTable } from '../common/GenericTable'
import { CompanyType } from './types'
import { formatDate, getCompanySizeLabel, formatWebsite, formatAddress } from './utils'
import { createColumnHelper } from '@tanstack/react-table'

interface CompaniesTableProps {
  companies: CompanyType[]
  isLoading: boolean
  error: Error | null
  onEdit: (company: CompanyType) => void
  onDelete: (company: CompanyType) => void
  onView: (company: CompanyType) => void
}

export function CompaniesTable({
  companies,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
}: CompaniesTableProps) {
  const t = useTranslations('companies')

  const columnHelper = createColumnHelper<CompanyType>()

  const columns = [
    columnHelper.accessor('id', {
      header: t('table.headers.id'),
      size: 80,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: t('table.headers.name'),
      size: 200,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: t('table.headers.description'),
      size: 300,
      cell: info => (
        <span title={info.getValue() || ''}>
          {info.getValue() ? info.getValue().substring(0, 100) + '...' : '-'}
        </span>
      ),
    }),
    columnHelper.accessor('address', {
      header: t('table.headers.address'),
      size: 200,
      cell: info => formatAddress(info.getValue()),
    }),
    columnHelper.accessor('website', {
      header: t('table.headers.website'),
      size: 150,
      cell: info => {
        const website = info.getValue()
        if (!website) return '-'
        const formattedWebsite = formatWebsite(website)
        return (
          <MuiLink
            href={formattedWebsite}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            {website}
          </MuiLink>
        )
      },
    }),
    columnHelper.accessor('industry', {
      header: t('table.headers.industry'),
      size: 150,
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('size', {
      header: t('table.headers.size'),
      size: 120,
      cell: info => {
        const size = info.getValue()
        if (!size) return '-'
        return <Chip label={getCompanySizeLabel(size)} size="small" variant="outlined" />
      },
    }),
    columnHelper.accessor('createdAt', {
      header: t('table.headers.createdAt'),
      size: 120,
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('updatedAt', {
      header: t('table.headers.updatedAt'),
      size: 120,
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.headers.actions'),
      size: 120,
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tooltip title={t('actions.view')}>
            <IconButton
              size="small"
              onClick={() => onView(row.original)}
              aria-label={t('actions.view')}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.edit')}>
            <IconButton
              size="small"
              onClick={() => onEdit(row.original)}
              aria-label={t('actions.edit')}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton
              size="small"
              onClick={() => onDelete(row.original)}
              aria-label={t('actions.delete')}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    }),
  ]

  return (
    <GenericTable<CompanyType>
      data={companies}
      columns={columns}
      isLoading={isLoading}
      error={error}
      noDataMessage={t('table.noData')}
      loadingMessage={t('table.loading')}
    />
  )
}
