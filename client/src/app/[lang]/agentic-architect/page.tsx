'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import AiRunPanel from '@/components/admin/AiRunPanel'
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
    <Box sx={{ mt: 4, mb: 4, mx: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <AgenticArchitectIcon sx={{ fontSize: 36 }} />
        <Typography variant="h4" component="h1">
          {tNavigation('agenticArchitect')}
        </Typography>
      </Box>
      <AiRunPanel />
    </Box>
  )
}
