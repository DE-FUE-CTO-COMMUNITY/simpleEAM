'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_COMPANIES } from '@/graphql/company'
import { GET_PERSON_BY_EMAIL } from '@/graphql/person'
import { useAuth, isAdmin } from '@/lib/auth'

type Company = {
  id: string
  name: string
  primaryColor?: string | null
  secondaryColor?: string | null
  font?: string | null
  diagramFont?: string | null
}

type CompanyContextValue = {
  companies: Company[]
  selectedCompany: Company | null
  selectedCompanyId: string | null
  setSelectedCompanyId: (id: string) => void
  isCompanySelectionLocked: boolean
  companySelectionLockReason: string | null
  setCompanySelectionLock: (lockId: string, reason?: string | null) => void
  loading: boolean
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined)

const STORAGE_KEY = 'selectedCompanyId:v1'

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { keycloak, initialized } = useAuth()
  const admin = isAdmin()
  const email = (keycloak?.tokenParsed as any)?.email as string | undefined

  // Admin: load all companies; Non-admin: load companies of own person (via email)
  const { data: allCompaniesData, loading: loadingAll } = useQuery(GET_COMPANIES, {
    skip: !admin,
  })
  const { data: meData, loading: loadingMe } = useQuery(GET_PERSON_BY_EMAIL, {
    skip: admin || !initialized || !email,
    variables: { email: email ?? '' },
    fetchPolicy: 'cache-and-network',
  })

  const companies: Company[] = useMemo(() => {
    if (admin) return (allCompaniesData?.companies ?? []) as Company[]
    const person = meData?.people?.[0]
    const myCompanies = (person?.companies ?? []) as Company[]
    return myCompanies
  }, [admin, allCompaniesData?.companies, meData?.people])

  const loading = admin ? loadingAll : loadingMe

  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectionLocks, setSelectionLocks] = useState<Map<string, string>>(new Map())

  // Set initial value from localStorage
  useEffect(() => {
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (fromStorage) {
      setSelectedCompanyIdState(fromStorage)
    }
    setIsInitialized(true)
  }, [])

  // Cross-tab sync: react to changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newId = e.newValue
        // Nur aktualisieren, wenn sich der Wert tatsächlich geändert hat
        if (newId !== selectedCompanyId) {
          setSelectedCompanyIdState(newId)
        }
      }
    }

    // Also sync with localStorage on tab focus/visibility change
    const reconcileFromLocalStorage = () => {
      try {
        const current = localStorage.getItem(STORAGE_KEY)
        if (current !== selectedCompanyId) {
          setSelectedCompanyIdState(current)
        }
      } catch {
        // noop
      }
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', reconcileFromLocalStorage)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') reconcileFromLocalStorage()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', reconcileFromLocalStorage)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [selectedCompanyId])

  // When companies are loaded, make sensible preselection and clean up invalid selection
  useEffect(() => {
    // Wait until localStorage is initialized and companies are loaded
    if (!isInitialized) return

    // If companies are still loading, wait (important for race condition)
    if (loading) {
      return
    }

    // If no companies are available and loading is complete
    if (!companies || companies.length === 0) {
      console.error(
        'CompanyContext: No companies available after loading completed, clearing selection'
      )
      if (selectedCompanyId) {
        setSelectedCompanyIdState(null)
        if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
      }
      return
    }

    const hasSelection = selectedCompanyId && companies.some(c => c.id === selectedCompanyId)

    if (companies.length === 1) {
      if (selectedCompanyId !== companies[0].id) {
        setSelectedCompanyIdState(companies[0].id)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, companies[0].id)
      }
      return
    }

    // Mehrere Companies: Prüfe, ob aktuelle Auswahl gültig ist
    if (selectedCompanyId && hasSelection) {
      return
    }

    // Wenn keine Auswahl vorhanden ist, wähle die erste
    if (!selectedCompanyId) {
      const first = companies[0]?.id
      if (first) {
        setSelectedCompanyIdState(first)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, first)
      }
      return
    }

    // If an invalid company ID comes from localStorage (e.g. company was deleted),
    // dann auf erste umschalten
    if (selectedCompanyId && !hasSelection) {
      console.warn(
        `CompanyContext: Selected company ID ${selectedCompanyId} not found in available companies, switching to first available`
      )
      const first = companies[0]?.id
      if (first) {
        setSelectedCompanyIdState(first)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, first)
      }
    }
  }, [companies, selectedCompanyId, isInitialized, loading])

  const setSelectedCompanyId = (id: string) => {
    setSelectedCompanyIdState(id)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, id)
  }

  const setCompanySelectionLock = useCallback((lockId: string, reason?: string | null) => {
    setSelectionLocks(prev => {
      const next = new Map(prev)
      if (!reason) {
        next.delete(lockId)
      } else {
        next.set(lockId, reason)
      }
      return next
    })
  }, [])

  const companySelectionLockReason = useMemo(() => {
    const iterator = selectionLocks.values().next()
    return iterator.done ? null : iterator.value
  }, [selectionLocks])

  const isCompanySelectionLocked = selectionLocks.size > 0

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null
    return companies.find(c => c.id === selectedCompanyId) ?? null
  }, [companies, selectedCompanyId])

  const value = useMemo(
    () => ({
      companies,
      selectedCompanyId,
      selectedCompany,
      setSelectedCompanyId,
      isCompanySelectionLocked,
      companySelectionLockReason,
      setCompanySelectionLock,
      loading,
    }),
    [
      companies,
      selectedCompanyId,
      selectedCompany,
      isCompanySelectionLocked,
      companySelectionLockReason,
      loading,
      setCompanySelectionLock,
    ]
  )

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext)
  if (!ctx) throw new Error('useCompanyContext must be used within CompanyProvider')
  return ctx
}
