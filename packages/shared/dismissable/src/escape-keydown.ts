import { addDomEvent } from '@destyler/dom'

export function trackEscapeKeydown(fn?: (event: KeyboardEvent) => void) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape')
      fn?.(event)
  }
  return addDomEvent(document, 'keydown', handleKeyDown)
}
