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
  collectAchievedDependencyTree,
  computeAggregatedAchievedScore,
  computeEntityAchivedScore,
  computeEntityRequiredScore,
  DependencyAIComponent,
  DependencyApplication,
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
  const applicationWhere = useCompanyWhere('company')
  const aiComponentWhere = useCompanyWhere('company')
  const infrastructureWhere = useCompanyWhere('company')

  const { data, loading, error } = useQuery(GET_SOVEREIGNTY_DATA_DETAIL, {
    skip: !selectedCompanyId,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere, applicationWhere, aiComponentWhere, infrastructureWhere },
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
  const allApplications: DependencyApplication[] = data?.applications ?? []
  const allAIComponents: DependencyAIComponent[] = data?.aiComponents ?? []
  const allInfrastructures: AchievedEntity[] = data?.infrastructures ?? []
  const applicationIds = new Set(allApplications.map(app => app.id))
  const aiComponentIds = new Set(allAIComponents.map(ai => ai.id))

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
        const allAssociated: AchievedEntity[] = collectAchievedDependencyTree({
          rootApplications: dataObject.usedByApplications,
          allApplications,
          allAIComponents,
          allInfrastructures,
        })

        const hasReqs = hasAnySovereigntyReqs(dataObject)
        const hasAchs = allAssociated.length > 0 && allAssociated.some(hasAnySovereigntyAchs)

        const expectedScore = hasReqs ? computeEntityRequiredScore(dataObject) : null
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

            {allAssociated.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {allAssociated.map(entity => {
                  const isApplication = applicationIds.has(entity.id)
                  const isAIComponent = aiComponentIds.has(entity.id)
                  const label = isApplication
                    ? `${entity.name} (${t('entityTypes.application')})`
                    : isAIComponent
                      ? `${entity.name} (${t('entityTypes.aicomponent')})`
                      : `${entity.name} (${t('entityTypes.infrastructure')})`

                  return (
                    <Tooltip
                      key={entity.id}
                      title={
                        hasAnySovereigntyAchs(entity)
                          ? `${t('achievedScore')}: ${formatSovereigntyScore(computeEntityAchivedScore(entity))}`
                          : t('noSovereigntyData')
                      }
                      arrow
                    >
                      <Chip
                        label={label}
                        size="small"
                        variant="outlined"
                        color={isAIComponent ? 'secondary' : 'default'}
                        onClick={
                          isApplication
                            ? () => onEntityClick({ id: entity.id, type: 'application' })
                            : isAIComponent
                              ? () => onEntityClick({ id: entity.id, type: 'aicomponent' })
                              : () => onEntityClick({ id: entity.id, type: 'infrastructure' })
                        }
                        clickable
                      />
                    </Tooltip>
                  )
                })}
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
