'use client'

import React from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { keycloak } from '@/lib/auth'
import { useAiConfig, useGraphQLConfig } from '@/lib/runtime-config'

// ── Types ──────────────────────────────────────────────────────────────────

type AiRunApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | null

type StrategicSource = {
  title: string
  url: string
  snippet: string
}

type StrategicDraftPayload = {
  companyName?: string
  generatedAt?: string
  mission?: { name?: string; purposeStatement?: string }
  vision?: { name?: string; visionStatement?: string; timeHorizon?: string }
  values?: Array<{ name?: string; valueStatement?: string }>
  goals?: Array<{ name?: string; goalStatement?: string }>
  strategies?: Array<{ name?: string; description?: string }>
  sources?: StrategicSource[]
}

type AiRun = {
  id: string
  prompt: string
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'APPLIED'
  approvalStatus?: AiRunApprovalStatus
  statusMessage?: string | null
  resultSummary?: string | null
  draftPayload?: string | null
  errorMessage?: string | null
  createdAt: string
  updatedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
}

type UploadedDoc = {
  name: string
  content: string
}

type ApiErrorPayload = {
  error?: { code?: string; message?: string }
}

// ── Chat message model derived from AI runs ────────────────────────────────

type ChatMessage =
  | { kind: 'welcome' }
  | { kind: 'user'; id: string; text: string; ts: string }
  | { kind: 'assistant'; id: string; run: AiRun; ts: string }
  | { kind: 'approval-action'; id: string; text: string; ts: string }

// ── Helpers ────────────────────────────────────────────────────────────────

const parseDraftPayload = (raw: string | null | undefined): StrategicDraftPayload | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as StrategicDraftPayload
  } catch {
    return null
  }
}

const fmtTime = (ts: string | null | undefined): string => {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ''
  }
}

// ── AssistantAvatar ────────────────────────────────────────────────────────

const AssistantAvatar = () => (
  <Box
    sx={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      bgcolor: 'primary.main',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      mt: 0.5,
    }}
  >
    <SmartToyOutlinedIcon sx={{ fontSize: 18, color: 'primary.contrastText' }} />
  </Box>
)

// ── DraftSection ───────────────────────────────────────────────────────────

const DraftSection = ({ draft, runId }: { draft: StrategicDraftPayload; runId: string }) => {
  const t = useTranslations('admin.aiSupport')
  const [expanded, setExpanded] = React.useState(false)

  return (
    <Box sx={{ mt: 0.5 }}>
      <Button
        size="small"
        variant="text"
        sx={{ px: 0, color: 'text.secondary', fontSize: '0.75rem', minWidth: 0 }}
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? t('chatHideDraft') : t('chatShowDraft')}
      </Button>
      {expanded && (
        <Stack spacing={0.75} sx={{ mt: 1 }}>
          {draft.generatedAt && (
            <Typography variant="caption" color="text.secondary">
              {t('draftGeneratedAt')}: {new Date(draft.generatedAt).toLocaleString()}
            </Typography>
          )}
          {draft.mission?.purposeStatement && (
            <Typography variant="body2">
              <strong>{t('missionLabel')}:</strong> {draft.mission.purposeStatement}
            </Typography>
          )}
          {draft.vision?.visionStatement && (
            <Typography variant="body2">
              <strong>{t('visionLabel')}:</strong> {draft.vision.visionStatement}
            </Typography>
          )}
          {!!draft.values?.length && (
            <Typography variant="body2">
              <strong>{t('valuesLabel')}:</strong>{' '}
              {draft.values
                .map(v => v.name)
                .filter(Boolean)
                .join(', ')}
            </Typography>
          )}
          {!!draft.goals?.length && (
            <Typography variant="body2">
              <strong>{t('goalsLabel')}:</strong>{' '}
              {draft.goals
                .map(g => g.name)
                .filter(Boolean)
                .join(', ')}
            </Typography>
          )}
          {!!draft.strategies?.length && (
            <Typography variant="body2">
              <strong>{t('strategiesLabel')}:</strong>{' '}
              {draft.strategies
                .map(s => s.name)
                .filter(Boolean)
                .join(', ')}
            </Typography>
          )}
          {!!draft.sources?.length && (
            <Stack spacing={0.5}>
              <Typography variant="body2">
                <strong>{t('sourcesLabel')}:</strong> {draft.sources.length}
              </Typography>
              {draft.sources.slice(0, 5).map((src, i) => (
                <Box key={`${runId}-src-${i}`}>
                  <Link
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    variant="body2"
                  >
                    {src.title || src.url}
                  </Link>
                  {src.snippet && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {src.snippet}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  )
}

// ── AssistantMessageContent ────────────────────────────────────────────────

interface AssistantMessageContentProps {
  run: AiRun
  approvalLoadingId: string | null
  onApproval: (runId: string, action: 'approve' | 'reject') => void
}

const AssistantMessageContent = ({
  run,
  approvalLoadingId,
  onApproval,
}: AssistantMessageContentProps) => {
  const t = useTranslations('admin.aiSupport')
  const isActive = run.status === 'QUEUED' || run.status === 'RUNNING'
  const isFailed = run.status === 'FAILED'
  const isApplied = run.status === 'APPLIED'
  const isCompleted = run.status === 'COMPLETED'
  const needsApproval = isCompleted && run.approvalStatus === 'PENDING_REVIEW'
  const draft = parseDraftPayload(run.draftPayload)
  const isApprovalLoading = approvalLoadingId === run.id

  if (isActive) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          {run.status === 'QUEUED'
            ? t('chatRunQueued')
            : run.statusMessage || t('chatRunProcessing')}
        </Typography>
      </Stack>
    )
  }

  if (isFailed) {
    return (
      <Typography variant="body2" color="error.main">
        {t('chatRunFailed')}: {run.errorMessage || ''}
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {run.resultSummary && (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {run.resultSummary}
        </Typography>
      )}
      {isApplied && (
        <Typography variant="body2" color="success.main">
          {t('chatRunApplied')}
        </Typography>
      )}
      {isCompleted && draft && <DraftSection draft={draft} runId={run.id} />}
      {needsApproval && (
        <Stack spacing={0.75} sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {t('chatPendingApproval')}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={
                isApprovalLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <CheckCircleOutlineIcon />
                )
              }
              disabled={isApprovalLoading}
              onClick={() => onApproval(run.id, 'approve')}
            >
              {t('chatApproveAction')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={
                isApprovalLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <HighlightOffIcon />
                )
              }
              disabled={isApprovalLoading}
              onClick={() => onApproval(run.id, 'reject')}
            >
              {t('chatRejectAction')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AgenticArchitectChat() {
  const t = useTranslations('admin.aiSupport')
  const { selectedCompanyId, selectedCompany } = useCompanyContext()
  const { apiUrl: aiApiUrl } = useAiConfig()
  const { url: graphQlUrl } = useGraphQLConfig()

  const [runs, setRuns] = React.useState<AiRun[]>([])
  const [prompt, setPrompt] = React.useState('')
  const [sendingPrompt, setSendingPrompt] = React.useState(false)
  const [uploadedDocs, setUploadedDocs] = React.useState<UploadedDoc[]>([])
  const [approvalLoadingId, setApprovalLoadingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingHistory, setDeletingHistory] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  const apiBaseUrl = React.useMemo(() => {
    if (aiApiUrl) return aiApiUrl
    if (!graphQlUrl) return ''
    return graphQlUrl.endsWith('/graphql') ? graphQlUrl.slice(0, -8) : graphQlUrl
  }, [aiApiUrl, graphQlUrl])

  const canClearHistory = React.useMemo(() => {
    const tokenParsed = keycloak?.tokenParsed as { realm_access?: { roles?: string[] } } | undefined
    const roles = tokenParsed?.realm_access?.roles ?? []
    return roles.includes('admin') || roles.includes('architect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId])

  // ── API helpers ────────────────────────────────────────────────────────

  const withToken = React.useCallback(async (): Promise<string> => {
    if (!keycloak) throw new Error('Keycloak not initialized')
    await keycloak.updateToken(30)
    if (!keycloak.token) throw new Error('Not authenticated')
    return keycloak.token
  }, [])

  const parseApiError = React.useCallback(
    async (res: Response, fallback: string): Promise<string> => {
      const payload = (await res.json().catch(() => null)) as ApiErrorPayload | null
      return payload?.error?.message || fallback
    },
    []
  )

  // ── Load runs ──────────────────────────────────────────────────────────

  const loadRuns = React.useCallback(async () => {
    if (!selectedCompanyId || !apiBaseUrl) {
      setRuns([])
      return
    }
    try {
      const token = await withToken()
      const res = await fetch(
        `${apiBaseUrl}/ai-runs?companyId=${encodeURIComponent(selectedCompanyId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error(await parseApiError(res, t('loadError')))
      setRuns((await res.json()) as AiRun[])
    } catch (err) {
      console.warn('[AgenticArchitect][load]', err)
    }
  }, [apiBaseUrl, parseApiError, selectedCompanyId, t, withToken])

  React.useEffect(() => {
    void loadRuns()
    if (!selectedCompanyId || !apiBaseUrl) return
    const iv = window.setInterval(() => void loadRuns(), 5000)
    return () => window.clearInterval(iv)
  }, [apiBaseUrl, loadRuns, selectedCompanyId])

  // ── Auto-scroll ────────────────────────────────────────────────────────

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [runs.length])

  // ── Derive chat messages ───────────────────────────────────────────────

  const chatMessages = React.useMemo((): ChatMessage[] => {
    const msgs: ChatMessage[] = [{ kind: 'welcome' }]
    const sorted = [...runs].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))

    for (const run of sorted) {
      msgs.push({
        kind: 'user',
        id: `u-${run.id}`,
        text: run.prompt || '',
        ts: run.createdAt,
      })
      msgs.push({
        kind: 'assistant',
        id: `a-${run.id}`,
        run,
        ts: run.completedAt ?? run.startedAt ?? run.createdAt,
      })
      if (run.approvalStatus === 'APPROVED') {
        msgs.push({
          kind: 'approval-action',
          id: `ap-${run.id}`,
          text: t('chatApprovedMessage'),
          ts: run.updatedAt ?? run.completedAt ?? run.createdAt,
        })
      } else if (run.approvalStatus === 'REJECTED') {
        msgs.push({
          kind: 'approval-action',
          id: `ap-${run.id}`,
          text: t('chatRejectedMessage'),
          ts: run.updatedAt ?? run.completedAt ?? run.createdAt,
        })
      }
    }
    return msgs
  }, [runs, t])

  // ── Send prompt ────────────────────────────────────────────────────────

  const handleSend = React.useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed || !selectedCompanyId) return
    setError(null)
    setSendingPrompt(true)
    try {
      const token = await withToken()
      const res = await fetch(`${apiBaseUrl}/ai-runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          prompt: trimmed,
          objective: null,
          useCase: 'CONVERSATIONAL_ASSISTANT',
          documents: uploadedDocs,
        }),
      })
      if (!res.ok) throw new Error(await parseApiError(res, t('startError')))
      setPrompt('')
      setUploadedDocs([])
      await loadRuns()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('startError'))
    } finally {
      setSendingPrompt(false)
    }
  }, [apiBaseUrl, loadRuns, parseApiError, prompt, selectedCompanyId, t, uploadedDocs, withToken])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      void handleSend()
    }
  }

  // ── Approval ───────────────────────────────────────────────────────────

  const handleApproval = React.useCallback(
    async (runId: string, action: 'approve' | 'reject') => {
      setError(null)
      setApprovalLoadingId(runId)
      try {
        const token = await withToken()
        const res = await fetch(`${apiBaseUrl}/ai-runs/${runId}/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ comment: null }),
        })
        if (!res.ok) throw new Error(await parseApiError(res, t('reviewActionError')))
        await loadRuns()
      } catch (err) {
        setError(err instanceof Error ? err.message : t('reviewActionError'))
      } finally {
        setApprovalLoadingId(null)
      }
    },
    [apiBaseUrl, loadRuns, parseApiError, t, withToken]
  )

  // ── Document upload ────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    void Promise.all(
      files.map(
        file =>
          new Promise<UploadedDoc>(resolve => {
            const reader = new FileReader()
            reader.onload = ev =>
              resolve({ name: file.name, content: (ev.target?.result as string) || '' })
            reader.readAsText(file)
          })
      )
    ).then(docs => setUploadedDocs(prev => [...prev, ...docs]))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Save history ────────────────────────────────────────────────────────

  const handleSaveHistory = React.useCallback(() => {
    const sorted = [...runs].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
    const lines: string[] = [
      `Agentic Architect – Conversation Export`,
      `Company: ${selectedCompany?.name ?? 'Unknown'}`,
      `Exported: ${new Date().toLocaleString()}`,
      '',
      '═'.repeat(60),
      '',
    ]
    sorted.forEach((run, idx) => {
      lines.push(`[${idx + 1}] You — ${fmtTime(run.createdAt)}`)
      lines.push(run.prompt)
      lines.push('')
      lines.push(`Assistant — ${fmtTime(run.completedAt ?? run.startedAt ?? run.createdAt)}`)
      if (run.status === 'FAILED') {
        lines.push(`Error: ${run.errorMessage ?? 'Unknown error'}`)
      } else if (run.resultSummary) {
        lines.push(run.resultSummary)
      } else {
        lines.push(`[${run.status}]`)
      }
      if (run.approvalStatus) {
        lines.push(`Approval: ${run.approvalStatus}`)
      }
      lines.push('')
      lines.push('─'.repeat(60))
      lines.push('')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const companySlug = (selectedCompany?.name ?? 'conversation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    a.download = `agentic-architect-${companySlug}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [runs, selectedCompany?.name])

  // ── Delete history ─────────────────────────────────────────────────────

  const handleDeleteHistory = React.useCallback(async () => {
    if (!selectedCompanyId) return
    setDeletingHistory(true)
    try {
      const token = await withToken()
      const res = await fetch(
        `${apiBaseUrl}/ai-runs?companyId=${encodeURIComponent(selectedCompanyId)}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error(await parseApiError(res, t('deleteHistoryError')))
      setDeleteDialogOpen(false)
      await loadRuns()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('deleteHistoryError'))
    } finally {
      setDeletingHistory(false)
    }
  }, [apiBaseUrl, loadRuns, parseApiError, selectedCompanyId, t, withToken])

  // ── Predefined prompts ─────────────────────────────────────────────────

  const predefinedPrompts: Array<{ label: string; text: string }> = React.useMemo(
    () => [
      {
        label: t('chatPromptStrategicEnrichment'),
        text: t('chatPromptStrategicEnrichmentText'),
      },
    ],
    [t]
  )

  const canSend = !!prompt.trim() && !!selectedCompanyId && !!apiBaseUrl && !sendingPrompt

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* Chat history */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Stack spacing={2}>
          {chatMessages.map(msg => {
            // Welcome
            if (msg.kind === 'welcome') {
              return (
                <Box key="welcome" sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <AssistantAvatar />
                  <Box
                    sx={{
                      bgcolor: 'background.default',
                      border: theme => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="body2">{t('chatWelcome')}</Typography>
                  </Box>
                </Box>
              )
            }

            // User message
            if (msg.kind === 'user') {
              return (
                <Box key={msg.id} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, opacity: 0.75, textAlign: 'right' }}
                    >
                      {fmtTime(msg.ts)}
                    </Typography>
                  </Box>
                </Box>
              )
            }

            // Assistant message
            if (msg.kind === 'assistant') {
              return (
                <Box key={msg.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <AssistantAvatar />
                  <Box
                    sx={{
                      bgcolor: 'background.default',
                      border: theme => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '80%',
                      minWidth: 200,
                    }}
                  >
                    <AssistantMessageContent
                      run={msg.run}
                      approvalLoadingId={approvalLoadingId}
                      onApproval={(runId, action) => void handleApproval(runId, action)}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {fmtTime(msg.ts)}
                    </Typography>
                  </Box>
                </Box>
              )
            }

            // Approval action message (Approved / Rejected — shown as a user bubble)
            if (msg.kind === 'approval-action') {
              return (
                <Box key={msg.id} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, opacity: 0.75, textAlign: 'right' }}
                    >
                      {fmtTime(msg.ts)}
                    </Typography>
                  </Box>
                </Box>
              )
            }

            return null
          })}
          <div ref={chatEndRef} />
        </Stack>
      </Box>

      <Divider />

      {/* Prompt area */}
      <Box sx={{ p: 1.5, bgcolor: 'background.paper', flexShrink: 0 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        {/* Predefined prompts */}
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mb: 1, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('chatSuggestedPrompts')}:
          </Typography>
          {predefinedPrompts.map(p => (
            <Chip
              key={p.label}
              label={p.label}
              size="small"
              variant="outlined"
              onClick={() => setPrompt(p.text)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        {/* Uploaded documents */}
        {uploadedDocs.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap' }}>
            {uploadedDocs.map((doc, i) => (
              <Chip
                key={`doc-${i}-${doc.name}`}
                label={doc.name}
                size="small"
                variant="outlined"
                color="primary"
                onDelete={() => setUploadedDocs(prev => prev.filter((_, j) => j !== i))}
              />
            ))}
          </Stack>
        )}

        {/* Input row */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            multiline
            maxRows={5}
            fullWidth
            size="small"
            placeholder={selectedCompanyId ? t('chatPlaceholder') : t('noCompanySelected')}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedCompanyId || !apiBaseUrl}
          />
          <Tooltip title={t('chatUploadDocument')}>
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <IconButton size="small" component="label" disabled={!selectedCompanyId}>
                <AttachFileIcon fontSize="small" />
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept=".txt,.csv,.json,.md,.xml,.yaml,.yml"
                  onChange={handleFileChange}
                />
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title={`${t('chatSend')} (Ctrl+Enter)`}>
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <IconButton color="primary" disabled={!canSend} onClick={() => void handleSend()}>
                {sendingPrompt ? <CircularProgress size={20} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Tooltip>
          {canClearHistory && (
            <Tooltip title={t('chatSaveHistoryTooltip')}>
              <Box component="span" sx={{ display: 'inline-flex' }}>
                <IconButton
                  size="small"
                  disabled={!selectedCompanyId || runs.length === 0}
                  onClick={handleSaveHistory}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {canClearHistory && (
            <Tooltip title={t('chatDeleteHistoryTooltip')}>
              <Box component="span" sx={{ display: 'inline-flex' }}>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!selectedCompanyId || runs.length === 0}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Ctrl+Enter {t('chatSend').toLowerCase()}
        </Typography>
      </Box>

      {/* Delete history confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deletingHistory && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
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
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deletingHistory}>
            {t('deleteHistoryCancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDeleteHistory()}
            disabled={deletingHistory}
          >
            {deletingHistory ? t('deletingHistory') : t('deleteHistoryConfirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
