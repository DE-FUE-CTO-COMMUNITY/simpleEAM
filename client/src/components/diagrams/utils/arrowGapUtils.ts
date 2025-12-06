import { ArrowGapSize } from '../types/addRelatedElements'

export const resolveArrowGapPx = (gap: ArrowGapSize): number => {
  switch (gap) {
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

export const applyPhysicalGap = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  startGap: number,
  endGap: number
): { start: { x: number; y: number }; end: { x: number; y: number } } => {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return {
    start: { x: start.x + ux * startGap, y: start.y + uy * startGap },
    end: { x: end.x - ux * endGap, y: end.y - uy * endGap },
  }
}
