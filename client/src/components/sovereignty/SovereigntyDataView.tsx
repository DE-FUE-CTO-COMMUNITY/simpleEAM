'use client'

import React from 'react'
import { Alert, Box, Chip, CircularProgress, Paper, Tooltip, Typography } from '@mui/material'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_SOVEREIGNTY_DATA_DETAIL } from '@/graphql/sovereigntyDetail'
import {
  AchievedEntity,
  computeAggregatedAchievedScore,
  computeEntityAchivedScore,
  computeEntityRequiredScore,
  formatSovereigntyScore,
  hasAnySovereigntyAchs,
  hasAnySovereigntyReqs,
  RequirementEntity,
} from './utils'
import { EntityRef } from './types'

interface DataObjectItem extends RequirementEntity {
  usedByApplications: AchievedEntity[]
}

function ScoreBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 60 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: color ?? 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}

interface SovereigntyDataViewProps {
  onEntityClick: (ref: EntityRef) => void
}

export default function SovereigntyDataView({ onEntityClick }: SovereigntyDataViewProps) {
  const t = useTranslations('sovereigntyDetail')
  const { selectedCompanyId } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')

  const { data, loading, error } = useQuery(GET_SOVEREIGNTY_DATA_DETAIL, {
    skip: !selectedCompanyId,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  if (!selectedCompanyId) {
    return <Alert severity="info">{t('noCompanySelected')}</Alert>
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }

  const dataObjects: DataObjectItem[] = data?.dataObjects ?? []

  if (dataObjects.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('noDataObjects')}
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {dataObjects.map(dataObject => {
        const hasReqs = hasAnySovereigntyReqs(dataObject)
        const hasAchs =
          dataObject.usedByApplications.length > 0 &&
          dataObject.usedByApplications.some(hasAnySovereigntyAchs)

        const expectedScore = hasReqs ? computeEntityRequiredScore(dataObject) : null
        const achievedScore = hasAchs
          ? computeAggregatedAchievedScore(dataObject.usedByApplications)
          : null
        const gap =
          expectedScore !== null && achievedScore !== null ? achievedScore - expectedScore : null

        const gapColor =
          gap === null
            ? undefined
            : gap >= 0
              ? 'success.main'
              : gap >= -1
                ? 'warning.main'
                : 'error.main'

        return (
          <Paper key={dataObject.id} variant="outlined" sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={dataObject.name}
                onClick={() => onEntityClick({ id: dataObject.id, type: 'dataobject' })}
                clickable
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                <ScoreBox
                  label={t('expectedScore')}
                  value={expectedScore !== null ? formatSovereigntyScore(expectedScore) : '–'}
                />
                <ScoreBox
                  label={t('achievedScore')}
                  value={achievedScore !== null ? formatSovereigntyScore(achievedScore) : '–'}
                />
                <ScoreBox
                  label={t('gap')}
                  value={gap !== null ? (gap >= 0 ? '+' : '') + formatSovereigntyScore(gap) : '–'}
                  color={gapColor}
                />
              </Box>
            </Box>

            {dataObject.usedByApplications.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {dataObject.usedByApplications.map(app => (
                  <Tooltip
                    key={app.id}
                    title={
                      hasAnySovereigntyAchs(app)
                        ? `${t('achievedScore')}: ${formatSovereigntyScore(computeEntityAchivedScore(app))}`
                        : t('noSovereigntyData')
                    }
                    arrow
                  >
                    <Chip
                      label={`${app.name} (${t('entityTypes.application')})`}
                      size="small"
                      variant="outlined"
                      onClick={() => onEntityClick({ id: app.id, type: 'application' })}
                      clickable
                    />
                  </Tooltip>
                ))}
              </Box>
            ) : (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.75, display: 'block' }}
              >
                {t('noAssociatedElements')}
              </Typography>
            )}
          </Paper>
        )
      })}
    </Box>
  )
}
