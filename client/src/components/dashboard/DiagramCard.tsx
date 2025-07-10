'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
  Skeleton,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface DiagramCardProps {
  id: string
  title: string
  description?: string
  diagramType?: string
  diagramPng?: string
  createdAt: string
  updatedAt: string
  creator?: {
    firstName: string
    lastName: string
  }
  architecture?: {
    id: string
    name: string
    type: string
    domain: string
  }[]
  diagramJson?: string
}

const DiagramCard: React.FC<DiagramCardProps> = ({
  id,
  title,
  description,
  diagramType,
  diagramPng,
  createdAt,
  updatedAt,
  creator,
  architecture,
  diagramJson,
}) => {
  const router = useRouter()

  const handleClick = async () => {
    try {
      // Diagramm-Daten mit allen verfügbaren Metadaten vorbereiten
      const diagramToOpen = {
        id,
        title,
        description,
        diagramType,
        createdAt,
        updatedAt,
        creator,
        architecture,
      }

      // Wenn diagramJson verfügbar ist, direkt verwenden
      if (diagramJson) {
        console.log('Speichere Diagramm mit verfügbarem JSON für Öffnen:', id)
        localStorage.setItem(
          'pendingDiagramToOpen',
          JSON.stringify({
            ...diagramToOpen,
            diagramJson,
          })
        )
      } else {
        // Nur die ID speichern, der DiagramEditor lädt das JSON dynamisch
        console.log('Speichere Diagramm-ID für dynamisches Laden:', id)
        localStorage.setItem('pendingDiagramToOpen', JSON.stringify(diagramToOpen))
      }

      // Navigiere ohne URL-Parameter zum Diagram Editor
      router.push('/diagrams')
    } catch (error) {
      console.error('Fehler beim Vorbereiten des Diagramm-Öffnens:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de })
  }

  const getDiagramTypeLabel = (type?: string) => {
    const types: { [key: string]: string } = {
      ARCHITECTURE: 'Architektur',
      APPLICATION_LANDSCAPE: 'Anwendungslandschaft',
      CAPABILITY_MAP: 'Capability Map',
      DATA_FLOW: 'Datenfluss',
      PROCESS: 'Prozess',
      NETWORK: 'Netzwerk',
      INTEGRATION_ARCHITECTURE: 'Integration',
      SECURITY_ARCHITECTURE: 'Sicherheit',
      CONCEPTUAL: 'Konzept',
      OTHER: 'Sonstige',
    }
    return types[type || 'OTHER'] || 'Unbekannt'
  }

  const getArchitectureInfo = () => {
    if (!architecture || architecture.length === 0) return null
    const arch = architecture[0]
    return arch
  }

  const archInfo = getArchitectureInfo()

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        {/* PNG-Vorschau */}
        <Box sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
          {diagramPng ? (
            <CardMedia
              component="img"
              height="200"
              image={`data:image/png;base64,${diagramPng}`}
              alt={title}
              sx={{
                objectFit: 'contain',
                backgroundColor: '#f5f5f5',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">Keine Vorschau verfügbar</Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Titel */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              mb: 1,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              minHeight: '2.4em',
            }}
          >
            {title}
          </Typography>

          {/* Beschreibung */}
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                minHeight: '2.8em',
              }}
            >
              {description}
            </Typography>
          )}

          {/* Architektur-Info */}
          {archInfo && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Architektur:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {archInfo.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {archInfo.type} • {archInfo.domain}
              </Typography>
            </Box>
          )}

          {/* Chips für Typ und Datum */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Chip
              label={getDiagramTypeLabel(diagramType)}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* Datum und Ersteller */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Aktualisiert: {formatDate(updatedAt || createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

// Skeleton-Version für Ladezeiten
export const DiagramCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" width="90%" height={14} />
      <Skeleton variant="text" width="60%" height={14} />
    </CardContent>
  </Card>
)

export default DiagramCard
