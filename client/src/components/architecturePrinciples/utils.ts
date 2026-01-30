import { useTranslations, useLocale } from 'next-intl'
import type { PrincipleCategory, PrinciplePriority } from '@/gql/generated'

/**
 * Custom hook for translating PrincipleCategory enum values
 */
export const useCategoryLabel = () => {
  const t = useTranslations('architecturePrinciples.categories')

  return (category: PrincipleCategory | null | undefined): string => {
    if (!category) return ''
    return t(category as any)
  }
}

/**
 * Custom hook for translating PrinciplePriority enum values
 */
export const usePriorityLabel = () => {
  const t = useTranslations('architecturePrinciples.priorities')

  return (priority: PrinciplePriority | null | undefined): string => {
    if (!priority) return ''
    return t(priority as any)
  }
}

/**
 * Custom hook for formatting date values in architecture principles
 */
export const useFormatDate = () => {
  const locale = useLocale()

  return (date: string | null | undefined): string => {
    if (!date) return ''
    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString(locale)
    } catch {
      return date || ''
    }
  }
}
