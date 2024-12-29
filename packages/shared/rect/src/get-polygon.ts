import type { RectValue } from "./types"
import { createRect, getRectCorners } from "./rect"

export function getElementPolygon(rectValue: RectValue, placement: string) {
  const rect = createRect(rectValue)
  const { top, right, left, bottom } = getRectCorners(rect)
  const [base] = placement.split('-')

  return {
    top: [left, top, right, bottom],
    right: [top, right, bottom, left],
    bottom: [top, left, bottom, right],
    left: [right, top, left, bottom],
  }[base]
}
