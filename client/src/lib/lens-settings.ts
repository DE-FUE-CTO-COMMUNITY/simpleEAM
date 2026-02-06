'use client'

import React from 'react'

export const LENS_STORAGE_KEY = 'selectedLens:v1'
export const LENS_FLAGS_STORAGE_KEY = 'lensFlags:v1'
const LENS_FLAGS_EVENT = 'lensFlagsChanged'
const SELECTED_LENS_EVENT = 'selectedLensChanged'
export const DEFAULT_LENS = 'enterpriseArchitecture'

export const LENS_OPTIONS = [
  'enterpriseArchitecture',
  'businessArchitecture',
  'processArchitecture',
  'dataArchitecture',
  'aiArchitecture',
  'solutionArchitecture',
  'infrastructureArchitecture',
] as const

export type LensKey = (typeof LENS_OPTIONS)[number]
export type LensFlags = Record<LensKey, boolean>

const defaultLensFlags: LensFlags = {
  enterpriseArchitecture: true,
  businessArchitecture: true,
  processArchitecture: true,
  dataArchitecture: true,
  aiArchitecture: true,
  solutionArchitecture: true,
  infrastructureArchitecture: true,
}

const normalizeLensFlags = (flags: Partial<LensFlags> | null | undefined): LensFlags => {
  const normalized: LensFlags = { ...defaultLensFlags, ...(flags || {}) }
  normalized.enterpriseArchitecture = true
  return normalized
}

export const loadLensFlags = (): LensFlags => {
  if (typeof window === 'undefined') return { ...defaultLensFlags }
  const raw = localStorage.getItem(LENS_FLAGS_STORAGE_KEY)
  if (!raw) return { ...defaultLensFlags }
  try {
    const parsed = JSON.parse(raw) as Partial<LensFlags>
    return normalizeLensFlags(parsed)
  } catch {
    return { ...defaultLensFlags }
  }
}

export const saveLensFlags = (flags: LensFlags) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LENS_FLAGS_STORAGE_KEY, JSON.stringify(normalizeLensFlags(flags)))
}

export const getEnabledLenses = (flags: LensFlags): LensKey[] =>
  LENS_OPTIONS.filter(lens => flags[lens])

export const loadSelectedLens = (): LensKey => {
  if (typeof window === 'undefined') return DEFAULT_LENS
  const raw = localStorage.getItem(LENS_STORAGE_KEY)
  if (!raw) return DEFAULT_LENS
  return LENS_OPTIONS.includes(raw as LensKey) ? (raw as LensKey) : DEFAULT_LENS
}

export const saveSelectedLens = (lens: LensKey) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LENS_STORAGE_KEY, lens)
}

export const useLensSettings = () => {
  const [lensFlags, setLensFlagsState] = React.useState<LensFlags>(() => ({
    ...defaultLensFlags,
  }))

  React.useEffect(() => {
    setLensFlagsState(loadLensFlags())
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: StorageEvent) => {
      if (event.key === LENS_FLAGS_STORAGE_KEY) {
        setLensFlagsState(loadLensFlags())
      }
    }
    window.addEventListener('storage', handler)
    const onLensFlagsChanged = () => setLensFlagsState(loadLensFlags())
    window.addEventListener(LENS_FLAGS_EVENT, onLensFlagsChanged)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener(LENS_FLAGS_EVENT, onLensFlagsChanged)
    }
  }, [])

  const setLensFlags = (next: LensFlags) => {
    const normalized = normalizeLensFlags(next)
    setLensFlagsState(normalized)
    saveLensFlags(normalized)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(LENS_FLAGS_EVENT))
    }
  }

  return { lensFlags, setLensFlags, enabledLenses: getEnabledLenses(lensFlags) }
}

export const useLensSelection = () => {
  const { lensFlags, enabledLenses } = useLensSettings()
  const [selectedLens, setSelectedLensState] = React.useState<LensKey>(DEFAULT_LENS)

  React.useEffect(() => {
    setSelectedLensState(loadSelectedLens())
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (event: StorageEvent) => {
      if (event.key === LENS_STORAGE_KEY) {
        setSelectedLensState(loadSelectedLens())
      }
    }
    const onSelectedLensChanged = () => setSelectedLensState(loadSelectedLens())
    window.addEventListener('storage', onStorage)
    window.addEventListener(SELECTED_LENS_EVENT, onSelectedLensChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(SELECTED_LENS_EVENT, onSelectedLensChanged)
    }
  }, [])

  React.useEffect(() => {
    if (!enabledLenses.includes(selectedLens)) {
      setSelectedLensState(DEFAULT_LENS)
      saveSelectedLens(DEFAULT_LENS)
    }
  }, [enabledLenses, selectedLens])

  const setSelectedLens = (lens: LensKey) => {
    const next = enabledLenses.includes(lens) ? lens : DEFAULT_LENS
    setSelectedLensState(next)
    saveSelectedLens(next)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(SELECTED_LENS_EVENT))
    }
  }

  return { selectedLens, setSelectedLens, enabledLenses, lensFlags }
}
