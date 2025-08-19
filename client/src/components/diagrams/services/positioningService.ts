/**
 * Service zur Berechnung der Positionen für neu hinzuzufügende verwandte Elemente
 */
import { RelativePosition } from '../types/addRelatedElements'

export interface SourceElementBounds {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Berechnet Positionen für verwandte Elemente relativ zu einem Quell-Element.
 * Alle Elemente erhalten identische Dimensionen wie das Quell-Element, damit das Layout konsistent bleibt.
 */
export interface CalculatedPosition {
  x: number
  y: number
}

export const calculateElementPositions = <T = unknown>(
  elements: readonly T[],
  sourceElement: SourceElementBounds,
  position: RelativePosition,
  spacing: number,
  distance?: number
): CalculatedPosition[] => {
  const positions: CalculatedPosition[] = []
  const elementWidth = sourceElement.width
  const elementHeight = sourceElement.height

  const numElements = elements.length

  for (let i = 0; i < numElements; i++) {
    let x: number, y: number

    const dist = distance ?? sourceElement.width
    switch (position) {
      case 'right': {
        x = sourceElement.x + sourceElement.width + dist
        const baseY = sourceElement.y + sourceElement.height / 2
        y = baseY + (i - (numElements - 1) / 2) * (elementHeight + spacing)
        break
      }
      case 'left': {
        x = sourceElement.x - elementWidth - dist
        const baseY = sourceElement.y + sourceElement.height / 2
        y = baseY + (i - (numElements - 1) / 2) * (elementHeight + spacing)
        break
      }
      case 'top': {
        const baseX = sourceElement.x + sourceElement.width / 2
        x = baseX + (i - (numElements - 1) / 2) * (elementWidth + spacing)
        y = sourceElement.y - elementHeight - dist
        break
      }
      case 'bottom': {
        const baseX = sourceElement.x + sourceElement.width / 2
        x = baseX + (i - (numElements - 1) / 2) * (elementWidth + spacing)
        y = sourceElement.y + sourceElement.height + dist
        break
      }
      default: {
        x = sourceElement.x + sourceElement.width + dist
        const baseY = sourceElement.y + sourceElement.height / 2
        y = baseY + (i - (numElements - 1) / 2) * (elementHeight + spacing)
      }
    }

    positions.push({ x, y })
  }

  return positions
}
