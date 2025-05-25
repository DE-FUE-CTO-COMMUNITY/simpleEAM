'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { Capability } from './types'
import { formatDate, getLevelLabel } from './utils'
import { CapabilityStatus, BusinessCapability } from '../../gql/generated'
import CapabilityForm, { CapabilityFormValues } from './CapabilityForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'

interface CapabilityTableProps {
  id?: string
  capabilities: Capability[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateCapability?: (data: CapabilityFormValues) => Promise<void>
  onUpdateCapability?: (id: string, data: CapabilityFormValues) => Promise<void>
  onDeleteCapability?: (id: string) => Promise<void>
  availableTags?: string[]
  availableCapabilities?: BusinessCapability[]
}

const CapabilityTable: React.FC<CapabilityTableProps> = ({
  capabilities,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateCapability,
  onUpdateCapability,
  onDeleteCapability,
  availableTags = [],
  availableCapabilities = [],
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<Capability>()

  // Spalten-Definition für die Capability-Tabelle
  const columns = useMemo(
    () => [
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
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
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
    ],
    [theme.palette.primary.lighter, theme.palette.primary.dark, columnHelper]
  )

  // Mapping von Capability zu den erwarteten FormValues für das Formular
  const mapToFormValues = (capability: Capability): CapabilityFormValues => {
    return {
      name: capability.name ?? '',
      description: capability.description ?? '',
      maturityLevel: capability.maturityLevel ?? 0,
      businessValue: capability.businessValue ?? 0,
      status: capability.status ?? CapabilityStatus.ACTIVE,
      ownerId: capability.owners && capability.owners.length > 0 ? capability.owners[0].id : '',
      tags: capability.tags ?? [],
      parentId: '',
    }
  }

  return (
    <GenericTable<Capability, CapabilityFormValues>
      data={capabilities}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateCapability}
      onUpdate={onUpdateCapability}
      onDelete={onDeleteCapability}
      emptyMessage="Keine Business Capabilities gefunden."
      createButtonLabel="Neue Business Capability erstellen"
      entityName="Capability"
      FormComponent={CapabilityForm}
      getIdFromData={(item: Capability) => item.id}
      mapDataToFormValues={mapToFormValues}
      additionalProps={{
        availableTags,
        availableCapabilities,
      }}
    />
  )
}

export default CapabilityTable
