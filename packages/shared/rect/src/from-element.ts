import type { Rect } from './rect';
import { getComputedStyle } from '@destyler/dom'
import { createRect } from './rect'

export function getElementRect(el: HTMLElement, opts: ElementRectOptions = {}): Rect {
  return createRect(getClientRect(el, opts))
}

export interface ElementRectOptions {
  /**
   * Whether to exclude the element's scrollbar size from the calculation.
   */
  excludeScrollbar?: boolean
  /**
   * Whether to exclude the element's borders from the calculation.
   */
  excludeBorders?: boolean
}

const px = (v: string) => Number.parseFloat(v.replace('px', ''))

const sum = (...vals: string[]) => vals.reduce((sum, v) => sum + (v ? px(v) : 0), 0)

function getClientRect(el: HTMLElement, opts: ElementRectOptions = {}) {
  const { excludeScrollbar = false, excludeBorders = false } = opts

  const { x, y, width, height } = el.getBoundingClientRect()
  const r = { x, y, width, height }

  const style = getComputedStyle(el)

  const { borderLeftWidth, borderTopWidth, borderRightWidth, borderBottomWidth } = style

  const borderXWidth = sum(borderLeftWidth, borderRightWidth)
  const borderYWidth = sum(borderTopWidth, borderBottomWidth)

  if (excludeBorders) {
    r.width -= borderXWidth
    r.height -= borderYWidth
    r.x += px(borderLeftWidth)
    r.y += px(borderTopWidth)
  }

  if (excludeScrollbar) {
    const scrollbarWidth = el.offsetWidth - el.clientWidth - borderXWidth
    const scrollbarHeight = el.offsetHeight - el.clientHeight - borderYWidth
    r.width -= scrollbarWidth
    r.height -= scrollbarHeight
  }

  return r
}
