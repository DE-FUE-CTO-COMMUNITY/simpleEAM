'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import AgenticArchitectChat from '@/components/agentic-architect/AgenticArchitectChat'
import { isAdmin, isArchitect, useAuth } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { AgenticArchitectIcon } from '@/components/icons'

export default function AgenticArchitectPage() {
  const tNavigation = useTranslations('navigation')
  const { initialized } = useAuth()
  const { selectedCompany, loading: companyLoading } = useCompanyContext()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  React.useEffect(() => {
    if (!initialized || companyLoading) {
      return
    }

    const hasRole = isAdmin() || isArchitect()
    const hasCompanyLlmConfig = Boolean(
      selectedCompany?.llmUrl?.trim() &&
        selectedCompany?.llmModel?.trim() &&
        selectedCompany?.llmKey?.trim()
    )

    if (!hasRole || !hasCompanyLlmConfig) {
      router.replace('/')
      return
    }

    setIsAuthorized(true)
  }, [initialized, companyLoading, selectedCompany, router])

  if (!isAuthorized) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        px: 3,
        pt: 2,
        pb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexShrink: 0 }}>
        <AgenticArchitectIcon sx={{ fontSize: 28 }} />
        <Typography variant="h5" component="h1">
          {tNavigation('agenticArchitect')}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <AgenticArchitectChat />
      </Box>
    </Box>
  )
}

