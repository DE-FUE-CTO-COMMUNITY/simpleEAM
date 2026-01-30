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
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { useTranslations, useLocale } from 'next-intl'

interface DiagramCardProps {
  id: string
  title: string
  description?: string
  diagramType?: string
  diagramPng?: string
  diagramPngDark?: string
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
  company?: {
    id: string
    name?: string | null
  }[]
}

const DiagramCard: React.FC<DiagramCardProps> = ({
  id,
  title,
  description,
  diagramType,
  diagramPng,
  diagramPngDark,
  createdAt,
  updatedAt,
  creator,
  architecture,
  diagramJson,
  company,
}) => {
  const router = useRouter()
  const theme = useTheme()
  const t = useTranslations('dashboard')
  const locale = useLocale()

  const handleClick = async () => {
    try {
      // Prepare diagram data with all available metadata
      const diagramToOpen = {
        id,
        title,
        description,
        diagramType,
        createdAt,
        updatedAt,
        creator,
        architecture,
        company,
      }

      // If diagramJson is available, use it directly
      if (diagramJson) {
        localStorage.setItem(
          'pendingDiagramToOpen',
          JSON.stringify({
            ...diagramToOpen,
            diagramJson,
          })
        )
      } else {
        // Only save ID, DiagramEditor loads JSON dynamically
        localStorage.setItem('pendingDiagramToOpen', JSON.stringify(diagramToOpen))
      }

      // Navigate to diagram editor without URL parameters
      router.push('/diagrams')
    } catch (error) {
      console.error('Error preparing diagram opening:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const dateLocale = locale === 'de' ? de : enUS
    const dateFormat = locale === 'de' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy hh:mm a'
    return format(new Date(dateString), dateFormat, { locale: dateLocale })
  }

  const getDiagramTypeLabel = (type?: string) => {
    const typeKey = type || 'OTHER'
    // Map old keys to new standardized keys
    const keyMapping: { [key: string]: string } = {
      INTEGRATION_ARCHITECTURE: 'INTEGRATION',
      SECURITY_ARCHITECTURE: 'SECURITY',
      CONCEPTUAL: 'CONCEPT',
    }
    const standardizedKey = keyMapping[typeKey] || typeKey
    try {
      return t(`diagramTypes.${standardizedKey}` as any)
    } catch {
      return t('diagramTypes.UNKNOWN')
    }
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
          {diagramPng || diagramPngDark ? (
            <CardMedia
              component="img"
              height="200"
              image={`data:image/png;base64,${theme.palette.mode === 'dark' && diagramPngDark ? diagramPngDark : diagramPng}`}
              alt={title}
              sx={{
                objectFit: 'contain',
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                backgroundColor: theme.palette.grey[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">{t('noPreviewAvailable')}</Typography>
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
                {t('architecture')}:
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

          {/* Chips for type and date */}
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
              {t('updated')}: {formatDate(updatedAt || createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

// Skeleton version for loading times
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
