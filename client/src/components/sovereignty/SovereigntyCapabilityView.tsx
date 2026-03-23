'use client'

import React from 'react'
import { Alert, Box, Chip, CircularProgress, Paper, Tooltip, Typography } from '@mui/material'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_SOVEREIGNTY_CAPABILITY_DETAIL } from '@/graphql/sovereigntyDetail'
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

interface CapabilityItem extends RequirementEntity {
  supportedByApplications: AchievedEntity[]
  supportedByAIComponents: AchievedEntity[]
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

interface SovereigntyCapabilityViewProps {
  onEntityClick: (ref: EntityRef) => void
}

export default function SovereigntyCapabilityView({
  onEntityClick,
}: SovereigntyCapabilityViewProps) {
  const t = useTranslations('sovereigntyDetail')
  const { selectedCompanyId } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')

  const { data, loading, error } = useQuery(GET_SOVEREIGNTY_CAPABILITY_DETAIL, {
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

  const capabilities: CapabilityItem[] = data?.businessCapabilities ?? []

  if (capabilities.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('noCapabilities')}
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {capabilities.map(capability => {
        const allAssociated: AchievedEntity[] = [
          ...capability.supportedByApplications,
          ...capability.supportedByAIComponents,
        ]

        const hasReqs = hasAnySovereigntyReqs(capability)
        const hasAchs = allAssociated.length > 0 && allAssociated.some(hasAnySovereigntyAchs)

        const expectedScore = hasReqs ? computeEntityRequiredScore(capability) : null
        const achievedScore = hasAchs ? computeAggregatedAchievedScore(allAssociated) : null
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
          <Paper key={capability.id} variant="outlined" sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={capability.name}
                onClick={() => onEntityClick({ id: capability.id, type: 'capability' })}
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

            {allAssociated.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {capability.supportedByApplications.map(app => (
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
                {capability.supportedByAIComponents.map(ai => (
                  <Tooltip
                    key={ai.id}
                    title={
                      hasAnySovereigntyAchs(ai)
                        ? `${t('achievedScore')}: ${formatSovereigntyScore(computeEntityAchivedScore(ai))}`
                        : t('noSovereigntyData')
                    }
                    arrow
                  >
                    <Chip
                      label={`${ai.name} (${t('entityTypes.aicomponent')})`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => onEntityClick({ id: ai.id, type: 'aicomponent' })}
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
