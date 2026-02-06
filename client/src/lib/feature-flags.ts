'use client'

import React from 'react'

export const FEATURE_FLAGS_STORAGE_KEY = 'featureFlags:v1'
const FEATURE_FLAGS_EVENT = 'featureFlagsChanged'

export const FEATURE_FLAGS = ['GEA', 'BMC', 'BCA'] as const
export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number]
export type FeatureFlags = Record<FeatureFlagKey, boolean>

const defaultFeatureFlags: FeatureFlags = {
  GEA: true,
  BMC: true,
  BCA: true,
}

const normalizeFeatureFlags = (flags: Partial<FeatureFlags> | null | undefined): FeatureFlags => ({
  ...defaultFeatureFlags,
  ...(flags || {}),
})

export const loadFeatureFlags = (): FeatureFlags => {
  if (typeof window === 'undefined') return { ...defaultFeatureFlags }
  const raw = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY)
  if (!raw) return { ...defaultFeatureFlags }
  try {
    const parsed = JSON.parse(raw) as Partial<FeatureFlags>
    return normalizeFeatureFlags(parsed)
  } catch {
    return { ...defaultFeatureFlags }
  }
}

export const saveFeatureFlags = (flags: FeatureFlags) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(normalizeFeatureFlags(flags)))
}

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlagsState] = React.useState<FeatureFlags>(() => ({
    ...defaultFeatureFlags,
  }))

  React.useEffect(() => {
    setFeatureFlagsState(loadFeatureFlags())
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (event: StorageEvent) => {
      if (event.key === FEATURE_FLAGS_STORAGE_KEY) {
        setFeatureFlagsState(loadFeatureFlags())
      }
    }
    const onFeatureFlagsChanged = () => setFeatureFlagsState(loadFeatureFlags())
    window.addEventListener('storage', onStorage)
    window.addEventListener(FEATURE_FLAGS_EVENT, onFeatureFlagsChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(FEATURE_FLAGS_EVENT, onFeatureFlagsChanged)
    }
  }, [])

  const setFeatureFlags = (next: FeatureFlags) => {
    const normalized = normalizeFeatureFlags(next)
    setFeatureFlagsState(normalized)
    saveFeatureFlags(normalized)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(FEATURE_FLAGS_EVENT))
    }
  }

  return { featureFlags, setFeatureFlags }
}
