// mathUtils.ts - Allgemeine mathematische Hilfsfunktionen für Pfeil-Verteilung & Gaps
import { ArrowGapSize } from '../types/addRelatedElements'

/**
 * Konvertiert eine Gap-Größe in Pixel
 */
export const getGapFromSize = (gapSize: ArrowGapSize): number => {
  switch (gapSize) {
    case 'none':
      return 0
    case 'small':
      return 4
    case 'medium':
      return 8
    case 'large':
      return 12
    default:
      return 8
  }
}

/**
 * Berechnet verteilte Y-Koordinate für mehrere Pfeile entlang der Elementhöhe
 */
export const calculateDistributedArrowY = (
  elementHeight: number,
  elementY: number,
  arrowCount: number,
  arrowIndex: number
): number => {
  if (arrowCount === 1) return elementY + elementHeight / 2
  const totalPoints = 5
  const usablePoints = totalPoints - 2
  const step = elementHeight / (totalPoints - 1)
  if (arrowCount <= usablePoints) {
    const startPointIndex = 1
    const usedPointIndex =
      startPointIndex + Math.floor((arrowIndex * (usablePoints - 1)) / Math.max(1, arrowCount - 1))
    return elementY + usedPointIndex * step
  } else {
    const usableHeight = elementHeight * (usablePoints / (totalPoints - 1))
    const startY = elementY + elementHeight / totalPoints
    return startY + (arrowIndex * usableHeight) / Math.max(1, arrowCount - 1)
  }
}

/**
 * Berechnet verteilte X-Koordinate für mehrere Pfeile entlang der Elementbreite
 */
export const calculateDistributedArrowX = (
  elementWidth: number,
  elementX: number,
  arrowCount: number,
  arrowIndex: number
): number => {
  if (arrowCount === 1) return elementX + elementWidth / 2
  const totalPoints = 5
  const usablePoints = totalPoints - 2
  const step = elementWidth / (totalPoints - 1)
  if (arrowCount <= usablePoints) {
    const startPointIndex = 1
    const usedPointIndex =
      startPointIndex + Math.floor((arrowIndex * (usablePoints - 1)) / Math.max(1, arrowCount - 1))
    return elementX + usedPointIndex * step
  } else {
    const usableWidth = elementWidth * (usablePoints / (totalPoints - 1))
    const startX = elementX + elementWidth / totalPoints
    return startX + (arrowIndex * usableWidth) / Math.max(1, arrowCount - 1)
  }
}

// Platzhalter für evtl. zukünftige mathematische Hilfsfunktionen
