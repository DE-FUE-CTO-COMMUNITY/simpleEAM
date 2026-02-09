'use client'

import React from 'react'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { DEFAULT_LENS, LENS_OPTIONS, type LensFlags, type LensKey } from './feature-definitions'
import { parseCompanyFeatures } from './company-features'

export { LENS_OPTIONS, DEFAULT_LENS }
export type { LensKey, LensFlags }

export const LENS_STORAGE_KEY = 'selectedLens:v1'
const SELECTED_LENS_EVENT = 'selectedLensChanged'

export const getEnabledLenses = (flags: LensFlags): LensKey[] =>
  LENS_OPTIONS.filter(lens => flags[lens])

const getStorageKey = (companyId: string | null) =>
  companyId ? `${LENS_STORAGE_KEY}:${companyId}` : LENS_STORAGE_KEY

export const loadSelectedLens = (companyId: string | null): LensKey => {
  if (typeof window === 'undefined') return DEFAULT_LENS
  const raw = localStorage.getItem(getStorageKey(companyId))
  if (!raw) return DEFAULT_LENS
  return LENS_OPTIONS.includes(raw as LensKey) ? (raw as LensKey) : DEFAULT_LENS
}

export const saveSelectedLens = (companyId: string | null, lens: LensKey) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey(companyId), lens)
}

export const useLensSettings = () => {
  const { selectedCompany } = useCompanyContext()
  const { lensFlags } = React.useMemo(
    () => parseCompanyFeatures(selectedCompany?.features),
    [selectedCompany?.features]
  )

  return { lensFlags, enabledLenses: getEnabledLenses(lensFlags) }
}

export const useLensSelection = () => {
  const { lensFlags, enabledLenses } = useLensSettings()
  const { selectedCompanyId, selectedCompany, loading } = useCompanyContext()
  const [selectedLens, setSelectedLensState] = React.useState<LensKey>(DEFAULT_LENS)

  React.useEffect(() => {
    setSelectedLensState(loadSelectedLens(selectedCompanyId))
  }, [selectedCompanyId])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (event: StorageEvent) => {
      if (event.key === getStorageKey(selectedCompanyId)) {
        setSelectedLensState(loadSelectedLens(selectedCompanyId))
      }
    }
    const onSelectedLensChanged = () => setSelectedLensState(loadSelectedLens(selectedCompanyId))
    window.addEventListener('storage', onStorage)
    window.addEventListener(SELECTED_LENS_EVENT, onSelectedLensChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(SELECTED_LENS_EVENT, onSelectedLensChanged)
    }
  }, [selectedCompanyId])

  React.useEffect(() => {
    if (loading || !selectedCompanyId || !selectedCompany) {
      return
    }
    if (!enabledLenses.includes(selectedLens)) {
      setSelectedLensState(DEFAULT_LENS)
      saveSelectedLens(selectedCompanyId, DEFAULT_LENS)
    }
  }, [enabledLenses, selectedLens, selectedCompanyId, selectedCompany, loading])

  const setSelectedLens = (lens: LensKey) => {
    const next = enabledLenses.includes(lens) ? lens : DEFAULT_LENS
    setSelectedLensState(next)
    saveSelectedLens(selectedCompanyId, next)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(SELECTED_LENS_EVENT))
    }
  }

  return { selectedLens, setSelectedLens, enabledLenses, lensFlags }
}
