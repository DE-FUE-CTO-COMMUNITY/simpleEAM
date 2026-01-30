import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert,
  InputAdornment,
} from '@mui/material'
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  People as PeopleIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import Image from 'next/image'

interface CollaborationDialogProps {
  isOpen: boolean
  onClose: () => void
  isCollaborating: boolean
  roomId: string | null
  collaborators: Map<string, any>
  onStartCollaboration: (roomId: string) => Promise<void>
  onStopCollaboration: () => void
}

export const CollaborationDialog: React.FC<CollaborationDialogProps> = ({
  isOpen,
  onClose,
  isCollaborating,
  roomId,
  collaborators,
  onStartCollaboration,
  onStopCollaboration,
}) => {
  const [newRoomId, setNewRoomId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generiere eine zufällige Room-ID
  const generateRoomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleStartCollaboration = async () => {
    if (!newRoomId.trim()) {
      setError('Room-ID ist erforderlich')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await onStartCollaboration(newRoomId.trim())
      setNewRoomId('')
    } catch (err) {
      setError('Fehler beim Starten der Collaboration')
      console.error('Error starting collaboration:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopCollaboration = () => {
    onStopCollaboration()
    onClose()
  }

  const handleCopyRoomId = async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId)
        // Optional: Toast-Notification für erfolgreiche Kopie
      } catch (err) {
        console.error('Failed to copy room ID:', err)
      }
    }
  }

  const handleCopyCollaborationLink = async () => {
    if (roomId) {
      const collaborationUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`
      try {
        await navigator.clipboard.writeText(collaborationUrl)
        // Optional: Toast-Notification für erfolgreiche Kopie
      } catch (err) {
        console.error('Failed to copy collaboration link:', err)
      }
    }
  }

  const handleGenerateRoomId = () => {
    setNewRoomId(generateRoomId())
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon color="primary" />
          <Typography variant="h6">Live Collaboration</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!isCollaborating ? (
          // Collaboration starten
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Starten Sie eine Live-Collaboration-Session, um gemeinsam an Diagrammen zu arbeiten.
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="Room-ID"
              value={newRoomId}
              onChange={e => setNewRoomId(e.target.value)}
              placeholder="Geben Sie eine Room-ID ein"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={handleGenerateRoomId}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Generieren
                    </Button>
                  </InputAdornment>
                ),
              }}
              helperText="Andere Benutzer können mit derselben Room-ID beitreten"
            />
          </Box>
        ) : (
          // Aktive Collaboration
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="success" icon={<PeopleIcon />}>
              Live Collaboration ist aktiv
            </Alert>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Aktuelle Room
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={roomId || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyRoomId} size="small">
                          <CopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Teilnehmer ({collaborators.size})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.from(collaborators.values()).map(collaborator => (
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
                ))}
                {collaborators.size === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Keine anderen Teilnehmer
                  </Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Session teilen
              </Typography>
              <Button
                startIcon={<ShareIcon />}
                onClick={handleCopyCollaborationLink}
                variant="outlined"
                fullWidth
              >
                Link kopieren
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!isCollaborating ? (
          <>
            <Button onClick={onClose}>Abbrechen</Button>
            <Button
              onClick={handleStartCollaboration}
              variant="contained"
              disabled={isLoading || !newRoomId.trim()}
            >
              {isLoading ? 'Startet...' : 'Collaboration starten'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Schließen</Button>
            <Button onClick={handleStopCollaboration} variant="outlined" color="error">
              Collaboration beenden
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
