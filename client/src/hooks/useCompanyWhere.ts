'use client'

import { useMemo } from 'react'
import { useCompanyContext } from '@/contexts/CompanyContext'

/**
 * Liefert einen where-Filter für GraphQL-Queries, um alle Elemente
 * auf die ausgewählte Company zu beschränken. Rückgabe ist undefined,
 * wenn keine Company ausgewählt ist (kein Filter anwenden).
 */
export function useCompanyWhere<T extends Record<string, any>>(key: string = 'company') {
  const { selectedCompanyId } = useCompanyContext()
  return useMemo(() => {
    if (!selectedCompanyId) return undefined
    // For types with relationship, can be filtered on id with RelationshipFilter
    return {
      [key]: {
        some: {
          id: { eq: selectedCompanyId },
        },
      },
    } as unknown as T
  }, [selectedCompanyId, key])
}
