import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Button,
  Popover,
} from '@mui/material'
import { useTranslation } from '@/i18n/client'
import { ColumnDef } from '@tanstack/react-table'

interface ColumnVisibilityDialogProps {
  open: boolean
  onClose: () => void
  anchorE1: HTMLElement | null
  columns: ColumnDef<any>[]
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (columnId: string) => void
  lng: string
}

const ColumnVisibilityDialog: React.FC<ColumnVisibilityDialogProps> = ({
  open,
  onClose,
  anchorE1,
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  lng,
}) => {
  const { t } = useTranslation(lng)

  return (
    <Popover
      open={open}
      anchorEl={anchorE1}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}>
      <DialogTitle>{t('column visibility')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        {columns.map((column: ColumnDef<any>) => {
          return (
            <FormControlLabel
              key={(column as any).accessorKey}
              control={
                <Checkbox
                  checked={
                    columnVisibility[(column as any).accessorKey as string]
                  }
                  onChange={() =>
                    onColumnVisibilityChange(
                      (column as any).accessorKey as string,
                    )
                  }
                />
              }
              label={t(column.header as string)}
            />
          )
        })}
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          variant='contained'
          onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Popover>
  )
}

export default ColumnVisibilityDialog
