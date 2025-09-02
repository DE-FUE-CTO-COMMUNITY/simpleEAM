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

  // Initial aus LocalStorage setzen
  useEffect(() => {
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (fromStorage) {
      setSelectedCompanyIdState(fromStorage)
    }
  }, [])

  // Wenn Companies geladen sind, sinnvolle Vorauswahl treffen und ungültige Auswahl bereinigen
  useEffect(() => {
    if (!companies) return
    const hasSelection = selectedCompanyId && companies.some(c => c.id === selectedCompanyId)

    if (companies.length === 0) {
      if (selectedCompanyId) {
        setSelectedCompanyIdState(null)
        if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
      }
      return
    }

    if (companies.length === 1) {
      if (selectedCompanyId !== companies[0].id) {
        setSelectedCompanyIdState(companies[0].id)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, companies[0].id)
      }
      return
    }

    // Mehrere Companies: sicherstellen, dass Auswahl gültig ist, sonst erste wählen
    if (!hasSelection) {
      const first = companies[0]?.id
      if (first) {
        setSelectedCompanyIdState(first)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, first)
      }
    }
  }, [companies, selectedCompanyId])

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
