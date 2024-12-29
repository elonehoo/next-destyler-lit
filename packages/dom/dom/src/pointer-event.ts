import type { AnyPointerEvent, EventListenerWithPointInfo as Listener, PointerEventInfo } from "./listener.types"
import { callAll } from "@destyler/utils"
import { isLeftClick, isMouseEvent } from "./event"
import { addDomEvent, addPointerEvent } from "./listener"
import { disableTextSelection } from './text-selection'

export function trackPointerDown(doc: Document, onPointerDown: (el: HTMLElement) => void) {
  const win = doc.defaultView ?? window
  const fn = (event: PointerEvent) => {
    if (event.target instanceof win.HTMLElement) {
      onPointerDown(event.target)
    }
  }
  return addDomEvent(doc, 'pointerdown', fn)
}

interface TrackPointerMoveOptions {
  onPointerUp: VoidFunction
  onPointerMove: (info: PointerEventInfo, event: AnyPointerEvent) => void
}

const THRESHOLD = 5

export function trackPointerMove(doc: Document, opts: TrackPointerMoveOptions) {
  const { onPointerMove, onPointerUp } = opts

  const handlePointerMove: Listener = (event, info) => {
    const { point: p } = info
    const distance = Math.sqrt(p.x ** 2 + p.y ** 2)
    if (distance < THRESHOLD) 
return

    // Because Safari doesn't trigger mouseup events when it's above a `<select>`
    if (isMouseEvent(event) && isLeftClick(event)) {
      onPointerUp()
      return
    }

    onPointerMove(info, event)
  }

  return callAll(
    addPointerEvent(doc, 'pointermove', handlePointerMove, false),
    addPointerEvent(doc, 'pointerup', onPointerUp, false),
    addPointerEvent(doc, 'pointercancel', onPointerUp, false),
    addPointerEvent(doc, 'contextmenu', onPointerUp, false),
    disableTextSelection({ doc }),
  )
}
