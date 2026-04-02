'use client'

import React, { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Button,
  FormControlLabel,
} from '@mui/material'
import { Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_AGENT_CONFIGS, UPDATE_AGENT_CONFIG } from '@/graphql/agentConfig'

interface AgentConfigRecord {
  id: string
  agentKey: string
  displayName: string
  description?: string | null
  systemPrompt: string
  temperature?: number | null
  topP?: number | null
  maxTokens?: number | null
  isEnabled: boolean
  configVersion: number
  updatedAt?: string | null
}

interface FormState {
  displayName: string
  description: string
  systemPrompt: string
  temperature: string
  topP: string
  maxTokens: string
  isEnabled: boolean
}

const DEFAULT_FORM_STATE: FormState = {
  displayName: '',
  description: '',
  systemPrompt: '',
  temperature: '',
  topP: '',
  maxTokens: '',
  isEnabled: true,
}

const AgentConfigManagement = () => {
  const t = useTranslations('admin.agentConfig')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<AgentConfigRecord | null>(null)
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE)

  const { data, loading, refetch } = useQuery(GET_AGENT_CONFIGS, {
    fetchPolicy: 'cache-and-network',
    onError: e => setErrorMessage(e.message),
  })

  const [updateAgentConfig, { loading: updating }] = useMutation(UPDATE_AGENT_CONFIG, {
    onCompleted: () => {
      void refetch()
      handleCloseDialog()
    },
    onError: e => setErrorMessage(e.message),
  })

  const rows = (data?.agentConfigs ?? []) as AgentConfigRecord[]

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(
      row =>
        row.agentKey.toLowerCase().includes(term) ||
        row.displayName.toLowerCase().includes(term) ||
        (row.description ?? '').toLowerCase().includes(term)
    )
  }, [rows, searchTerm])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelected(null)
    setFormState(DEFAULT_FORM_STATE)
  }

  const handleOpenEdit = (row: AgentConfigRecord) => {
    setSelected(row)
    setFormState({
      displayName: row.displayName,
      description: row.description ?? '',
      systemPrompt: row.systemPrompt,
      temperature: row.temperature != null ? String(row.temperature) : '',
      topP: row.topP != null ? String(row.topP) : '',
      maxTokens: row.maxTokens != null ? String(row.maxTokens) : '',
      isEnabled: row.isEnabled,
    })
    setDialogOpen(true)
  }

  const handleToggleEnabled = async (row: AgentConfigRecord) => {
    await updateAgentConfig({
      variables: {
        id: row.id,
        input: {
          isEnabled: { set: !row.isEnabled },
          configVersion: { increment: 1 },
        },
      },
    })
  }

  const parseOptionalFloat = (value: string): number | null => {
    if (value.trim() === '') return null
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }

  const parseOptionalInt = (value: string): number | null => {
    if (value.trim() === '') return null
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? null : parsed
  }

  const handleSave = async () => {
    if (!formState.systemPrompt.trim()) {
      setErrorMessage(t('validation.systemPromptRequired'))
      return
    }

    const temperature = parseOptionalFloat(formState.temperature)
    if (temperature !== null && (temperature < 0 || temperature > 2)) {
      setErrorMessage(t('validation.temperatureRange'))
      return
    }

    const topP = parseOptionalFloat(formState.topP)
    if (topP !== null && (topP < 0 || topP > 1)) {
      setErrorMessage(t('validation.topPRange'))
      return
    }

    const maxTokens = parseOptionalInt(formState.maxTokens)
    if (maxTokens !== null && maxTokens <= 0) {
      setErrorMessage(t('validation.maxTokensPositive'))
      return
    }

    if (!selected) return

    await updateAgentConfig({
      variables: {
        id: selected.id,
        input: {
          displayName: { set: formState.displayName.trim() },
          description: { set: formState.description.trim() || null },
          systemPrompt: { set: formState.systemPrompt.trim() },
          temperature: { set: temperature },
          topP: { set: topP },
          maxTokens: { set: maxTokens },
          isEnabled: { set: formState.isEnabled },
          configVersion: { increment: 1 },
        },
      },
    })
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '–'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {t('title')}
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table.agentKey')}</TableCell>
                  <TableCell>{t('table.displayName')}</TableCell>
                  <TableCell>{t('table.isEnabled')}</TableCell>
                  <TableCell>{t('table.temperature')}</TableCell>
                  <TableCell>{t('table.topP')}</TableCell>
                  <TableCell>{t('table.maxTokens')}</TableCell>
                  <TableCell>{t('table.configVersion')}</TableCell>
                  <TableCell>{t('table.updatedAt')}</TableCell>
                  <TableCell align="right">{t('table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {row.agentKey}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.displayName}</TableCell>
                    <TableCell>
                      <Tooltip title={row.isEnabled ? t('actions.disable') : t('actions.enable')}>
                        <Switch
                          checked={row.isEnabled}
                          onChange={() => handleToggleEnabled(row)}
                          size="small"
                          color="success"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {row.temperature != null ? (
                        <Chip size="small" label={row.temperature} />
                      ) : (
                        '–'
                      )}
                    </TableCell>
                    <TableCell>
                      {row.topP != null ? <Chip size="small" label={row.topP} /> : '–'}
                    </TableCell>
                    <TableCell>
                      {row.maxTokens != null ? <Chip size="small" label={row.maxTokens} /> : '–'}
                    </TableCell>
                    <TableCell>{row.configVersion}</TableCell>
                    <TableCell>{formatDate(row.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('actions.edit')}>
                        <IconButton size="small" onClick={() => handleOpenEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('noData')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{t('editTitle')}</DialogTitle>
        <DialogContent>
          {selected && (
            <TextField
              margin="dense"
              label={t('form.agentKey')}
              fullWidth
              value={selected.agentKey}
              InputProps={{ readOnly: true }}
              helperText={t('hints.agentKey')}
            />
          )}

          <TextField
            autoFocus
            margin="dense"
            label={t('form.displayName')}
            fullWidth
            value={formState.displayName}
            onChange={e => setFormState(prev => ({ ...prev, displayName: e.target.value }))}
          />

          <TextField
            margin="dense"
            label={t('form.description')}
            fullWidth
            multiline
            rows={2}
            value={formState.description}
            onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
          />

          <TextField
            margin="dense"
            label={t('form.systemPrompt')}
            fullWidth
            multiline
            rows={8}
            required
            value={formState.systemPrompt}
            onChange={e => setFormState(prev => ({ ...prev, systemPrompt: e.target.value }))}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              margin="dense"
              label={t('form.temperature')}
              type="number"
              inputProps={{ min: 0, max: 2, step: 0.1 }}
              value={formState.temperature}
              onChange={e => setFormState(prev => ({ ...prev, temperature: e.target.value }))}
              helperText={t('hints.temperature')}
              sx={{ flex: 1 }}
            />

            <TextField
              margin="dense"
              label={t('form.topP')}
              type="number"
              inputProps={{ min: 0, max: 1, step: 0.05 }}
              value={formState.topP}
              onChange={e => setFormState(prev => ({ ...prev, topP: e.target.value }))}
              helperText={t('hints.topP')}
              sx={{ flex: 1 }}
            />

            <TextField
              margin="dense"
              label={t('form.maxTokens')}
              type="number"
              inputProps={{ min: 1, step: 100 }}
              value={formState.maxTokens}
              onChange={e => setFormState(prev => ({ ...prev, maxTokens: e.target.value }))}
              helperText={t('hints.maxTokens')}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                checked={formState.isEnabled}
                onChange={e => setFormState(prev => ({ ...prev, isEnabled: e.target.checked }))}
                color="success"
              />
            }
            label={t('form.isEnabled')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('actions.cancel')}</Button>
          <Button onClick={handleSave} variant="contained" disabled={updating}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AgentConfigManagement
