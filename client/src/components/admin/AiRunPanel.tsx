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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { keycloak } from '@/lib/auth'
import { useGraphQLConfig } from '@/lib/runtime-config'

type AiRunApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | null

type StrategicSource = {
  title: string
  url: string
  snippet: string
}

type StrategicDraftPayload = {
  companyName?: string
  generatedAt?: string
  mission?: {
    name?: string
    purposeStatement?: string
  }
  vision?: {
    name?: string
    visionStatement?: string
    timeHorizon?: string
  }
  values?: Array<{
    name?: string
    valueStatement?: string
  }>
  goals?: Array<{
    name?: string
    goalStatement?: string
  }>
  strategies?: Array<{
    name?: string
    description?: string
  }>
  sources?: StrategicSource[]
}

type AiRun = {
  id: string
  prompt: string
  objective?: string | null
  useCase?: 'STRATEGIC_ENRICHMENT'
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  approvalStatus?: AiRunApprovalStatus
  workflowId?: string | null
  initiatedBy?: string | null
  resultSummary?: string | null
  draftPayload?: string | null
  errorMessage?: string | null
  createdAt: string
  startedAt?: string | null
  completedAt?: string | null
}

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
  }
}

type AiRunAuditEvent = {
  id: string
  runId: string
  action: 'APPROVED' | 'REJECTED'
  actor: string
  comment: string | null
  createdAt: string | null
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

const getApprovalColor = (approvalStatus: AiRunApprovalStatus) => {
  switch (approvalStatus) {
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    case 'PENDING_REVIEW':
      return 'warning'
    default:
      return 'default'
  }
}

const parseDraftPayload = (raw: string | null | undefined): StrategicDraftPayload | null => {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }

    return parsed as StrategicDraftPayload
  } catch {
    return null
  }
}

export default function AiRunPanel() {
  const t = useTranslations('admin.aiRuns')
  const { selectedCompanyId, selectedCompany } = useCompanyContext()
  const { url: graphQlUrl } = useGraphQLConfig()

  const [prompt, setPrompt] = React.useState('')
  const [objective, setObjective] = React.useState('')
  const [useCase, setUseCase] = React.useState<'STRATEGIC_ENRICHMENT'>('STRATEGIC_ENRICHMENT')
  const [runs, setRuns] = React.useState<AiRun[]>([])
  const [runsLoading, setRunsLoading] = React.useState(false)
  const [runsError, setRunsError] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = React.useState(false)
  const [deleteHistoryLoading, setDeleteHistoryLoading] = React.useState(false)
  const [deleteHistoryDialogOpen, setDeleteHistoryDialogOpen] = React.useState(false)
  const [reviewActionLoadingRunId, setReviewActionLoadingRunId] = React.useState<string | null>(
    null
  )
  const [expandedRunIds, setExpandedRunIds] = React.useState<string[]>([])
  const [auditByRunId, setAuditByRunId] = React.useState<Record<string, AiRunAuditEvent[]>>({})
  const [auditLoadingByRunId, setAuditLoadingByRunId] = React.useState<Record<string, boolean>>({})
  const [auditErrorByRunId, setAuditErrorByRunId] = React.useState<Record<string, string | null>>(
    {}
  )

  const apiBaseUrl = React.useMemo(() => {
    if (!graphQlUrl) {
      return ''
    }
    return graphQlUrl.endsWith('/graphql') ? graphQlUrl.slice(0, -8) : graphQlUrl
  }, [graphQlUrl])

  const isAdmin = React.useMemo(() => {
    const tokenParsed = keycloak?.tokenParsed as
      | {
          realm_access?: {
            roles?: string[]
          }
        }
      | undefined

    const roles = tokenParsed?.realm_access?.roles ?? []
    return roles.includes('admin')
  }, [selectedCompanyId])

  const parseApiErrorMessage = React.useCallback(async (response: Response, fallback: string) => {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null
    return payload?.error?.message || fallback
  }, [])

  const withToken = React.useCallback(async () => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized')
    }

    await keycloak.updateToken(30)
    if (!keycloak.token) {
      throw new Error('Not authenticated - no token available')
    }

    return keycloak.token
  }, [])

  const loadRuns = React.useCallback(async () => {
    if (!selectedCompanyId || !apiBaseUrl) {
      setRuns([])
      return
    }

    try {
      const token = await withToken()

      setRunsLoading(true)
      setRunsError(null)

      const response = await fetch(
        `${apiBaseUrl}/ai-runs?companyId=${encodeURIComponent(selectedCompanyId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(await parseApiErrorMessage(response, t('loadError')))
      }

      const payload = (await response.json()) as AiRun[]
      setRuns(payload)
    } catch (error) {
      setRunsError(error instanceof Error ? error.message : t('loadError'))
    } finally {
      setRunsLoading(false)
    }
  }, [apiBaseUrl, parseApiErrorMessage, selectedCompanyId, t, withToken])

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

    setSubmitError(null)
    setSubmitSuccess(null)
    setSubmitLoading(true)

    try {
      const token = await withToken()

      const response = await fetch(`${apiBaseUrl}/ai-runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          prompt: normalizedPrompt,
          objective: objective.trim() || null,
          useCase,
        }),
      })

      if (!response.ok) {
        throw new Error(await parseApiErrorMessage(response, t('startError')))
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

  const triggerReviewAction = React.useCallback(
    async (runId: string, action: 'approve' | 'reject') => {
      try {
        setReviewActionLoadingRunId(runId)
        setSubmitError(null)
        setSubmitSuccess(null)

        const token = await withToken()
        const response = await fetch(`${apiBaseUrl}/ai-runs/${runId}/${action}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: null }),
        })

        if (!response.ok) {
          throw new Error(await parseApiErrorMessage(response, t('reviewActionError')))
        }

        setSubmitSuccess(action === 'approve' ? t('approveSuccess') : t('rejectSuccess'))
        await loadRuns()
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : t('reviewActionError'))
      } finally {
        setReviewActionLoadingRunId(null)
      }
    },
    [apiBaseUrl, loadRuns, parseApiErrorMessage, t, withToken]
  )

  const openDeleteHistoryDialog = React.useCallback(() => {
    if (!selectedCompanyId) {
      setSubmitError(t('selectCompanyFirst'))
      return
    }

    setDeleteHistoryDialogOpen(true)
  }, [selectedCompanyId, t])

  const closeDeleteHistoryDialog = React.useCallback(() => {
    if (deleteHistoryLoading) {
      return
    }

    setDeleteHistoryDialogOpen(false)
  }, [deleteHistoryLoading])

  const handleDeleteHistory = React.useCallback(async () => {
    if (!selectedCompanyId) {
      setSubmitError(t('selectCompanyFirst'))
      return
    }

    try {
      setDeleteHistoryLoading(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      const token = await withToken()
      const response = await fetch(
        `${apiBaseUrl}/ai-runs?companyId=${encodeURIComponent(selectedCompanyId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(await parseApiErrorMessage(response, t('deleteHistoryError')))
      }

      const result = (await response.json()) as { deletedRuns?: number }
      setSubmitSuccess(
        t('deleteHistorySuccess', {
          count: result.deletedRuns ?? 0,
        })
      )
      setDeleteHistoryDialogOpen(false)
      await loadRuns()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('deleteHistoryError'))
    } finally {
      setDeleteHistoryLoading(false)
    }
  }, [apiBaseUrl, loadRuns, parseApiErrorMessage, selectedCompanyId, t, withToken])

  const loadAuditForRun = React.useCallback(
    async (runId: string) => {
      if (auditByRunId[runId] || auditLoadingByRunId[runId]) {
        return
      }

      try {
        setAuditLoadingByRunId(prev => ({ ...prev, [runId]: true }))
        setAuditErrorByRunId(prev => ({ ...prev, [runId]: null }))

        const token = await withToken()
        const response = await fetch(`${apiBaseUrl}/ai-runs/${runId}/audit`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(await parseApiErrorMessage(response, t('auditLoadError')))
        }

        const payload = (await response.json()) as AiRunAuditEvent[]
        setAuditByRunId(prev => ({ ...prev, [runId]: payload }))
      } catch (error) {
        setAuditErrorByRunId(prev => ({
          ...prev,
          [runId]: error instanceof Error ? error.message : t('auditLoadError'),
        }))
      } finally {
        setAuditLoadingByRunId(prev => ({ ...prev, [runId]: false }))
      }
    },
    [apiBaseUrl, auditByRunId, auditLoadingByRunId, parseApiErrorMessage, t, withToken]
  )

  const toggleRunDetails = React.useCallback(
    (runId: string) => {
      setExpandedRunIds(prev => {
        if (prev.includes(runId)) {
          return prev.filter(id => id !== runId)
        }

        void loadAuditForRun(runId)
        return [...prev, runId]
      })
    },
    [loadAuditForRun]
  )

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
            {selectedCompany
              ? t('selectedCompany', { name: selectedCompany.name })
              : t('noCompanySelected')}
          </Typography>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {t('useCaseLabel')}
            </Typography>
            <Select
              size="small"
              fullWidth
              value={useCase}
              onChange={event => setUseCase(event.target.value as 'STRATEGIC_ENRICHMENT')}
            >
              <MenuItem value="STRATEGIC_ENRICHMENT">{t('useCaseStrategicEnrichment')}</MenuItem>
            </Select>
          </Box>

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
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleStartRun}
                disabled={!selectedCompanyId || submitLoading || !apiBaseUrl}
                startIcon={
                  submitLoading ? <CircularProgress size={18} color="inherit" /> : <SmartToyIcon />
                }
              >
                {submitLoading ? t('starting') : t('startButton')}
              </Button>
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={openDeleteHistoryDialog}
                  disabled={!selectedCompanyId || deleteHistoryLoading || !apiBaseUrl}
                >
                  {deleteHistoryLoading ? t('deletingHistory') : t('deleteHistoryButton')}
                </Button>
              )}
            </Stack>
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
                  {(() => {
                    const draft = parseDraftPayload(run.draftPayload)
                    const isExpanded = expandedRunIds.includes(run.id)
                    const auditEntries = auditByRunId[run.id] ?? []
                    const isAuditLoading = auditLoadingByRunId[run.id] ?? false
                    const auditError = auditErrorByRunId[run.id]

                    return (
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            useFlexGap
                            flexWrap="wrap"
                          >
                            <Chip
                              label={run.status}
                              color={getStatusColor(run.status)}
                              size="small"
                            />
                            {run.approvalStatus && (
                              <Chip
                                label={`${t('approvalStatus')}: ${run.approvalStatus}`}
                                color={getApprovalColor(run.approvalStatus)}
                                size="small"
                                variant="outlined"
                              />
                            )}
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
                          <Stack spacing={0.75} sx={{ mt: 0.5 }}>
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
                            <Box>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => toggleRunDetails(run.id)}
                              >
                                {isExpanded ? t('hideDetails') : t('showDetails')}
                              </Button>
                            </Box>
                            {isExpanded && run.status === 'COMPLETED' && (
                              <Box
                                sx={{
                                  p: 1,
                                  border: theme => `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                  backgroundColor: theme => theme.palette.background.default,
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                  {t('draftTitle')}
                                </Typography>

                                {draft ? (
                                  <Stack spacing={0.75}>
                                    {draft.generatedAt && (
                                      <Typography variant="caption" color="text.secondary">
                                        {t('draftGeneratedAt')}:{' '}
                                        {new Date(draft.generatedAt).toLocaleString()}
                                      </Typography>
                                    )}
                                    {draft.mission?.purposeStatement && (
                                      <Typography variant="body2">
                                        <strong>{t('missionLabel')}:</strong>{' '}
                                        {draft.mission.purposeStatement}
                                      </Typography>
                                    )}
                                    {draft.vision?.visionStatement && (
                                      <Typography variant="body2">
                                        <strong>{t('visionLabel')}:</strong>{' '}
                                        {draft.vision.visionStatement}
                                      </Typography>
                                    )}
                                    {!!draft.values?.length && (
                                      <Typography variant="body2">
                                        <strong>{t('valuesLabel')}:</strong>{' '}
                                        {draft.values
                                          .map(value => value.name)
                                          .filter(Boolean)
                                          .join(', ')}
                                      </Typography>
                                    )}
                                    {!!draft.goals?.length && (
                                      <Typography variant="body2">
                                        <strong>{t('goalsLabel')}:</strong>{' '}
                                        {draft.goals
                                          .map(goal => goal.name)
                                          .filter(Boolean)
                                          .join(', ')}
                                      </Typography>
                                    )}
                                    {!!draft.strategies?.length && (
                                      <Typography variant="body2">
                                        <strong>{t('strategiesLabel')}:</strong>{' '}
                                        {draft.strategies
                                          .map(strategy => strategy.name)
                                          .filter(Boolean)
                                          .join(', ')}
                                      </Typography>
                                    )}
                                    {!!draft.sources?.length && (
                                      <Stack spacing={0.5}>
                                        <Typography variant="body2">
                                          <strong>{t('sourcesLabel')}:</strong>{' '}
                                          {draft.sources.length}
                                        </Typography>
                                        {draft.sources.map((source, index) => (
                                          <Box key={`${run.id}-source-${index}`}>
                                            <Link
                                              href={source.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              underline="hover"
                                              variant="body2"
                                            >
                                              {source.title || source.url}
                                            </Link>
                                            {source.snippet && (
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: 'block' }}
                                              >
                                                {source.snippet}
                                              </Typography>
                                            )}
                                          </Box>
                                        ))}
                                      </Stack>
                                    )}
                                  </Stack>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    {t('noDraftPayload')}
                                  </Typography>
                                )}
                              </Box>
                            )}
                            {isExpanded && (
                              <Box
                                sx={{
                                  p: 1,
                                  border: theme => `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                  {t('auditTitle')}
                                </Typography>

                                {isAuditLoading ? (
                                  <CircularProgress size={16} />
                                ) : auditError ? (
                                  <Typography variant="body2" color="error.main">
                                    {auditError}
                                  </Typography>
                                ) : auditEntries.length === 0 ? (
                                  <Typography variant="body2" color="text.secondary">
                                    {t('noAuditEntries')}
                                  </Typography>
                                ) : (
                                  <Stack spacing={0.5}>
                                    {auditEntries.map(entry => (
                                      <Typography
                                        key={entry.id}
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {entry.action} · {entry.actor} ·{' '}
                                        {entry.createdAt
                                          ? new Date(entry.createdAt).toLocaleString()
                                          : '-'}
                                        {entry.comment ? ` · ${entry.comment}` : ''}
                                      </Typography>
                                    ))}
                                  </Stack>
                                )}
                              </Box>
                            )}
                            {run.status === 'COMPLETED' &&
                              run.approvalStatus === 'PENDING_REVIEW' && (
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    disabled={reviewActionLoadingRunId === run.id}
                                    onClick={() => {
                                      void triggerReviewAction(run.id, 'approve')
                                    }}
                                  >
                                    {t('approveButton')}
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    disabled={reviewActionLoadingRunId === run.id}
                                    onClick={() => {
                                      void triggerReviewAction(run.id, 'reject')
                                    }}
                                  >
                                    {t('rejectButton')}
                                  </Button>
                                </Stack>
                              )}
                          </Stack>
                        }
                      />
                    )
                  })()}
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>

      <Dialog
        open={deleteHistoryDialogOpen}
        onClose={closeDeleteHistoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('deleteHistoryDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deleteHistoryConfirm', {
              name: selectedCompany?.name || t('unknownCompany'),
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteHistoryDialog} disabled={deleteHistoryLoading}>
            {t('deleteHistoryCancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              void handleDeleteHistory()
            }}
            disabled={deleteHistoryLoading}
          >
            {deleteHistoryLoading ? t('deletingHistory') : t('deleteHistoryConfirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
