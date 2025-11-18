'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'

interface AvatarUploadDialogProps {
  open: boolean
  onClose: () => void
  currentAvatarUrl?: string | null
  onAvatarChanged?: () => void
}

const AvatarUploadDialog: React.FC<AvatarUploadDialogProps> = ({
  open,
  onClose,
  currentAvatarUrl,
  onAvatarChanged,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [keycloak, setKeycloak] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/auth').then(({ getKeycloak }) => {
        const kc = getKeycloak()
        setKeycloak(kc)
      })
    }
  }, [])

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Maximale Größe für Avatar: 200x200 px
        const maxSize = 200
        let { width, height } = img

        // Proportional skalieren
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Bild zeichnen und komprimieren
        ctx?.drawImage(img, 0, 0, width, height)

        // Als JPEG mit 0.7 Qualität komprimieren (kleinere Dateigröße)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedDataUrl)
      }

      img.onerror = () => reject(new Error('Fehler beim Laden des Bildes'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validierung
    const maxSize = 10 * 1024 * 1024 // 10MB Original
    if (file.size > maxSize) {
      enqueueSnackbar('Datei ist zu groß. Maximum: 10MB', { variant: 'error' })
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar('Ungültiger Dateityp. Erlaubt: JPEG, PNG, GIF, WebP', { variant: 'error' })
      return
    }

    try {
      // Bild komprimieren
      const compressedDataUrl = await compressImage(file)
      setPreviewUrl(compressedDataUrl)

      // Komprimierte Version als Blob für Upload vorbereiten
      const response = await fetch(compressedDataUrl)
      const blob = await response.blob()
      const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
      setSelectedFile(compressedFile)

      enqueueSnackbar('Bild wurde erfolgreich komprimiert', { variant: 'info' })
    } catch (error) {
      console.error('Komprimierungsfehler:', error)
      enqueueSnackbar('Fehler beim Komprimieren des Bildes', { variant: 'error' })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)

    try {
      if (!keycloak?.token) {
        enqueueSnackbar('Nicht authentifiziert - bitte melden Sie sich erneut an', {
          variant: 'error',
        })
        return
      }

      const formData = new FormData()
      formData.append('avatar', selectedFile)

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        enqueueSnackbar('Avatar erfolgreich hochgeladen', { variant: 'success' })
        onAvatarChanged?.()
        onClose()
      } else {
        enqueueSnackbar(result.message || 'Fehler beim Hochladen', { variant: 'error' })
      }
    } catch (error) {
      console.error('Upload-Fehler:', error)
      enqueueSnackbar('Fehler beim Hochladen des Avatars', { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setUploading(true)

    try {
      if (!keycloak?.token) {
        enqueueSnackbar('Nicht authentifiziert - bitte melden Sie sich erneut an', {
          variant: 'error',
        })
        return
      }

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        enqueueSnackbar('Avatar erfolgreich entfernt', { variant: 'success' })
        onAvatarChanged?.()
        setPreviewUrl(null)
        setSelectedFile(null)
        onClose()
      } else {
        enqueueSnackbar(result.message || 'Fehler beim Entfernen', { variant: 'error' })
      }
    } catch (error) {
      console.error('Delete-Fehler:', error)
      enqueueSnackbar('Fehler beim Entfernen des Avatars', { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const getUserInitials = () => {
    if (keycloak?.tokenParsed) {
      const firstName = keycloak.tokenParsed.given_name || ''
      const lastName = keycloak.tokenParsed.family_name || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  const handleClose = () => {
    if (!uploading) {
      setPreviewUrl(currentAvatarUrl || null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Avatar bearbeiten
          <IconButton onClick={handleClose} disabled={uploading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Avatar Preview */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={previewUrl || undefined}
              sx={{
                width: 120,
                height: 120,
                fontSize: '2rem',
                bgcolor: 'primary.main',
              }}
            >
              {!previewUrl && getUserInitials()}
            </Avatar>

            {uploading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                }}
              >
                <CircularProgress size={40} sx={{ color: 'white' }} />
              </Box>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Erlaubte Formate: JPEG, PNG, GIF, WebP
            <br />
            Maximale Dateigröße: 5MB
          </Typography>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Bild auswählen
            </Button>

            {(previewUrl || currentAvatarUrl) && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={uploading}
              >
                Avatar remove
              </Button>
            )}
          </Box>

          {selectedFile && (
            <Alert severity="info" sx={{ width: '100%' }}>
              Datei ausgewählt: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Abbrechen
        </Button>
        <Button onClick={handleUpload} variant="contained" disabled={!selectedFile || uploading}>
          {uploading ? 'Hochladen...' : 'Hochladen'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AvatarUploadDialog
