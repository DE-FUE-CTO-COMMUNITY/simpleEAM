'use client'

import React from 'react'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { parseCompanyFeatures } from './company-features'
import { FEATURE_FLAGS, type FeatureFlagKey, type FeatureFlags } from './feature-definitions'

export { FEATURE_FLAGS }
export type { FeatureFlagKey, FeatureFlags }

export const useFeatureFlags = () => {
  const { selectedCompany } = useCompanyContext()
  const { featureFlags } = React.useMemo(
    () => parseCompanyFeatures(selectedCompany?.features),
    [selectedCompany?.features]
  )

  return { featureFlags }
}
