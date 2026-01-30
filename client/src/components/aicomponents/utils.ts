'use client'

import { useTranslations, useLocale } from 'next-intl'
import { FilterState } from './types'
import { AiComponentType, AiComponentStatus } from '../../gql/generated'

/**
 * Hook für die Übersetzung von AI Component Types
 */
export const useAiTypeLabel = () => {
  const t = useTranslations('aicomponents.types')

  return (type: AiComponentType): string => {
    switch (type) {
      case AiComponentType.AGENTIC_AI:
        return t('agenticAi')
      case AiComponentType.AUTOMATION_ENGINE:
        return t('automationEngine')
      case AiComponentType.CHATBOT:
        return t('chatbot')
      case AiComponentType.COMPUTER_VISION:
        return t('computerVision')
      case AiComponentType.DECISION_SUPPORT_SYSTEM:
        return t('decisionSupportSystem')
      case AiComponentType.DEEP_LEARNING_MODEL:
        return t('deepLearningModel')
      case AiComponentType.GENERATIVE_AI:
        return t('generativeAi')
      case AiComponentType.MACHINE_LEARNING_MODEL:
        return t('machineLearningModel')
      case AiComponentType.NATURAL_LANGUAGE_PROCESSING:
        return t('naturalLanguageProcessing')
      case AiComponentType.OTHER:
        return t('other')
      case AiComponentType.PREDICTIVE_ANALYTICS:
        return t('predictiveAnalytics')
      case AiComponentType.RAG:
        return t('rag')
      case AiComponentType.RECOMMENDATION_ENGINE:
        return t('recommendationEngine')
      case AiComponentType.VOICE_ASSISTANT:
        return t('voiceAssistant')
      default:
        return type
    }
  }
}

/**
 * Hook für die Übersetzung von AI Component Status
 */
export const useStatusLabel = () => {
  const t = useTranslations('aicomponents.status')

  return (status: AiComponentStatus): string => {
    switch (status) {
      case AiComponentStatus.ACTIVE:
        return t('active')
      case AiComponentStatus.DEPLOYED:
        return t('deployed')
      case AiComponentStatus.DEPRECATED:
        return t('deprecated')
      case AiComponentStatus.IN_DEVELOPMENT:
        return t('inDevelopment')
      case AiComponentStatus.RETIRED:
        return t('retired')
      case AiComponentStatus.TESTING:
        return t('testing')
      case AiComponentStatus.TRAINING:
        return t('training')
      default:
        return status
    }
  }
}

/**
 * Custom hook for formatting date values
 */
export const useFormatDate = () => {
  const locale = useLocale()

  return (date: string | null | undefined): string => {
    if (!date) return '-'
    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString(locale)
    } catch {
      return date || '-'
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use useFormatDate hook instead
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('de-DE')
}

/**
 * Hook zum Formatieren von Boolean-Werten mit Internationalisierung
 */
export const useFormatBoolean = () => {
  const t = useTranslations('aicomponents.states')

  return (value: boolean | null | undefined): string => {
    if (value === null || value === undefined) return '-'
    return value ? t('active') : t('inactive')
  }
}

/**
 * @deprecated Legacy-Funktion - verwenden Sie useFormatBoolean() Hook stattdessen
 */
export const formatBoolean = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return value ? 'Aktiv' : 'Inaktiv'
}

/**
 * Hook für AI Component Type Labels
 */
export const useAiComponentTypeLabel = () => {
  const t = useTranslations('aicomponents.types')

  return (type: AiComponentType): string => {
    switch (type) {
      case AiComponentType.MACHINE_LEARNING_MODEL:
        return t('machineLearningModel')
      case AiComponentType.DEEP_LEARNING_MODEL:
        return t('deepLearningModel')
      case AiComponentType.NATURAL_LANGUAGE_PROCESSING:
        return t('naturalLanguageProcessing')
      case AiComponentType.COMPUTER_VISION:
        return t('computerVision')
      case AiComponentType.CHATBOT:
        return t('chatbot')
      case AiComponentType.VOICE_ASSISTANT:
        return t('voiceAssistant')
      case AiComponentType.RECOMMENDATION_ENGINE:
        return t('recommendationEngine')
      case AiComponentType.PREDICTIVE_ANALYTICS:
        return t('predictiveAnalytics')
      case AiComponentType.DECISION_SUPPORT_SYSTEM:
        return t('decisionSupportSystem')
      case AiComponentType.AUTOMATION_ENGINE:
        return t('automationEngine')
      case AiComponentType.GENERATIVE_AI:
        return t('generativeAi')
      case AiComponentType.RAG:
        return t('rag')
      case AiComponentType.AGENTIC_AI:
        return t('agenticAi')
      case AiComponentType.OTHER:
        return t('other')
      default:
        return type
    }
  }
}

/**
 * Hook für AI Component status labels
 */
export const useAiComponentStatusLabel = () => {
  const t = useTranslations('aicomponents.status')

  return (status: AiComponentStatus): string => {
    switch (status) {
      case AiComponentStatus.IN_DEVELOPMENT:
        return t('inDevelopment')
      case AiComponentStatus.TRAINING:
        return t('training')
      case AiComponentStatus.TESTING:
        return t('testing')
      case AiComponentStatus.DEPLOYED:
        return t('deployed')
      case AiComponentStatus.ACTIVE:
        return t('active')
      case AiComponentStatus.DEPRECATED:
        return t('deprecated')
      case AiComponentStatus.RETIRED:
        return t('retired')
      default:
        return status
    }
  }
}

/**
 * Formatiert Kosten als Währung
 */
export const useFormatCurrency = () => {
  const locale = useLocale()

  return (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }
}

/**
 * Formatiert Genauigkeit als Prozent
 */
export const useFormatPercentage = () => {
  const locale = useLocale()

  return (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value / 100) // Annahme: Wert ist zwischen 0-100
  }
}

/**
 * Counts active filters basierend auf geänderten Werten vom Standard
 */
export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  // Array-Filter zählen nur wenn nicht leer
  if (filterState.aiTypeFilter && filterState.aiTypeFilter.length > 0) count++
  if (filterState.statusFilter && filterState.statusFilter.length > 0) count++
  if (filterState.tagsFilter && filterState.tagsFilter.length > 0) count++

  // Text-Filter zählen nur wenn gesetzt
  if (filterState.descriptionFilter && filterState.descriptionFilter.trim()) count++
  if (filterState.providerFilter && filterState.providerFilter.trim()) count++
  if (filterState.ownerFilter && filterState.ownerFilter.trim()) count++

  // Range-Filter zählen nur wenn vom Standard abweichend
  if (
    filterState.accuracyRange &&
    (filterState.accuracyRange[0] > 0 || filterState.accuracyRange[1] < 100)
  )
    count++

  if (
    filterState.costsRange &&
    (filterState.costsRange[0] > 0 || filterState.costsRange[1] < 1000000)
  )
    count++

  // Date-Range-Filter zählen nur wenn beide Werte gesetzt
  if (
    filterState.trainingDateRange &&
    filterState.trainingDateRange[0] &&
    filterState.trainingDateRange[1]
  )
    count++

  if (
    filterState.lastUpdatedRange &&
    filterState.lastUpdatedRange[0] &&
    filterState.lastUpdatedRange[1]
  )
    count++

  return count
}
