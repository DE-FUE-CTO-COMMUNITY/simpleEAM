'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_COMPANIES } from '@/graphql/company'
import { GET_PERSON_BY_EMAIL } from '@/graphql/person'
import { useAuth, isAdmin } from '@/lib/auth'

type Company = {
  id: string
  name: string
}

type CompanyContextValue = {
  companies: Company[]
  selectedCompanyId: string | null
  setSelectedCompanyId: (id: string) => void
  loading: boolean
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined)

const STORAGE_KEY = 'selectedCompanyId:v1'

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { keycloak, initialized } = useAuth()
  const admin = isAdmin()
  const email = (keycloak?.tokenParsed as any)?.email as string | undefined

  // Admin: lade alle Companies; Nicht-Admin: lade Companies der eigenen Person (über E-Mail)
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
    const myCompanies = (person?.company ?? []) as Company[]
    return myCompanies
  }, [admin, allCompaniesData?.companies, meData?.people])

  const loading = admin ? loadingAll : loadingMe

  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initial aus LocalStorage setzen
  useEffect(() => {
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (fromStorage) {
      setSelectedCompanyIdState(fromStorage)
    }
    setIsInitialized(true)
  }, [])

  // Cross-Tab Sync: auf Änderungen aus anderen Tabs reagieren
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

    // Beim Tab-Fokus/Visibility-Change ebenfalls mit LocalStorage abgleichen
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

  // Wenn Companies geladen sind, sinnvolle Vorauswahl treffen und ungültige Auswahl bereinigen
  useEffect(() => {
    // Warten bis localStorage initialisiert ist und Companies geladen sind
    if (!isInitialized) return

    // Wenn Companies noch laden, warten (wichtig für Race Condition)
    if (loading) {
      return
    }

    // Wenn keine Companies verfügbar sind und das Laden abgeschlossen ist
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

    // Wenn eine ungültige Company-ID aus localStorage kommt (z.B. Company wurde gelöscht),
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

  const value = useMemo(
    () => ({ companies, selectedCompanyId, setSelectedCompanyId, loading }),
    [companies, selectedCompanyId, loading]
  )

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext)
  if (!ctx) throw new Error('useCompanyContext must be used within CompanyProvider')
  return ctx
}
