type EventKey =
  | 'ArrowDown'
  | 'ArrowUp'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Space'
  | 'Enter'
  | 'Comma'
  | 'Escape'
  | 'Backspace'
  | 'Delete'
  | 'Home'
  | 'End'
  | 'Tab'
  | 'PageUp'
  | 'PageDown'
  | (string & {})

export type EventKeyMap = Partial<Record<EventKey, (event: any) => void>>

const rtlKeyMap: Record<string, string> = {
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft',
  Home: 'End',
  End: 'Home',
}

const sameKeyMap: Record<string, EventKey> = {
  'Up': 'ArrowUp',
  'Down': 'ArrowDown',
  'Esc': 'Escape',
  ' ': 'Space',
  ',': 'Comma',
  'Left': 'ArrowLeft',
  'Right': 'ArrowRight',
}

interface EventKeyOptions {
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Determine the event key based on text direction.
 */
export function getEventKey(event: KeyboardEvent, options: EventKeyOptions = {}) {
  const { dir = 'ltr', orientation = 'horizontal' } = options

  let { key } = event
  key = sameKeyMap[key] ?? key // normalize key

  const isRtl = dir === 'rtl' && orientation === 'horizontal'

  if (isRtl && key in rtlKeyMap) {
    key = rtlKeyMap[key]
  }

  return key
}

const PAGE_KEYS = new Set(['PageUp', 'PageDown'])
const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

/**
 * Determine the step factor for keyboard events
 */
export function getEventStep(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) {
    return 0.1
  }
  else {
    const isPageKey = PAGE_KEYS.has(event.key)
    const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.has(event.key))
    return isSkipKey ? 10 : 1
  }
}
