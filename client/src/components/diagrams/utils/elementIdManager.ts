import { generateNKeysBetween } from 'fractional-indexing'

// Global variables for index management
let preGeneratedIndices: string[] = []
let currentIndexPosition = 0

const generateIndices = (count: number, startAfter?: string): string[] => {
  return generateNKeysBetween(startAfter || null, null, count)
}

export const generateSeed = (): number => {
  return Math.floor(Math.random() * 2 ** 31)
}

export const generateId = (): string => {
  if (typeof window !== 'undefined') {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
  }
  return 'temp-id-' + Date.now().toString(36)
}

export const generateElementId = (): string => {
  if (typeof window !== 'undefined') {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36).substr(-4)
  }
  return 'temp-' + Date.now().toString(36).substr(-6)
}

export const initializeIndices = (count: number) => {
  preGeneratedIndices = generateIndices(count)
  currentIndexPosition = 0
}

export const getNextIndex = (): string => {
  if (currentIndexPosition >= preGeneratedIndices.length) {
    // Generate more indices if needed
    const additionalIndices = generateIndices(
      10,
      preGeneratedIndices[preGeneratedIndices.length - 1]
    )
    preGeneratedIndices.push(...additionalIndices)
  }
  return preGeneratedIndices[currentIndexPosition++]
}
