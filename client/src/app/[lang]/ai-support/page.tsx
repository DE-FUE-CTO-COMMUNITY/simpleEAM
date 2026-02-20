'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import AiRunPanel from '@/components/admin/AiRunPanel'
import { isAdmin, isArchitect, useAuth } from '@/lib/auth'
import { useRuntimeConfig } from '@/lib/runtime-config'

export default function AiSupportPage() {
  const tNavigation = useTranslations('navigation')
  const { initialized } = useAuth()
  const runtimeConfig = useRuntimeConfig()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  React.useEffect(() => {
    if (!initialized) {
      return
    }

    const hasRole = isAdmin() || isArchitect()
    const hasLlmUrl = Boolean(runtimeConfig.ai.llmUrl.trim())

    if (!hasRole || !hasLlmUrl) {
      router.replace('/')
      return
    }

    setIsAuthorized(true)
  }, [initialized, router, runtimeConfig.ai.llmUrl])

  if (!isAuthorized) {
    return null
  }

  return (
    <Box sx={{ mt: 4, mb: 4, mx: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {tNavigation('aiSupport')}
      </Typography>
      <AiRunPanel />
    </Box>
  )
}
