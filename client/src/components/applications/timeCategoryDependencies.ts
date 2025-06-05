import { TimeCategory, SevenRStrategy } from '@/gql/generated'

// Definiert die gültigen Kombinationen zwischen TIME-Kategorie und 7R-Strategie
export const TIME_CATEGORY_SEVEN_R_DEPENDENCIES: Record<TimeCategory, SevenRStrategy[]> = {
  [TimeCategory.TOLERATE]: [SevenRStrategy.RETAIN],
  [TimeCategory.INVEST]: [
    SevenRStrategy.REFACTOR,
    SevenRStrategy.REPLATFORM,
    SevenRStrategy.REPLACE,
  ],
  [TimeCategory.MIGRATE]: [
    SevenRStrategy.REHOST,
    SevenRStrategy.REPLATFORM,
    SevenRStrategy.REFACTOR,
  ],
  [TimeCategory.ELIMINATE]: [SevenRStrategy.RETIRE],
}

// Funktion um gültige 7R-Strategien für eine gegebene TIME-Kategorie zu erhalten
export const getValidSevenRStrategies = (timeCategory: TimeCategory | null): SevenRStrategy[] => {
  if (!timeCategory) {
    return Object.values(SevenRStrategy)
  }
  return TIME_CATEGORY_SEVEN_R_DEPENDENCIES[timeCategory] || []
}

// Funktion um zu prüfen ob eine Kombination gültig ist
export const isValidCombination = (
  timeCategory: TimeCategory | null,
  sevenRStrategy: SevenRStrategy | null
): boolean => {
  if (!timeCategory || !sevenRStrategy) {
    return true // Erlaubt leere Werte
  }

  const validStrategies = TIME_CATEGORY_SEVEN_R_DEPENDENCIES[timeCategory]
  return validStrategies.includes(sevenRStrategy)
}

// Funktion um eine gültige 7R-Strategie basierend auf der TIME-Kategorie zu empfehlen
export const getRecommendedSevenRStrategy = (
  timeCategory: TimeCategory | null
): SevenRStrategy | null => {
  if (!timeCategory) {
    return null
  }

  const validStrategies = TIME_CATEGORY_SEVEN_R_DEPENDENCIES[timeCategory]
  return validStrategies.length > 0 ? validStrategies[0] : null
}
