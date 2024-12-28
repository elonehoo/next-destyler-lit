import type {
  AnyPointerEvent,
  DOMEventTarget,
  EventMap,
  PointerEventInfo,
  PointerNameMap,
  RefTarget,
} from './listener.types'
import { globalEventBus } from './event-bus'

const t = (v: any) => Object.prototype.toString.call(v).slice(8, -1)
const isRef = (v: any): v is RefTarget => t(v) === 'Object' && 'current' in v
const runIfFn = (fn: any): HTMLElement | null => (t(fn) === 'Function' ? fn() : fn)
const isTouchEvent = (v: Event): v is TouchEvent => t(v) === 'Object' && !!(v as TouchEvent).touches

const fallback = { pageX: 0, pageY: 0, clientX: 0, clientY: 0 }

export function extractInfo<T extends AnyPointerEvent = AnyPointerEvent>(event: T, type: 'page' | 'client' = 'page') {
  const point = isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] || fallback : event
  return {
    point: {
      x: point[`${type}X` as keyof typeof point],
      y: point[`${type}Y` as keyof typeof point],
    },
  }
}

export function addDomEvent<K extends keyof EventMap>(
  target: DOMEventTarget,
  event: K,
  listener: (event: EventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const node = isRef(target) ? target.current : runIfFn(target)
  return globalEventBus(node, event, listener as any, options)
}

export function addPointerEvent<K extends keyof EventMap>(
  target: DOMEventTarget,
  event: K,
  listener: (event: EventMap[K], info: PointerEventInfo) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const type = getEventName(event) ?? event
  return addDomEvent(target, type, wrapHandler(listener, event === 'pointerdown'), options)
}

function wrapHandler<E extends EventMap[keyof EventMap]>(
  fn: (event: E, info: PointerEventInfo) => void,
  filter = false,
) {
  const listener: EventListener = (event: any) => {
    fn(event, extractInfo(event))
  }
  return filter ? filterPrimaryPointer(listener) : listener
}

function filterPrimaryPointer(fn: EventListener): EventListener {
  return (event: Event) => {
    const win = ((event as UIEvent).view ?? window) as typeof window
    const isMouseEvent = event instanceof win.MouseEvent
    const isPrimary = !isMouseEvent || (isMouseEvent && (event as MouseEvent).button === 0)
    if (isPrimary)
      fn(event)
  }
}

export function extractClientInfo(event: AnyPointerEvent) {
  return extractInfo(event, 'client')
}

const supportsPointerEvent = () => typeof window !== 'undefined' && window.onpointerdown === null
const supportsTouchEvent = () => typeof window !== 'undefined' && window.ontouchstart === null
const supportsMouseEvent = () => typeof window !== 'undefined' && window.onmousedown === null

const mouseEventNames: PointerNameMap = {
  pointerdown: 'mousedown',
  pointermove: 'mousemove',
  pointerup: 'mouseup',
  pointercancel: 'mousecancel',
  pointerover: 'mouseover',
  pointerout: 'mouseout',
  pointerenter: 'mouseenter',
  pointerleave: 'mouseleave',
}

const touchEventNames: PointerNameMap = {
  pointerdown: 'touchstart',
  pointermove: 'touchmove',
  pointerup: 'touchend',
  pointercancel: 'touchcancel',
}

export function getEventName(evt: keyof EventMap): keyof EventMap {
  if (supportsPointerEvent())
    return evt
  if (supportsTouchEvent() && evt in touchEventNames)
    return touchEventNames[evt as keyof PointerNameMap] as keyof EventMap
  if (supportsMouseEvent() && evt in mouseEventNames)
    return mouseEventNames[evt as keyof PointerNameMap] as keyof EventMap
  return evt
}
