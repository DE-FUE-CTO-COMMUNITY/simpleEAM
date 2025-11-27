'use client'

import { useState, useMemo, useImperativeHandle, forwardRef } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  People as PeopleIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useSnackbar } from 'notistack'
import type { Collaborator } from '@/components/diagrams/hooks/useExcalidrawCollaboration'

export interface CollaborationDialogHandle {
  setError: (message: string) => void
}

export interface CollaborationDialogProps {
  open: boolean
  isCollaborating: boolean
  roomId: string | null
  collaborators: Map<string, Collaborator>
  onClose: () => void
  onStartCollaboration: (roomId: string) => Promise<void>
  onStopCollaboration: () => void
}

const CollaborationDialog = forwardRef<CollaborationDialogHandle, CollaborationDialogProps>(
  (
    {
      open,
      isCollaborating,
      roomId,
      collaborators,
      onClose,
      onStartCollaboration,
      onStopCollaboration,
    },
    ref
  ) => {
    const t = useTranslations('diagrams.collaborationDialog')
    const { enqueueSnackbar } = useSnackbar()
    const [roomInput, setRoomInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        setError: message => {
          setError(message)
        },
      }),
      []
    )

    const participantCountLabel = useMemo(
      () => t('participants', { count: collaborators.size }),
      [collaborators.size, t]
    )

    const generateRoomId = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 8; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setRoomInput(result)
      enqueueSnackbar(t('roomGenerated'), { variant: 'info' })
    }

    const handleStart = async () => {
      if (!roomInput.trim()) {
        setError(t('errorRoomRequired'))
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        await onStartCollaboration(roomInput.trim())
        enqueueSnackbar(t('startSuccess'), { variant: 'success' })
        setRoomInput('')
        onClose()
      } catch (startError) {
        const message = startError instanceof Error ? startError.message : ''
        const isPermissionError = message.startsWith('collaboration-permission')
        if (!isPermissionError) {
          console.error('Collaboration start failed', startError)
        }
        if (message.startsWith('collaboration-permission')) {
          const [, reason] = message.split(':')
          const translationKey =
            reason === 'missing-edit'
              ? 'permissionRequired'
              : reason === 'missing-company'
                ? 'companyMissing'
                : reason === 'forbidden-company'
                  ? 'companyPermissionDenied'
                  : 'permissionDenied'
          setError(t(translationKey as any))
          return
        }
        setError(t('errorStart'))
      } finally {
        setIsLoading(false)
      }
    }

    const handleStop = () => {
      onStopCollaboration()
      enqueueSnackbar(t('stopSuccess'), { variant: 'info' })
      onClose()
    }

    const copyToClipboard = async (
      text: string | null | undefined,
      successKey: 'roomCopied' | 'linkCopied'
    ) => {
      if (!text) {
        return
      }
      try {
        await navigator.clipboard.writeText(text)
        enqueueSnackbar(t(successKey), { variant: 'success' })
      } catch (copyError) {
        console.error('Clipboard copy failed', copyError)
        enqueueSnackbar(t('copyFailed'), { variant: 'error' })
      }
    }

    const handleCopyRoomId = () => copyToClipboard(roomId, 'roomCopied')

    const handleCopyLink = () => {
      if (typeof window === 'undefined' || !roomId) {
        return
      }
      const link = `${window.location.origin}${window.location.pathname}?room=${roomId}`
      void copyToClipboard(link, 'linkCopied')
    }

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            <Typography variant="h6">{t('title')}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label={t('close')}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {!isCollaborating ? (
            <>
              <Typography variant="body1" color="text.secondary">
                {t('description')}
              </Typography>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              <TextField
                label={t('roomLabel')}
                value={roomInput}
                onChange={event => setRoomInput(event.target.value)}
                placeholder={t('roomPlaceholder')}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={generateRoomId}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        {t('generate')}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                helperText={t('roomHelper')}
              />
            </>
          ) : (
            <>
              <Alert severity="success" icon={<PeopleIcon />}>
                {t('activeAlert')}
              </Alert>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('currentRoom')}
                </Typography>
                <TextField
                  value={roomId ?? ''}
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleCopyRoomId}
                          size="small"
                          aria-label={t('copyRoomId')}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {participantCountLabel}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {collaborators.size === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('noParticipants')}
                    </Typography>
                  ) : (
                    Array.from(collaborators.values()).map(collaborator => (
                      <Chip
                        key={collaborator.id}
                        label={collaborator.name}
                        avatar={
                          collaborator.avatarUrl ? (
                            <Image
                              src={collaborator.avatarUrl}
                              alt={collaborator.name}
                              width={24}
                              height={24}
                              style={{ borderRadius: '50%' }}
                            />
                          ) : undefined
                        }
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('shareSession')}
                </Typography>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={handleCopyLink}
                  variant="outlined"
                  fullWidth
                >
                  {t('copyLink')}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          {!isCollaborating ? (
            <>
              <Button onClick={onClose}>{t('cancel')}</Button>
              <Button
                onClick={handleStart}
                variant="contained"
                disabled={isLoading || !roomInput.trim()}
              >
                {isLoading ? t('starting') : t('startCollaboration')}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>{t('close')}</Button>
              <Button onClick={handleStop} variant="outlined" color="error">
                {t('stopCollaboration')}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    )
  }
)

CollaborationDialog.displayName = 'CollaborationDialog'

export default CollaborationDialog
