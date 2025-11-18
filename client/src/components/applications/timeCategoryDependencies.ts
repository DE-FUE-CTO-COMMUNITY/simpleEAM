import { TimeCategory, SevenRStrategy } from '@/gql/generated'

// Defines valid combinations between TIME category and 7R strategy
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

// Function to get valid 7R strategies for a given TIME category
export const getValidSevenRStrategies = (timeCategory: TimeCategory | null): SevenRStrategy[] => {
  if (!timeCategory) {
    return Object.values(SevenRStrategy)
  }
  return TIME_CATEGORY_SEVEN_R_DEPENDENCIES[timeCategory] || []
}

// Function to check if a combination is valid
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

// Function to recommend a valid 7R strategy based on TIME category
export const getRecommendedSevenRStrategy = (
  timeCategory: TimeCategory | null
): SevenRStrategy | null => {
  if (!timeCategory) {
    return null
  }

  const validStrategies = TIME_CATEGORY_SEVEN_R_DEPENDENCIES[timeCategory]
  return validStrategies.length > 0 ? validStrategies[0] : null
}
