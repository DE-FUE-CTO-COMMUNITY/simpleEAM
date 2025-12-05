'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_RECENT_DIAGRAMS } from '@/graphql/diagram'
import DiagramCard, { DiagramCardSkeleton } from './DiagramCard'
import { useAuth } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'

const RecentDiagramsSection: React.FC = () => {
  const theme = useTheme()
  const [diagramLimit, setDiagramLimit] = useState(6)
  const { authenticated, initialized } = useAuth()
  const t = useTranslations('dashboard')
  const { selectedCompanyId } = useCompanyContext()

  // Responsive Breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))
  const isLg = useMediaQuery(theme.breakpoints.only('lg'))
  const isXl = useMediaQuery(theme.breakpoints.up('xl'))

  // Calculate number of diagrams to display based on screen size
  useEffect(() => {
    let limit = 6 // Default for xl and larger

    if (isXs) {
      limit = 1 // 1 Karte pro Zeile auf sehr kleinen Bildschirmen
    } else if (isSm) {
      limit = 2 // 2 Karten pro Zeile auf kleinen Bildschirmen
    } else if (isMd) {
      limit = 3 // 3 Karten pro Zeile auf mittleren Bildschirmen
    } else if (isLg) {
      limit = 4 // 4 cards per row on large screens
    } else if (isXl) {
      limit = 6 // 6 cards per row on very large screens
    }

    setDiagramLimit(limit)
  }, [isXs, isSm, isMd, isLg, isXl])

  const {
    data: diagramsData,
    loading: diagramsLoading,
    error: diagramsError,
  } = useQuery(GET_RECENT_DIAGRAMS, {
    variables: {
      limit: diagramLimit,
      where: selectedCompanyId
        ? {
            OR: [
              { company: { some: { id: { eq: selectedCompanyId } } } },
              { architecture: { some: { company: { some: { id: { eq: selectedCompanyId } } } } } },
            ],
          }
        : undefined,
    },
    fetchPolicy: 'cache-and-network',
    skip: !initialized || !authenticated, // Skip query if not authenticated
  })

  const diagrams = diagramsData?.diagrams || []

  // Show loading while authenticating or query is loading
  if (!initialized || (!authenticated && initialized)) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardHeader title={t('recentDiagrams')} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {Array.from({ length: diagramLimit }, (_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={index}>
                <DiagramCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  if (diagramsError) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardHeader title={t('recentDiagrams')} />
        <Divider />
        <CardContent>
          <Alert severity="error">
            {t('loadingDiagramsError', { message: diagramsError.message })}
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardHeader
          title={t('recentDiagrams')}
          subheader={
            diagrams.length > 0
              ? t('diagramsCount', {
                  count: diagrams.length,
                  total: diagrams.length === diagramLimit ? `${diagramLimit}+` : diagrams.length,
                })
              : t('noDiagramsAvailable')
          }
        />
        <Divider />
        <CardContent>
          {diagramsLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: diagramLimit }).map((_, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                    xl: 2,
                  }}
                >
                  <DiagramCardSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : diagrams.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {t('noDiagramsYet')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('createFirstDiagram')}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {diagrams.map((diagram: any) => (
                <Grid
                  key={diagram.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                    xl: 2,
                  }}
                >
                  <DiagramCard
                    id={diagram.id}
                    title={diagram.title}
                    description={diagram.description}
                    diagramType={diagram.diagramType}
                    diagramPng={diagram.diagramPng}
                    diagramPngDark={diagram.diagramPngDark}
                    createdAt={diagram.createdAt}
                    updatedAt={diagram.updatedAt}
                    creator={diagram.creator}
                    architecture={diagram.architecture}
                    diagramJson={diagram.diagramJson}
                    company={diagram.company}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default RecentDiagramsSection
