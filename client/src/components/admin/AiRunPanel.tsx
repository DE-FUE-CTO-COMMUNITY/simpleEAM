'use client'

import React from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { keycloak } from '@/lib/auth'
import { useGraphQLConfig } from '@/lib/runtime-config'

type AiRun = {
  id: string
  prompt: string
  objective?: string | null
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  workflowId?: string | null
  initiatedBy?: string | null
  resultSummary?: string | null
  errorMessage?: string | null
  createdAt: string
  startedAt?: string | null
  completedAt?: string | null
}

const getStatusColor = (status: AiRun['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'FAILED':
      return 'error'
    case 'RUNNING':
      return 'warning'
    default:
      return 'default'
  }
}

export default function AiRunPanel() {
  const t = useTranslations('admin.aiRuns')
  const { selectedCompanyId, selectedCompany } = useCompanyContext()
  const { url: graphQlUrl } = useGraphQLConfig()

  const [prompt, setPrompt] = React.useState('')
  const [objective, setObjective] = React.useState('')
  const [runs, setRuns] = React.useState<AiRun[]>([])
  const [runsLoading, setRunsLoading] = React.useState(false)
  const [runsError, setRunsError] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = React.useState(false)

  const apiBaseUrl = React.useMemo(() => {
    if (!graphQlUrl) {
      return ''
    }
    return graphQlUrl.endsWith('/graphql') ? graphQlUrl.slice(0, -8) : graphQlUrl
  }, [graphQlUrl])

  const loadRuns = React.useCallback(async () => {
    if (!selectedCompanyId || !apiBaseUrl) {
      setRuns([])
      return
    }

    try {
      if (!keycloak) {
        throw new Error('Keycloak not initialized')
      }

      await keycloak.updateToken(30)
      if (!keycloak.token) {
        throw new Error('Not authenticated - no token available')
      }

      setRunsLoading(true)
      setRunsError(null)

      const response = await fetch(
        `${apiBaseUrl}/ai-runs?companyId=${encodeURIComponent(selectedCompanyId)}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(t('loadError'))
      }

      const payload = (await response.json()) as AiRun[]
      setRuns(payload)
    } catch (error) {
      setRunsError(error instanceof Error ? error.message : t('loadError'))
    } finally {
      setRunsLoading(false)
    }
  }, [apiBaseUrl, selectedCompanyId, t])

  React.useEffect(() => {
    void loadRuns()

    if (!selectedCompanyId || !apiBaseUrl) {
      return
    }

    const interval = window.setInterval(() => {
      void loadRuns()
    }, 5000)

    return () => {
      window.clearInterval(interval)
    }
  }, [apiBaseUrl, loadRuns, selectedCompanyId])

  const handleStartRun = async () => {
    if (!selectedCompanyId) {
      setSubmitError(t('selectCompanyFirst'))
      return
    }

    const normalizedPrompt = prompt.trim()
    if (!normalizedPrompt) {
      setSubmitError(t('promptRequired'))
      return
    }

    setSubmitError(null)
    setSubmitSuccess(null)
    setSubmitLoading(true)

    try {
      if (!keycloak) {
        throw new Error('Keycloak not initialized')
      }

      await keycloak.updateToken(30)
      if (!keycloak.token) {
        throw new Error('Not authenticated - no token available')
      }

      const response = await fetch(`${apiBaseUrl}/ai-runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          prompt: normalizedPrompt,
          objective: objective.trim() || null,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || t('startError'))
      }

      const result = (await response.json()) as {
        workflowId: string
      }

      setSubmitSuccess(t('startSuccess', { workflowId: result.workflowId ?? '-' }))
      setPrompt('')
      setObjective('')
      await loadRuns()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('startError')
      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  const hasNoRuns = runs.length === 0

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon color="primary" />
            <Typography variant="h6">{t('title')}</Typography>
          </Box>
        }
        subheader={t('description')}
      />
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {selectedCompany ? t('selectedCompany', { name: selectedCompany.name }) : t('noCompanySelected')}
          </Typography>

          <TextField
            label={t('promptLabel')}
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label={t('objectiveLabel')}
            value={objective}
            onChange={event => setObjective(event.target.value)}
            fullWidth
          />

          <Box>
            <Button
              variant="contained"
              onClick={handleStartRun}
              disabled={!selectedCompanyId || submitLoading || !apiBaseUrl}
              startIcon={submitLoading ? <CircularProgress size={18} color="inherit" /> : <SmartToyIcon />}
            >
              {submitLoading ? t('starting') : t('startButton')}
            </Button>
          </Box>

          {submitError && <Alert severity="error">{submitError}</Alert>}
          {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}
          {runsError && <Alert severity="error">{runsError}</Alert>}

          <Divider />

          <Typography variant="subtitle1">{t('historyTitle')}</Typography>

          {!selectedCompanyId ? (
            <Alert severity="info">{t('selectCompanyFirst')}</Alert>
          ) : runsLoading && hasNoRuns ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : hasNoRuns ? (
            <Typography variant="body2" color="text.secondary">
              {t('noRuns')}
            </Typography>
          ) : (
            <List disablePadding>
              {runs.map(run => (
                <ListItem key={run.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                        <Chip label={run.status} color={getStatusColor(run.status)} size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {run.createdAt ? new Date(run.createdAt).toLocaleString() : '-'}
                        </Typography>
                        {run.workflowId && (
                          <Typography variant="caption" color="text.secondary">
                            {t('workflowId')}: {run.workflowId}
                          </Typography>
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        <Typography variant="body2">{run.prompt}</Typography>
                        {run.resultSummary && (
                          <Typography variant="body2" color="text.secondary">
                            {run.resultSummary}
                          </Typography>
                        )}
                        {run.errorMessage && (
                          <Typography variant="body2" color="error.main">
                            {run.errorMessage}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
