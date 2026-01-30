'use client'

import React from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Chip,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { NameChange } from '../utils/databaseSyncUtils'
import { getElementTypeLabel } from '../utils/newElementsUtils'

interface NameChangesSectionProps {
  nameChanges: NameChange[]
  onNameChange: (index: number, newName: string) => void
}

export const NameChangesSection: React.FC<NameChangesSectionProps> = ({
  nameChanges,
  onNameChange,
}) => {
  const t = useTranslations('diagrams.dialogs.nameChanges')
  const tElements = useTranslations('diagrams.dialogs.newElements')

  if (nameChanges.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t('title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {t('description', { count: nameChanges.length })}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('elementType')}</TableCell>
              <TableCell>{t('currentName')}</TableCell>
              <TableCell>{t('newName')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nameChanges.map((change, index) => (
              <TableRow key={change.elementId}>
                <TableCell>
                  <Chip
                    label={tElements(
                      `elementTypes.${getElementTypeLabel(change.elementType)}` as any
                    )}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {change.elementName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={change.newDatabaseName}
                    onChange={e => onNameChange(index, e.target.value)}
                    placeholder={t('newNamePlaceholder')}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default NameChangesSection
