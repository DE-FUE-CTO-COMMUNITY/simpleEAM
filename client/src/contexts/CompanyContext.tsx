'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_COMPANIES } from '@/graphql/company'

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
  const { data, loading } = useQuery(GET_COMPANIES)
  const companies: Company[] = useMemo(() => data?.companies ?? [], [data?.companies])

  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(null)

  // Initial aus LocalStorage setzen
  useEffect(() => {
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (fromStorage) {
      setSelectedCompanyIdState(fromStorage)
    }
  }, [])

  // Wenn Companies geladen sind, sinnvolle Vorauswahl treffen
  useEffect(() => {
    if (!companies) return
    if (companies.length === 1) {
      if (selectedCompanyId !== companies[0].id) {
        setSelectedCompanyIdState(companies[0].id)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, companies[0].id)
      }
    } else if (companies.length > 1) {
      // Falls noch keine Auswahl gesetzt ist, auf erste Company setzen
      if (!selectedCompanyId) {
        const first = companies[0]?.id
        if (first) {
          setSelectedCompanyIdState(first)
          if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, first)
        }
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
